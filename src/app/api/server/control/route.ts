import { NextRequest, NextResponse } from 'next/server'
import { requireAuth, requireMCAPI, apiError } from '@/lib/api-auth'
import { z } from 'zod'

const controlSchema = z.object({
  action: z.enum(['start', 'stop', 'restart']),
})

export async function POST(req: NextRequest) {
  try {
    await requireAuth(['ADMIN'])

    const body = await req.json()
    const { action } = controlSchema.parse(body)

    const response = await requireMCAPI(`/api/server/${action}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    })

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    if (error instanceof z.ZodError) {
      return apiError('Invalid action', 400)
    }

    console.error('Server control error:', error)
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized') || error.message.includes('Forbidden')) {
        return apiError(error.message, 403)
      }
    }
    return apiError('Failed to control server', 500)
  }
}