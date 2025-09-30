import { ActionFunction, json, LoaderFunction, redirect } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { ArticleForm } from "~/components/articles/ArticleForm";
import { prisma } from "~/db.server";
import { requireUserId } from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  
  // Fetch categories for the dropdown
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
  });

  return json({ categories });
};

export const action: ActionFunction = async ({ request }) => {
  try {
    const userId = await requireUserId(request);
    if (!userId) {
      return json(
        { 
          errors: { 
            general: "You must be logged in to create an article." 
          } 
        },
        { status: 401 }
      );
    }
    
    const formData = await request.formData();
    
    // Log all form data for debugging
    const formDataObj: Record<string, any> = {};
    for (const [key, value] of formData.entries()) {
      formDataObj[key] = value;
    }
    console.log('Form data received:', formDataObj);
    
    const title = formData.get("title") as string;
    const slug = formData.get("slug") as string;
    const excerpt = formData.get("excerpt") as string;
    const content = formData.get("content") as string;
    const categoryId = formData.get("categoryId") as string;
    const featuredImage = formData.get("featuredImage") as string;
    const isPublished = formData.get("isPublished") === "on";

    // Log parsed values for debugging
    console.log('Parsed values:', { 
      title, 
      slug, 
      excerpt, 
      contentLength: content?.length || 0,
      categoryId,
      featuredImage,
      isPublished 
    });

    // Basic validation
    const errors: Record<string, string> = {};
    
    if (!title) errors.title = "Title is required";
    if (!slug) errors.slug = "Slug is required";
    if (!content) errors.content = "Content is required";
    
    if (Object.keys(errors).length > 0) {
      console.log('Validation errors:', errors);
      return json({ errors }, { status: 400 });
    }

    // Verify user exists in database
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true }
    });

    if (!userExists) {
      console.error('User not found with ID:', userId);
      return json(
        { 
          errors: { 
            general: "Your user account could not be found. Please sign in again." 
          } 
        },
        { status: 404 }
      );
    }

    // Check if slug is already taken
    const existingArticle = await prisma.article.findUnique({
      where: { slug },
    });

    if (existingArticle) {
      console.log('Slug already exists:', slug);
      return json(
        { errors: { slug: "This slug is already in use. Please choose another one." } },
        { status: 400 }
      );
    }

    // Create the article
    const article = await prisma.article.create({
      data: {
        title,
        slug,
        excerpt,
        content,
        categoryId: categoryId || null,
        featuredImage: featuredImage || null,
        isPublished,
        publishedAt: isPublished ? new Date() : null,
        authorId: userId,
      },
    });

    console.log('Article created successfully:', { articleId: article.id });
    
    // Redirect to the articles list after successful creation
    return redirect('/articles', {
      status: 303, // 303 See Other - ensures the browser does a GET request
      headers: {
        'Location': '/articles'
      }
    });
  } catch (error: unknown) {
    console.error("Error creating article:", error);
    
    // More detailed error handling
    let errorMessage = "An error occurred while creating the article. Please try again.";
    let errorDetails: string | undefined;
    
    // Handle different error types
    if (error instanceof Error) {
      console.error("Error details:", {
        name: error.name,
        message: error.message,
        stack: error.stack,
      });
      
      errorDetails = error.message;
      
      // Handle unique constraint violations
      if (error.message.includes('Unique constraint failed')) {
        errorMessage = "This article title or slug is already in use. Please choose a different one.";
      }
      // Handle foreign key constraint violations (e.g., invalid categoryId)
      else if (error.message.includes('foreign key constraint')) {
        errorMessage = "The selected category is invalid. Please select a valid category.";
      }
    } else if (typeof error === 'string') {
      errorDetails = error;
    } else if (error && typeof error === 'object' && 'message' in error) {
      errorDetails = String(error.message);
    }
    
    return json(
      { 
        errors: { 
          general: errorMessage,
          details: process.env.NODE_ENV === 'development' ? errorDetails : undefined 
        } 
      },
      { status: 500 }
    );
  }
};

export default function NewArticlePage() {
  const { categories } = useLoaderData<typeof loader>();
  
  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-semibold text-gray-900">Create New Article</h1>
        <p className="mt-2 text-sm text-gray-600">
          Fill in the details below to create a new article.
        </p>
      </div>
      
      <ArticleForm categories={categories} />
    </div>
  );
}
