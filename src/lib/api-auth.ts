import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export type Role = 'USER' | 'MODERATOR' | 'ADMIN'

export async function requireAuth(allowedRoles?: Role[]) {
  const session = await getServerSession(authOptions)

  if (!session) {
    throw new Error('Unauthorized - Authentication required')
  }

  if (allowedRoles && !allowedRoles.includes(session.user.role as Role)) {
    throw new Error('Forbidden - Insufficient permissions')
  }

  return session
}

export async function requireMCAPI(url: string, options: RequestInit = {}) {
  const response = await fetch(`${process.env.MINECRAFT_API_URL}${url}`, {
    ...options,
    headers: {
      'x-api-key': process.env.MINECRAFT_API_KEY!,
      ...options.headers,
    },
  })

  if (!response.ok) {
    throw new Error(`MC API responded with ${response.status}`)
  }

  return response
}

export function apiError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
}