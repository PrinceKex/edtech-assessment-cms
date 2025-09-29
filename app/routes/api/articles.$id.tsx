import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server";
import { prisma } from "../../db.server";

// GET /api/articles/:id - Get a single article
// Public route - no authentication required
// But will only return published articles to non-authenticated users
export const loader: LoaderFunction = async ({ request, params }) => {
  try {
    const userId = await requireUserId(request, false);
    
    const article = await prisma.article.findUnique({
      where: { 
        id: params.id,
        // If user is not authenticated, only return published articles
        ...(userId ? {} : { isPublished: true })
      },
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!article) {
      return json(
        { error: 'Article not found or not published' },
        { status: 404 }
      );
    }

    return json({ article });
  } catch (error) {
    console.error(`Error fetching article ${params.id}:`, error);
    return json(
      { error: 'Failed to fetch article' },
      { status: 500 }
    );
  }
};

// PUT /api/articles/:id - Update an article
export const action: ActionFunction = async ({ request, params }) => {
  // Only allow PUT and DELETE methods
  if (request.method === 'PUT') {
    return handleUpdateArticle(request, params);
  } else if (request.method === 'DELETE') {
    return handleDeleteArticle(request, params);
  }
  
  return json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
};

// Handle article update
async function handleUpdateArticle(request: Request, params: { id?: string }) {
  const userId = await requireUserId(request);
  
  try {
    const data = await request.json();
    
    // First, verify the article exists and belongs to the user
    const existingArticle = await prisma.article.findUnique({
      where: { id: params.id },
      select: { authorId: true }
    });

    if (!existingArticle) {
      return json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Check if the current user is the author
    if (existingArticle.authorId !== userId) {
      return json(
        { error: 'Unauthorized - You can only update your own articles' },
        { status: 403 }
      );
    }
    
    const updatedArticle = await prisma.article.update({
      where: { id: params.id },
      data: {
        title: data.title,
        slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
        content: data.content,
        excerpt: data.excerpt || data.content.substring(0, 200) + '...',
        featuredImage: data.featuredImage || null,
        isPublished: data.isPublished,
        publishedAt: data.isPublished ? (data.isPublished === false ? null : new Date()) : null,
        categoryId: data.categoryId || null,
        updatedAt: new Date(),
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return json({ article: updatedArticle });
  } catch (error) {
    console.error(`Error updating article ${params.id}:`, error);
    return json(
      { error: 'Failed to update article' },
      { status: 500 }
    );
  }
}

// Handle article deletion
async function handleDeleteArticle(request: Request, params: { id?: string }) {
  const userId = await requireUserId(request);
  
  try {
    // First, verify the article exists and belongs to the user
    const existingArticle = await prisma.article.findUnique({
      where: { id: params.id },
      select: { authorId: true }
    });

    if (!existingArticle) {
      return json(
        { error: 'Article not found' },
        { status: 404 }
      );
    }

    // Check if the current user is the author
    if (existingArticle.authorId !== userId) {
      return json(
        { error: 'Unauthorized - You can only delete your own articles' },
        { status: 403 }
      );
    }

    await prisma.article.delete({
      where: { id: params.id },
    });

    return json({ success: true }, { status: 204 });
  } catch (error) {
    console.error(`Error deleting article ${params.id}:`, error);
    return json(
      { error: 'Failed to delete article' },
      { status: 500 }
    );
  }
}
