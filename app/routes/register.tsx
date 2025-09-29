import { json } from "@remix-run/node";
import { Form, Link, useActionData, useSearchParams } from "@remix-run/react";
import { createUserSession } from "~/utils/auth.server";
import { createSupabaseServerClient } from "~/utils/supabase.server";

export const action = async ({ request }: { request: Request }) => {
  const form = await request.formData();
  const email = form.get("email") as string;
  const password = form.get("password") as string;
  const name = form.get("name") as string;
  const redirectTo = (form.get("redirectTo") as string) || "/";

  const { supabaseClient, headers } = createSupabaseServerClient({
    request,
    response: new Response(),
  });

  // Sign up the user with Supabase Auth
  const { data: authData, error: authError } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (authError) {
    return json(
      { error: authError.message },
      { status: 400, headers }
    );
  }

  if (!authData.session) {
    // User needs to verify their email
    return json(
      { message: "Check your email to verify your account" },
      { status: 200, headers }
    );
  }

  if (!authData.user) {
    throw new Error("User not found after registration");
  }

  return createUserSession(authData.user.id, redirectTo);
};

export default function Register() {
  const [searchParams] = useSearchParams();
  const actionData = useActionData<{ error?: string; message?: string }>();
  const redirectTo = searchParams.get("redirectTo") || "/";

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Create a new account
          </h2>
        </div>
        <Form className="mt-8 space-y-6" method="post">
          <input type="hidden" name="redirectTo" value={redirectTo} />
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <label htmlFor="name" className="sr-only">
                Full Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                required
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Full Name"
              />
            </div>
            <div>
              <label htmlFor="email-address" className="sr-only">
                Email address
              </label>
              <input
                id="email-address"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="sr-only">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>
          </div>

          {actionData?.error && (
            <div className="text-red-500 text-sm">{actionData.error}</div>
          )}
          {actionData?.message && (
            <div className="text-green-500 text-sm">{actionData.message}</div>
          )}

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Sign up
            </button>
          </div>
        </Form>
        <div className="text-sm text-center">
          <span className="text-gray-600">Already have an account? </span>
          <Link
            to={`/login?redirectTo=${encodeURIComponent(redirectTo)}`}
            className="font-medium text-indigo-600 hover:text-indigo-500"
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
}
