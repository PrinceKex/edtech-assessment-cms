import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";
import { formatDate } from "~/utils";
import { requireUserId } from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request, false);
  const { id } = params;
  
  try {
    const article = await prisma.article.findUnique({
      where: { 
        id,
        // If user is not authenticated, only return published articles
        ...(userId ? {} : { isPublished: true })
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    });

    if (!article) {
      throw new Response("Article not found or not published", { status: 404 });
    }

    // Check if the current user is the author
    const isAuthor = userId === article.authorId;

    return json({ article, isAuthor });
  } catch (error) {
    console.error("Error fetching article:", error);
    throw new Response("Error loading article", { status: 500 });
  }
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const { id } = params;

  try {
    // First, verify the article exists and the user is the author
    const article = await prisma.article.findUnique({
      where: { id },
      select: { authorId: true }
    });

    if (!article) {
      throw new Response("Article not found", { status: 404 });
    }

    if (article.authorId !== userId) {
      throw new Response("Unauthorized", { status: 403 });
    }

    // Delete the article
    await prisma.article.delete({
      where: { id }
    });

    // Redirect to the articles list after successful deletion
    return redirect('/articles');
  } catch (error) {
    console.error("Error deleting article:", error);
    return json(
      { error: "Failed to delete article" },
      { status: 500 }
    );
  }
};

export default function ArticleDetail() {
  const { article, isAuthor } = useLoaderData<typeof loader>();
  
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8">
        {article.category && (
          <Link
            to={`/categories/${article.category.slug}`}
            className="inline-block mb-4 text-sm font-medium text-indigo-600 hover:text-indigo-800"
          >
            {article.category.name}
          </Link>
        )}
        
        <h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
          {article.title}
        </h1>
        
        <div className="mt-4 flex items-center text-sm text-gray-500">
          <span>By {article.author.name || article.author.email}</span>
          <span className="mx-2">•</span>
          <time dateTime={article.updatedAt}>
            {formatDate(article.updatedAt)}
          </time>
          {!article.isPublished && (
            <>
              <span className="mx-2">•</span>
              <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                Draft
              </span>
            </>
          )}
        </div>
        
        {isAuthor && (
          <div className="mt-4 flex space-x-3">
            <Link
              to={`/articles/${article.id}/edit`}
              className="inline-flex items-center rounded-md bg-white px-3 py-2 text-sm font-medium text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            >
              Edit Article
            </Link>
          </div>
        )}
      </div>
      
      {article.featuredImage && (
        <div className="mb-8 overflow-hidden rounded-lg">
          <img
            src={article.featuredImage}
            alt={article.title}
            className="w-full h-auto object-cover"
          />
        </div>
      )}
      
      {article.excerpt && (
        <div className="mb-8 text-lg text-gray-600 italic">
          {article.excerpt}
        </div>
      )}
      
      <div 
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: article.content }}
      />
    </div>
  );
}

// Handle 404 and other error responses
export function CatchBoundary() {
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="rounded-md bg-red-50 p-4">
        <div className="flex">
          <div className="ml-3">
            <h3 className="text-sm font-medium text-red-800">
              Article not found or not published
            </h3>
            <div className="mt-2 text-sm text-red-700">
              <p>The article you're looking for doesn't exist or isn't available.</p>
            </div>
            <div className="mt-4">
              <Link
                to="/articles"
                className="text-sm font-medium text-red-700 hover:text-red-600"
              >
                View all articles <span aria-hidden="true">&rarr;</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
