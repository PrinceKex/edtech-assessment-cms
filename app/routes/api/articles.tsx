import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import { requireUserId } from "~/utils/auth.server";
import { prisma } from "../../db.server";

// GET /api/articles - Get all articles (public)
export const loader: LoaderFunction = async ({ request }) => {
  try {
    const articles = await prisma.article.findMany({
      where: { isPublished: true }, // Only return published articles for non-authenticated users
      include: {
        category: true,
        author: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    return json({ articles });
  } catch (error) {
    console.error('Error fetching articles:', error);
    return json(
      { error: 'Failed to fetch articles' },
      { status: 500 }
    );
  }
};

// POST /api/articles - Create a new article (requires authentication)
export const action: ActionFunction = async ({ request }) => {
  // Require authentication for creating articles
  const userId = await requireUserId(request);
  
  try {
    const data = await request.json();
    
    // Basic validation
    if (!data.title || !data.content) {
      return json(
        { error: 'Title and content are required' },
        { status: 400 }
      );
    }

    const article = await prisma.article.create({
      data: {
        title: data.title,
        slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]+/g, ''),
        content: data.content,
        excerpt: data.excerpt || data.content.substring(0, 200) + '...',
        featuredImage: data.featuredImage || null,
        isPublished: data.isPublished || false,
        publishedAt: data.isPublished ? new Date() : null,
        categoryId: data.categoryId || null,
        authorId: userId, // Use the authenticated user's ID
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

    return json({ article }, { status: 201 });
  } catch (error) {
    console.error('Error creating article:', error);
    return json(
      { error: 'Failed to create article' },
      { status: 500 }
    );
  }
};
