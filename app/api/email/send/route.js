import { sendEmail } from '../../../../services/emailService'
import { NextResponse } from 'next/server'

/**
 * POST /api/email/send
 * Send an email
 * Body: { to, subject, text, html?, from?, cc?, bcc?, attachments? }
 */
export async function POST(request) {
  const requestStartTime = Date.now()
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const timestamp = new Date().toISOString()
  
  console.log(`[${timestamp}] [${requestId}] ========== EMAIL SEND REQUEST STARTED ==========`)
  
  try {
    let body
    try {
      body = await request.json()
    } catch (jsonError) {
      console.error(`[${new Date().toISOString()}] [${requestId}] JSON parsing error:`, jsonError)
      return NextResponse.json({
        success: false,
        message: 'Invalid JSON format in request body',
        error: 'Please check your JSON syntax. Common issues: trailing commas, unquoted keys, or invalid characters.',
        details: jsonError.message
      }, { status: 400 })
    }
    
    console.log(`[${timestamp}] [${requestId}] Request Body:`, JSON.stringify({
      to: body.to,
      subject: body.subject,
      hasText: !!body.text,
      hasHtml: !!body.html,
      from: body.from,
      cc: body.cc,
      bcc: body.bcc,
      hasAttachments: !!(body.attachments && body.attachments.length > 0)
    }, null, 2))
    
    const { to, subject, text, html, from, cc, bcc, attachments } = body

    // Validate required fields
    if (!to || !subject || (!text && !html)) {
      const validationTime = Date.now() - requestStartTime
      console.log(`[${new Date().toISOString()}] [${requestId}] Validation failed (${validationTime}ms)`)
      return NextResponse.json({
        success: false,
        message: 'Missing required fields: to, subject, and either text or html are required'
      }, { status: 400 })
    }

    console.log(`[${new Date().toISOString()}] [${requestId}] Validation passed, calling sendEmail...`)
    const emailStartTime = Date.now()
    
    const result = await sendEmail({
      to,
      subject,
      text,
      html,
      from,
      cc,
      bcc,
      attachments
    })

    const emailDuration = Date.now() - emailStartTime
    const totalDuration = Date.now() - requestStartTime
    
    console.log(`[${new Date().toISOString()}] [${requestId}] Email service completed in ${emailDuration}ms`)
    console.log(`[${new Date().toISOString()}] [${requestId}] Result:`, JSON.stringify({
      success: result.success,
      message: result.message,
      messageId: result.messageId
    }, null, 2))

    if (result.success) {
      console.log(`[${new Date().toISOString()}] [${requestId}] ========== EMAIL SEND SUCCESS (Total: ${totalDuration}ms) ==========`)
      return NextResponse.json(result, { status: 200 })
    } else {
      console.error(`[${new Date().toISOString()}] [${requestId}] ========== EMAIL SEND FAILED (Total: ${totalDuration}ms) ==========`)
      console.error(`[${new Date().toISOString()}] [${requestId}] Error:`, result.error)
      return NextResponse.json(result, { status: 500 })
    }
  } catch (error) {
    const totalDuration = Date.now() - requestStartTime
    console.error(`[${new Date().toISOString()}] [${requestId}] ========== EMAIL SEND EXCEPTION (Total: ${totalDuration}ms) ==========`)
    console.error(`[${new Date().toISOString()}] [${requestId}] Exception:`, error)
    console.error(`[${new Date().toISOString()}] [${requestId}] Stack:`, error.stack)
    
    // Handle JSON parsing errors
    if (error instanceof SyntaxError) {
      return NextResponse.json({
        success: false,
        message: 'Invalid JSON format in request body',
        error: 'Please check your JSON syntax. Common issues: trailing commas, unquoted keys, or invalid characters.',
        details: error.message
      }, { status: 400 })
    }
    
    return NextResponse.json({
      success: false,
      message: 'Internal server error',
      error: error.message
    }, { status: 500 })
  }
}

