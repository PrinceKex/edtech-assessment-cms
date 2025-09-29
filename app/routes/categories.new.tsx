import { ActionFunction, json, LoaderFunction } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import { CategoryForm } from "~/components/categories/CategoryForm";
import { prisma } from "~/db.server";
import { slugify } from "~/utils";
import { requireUserId } from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  
  // Fetch all categories for the parent category dropdown
  const categories = await prisma.category.findMany({
    select: {
      id: true,
      name: true,
    },
    orderBy: {
      name: 'asc',
    },
  });

  return json({ categories });
};

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
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
    // Check if slug is already taken
    const existingCategory = await prisma.category.findUnique({
      where: { slug },
    });

    if (existingCategory) {
      return json(
        { errors: { slug: "This slug is already in use. Please choose another one." } },
        { status: 400 }
      );
    }

    // Create the category
    const category = await prisma.category.create({
      data: {
        name,
        slug,
        description: description || null,
        parentId: parentId || null,
      },
    });

    return json(
      { success: true, category },
      { 
        status: 201,
        headers: {
          'Location': '/categories'
        }
      }
    );
  } catch (error) {
    console.error("Error creating category:", error);
    return json(
      { errors: { general: "An error occurred while creating the category. Please try again." } },
      { status: 500 }
    );
  }
};

export default function NewCategoryPage() {
  const { categories } = useLoaderData<typeof loader>();
  
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-8 border-b border-gray-200 pb-5">
        <h1 className="text-2xl font-semibold text-gray-900">Create New Category</h1>
        <p className="mt-2 text-sm text-gray-600">
          Categories help organize your content and create a navigation structure.
        </p>
      </div>
      
      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <CategoryForm categories={categories} />
        </div>
      </div>
    </div>
  );
}
