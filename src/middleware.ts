import { withAuth } from 'next-auth/middleware'

export default withAuth(
  function middleware() {
    // Additional middleware logic can go here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl

        // Allow access to auth pages when not authenticated
        if (pathname.startsWith('/auth/')) {
          return true
        }

        // Require authentication for protected routes
        if (pathname.startsWith('/admin/')) {
          return token?.role === 'ADMIN'
        }

        if (pathname.startsWith('/moderator/')) {
          return token?.role === 'ADMIN' || token?.role === 'MODERATOR'
        }

        // Allow access to other pages for authenticated users
        return !!token
      },
    },
  },
)

export const config = {
  matcher: [
    '/admin/:path*',
    '/moderator/:path*',
    '/dashboard/:path*',
    '/suggestions/new',
    '/suggestions/:id/edit',
  ],
}