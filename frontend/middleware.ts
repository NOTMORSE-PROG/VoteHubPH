import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const isAuth = !!token
    const pathname = req.nextUrl.pathname
    const isAuthPage = pathname.startsWith('/login') ||
                       pathname.startsWith('/signup') ||
                       pathname.startsWith('/register')
    const isCompleteProfilePage = pathname.startsWith('/complete-profile')

    // If user is authenticated but profile is incomplete, redirect to complete-profile
    if (isAuth && token?.profileCompleted === false && !isCompleteProfilePage) {
      // Allow access to auth pages and API routes even with incomplete profile
      if (!isAuthPage && !pathname.startsWith('/api/')) {
        return NextResponse.redirect(new URL('/complete-profile', req.url))
      }
    }

    // If user is authenticated with complete profile and tries to access complete-profile page, redirect to browse
    if (isAuth && token?.profileCompleted === true && isCompleteProfilePage) {
      return NextResponse.redirect(new URL('/browse', req.url))
    }

    // If user is authenticated and tries to access auth pages, redirect to browse
    if (isAuthPage && isAuth) {
      return NextResponse.redirect(new URL('/browse', req.url))
    }

    // For protected routes, the withAuth will handle redirecting to login
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname

        // Public routes that don't require authentication
        const publicRoutes = [
          '/',
          '/login',
          '/signup',
          '/register',
          '/browse',
          '/candidate',
          '/partylist',
          '/api/auth',
          '/complete-profile', // Allow complete-profile (middleware will handle incomplete users)
        ]

        // Check if the pathname starts with any public route
        const isPublicRoute = publicRoutes.some(route => pathname.startsWith(route))

        // Allow access to public routes without authentication
        if (isPublicRoute) {
          return true
        }

        // For all other routes, require authentication
        return !!token
      },
    },
    pages: {
      signIn: '/login',
    },
  }
)

// Protect specific routes
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
