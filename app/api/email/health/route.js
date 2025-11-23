import { NextResponse } from 'next/server'

/**
 * GET /api/email/health
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Email service is running',
    timestamp: new Date().toISOString()
  }, { status: 200 })
}

