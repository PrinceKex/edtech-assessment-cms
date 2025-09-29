import { createCookieSessionStorage, redirect } from "@remix-run/node";

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
  throw new Error("SESSION_SECRET must be set");
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "sb:token",
    secure: process.env.NODE_ENV === "production",
    secrets: [sessionSecret],
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    httpOnly: true,
  },
});

export async function createUserSession(userId: string, redirectTo: string) {
  const session = await sessionStorage.getSession();
  session.set("userId", userId);
  
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await sessionStorage.commitSession(session),
    },
  });
}

export async function getUserId(request: Request) {
  const session = await sessionStorage.getSession(
    request.headers.get("Cookie")
  );
  const userId = session.get("userId");
  if (!userId) return null;
  return userId;
}

export async function requireUserId(
  request: Request,
  redirectTo: string | boolean = new URL(request.url).pathname
): Promise<string | null> {
  const userId = await getUserId(request);
  if (!userId) {
    if (redirectTo === false) {
      return null; // Return null if authentication is optional
    }
    const redirectPath = typeof redirectTo === 'string' ? redirectTo : new URL(request.url).pathname;
    const searchParams = new URLSearchParams([["redirectTo", redirectPath]]);
    throw redirect(`/login?${searchParams}`);
  }
  return userId;
}

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie");
  return sessionStorage.getSession(cookie);
}
