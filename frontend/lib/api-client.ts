import { getSession } from "next-auth/react"

/**
 * Authenticated fetch wrapper that forwards the Sanctum token issued after a
 * verified NextAuth login. A caller-controlled user ID is never trusted.
 */
export async function authenticatedFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const session = await getSession()
  
  const headers = new Headers(options.headers)
  if (!headers.has("Content-Type")) headers.set("Content-Type", "application/json")
  if (!headers.has("Accept")) headers.set("Accept", "application/json")
  
  if (session?.user?.backendToken) {
    headers.set("Authorization", `Bearer ${session.user.backendToken}`)
  }
  
  return fetch(url, {
    ...options,
    headers,
    credentials: "include",
  })
}

