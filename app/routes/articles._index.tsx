import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate, useSubmit } from "@remix-run/react";
import { ArticlesList } from "~/components/articles/ArticlesList";
import { prisma } from "~/db.server";

type ArticleStatus = 'draft' | 'published' | 'amendment' | 'upcoming' | 'active';

type Article = {
  id: string;
  title: string;
  slug: string;
  excerpt?: string;
  status: ArticleStatus;
  category?: string;
  dueDate?: string | null;
  updatedAt: string;
  isPublished: boolean;
};

export const loader: LoaderFunction = async () => {
  try {
    const articles = await prisma.article.findMany({
      include: {
        category: {
          select: {
            name: true,
          },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    // Transform the data to match the ArticlesList component's expected format
    const formattedArticles = articles.map((article: { 
      id: string;
      title: string;
      slug: string;
      excerpt?: string | null;
      isPublished: boolean;
      category: { name: string } | null;
      dueDate: Date | null;
      updatedAt: Date;
    }) => ({
      id: article.id,
      title: article.title,
      slug: article.slug,
      excerpt: article.excerpt || undefined,
      status: (article.isPublished ? 'published' : 'draft') as ArticleStatus,
      category: article.category?.name,
      dueDate: article.dueDate ? new Date(article.dueDate).toISOString() : null,
      updatedAt: article.updatedAt.toISOString(),
      isPublished: article.isPublished,
    }));
    
    return json({ articles: formattedArticles });
  } catch (error) {
    console.error("Error loading articles:", error);
    return json(
      { error: "Failed to load articles" },
      { status: 500 }
    );
  }
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const action = formData.get('_action');
  const articleId = formData.get('articleId')?.toString();

  if (action === 'delete' && articleId) {
    try {
      await prisma.article.delete({
        where: { id: articleId },
      });
      return json({ success: true });
    } catch (error) {
      console.error('Error deleting article:', error);
      return json(
        { error: 'Failed to delete article' },
        { status: 500 }
      );
    }
  }

  return null;
};

export default function ArticlesIndex() {
  const data = useLoaderData<{ articles: Article[]; error?: string }>();
  const { articles = [], error } = data || {};
  const submit = useSubmit();
  const navigate = useNavigate();

  const handleDelete = (articleId: string) => {
    if (confirm('Are you sure you want to delete this article? This action cannot be undone.')) {
      const formData = new FormData();
      formData.append('_action', 'delete');
      formData.append('articleId', articleId);
      submit(formData, { method: 'post' });
    }
  };

  const handleEdit = (articleId: string) => {
    navigate(`/articles/${articleId}/edit`);
  };

  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        <p>Error: {error}</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <ArticlesList 
        articles={articles} 
        onDelete={handleDelete}
      />
    </div>
  );
}
