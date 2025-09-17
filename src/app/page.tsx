'use client'

import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function Home() {
  const { data: session } = useSession()

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl">
        <h1 className="text-4xl font-bold mb-4">MCAdmin Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Welcome to your Minecraft server administration panel.
        </p>

        {session ? (
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-green-800 mb-2">
                Welcome back, {session.user.name || session.user.email}!
              </h2>
              <p className="text-green-700">
                You&apos;re signed in as <span className="font-medium">{session.user.role}</span>
              </p>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold mb-2">Authentication System</h3>
              <p className="text-sm text-muted-foreground mb-4">
                ✅ User authentication is working! You can sign in, sign up, and manage user sessions with role-based access.
              </p>
              <p className="text-xs text-muted-foreground">
                Ready for additional features to be built on top of this foundation.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">
                MCAdmin Authentication Demo
              </h2>
              <p className="text-blue-700 mb-6">
                This is a working authentication system for a Minecraft server admin panel. Create an account or sign in to test the system.
              </p>
              <div className="flex gap-4">
                <Button asChild>
                  <Link href="/auth/signin">Sign In</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/auth/signup">Create Account</Link>
                </Button>
              </div>
            </div>

            <div className="bg-card border rounded-lg p-6">
              <h3 className="font-semibold mb-2">✅ What&apos;s Working</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• User registration and authentication</li>
                <li>• Role-based access (USER, MODERATOR, ADMIN)</li>
                <li>• Protected routes and middleware</li>
                <li>• Secure password hashing</li>
                <li>• Database integration with Prisma</li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
