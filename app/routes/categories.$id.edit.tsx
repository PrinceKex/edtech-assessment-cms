import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { CategoryForm } from "~/components/categories/CategoryForm";
import { prisma } from "~/db.server";
import { slugify } from "~/utils";
import { requireUserId } from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const { id } = params;
  
  // Fetch the category to edit
  const category = await prisma.category.findUnique({
    where: { id },
  });

  if (!category) {
    throw new Response("Category not found", { status: 404 });
  }

  // Fetch all categories for the parent category dropdown (excluding the current category and its children)
  const categories = await prisma.category.findMany({
    where: {
      id: { not: id }, // Exclude current category
      // Exclude any descendants of the current category to prevent cycles
      path: { not: { has: id } },
    },
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return json({ category, categories });
};

export const action: ActionFunction = async ({ request, params }) => {
  const userId = await requireUserId(request);
  const { id } = params;
  const formData = await request.formData();
  
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string || slugify(name);
  const description = formData.get("description") as string;
  const parentId = formData.get("parentId") as string;

  // Basic validation
  const errors: Record<string, string> = {};
  
  if (!name) errors.name = "Name is required";
  if (!slug) errors.slug = "Slug is required";
  
  if (Object.keys(errors).length > 0) {
    return json({ errors }, { status: 400 });
  }

  try {
    // Check if slug is already taken by another category
    const existingCategory = await prisma.category.findFirst({
      where: {
        slug,
        id: { not: id },
      },
    });

    if (existingCategory) {
      return json(
        { errors: { slug: "This slug is already in use. Please choose another one." } },
        { status: 400 }
      );
    }

    // Prevent setting a category as its own parent
    if (parentId === id) {
      return json(
        { errors: { parentId: "A category cannot be its own parent." } },
        { status: 400 }
      );
    }

    // Update the category
    const updatedCategory = await prisma.category.update({
      where: { id },
      data: {
        name,
        slug,
        description: description || null,
        parentId: parentId || null,
      },
    });

    return json(
      { success: true, category: updatedCategory },
      { 
        status: 200,
        headers: {
          'Location': '/categories'
        }
      }
    );
  } catch (error) {
    console.error("Error updating category:", error);
    return json(
      { errors: { general: "An error occurred while updating the category. Please try again." } },
      { status: 500 }
    );
  }
};

export default function EditCategoryPage() {
  const { category, categories } = useLoaderData<typeof loader>();
  
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-semibold text-gray-900">Edit Category</h1>
        <p className="mt-2 text-sm text-gray-600">
          Update the category details below.
        </p>
      </div>
      
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <CategoryForm 
            categories={categories} 
            initialData={{
              name: category.name,
              slug: category.slug,
              description: category.description || "",
              parentId: category.parentId || "",
            }} 
          />
        </div>
      </div>
    </div>
  );
}
