import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import emailRoutes from './routes/emailRoutes.js'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.PORT || 3000

// Request logging middleware
app.use((req, res, next) => {
  const startTime = Date.now()
  const timestamp = new Date().toISOString()
  
  console.log(`[${timestamp}] ${req.method} ${req.path} - Request started`)
  console.log(`[${timestamp}] Headers:`, JSON.stringify(req.headers, null, 2))
  
  // Log response when it finishes
  res.on('finish', () => {
    const duration = Date.now() - startTime
    const timestampEnd = new Date().toISOString()
    console.log(`[${timestampEnd}] ${req.method} ${req.path} - Response sent (${duration}ms) - Status: ${res.statusCode}`)
  })
  
  next()
})

// Middleware
app.use(cors()) // Enable CORS for all routes
app.use(express.json()) // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })) // Parse URL-encoded request bodies

// Routes
app.use('/api/email', emailRoutes)

// Root endpoint
app.get('/', (req, res) => {
  return res.json({
    message: 'Email API Service',
    version: '1.0.0',
    endpoints: {
      send: 'POST /api/email/send',
      verify: 'GET /api/email/verify',
      health: 'GET /api/email/health'
    }
  })
})

// 404 handler
app.use((req, res) => {
  return res.status(404).json({
    success: false,
    message: 'Route not found'
  })
})

// JSON parsing error handler (must be before general error handler)
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    console.error('JSON parsing error:', err.message)
    return res.status(400).json({
      success: false,
      message: 'Invalid JSON format in request body',
      error: 'Please check your JSON syntax. Common issues: trailing commas, unquoted keys, or invalid characters.',
      details: err.message
    })
  }
  next(err)
})

// General error handler
app.use((err, req, res, next) => {
  console.error('Error:', err)
  const statusCode = err.statusCode || 500
  return res.status(statusCode).json({
    success: false,
    message: err.message || 'Internal server error',
    error: process.env.NODE_ENV === 'development' ? err.stack : err.message
  })
})

// Start server
app.listen(PORT, () => {
  const timestamp = new Date().toISOString()
  console.log(`\n${'='.repeat(60)}`)
  console.log(`[${timestamp}] 🚀 SERVER STARTED`)
  console.log(`[${timestamp}] Server is running on http://localhost:${PORT}`)
  console.log(`[${timestamp}] Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`[${timestamp}] Email API endpoints:`)
  console.log(`[${timestamp}]   POST http://localhost:${PORT}/api/email/send`)
  console.log(`[${timestamp}]   GET  http://localhost:${PORT}/api/email/verify`)
  console.log(`[${timestamp}]   GET  http://localhost:${PORT}/api/email/health`)
  console.log(`${'='.repeat(60)}\n`)
})

