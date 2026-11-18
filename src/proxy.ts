import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isAdminRoute = createRouteMatcher(["/admin(.*)", "/api/admin(.*)"]);

// Public app; owner-only routes need the Clerk role publicMetadata.role = "admin"
// (exposed on the session token via the session claim `metadata`).
export default clerkMiddleware(async (auth, req) => {
  if (!isAdminRoute(req)) return;
  const { userId, sessionClaims } = await auth();
  if (sessionClaims?.metadata?.role === "admin") return;
  if (!userId && !req.nextUrl.pathname.startsWith("/api/")) return (await auth()).redirectToSignIn();
  return new Response("Not found", { status: 404 });
});

export const config = {
  matcher: [
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    "/(api|trpc)(.*)",
  ],
};
