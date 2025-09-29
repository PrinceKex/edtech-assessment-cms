import { redirect } from "@remix-run/node";
import { getSession } from "~/utils/auth.server";
import { createSupabaseServerClient } from "~/utils/supabase.server";

export const action = async ({ request }: { request: Request }) => {
  const { supabaseClient, headers } = createSupabaseServerClient({
    request,
    response: new Response(),
  });

  // Sign out from Supabase
  await supabaseClient.auth.signOut();

  // Clear the session cookie
  const session = await getSession(request);
  return redirect("/login", {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
};

export const loader = async () => {
  return redirect("/");
};
