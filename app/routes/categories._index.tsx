import { PencilIcon, PlusIcon, TrashIcon } from "@heroicons/react/24/outline";
import { json, LoaderFunction } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";
import { requireUserId } from "~/utils/auth.server";

export const loader: LoaderFunction = async ({ request }) => {
  await requireUserId(request);
  
  // Fetch all categories with their parent and children
  const categories = await prisma.category.findMany({
    include: {
      parent: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: {
          children: true,
          articles: true,
        },
      },
    },
    orderBy: [
      { parentId: 'asc' },
      { name: 'asc' },
    ],
  });

  return json({ categories });
};

// Helper function to build a tree structure from flat categories
function buildCategoryTree(categories: any[], parentId: string | null = null): any[] {
  return categories
    .filter(category => category.parentId === parentId)
    .map(category => ({
      ...category,
      children: buildCategoryTree(categories, category.id),
    }));
}

// Recursive component to render categories as a tree
function CategoryTree({ categories, level = 0 }: { categories: any[], level?: number }) {
  if (!categories.length) {
    return null;
  }

  return (
    <ul className={`${level > 0 ? 'ml-6 mt-1' : ''}`}>
      {categories.map((category) => (
        <li key={category.id} className="py-2">
          <div className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
            <div className="flex items-center">
              <span className="font-medium text-gray-900">{category.name}</span>
              <span className="ml-2 inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-800">
                {category._count.articles} {category._count.articles === 1 ? 'article' : 'articles'}
              </span>
              {category._count.children > 0 && (
                <span className="ml-2 inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-medium text-blue-800">
                  {category._count.children} {category._count.children === 1 ? 'subcategory' : 'subcategories'}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2">
              <Link
                to={`/categories/${category.id}/edit`}
                className="text-gray-400 hover:text-indigo-600"
                title="Edit category"
              >
                <PencilIcon className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Link>
              <button
                type="button"
                className="text-gray-400 hover:text-red-600"
                title="Delete category"
                onClick={() => {
                  // TODO: Implement delete with confirmation
                  if (window.confirm(`Are you sure you want to delete "${category.name}"? This action cannot be undone.`)) {
                    // TODO: Call delete action
                  }
                }}
              >
                <TrashIcon className="h-4 w-4" />
                <span className="sr-only">Delete</span>
              </button>
            </div>
          </div>
          {category.children && category.children.length > 0 && (
            <CategoryTree categories={category.children} level={level + 1} />
          )}
        </li>
      ))}
    </ul>
  );
}

export default function CategoriesPage() {
  const { categories } = useLoaderData<typeof loader>();
  const categoryTree = buildCategoryTree(JSON.parse(JSON.stringify(categories)));
  
  return (
    <div className="px-4 sm:px-6 lg:px-8 py-8">
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-2xl font-semibold text-gray-900">Categories</h1>
          <p className="mt-2 text-sm text-gray-700">
            Manage your content categories. Categories can be nested to create a hierarchical structure.
          </p>
        </div>
        <div className="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
          <Link
            to="/categories/new"
            className="inline-flex items-center justify-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
            Add Category
          </Link>
        </div>
      </div>
      
      <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">Category List</h2>
        </div>
        
        {categories.length === 0 ? (
          <div className="px-4 py-12 text-center">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">No categories</h3>
            <p className="mt-1 text-sm text-gray-500">
              Get started by creating a new category.
            </p>
            <div className="mt-6">
              <Link
                to="/categories/new"
                className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                <PlusIcon className="-ml-1 mr-2 h-5 w-5" />
                New Category
              </Link>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            <CategoryTree categories={categoryTree} />
          </div>
        )}
      </div>
    </div>
  );
}
