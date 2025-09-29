import { Form, useNavigation } from "@remix-run/react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { RichTextEditor } from "~/components/editor/RichTextEditor";

// Local type definition for Category
type Category = {
  id: string;
  name: string;
};

interface ArticleFormProps {
  categories: Array<Category>;
  initialData?: {
    title?: string;
    slug?: string;
    excerpt?: string;
    content?: string;
    categoryId?: string;
    isPublished?: boolean;
    featuredImage?: string;
  };
  errors?: Record<string, string>;
}

export function ArticleForm({ categories, initialData = {}, errors = {} }: ArticleFormProps) {
  const navigation = useNavigation();
  const isSubmitting = navigation.state === "submitting";
  const [content, setContent] = useState(initialData.content || "");

  // Update content when initialData changes (for edit mode)
  useEffect(() => {
    setContent(initialData.content || "");
  }, [initialData.content]);

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
        {/* Title */}
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input
              type="text"
              id="title"
              name="title"
              required
              defaultValue={initialData.title || ""}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            {errors.title && <p className="mt-1 text-sm text-red-600">{errors.title}</p>}
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
              placeholder="article-slug"
            />
            <p className="mt-1 text-xs text-gray-500">
              The URL-friendly version of the title. Use lowercase letters, numbers, and hyphens only.
            </p>
            {errors.slug && <p className="mt-1 text-sm text-red-600">{errors.slug}</p>}
          </div>
        </div>

        {/* Category */}
        <div>
          <label htmlFor="categoryId" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <div className="mt-1">
            <select
              id="categoryId"
              name="categoryId"
              defaultValue={initialData.categoryId || ""}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            >
              <option value="">No category</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
            {errors.categoryId && <p className="mt-1 text-sm text-red-600">{errors.categoryId}</p>}
          </div>
        </div>

        {/* Featured Image */}
        <div>
          <label htmlFor="featuredImage" className="block text-sm font-medium text-gray-700">
            Featured Image URL
          </label>
          <div className="mt-1">
            <input
              type="url"
              id="featuredImage"
              name="featuredImage"
              defaultValue={initialData.featuredImage || ""}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="https://example.com/image.jpg"
            />
            {errors.featuredImage && (
              <p className="mt-1 text-sm text-red-600">{errors.featuredImage}</p>
            )}
          </div>
        </div>

        {/* Excerpt */}
        <div>
          <label htmlFor="excerpt" className="block text-sm font-medium text-gray-700">
            Excerpt
          </label>
          <div className="mt-1">
            <textarea
              id="excerpt"
              name="excerpt"
              rows={3}
              defaultValue={initialData.excerpt || ""}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="A brief summary of your article"
            />
            <p className="mt-1 text-xs text-gray-500">
              A short summary of your article (max 300 characters). This will be used in article
              previews and SEO.
            </p>
            {errors.excerpt && <p className="mt-1 text-sm text-red-600">{errors.excerpt}</p>}
          </div>
        </div>

        {/* Content */}
        <div>
          <label className="block text-sm font-medium text-gray-700">
            Content <span className="text-red-500">*</span>
          </label>
          <div className="mt-1">
            <input 
              type="hidden" 
              name="content" 
              defaultValue={content}
              id="content" 
              aria-describedby="content-error"
            />
            <RichTextEditor
              content={content}
              onChange={(newContent) => {
                setContent(newContent);
                // Update the hidden input value directly
                const input = document.getElementById("content") as HTMLInputElement;
                if (input) {
                  input.value = newContent;
                }
              }}
              placeholder="Write your article content here..."
              className="mt-1"
            />
            {errors.content && (
              <p id="content-error" className="mt-1 text-sm text-red-600">
                {errors.content}
              </p>
            )}
          </div>
        </div>

        {/* Published */}
        <div className="flex items-center">
          <input
            id="isPublished"
            name="isPublished"
            type="checkbox"
            defaultChecked={initialData.isPublished || false}
            className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
          />
          <label htmlFor="isPublished" className="ml-2 block text-sm text-gray-900">
            Publish this article
          </label>
        </div>
      </div>

      <div className="flex justify-end space-x-3">
        <button
          type="button"
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
            'Save Article'
          )}
        </button>
      </div>
    </Form>
  );
}
