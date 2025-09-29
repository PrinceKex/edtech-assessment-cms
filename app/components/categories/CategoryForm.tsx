import { Form, useNavigation } from "@remix-run/react";
import { Loader2 } from "lucide-react";

// Local type definition for Category
type Category = {
  id: string;
  name: string;
};

interface CategoryFormProps {
  categories: Array<Pick<Category, 'id' | 'name'>>;
  initialData?: {
    name?: string;
    slug?: string;
    description?: string;
    parentId?: string | null;
  };
  errors?: Record<string, string>;
}

export function CategoryForm({ categories, initialData = {}, errors = {} }: CategoryFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";

  return (
    <Form method="post" className="space-y-6">
      {errors.general && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">{errors.general}</h3>
            </div>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {/* Name */}
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            Name <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="name"
              name="name"
              required
              defaultValue={initialData.name || ""}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="e.g., Technology, Business, etc."
            />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
          </div>
        </div>

        {/* Slug */}
        <div>
          <label htmlFor="slug" className="block text-sm font-medium text-gray-700">
            Slug <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="slug"
              name="slug"
              required
              defaultValue={initialData.slug || ""}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="e.g., technology, business"
            />
            <p className="mt-1 text-xs text-gray-500">
              The URL-friendly version of the name. Use lowercase letters, numbers, and hyphens only.
            </p>
            {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
          </div>
        </div>

        {/* Parent Category */}
        <div>
          <label htmlFor="parentId" className="block text-sm font-medium text-gray-700">
            Parent Category
          </label>
          <div className="mt-1">
            <select
              id="parentId"
              name="parentId"
              defaultValue={initialData.parentId || ""}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">No parent (top-level category)</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            <p className="mt-1 text-xs text-gray-500">
              Select a parent category to create a hierarchy. Leave empty for a top-level category.
            </p>
            {errors.parentId && <p className="mt-1 text-sm text-red-600">{errors.parentId}</p>}
          </div>
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <div className="mt-1">
            <textarea
              id="description"
              name="description"
              rows={3}
              defaultValue={initialData.description || ""}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="A brief description of this category"
            />
            <p className="mt-1 text-xs text-gray-500">
              Optional. This can be used for SEO and display purposes.
            </p>
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description}</p>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 pt-6">
        <button
          type="button"
          onClick={() => window.history.back()}
          className="rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Category'
          )}
        </button>
      </div>
    </Form>
  );
}
