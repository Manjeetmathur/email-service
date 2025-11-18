import express from 'express'
import { sendEmail, verifyConnection } from '../services/emailService.js'

const router = express.Router()

/**
 * POST /api/email/send
 * Send an email
 * Body: { to, subject, text, html?, from?, cc?, bcc?, attachments? }
 */
router.post('/send', async (req, res) => {
  try {
    const { to, subject, text, html, from, cc, bcc, attachments } = req.body

    // Validate required fields
    if (!to || !subject || (!text && !html)) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: to, subject, and either text or html are required'
      })
    }

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

    if (result.success) {
      return res.status(200).json(result)
    } else {
      return res.status(500).json(result)
    }
  } catch (error) {
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
  try {
    const result = await verifyConnection()
    const statusCode = result.success ? 200 : 500
    return res.status(statusCode).json(result)
  } catch (error) {
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

