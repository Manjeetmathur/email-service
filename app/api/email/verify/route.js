import { verifyConnection } from '../../../../services/emailService'
import { NextResponse } from 'next/server'

/**
 * GET /api/email/verify
 * Verify email connection
 */
export async function GET() {
  const requestStartTime = Date.now()
  const requestId = `verify-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const timestamp = new Date().toISOString()
  
  console.log(`[${timestamp}] [${requestId}] ========== EMAIL VERIFY REQUEST STARTED ==========`)
  
  try {
    const verifyStartTime = Date.now()
    console.log(`[${new Date().toISOString()}] [${requestId}] Calling verifyConnection...`)
    
    const result = await verifyConnection()
    
    const verifyDuration = Date.now() - verifyStartTime
    const totalDuration = Date.now() - requestStartTime
    
    console.log(`[${new Date().toISOString()}] [${requestId}] Verify completed in ${verifyDuration}ms`)
    console.log(`[${new Date().toISOString()}] [${requestId}] Result:`, JSON.stringify(result, null, 2))
    console.log(`[${new Date().toISOString()}] [${requestId}] ========== EMAIL VERIFY COMPLETED (Total: ${totalDuration}ms) ==========`)
    
    const statusCode = result.success ? 200 : 500
    return NextResponse.json(result, { status: statusCode })
  } catch (error) {
    const totalDuration = Date.now() - requestStartTime
    console.error(`[${new Date().toISOString()}] [${requestId}] ========== EMAIL VERIFY EXCEPTION (Total: ${totalDuration}ms) ==========`)
    console.error(`[${new Date().toISOString()}] [${requestId}] Exception:`, error)
    console.error(`[${new Date().toISOString()}] [${requestId}] Stack:`, error.stack)
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 })
  }
}

