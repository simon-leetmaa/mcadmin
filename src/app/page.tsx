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
              <p className="text-green-700 mb-4">
                You're signed in as <span className="font-medium">{session.user.role}</span>
              </p>
              <div className="flex gap-4">
                <Button asChild>
                  <Link href="/suggestions">View Mod Suggestions</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link href="/suggestions/new">Create Suggestion</Link>
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Mod Suggestions</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Browse and vote on community mod suggestions
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/suggestions">Browse →</Link>
                </Button>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Server Status</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Monitor and control your Minecraft server
                </p>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/server">View Server →</Link>
                </Button>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Profile</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Manage your account and preferences
                </p>
                <Button variant="outline" size="sm" disabled>
                  Coming Soon
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h2 className="text-xl font-semibold text-blue-800 mb-4">
                Get Started with MCAdmin
              </h2>
              <p className="text-blue-700 mb-6">
                Sign in to access mod suggestions, vote on community proposals, and manage your Minecraft server.
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-2">🗳️ Mod Voting System</h3>
                <p className="text-sm text-muted-foreground">
                  Community-driven mod suggestions with upvote/downvote system and automatic approval thresholds
                </p>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-2">🎮 Server Management</h3>
                <p className="text-sm text-muted-foreground">
                  Control your Minecraft server with start/stop/restart functionality and real-time status monitoring
                </p>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-2">👥 Role-Based Access</h3>
                <p className="text-sm text-muted-foreground">
                  Different permission levels for users, moderators, and administrators with protected routes
                </p>
              </div>

              <div className="bg-card border rounded-lg p-6">
                <h3 className="font-semibold mb-2">📁 File Management</h3>
                <p className="text-sm text-muted-foreground">
                  Upload and manage mod files through integrated Express.js API with secure file handling
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
