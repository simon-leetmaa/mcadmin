import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  // No adapter needed when using JWT strategy with credentials provider
  // This prevents unnecessary database queries that cause delays
  session: {
    strategy: 'jwt',
    maxAge: 60 * 60, // 1 hour (shorter for faster role updates)
  },
  jwt: {
    maxAge: 60 * 60, // 1 hour
  },
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        // Lazy load Prisma only when actually authenticating
        // This prevents cold starts on every session check
        const { prisma } = await import('./prisma')

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user || !user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password,
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      // If this is the first time (user is provided), store the role and timestamp
      if (user) {
        token.role = user.role
        token.lastRefresh = Date.now()
      }

      // Skip database refresh to avoid delays with remote databases
      // The role is set correctly when the user logs in
      // If role changes are needed, user should log out and log in again

      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.sub as string
        session.user.role = token.role as string
        session.user.name = token.name as string
        session.user.email = token.email as string
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}