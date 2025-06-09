import { redirectIfLoggedIn, requireUserId } from "./supabase/auth"

export async function authMiddleware(request: Request) {
  const url = new URL(request.url)

  // Skip middleware for API routes
  if (url.pathname.startsWith("/api")) {
    return null
  }

  // Skip middleware for static assets
  if (
    url.pathname.startsWith("/build/") ||
    url.pathname.startsWith("/assets/")
  ) {
    return null
  }

  // Handle auth routes - redirect logged in users to /app
  if (["/", "/login", "/signup"].includes(url.pathname)) {
    await redirectIfLoggedIn(request)
  }

  // Handle protected routes - redirect non-logged in users to /login
  if (url.pathname.startsWith("/app") || url.pathname.startsWith("/library")) {
    await requireUserId(request)
  }

  return null
}
