import { NextResponse } from 'next/server'
import { requireMCAPI } from '@/lib/api-auth'

export async function GET() {
  try {
    const response = await requireMCAPI('/health')
    const data = await response.json()
    return NextResponse.json({
      connected: true,
      mcApiResponse: data,
      url: process.env.MINECRAFT_API_URL,
    })
  } catch (error) {
    return NextResponse.json({
      connected: false,
      error: error instanceof Error ? error.message : 'Unknown error',
      url: process.env.MINECRAFT_API_URL,
    })
  }
}