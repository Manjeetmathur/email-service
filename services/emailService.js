import nodemailer from 'nodemailer'
import dotenv from 'dotenv'

dotenv.config()

// Create reusable transporter object using SMTP transport
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: process.env.SMTP_SECURE === 'true', // true for 465, false for other ports
    auth: {
      user: 'manjeetkumar62054@gmail.com',
      pass: 'fazu jmlj iyqa mrki'
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
  try {
    // Validate required fields
    if (!options.to) {
      throw new Error('Recipient email address (to) is required')
    }
    if (!options.subject) {
      throw new Error('Email subject is required')
    }
    if (!options.text && !options.html) {
      throw new Error('Email content (text or html) is required')
    }

    // Check if SMTP credentials are configured
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      throw new Error('SMTP credentials not configured. Please set SMTP_USER and SMTP_PASS in .env file')
    }

    const transporter = createTransporter()

    // Prepare mail options
    const mailOptions = {
      from: options.from || process.env.SMTP_USER,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
      cc: options.cc,
      bcc: options.bcc,
      attachments: options.attachments
    }

    // Send mail
    const info = await transporter.sendMail(mailOptions)

    return {
      success: true,
      message: 'Email sent successfully',
      messageId: info.messageId,
      response: info.response
    }
  } catch (error) {
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
  try {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
      return {
        success: false,
        message: 'SMTP credentials not configured'
      }
    }

    const transporter = createTransporter()
    await transporter.verify()

    return {
      success: true,
      message: 'SMTP connection verified successfully'
    }
  } catch (error) {
    return {
      success: false,
      message: 'SMTP connection verification failed',
      error: error.message
    }
  }
}

