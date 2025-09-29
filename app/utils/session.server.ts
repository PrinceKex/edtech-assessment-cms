import { createCookieSessionStorage } from "@remix-run/node";

// This secret is used to encrypt the session data
// In production, you should use a long, random string stored in an environment variable
const SESSION_SECRET = process.env.SESSION_SECRET || "s3cr3t";

if (!SESSION_SECRET) {
  throw new Error("SESSION_SECRET must be set");
}

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [SESSION_SECRET],
    secure: process.env.NODE_ENV === "production",
  },
});

export async function getSession(request: Request) {
  const cookie = request.headers.get("Cookie") || "";
  return sessionStorage.getSession(cookie);
}

export async function createUserSession({
  request,
  userId,
  userEmail,
  redirectTo,
}: {
  request: Request;
  userId: string;
  userEmail: string;
  redirectTo: string;
}) {
  const session = await getSession(request);
  session.set("userId", userId);
  session.set("userEmail", userEmail);
  
  return new Response(null, {
    status: 302,
    headers: {
      Location: redirectTo,
      "Set-Cookie": await sessionStorage.commitSession(session, {
        maxAge: 60 * 60 * 24 * 7, // 1 week
      }),
    },
  });
}

export async function destroySession(request: Request) {
  const session = await getSession(request);
  return new Response(null, {
    headers: {
      "Set-Cookie": await sessionStorage.destroySession(session),
    },
  });
}

export async function getUserId(request: Request) {
  const session = await getSession(request);
  const userId = session.get("userId");
  return userId;
}

export async function getUserEmail(request: Request) {
  const session = await getSession(request);
  const userEmail = session.get("userEmail");
  return userEmail;
}
