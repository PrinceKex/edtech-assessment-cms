import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { ArticleForm } from "~/components/articles/ArticleForm";
import { prisma } from "~/db.server";
import { requireUserId } from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const { id } = params;
  
  // Fetch the article to edit
  const article = await prisma.article.findUnique({
    where: { id },
  });

  if (!article) {
    throw new Response("Article not found", { status: 404 });
  }

  // Verify the current user is the author
  if (article.authorId !== userId) {
    throw new Response("Unauthorized", { status: 403 });
  }

  // Fetch categories for the dropdown
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  return json({ article, categories });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const { id } = params;
  const formData = await request.formData();
  
  const title = formData.get("title") as string;
  const slug = formData.get("slug") as string;
  const excerpt = formData.get("excerpt") as string;
  const content = formData.get("content") as string;
  const categoryId = formData.get("categoryId") as string;
  const featuredImage = formData.get("featuredImage") as string;
  const isPublished = formData.get("isPublished") === "on";

  // Basic validation
  const errors: Record<string, string> = {};
  
  if (!title) errors.title = "Title is required";
  if (!slug) errors.slug = "Slug is required";
  if (!content) errors.content = "Content is required";
  
  if (Object.keys(errors).length > 0) {
    return json({ errors }, { status: 400 });
  }

  try {
    // Check if slug is already taken by another article
    const existingArticle = await prisma.article.findFirst({
      where: {
        slug,
        NOT: { id },
      },
    });

    if (existingArticle) {
      return json(
        { errors: { slug: "This slug is already in use. Please choose another one." } },
        { status: 400 }
      );
    }

    // Get the current article to check publish status
    const currentArticle = await prisma.article.findUnique({
      where: { id },
      select: { isPublished: true },
    });

    // Update the article
    const updatedArticle = await prisma.article.update({
      where: { id },
      data: {
        title,
        slug,
        excerpt,
        content,
        categoryId: categoryId || null,
        featuredImage: featuredImage || null,
        isPublished,
        // Only update publishedAt if the article is being published now
        publishedAt: isPublished && !currentArticle?.isPublished 
          ? new Date() 
          : undefined,
      },
    });

    return json(
      { success: true, article: updatedArticle },
      { 
        status: 200,
        headers: {
          'Location': `/articles/${updatedArticle.id}`
        }
      }
    );
  } catch (error) {
    console.error("Error updating article:", error);
    return json(
      { errors: { general: "An error occurred while updating the article. Please try again." } },
      { status: 500 }
    );
  }
};

export default function EditArticlePage() {
  const { article, categories } = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 border-b border-gray-200 pb-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Edit Article</h1>
            <p className="mt-2 text-sm text-gray-600">
              Update the details of your article below.
            </p>
          </div>
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            Cancel
          </button>
        </div>
      </div>
      
      <ArticleForm 
        categories={categories} 
        initialData={{
          title: article.title,
          slug: article.slug,
          excerpt: article.excerpt || "",
          content: article.content,
          categoryId: article.categoryId || "",
          isPublished: article.isPublished,
          featuredImage: article.featuredImage || "",
        }}
      />
    </div>
  );
}
