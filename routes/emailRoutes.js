import express from 'express'
import { sendEmail, verifyConnection } from '../services/emailService.js'

const router = express.Router()

/**
 * POST /api/email/send
 * Send an email
 * Body: { to, subject, text, html?, from?, cc?, bcc?, attachments? }
 */
router.post('/send', async (req, res) => {
  const requestStartTime = Date.now()
  const requestId = `req-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const timestamp = new Date().toISOString()
  
  console.log(`[${timestamp}] [${requestId}] ========== EMAIL SEND REQUEST STARTED ==========`)
  console.log(`[${timestamp}] [${requestId}] Request Body:`, JSON.stringify({
    to: req.body.to,
    subject: req.body.subject,
    hasText: !!req.body.text,
    hasHtml: !!req.body.html,
    from: req.body.from,
    cc: req.body.cc,
    bcc: req.body.bcc,
    hasAttachments: !!(req.body.attachments && req.body.attachments.length > 0)
  }, null, 2))
  
  try {
    const { to, subject, text, html, from, cc, bcc, attachments } = req.body

    // Validate required fields
    if (!to || !subject || (!text && !html)) {
      const validationTime = Date.now() - requestStartTime
      console.log(`[${new Date().toISOString()}] [${requestId}] Validation failed (${validationTime}ms)`)
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: to, subject, and either text or html are required'
      })
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
      return res.status(200).json(result)
    } else {
      console.error(`[${new Date().toISOString()}] [${requestId}] ========== EMAIL SEND FAILED (Total: ${totalDuration}ms) ==========`)
      console.error(`[${new Date().toISOString()}] [${requestId}] Error:`, result.error)
      return res.status(500).json(result)
    }
  } catch (error) {
    const totalDuration = Date.now() - requestStartTime
    console.error(`[${new Date().toISOString()}] [${requestId}] ========== EMAIL SEND EXCEPTION (Total: ${totalDuration}ms) ==========`)
    console.error(`[${new Date().toISOString()}] [${requestId}] Exception:`, error)
    console.error(`[${new Date().toISOString()}] [${requestId}] Stack:`, error.stack)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    })
  }
})

/**
 * GET /api/email/verify
 * Verify SMTP connection
 */
router.get('/verify', async (req, res) => {
  const requestStartTime = Date.now()
  const requestId = `verify-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const timestamp = new Date().toISOString()
  
  console.log(`[${timestamp}] [${requestId}] ========== SMTP VERIFY REQUEST STARTED ==========`)
  
  try {
    const verifyStartTime = Date.now()
    console.log(`[${new Date().toISOString()}] [${requestId}] Calling verifyConnection...`)
    
    const result = await verifyConnection()
    
    const verifyDuration = Date.now() - verifyStartTime
    const totalDuration = Date.now() - requestStartTime
    
    console.log(`[${new Date().toISOString()}] [${requestId}] Verify completed in ${verifyDuration}ms`)
    console.log(`[${new Date().toISOString()}] [${requestId}] Result:`, JSON.stringify(result, null, 2))
    console.log(`[${new Date().toISOString()}] [${requestId}] ========== SMTP VERIFY COMPLETED (Total: ${totalDuration}ms) ==========`)
    
    const statusCode = result.success ? 200 : 500
    return res.status(statusCode).json(result)
  } catch (error) {
    const totalDuration = Date.now() - requestStartTime
    console.error(`[${new Date().toISOString()}] [${requestId}] ========== SMTP VERIFY EXCEPTION (Total: ${totalDuration}ms) ==========`)
    console.error(`[${new Date().toISOString()}] [${requestId}] Exception:`, error)
    console.error(`[${new Date().toISOString()}] [${requestId}] Stack:`, error.stack)
    return res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: error.message
    })
  }
})

/**
 * GET /api/email/health
 * Health check endpoint
 */
router.get('/health', (req, res) => {
  return res.status(200).json({
    success: true,
    message: 'Email service is running',
    timestamp: new Date().toISOString()
  })
})

export default router

