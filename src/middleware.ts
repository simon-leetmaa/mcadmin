import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware() {
    // Middleware handles basic auth requirements
    // Specific role checks are handled in individual pages
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Allow access to auth pages when not authenticated
        if (pathname.startsWith('/auth/')) {
          return true
        }

        // Require authentication for all protected pages
        return !!token
      },
    },
  },
)

export const config = {
  matcher: [
    '/mods',
    '/server',
  ],
}