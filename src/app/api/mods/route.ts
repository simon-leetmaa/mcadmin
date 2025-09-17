import { NextResponse } from 'next/server'
import { requireAuth, requireMCAPI, apiError } from '@/lib/api-auth'

export async function GET() {
  try {
    await requireAuth()
    const response = await requireMCAPI('/api/mods')
    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Mods API error:', error)
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
        return apiError(error.message, 403)
      }
    }
    return apiError('Failed to fetch mods data', 500)
  }
}