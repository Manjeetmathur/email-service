import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  // Use explicit SMTP configuration instead of 'service: gmail' for better timeout control
  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: 'manjeetkumar62054@gmail.com',
      pass: 'fazu jmlj iyqa mrki'
    },
    // CRITICAL: Timeout settings to prevent 120s default timeout
    connectionTimeout: 15000, // 15 seconds - time to establish TCP connection
    greetingTimeout: 15000, // 15 seconds - time to receive greeting from server
    socketTimeout: 15000, // 15 seconds - time to wait for socket operations
    // Additional settings for better reliability
    requireTLS: true, // Force TLS
    tls: {
      rejectUnauthorized: false // Accept self-signed certificates (if needed)
    }
  })
}

/**
 * Send email using nodemailer
 * @param {Object} options - Email options
 * @param {string} options.to - Recipient email address
 * @param {string} options.subject - Email subject
 * @param {string} options.text - Plain text content
 * @param {string} [options.html] - HTML content (optional)
 * @param {string} [options.from] - Sender email address (optional, uses SMTP_USER if not provided)
 * @param {Array} [options.cc] - CC recipients (optional)
 * @param {Array} [options.bcc] - BCC recipients (optional)
 * @param {Array} [options.attachments] - Email attachments (optional)
 * @returns {Promise<Object>} - Result object with success status and message/info
 */
export const sendEmail = async (options) => {
  const emailId = `email-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const startTime = Date.now()
  const timestamp = new Date().toISOString()
  
  console.log(`[${timestamp}] [${emailId}] ========== EMAIL SERVICE STARTED ==========`)
  console.log(`[${timestamp}] [${emailId}] Recipient: ${options.to}`)
  console.log(`[${timestamp}] [${emailId}] Subject: ${options.subject}`)
  
  try {
    // Validate required fields
    const validationStart = Date.now()
    console.log(`[${new Date().toISOString()}] [${emailId}] Starting validation...`)
    
    if (!options.to) {
      throw new Error('Recipient email address (to) is required')
    }
    if (!options.subject) {
      throw new Error('Email subject is required')
    }
    if (!options.text && !options.html) {
      throw new Error('Email content (text or html) is required')
    }

    const validationTime = Date.now() - validationStart
    console.log(`[${new Date().toISOString()}] [${emailId}] Validation passed (${validationTime}ms)`)

    // Check if SMTP credentials are configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn(`[${new Date().toISOString()}] [${emailId}] WARNING: SMTP credentials not in env, using hardcoded values`)
    }

    // Create transporter
    const transporterStart = Date.now()
    console.log(`[${new Date().toISOString()}] [${emailId}] Creating SMTP transporter...`)
    console.log(`[${new Date().toISOString()}] [${emailId}] SMTP Config: host=smtp.gmail.com, port=587, secure=false`)
    console.log(`[${new Date().toISOString()}] [${emailId}] Timeouts: connection=15s, greeting=15s, socket=15s`)
    const transporter = createTransporter()
    const transporterTime = Date.now() - transporterStart
    console.log(`[${new Date().toISOString()}] [${emailId}] Transporter created (${transporterTime}ms)`)

    // Prepare mail options
    const mailOptions = {
      from: 'manjeetkumar62054@gmail.com',
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      cc: options.cc,
      bcc: options.bcc,
      attachments: options.attachments
    }

    console.log(`[${new Date().toISOString()}] [${emailId}] Mail options prepared:`)
    console.log(`[${new Date().toISOString()}] [${emailId}]   From: ${mailOptions.from}`)
    console.log(`[${new Date().toISOString()}] [${emailId}]   To: ${mailOptions.to}`)
    console.log(`[${new Date().toISOString()}] [${emailId}]   Subject: ${mailOptions.subject}`)
    console.log(`[${new Date().toISOString()}] [${emailId}]   Has text: ${!!mailOptions.text}`)
    console.log(`[${new Date().toISOString()}] [${emailId}]   Has HTML: ${!!mailOptions.html}`)
    console.log(`[${new Date().toISOString()}] [${emailId}]   CC: ${mailOptions.cc || 'none'}`)
    console.log(`[${new Date().toISOString()}] [${emailId}]   BCC: ${mailOptions.bcc || 'none'}`)
    console.log(`[${new Date().toISOString()}] [${emailId}]   Attachments: ${mailOptions.attachments?.length || 0}`)

    // Send mail with timeout wrapper
    const sendStart = Date.now()
    console.log(`[${new Date().toISOString()}] [${emailId}] Attempting to send email via SMTP...`)
    console.log(`[${new Date().toISOString()}] [${emailId}] Connection timeout set to 15 seconds...`)
    
    // Wrap sendMail in a timeout promise to fail faster than default 120s
    const sendMailPromise = transporter.sendMail(mailOptions)
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('SMTP connection timeout: Unable to connect to Gmail SMTP server within 20 seconds. This may be due to network restrictions or Gmail blocking the connection.'))
      }, 20000) // 20 seconds total timeout
    })
    
    const info = await Promise.race([sendMailPromise, timeoutPromise])
    
    const sendDuration = Date.now() - sendStart
    const totalDuration = Date.now() - startTime
    
    console.log(`[${new Date().toISOString()}] [${emailId}] ✅ Email sent successfully!`)
    console.log(`[${new Date().toISOString()}] [${emailId}] SMTP send duration: ${sendDuration}ms`)
    console.log(`[${new Date().toISOString()}] [${emailId}] Total service duration: ${totalDuration}ms`)
    console.log(`[${new Date().toISOString()}] [${emailId}] Message ID: ${info.messageId}`)
    console.log(`[${new Date().toISOString()}] [${emailId}] SMTP Response: ${info.response}`)
    console.log(`[${new Date().toISOString()}] [${emailId}] ========== EMAIL SERVICE SUCCESS ==========`)

    return {
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId,
      response: info.response
    }
  } catch (error) {
    const totalDuration = Date.now() - startTime
    console.error(`[${new Date().toISOString()}] [${emailId}] ❌ EMAIL SERVICE FAILED`)
    console.error(`[${new Date().toISOString()}] [${emailId}] Error after ${totalDuration}ms`)
    console.error(`[${new Date().toISOString()}] [${emailId}] Error type: ${error.constructor.name}`)
    console.error(`[${new Date().toISOString()}] [${emailId}] Error message: ${error.message}`)
    console.error(`[${new Date().toISOString()}] [${emailId}] Error code: ${error.code || 'N/A'}`)
    console.error(`[${new Date().toISOString()}] [${emailId}] Error stack:`, error.stack)
    
    // Log specific SMTP errors
    if (error.code) {
      console.error(`[${new Date().toISOString()}] [${emailId}] SMTP Error Code: ${error.code}`)
    }
    if (error.command) {
      console.error(`[${new Date().toISOString()}] [${emailId}] Failed SMTP Command: ${error.command}`)
    }
    if (error.response) {
      console.error(`[${new Date().toISOString()}] [${emailId}] SMTP Response: ${error.response}`)
    }
    
    console.error(`[${new Date().toISOString()}] [${emailId}] ========== EMAIL SERVICE FAILED ==========`)
    
    return {
      success: false,
      message: error.message || 'Failed to send email',
      error: error.toString()
    }
  }
}

/**
 * Verify SMTP connection
 * @returns {Promise<Object>} - Verification result
 */
export const verifyConnection = async () => {
  const verifyId = `verify-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  const startTime = Date.now()
  const timestamp = new Date().toISOString()
  
  console.log(`[${timestamp}] [${verifyId}] ========== SMTP VERIFY SERVICE STARTED ==========`)
  
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      console.warn(`[${new Date().toISOString()}] [${verifyId}] WARNING: SMTP credentials not in env, using hardcoded values`)
    }

    const transporterStart = Date.now()
    console.log(`[${new Date().toISOString()}] [${verifyId}] Creating SMTP transporter...`)
    const transporter = createTransporter()
    const transporterTime = Date.now() - transporterStart
    console.log(`[${new Date().toISOString()}] [${verifyId}] Transporter created (${transporterTime}ms)`)
    
    const verifyStart = Date.now()
    console.log(`[${new Date().toISOString()}] [${verifyId}] Attempting SMTP connection verification...`)
    console.log(`[${new Date().toISOString()}] [${verifyId}] Connection timeout set to 15 seconds...`)
    
    // Wrap verify in a timeout promise to fail faster than default 120s
    const verifyPromise = transporter.verify()
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('SMTP verification timeout: Unable to connect to Gmail SMTP server within 20 seconds. This may be due to network restrictions or Gmail blocking the connection.'))
      }, 20000) // 20 seconds total timeout
    })
    
    await Promise.race([verifyPromise, timeoutPromise])
    
    const verifyDuration = Date.now() - verifyStart
    const totalDuration = Date.now() - startTime
    
    console.log(`[${new Date().toISOString()}] [${verifyId}] ✅ SMTP connection verified successfully!`)
    console.log(`[${new Date().toISOString()}] [${verifyId}] Verify duration: ${verifyDuration}ms`)
    console.log(`[${new Date().toISOString()}] [${verifyId}] Total duration: ${totalDuration}ms`)
    console.log(`[${new Date().toISOString()}] [${verifyId}] ========== SMTP VERIFY SUCCESS ==========`)

    return {
      success: true,
      message: 'SMTP connection verified successfully'
    }
  } catch (error) {
    const totalDuration = Date.now() - startTime
    console.error(`[${new Date().toISOString()}] [${verifyId}] ❌ SMTP VERIFY FAILED`)
    console.error(`[${new Date().toISOString()}] [${verifyId}] Error after ${totalDuration}ms`)
    console.error(`[${new Date().toISOString()}] [${verifyId}] Error type: ${error.constructor.name}`)
    console.error(`[${new Date().toISOString()}] [${verifyId}] Error message: ${error.message}`)
    console.error(`[${new Date().toISOString()}] [${verifyId}] Error code: ${error.code || 'N/A'}`)
    console.error(`[${new Date().toISOString()}] [${verifyId}] Error stack:`, error.stack)
    
    if (error.code) {
      console.error(`[${new Date().toISOString()}] [${verifyId}] SMTP Error Code: ${error.code}`)
    }
    if (error.command) {
      console.error(`[${new Date().toISOString()}] [${verifyId}] Failed SMTP Command: ${error.command}`)
    }
    if (error.response) {
      console.error(`[${new Date().toISOString()}] [${verifyId}] SMTP Response: ${error.response}`)
    }
    
    console.error(`[${new Date().toISOString()}] [${verifyId}] ========== SMTP VERIFY FAILED ==========`)
    
    return {
      success: false,
      message: 'SMTP connection verification failed',
      error: error.message
    }
  }
}

