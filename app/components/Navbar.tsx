import { json } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { getSession } from "../utils/auth.server";

// This loader will be used by the root route to get the user session
export const loader = async ({ request }: { request: Request }) => {
  const session = await getSession(request);
  const userId = session.get("userId");
  return json({ userId });
};

export function Navbar() {
  const data = useLoaderData<typeof loader>();
  const isAuthenticated = !!data?.userId;

  return (
    <nav className="bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-xl font-bold text-indigo-600">
                CMS Admin
              </Link>
            </div>
            {isAuthenticated && (
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link
                  to="/articles"
                  className="border-indigo-500 text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Articles
                </Link>
                <Link
                  to="/categories"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Categories
                </Link>
              </div>
            )}
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {isAuthenticated ? (
              <div className="flex items-center">
                <span className="text-sm text-gray-500 mr-4">
                  Welcome, User
                </span>
                <form action="/logout" method="post">
                  <button
                    type="submit"
                    className="text-sm font-medium text-gray-500 hover:text-gray-700"
                  >
                    Logout
                  </button>
                </form>
              </div>
            ) : (
              <div className="flex space-x-4">
                <Link
                  to="/login"
                  className="text-sm font-medium text-gray-500 hover:text-gray-700"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Sign up
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
