# Email API Service - Next.js

A Next.js email service using Nodemailer API.

## Features

- Send emails via REST API
- Verify email connection
- Health check endpoint
- Comprehensive logging
- Error handling

## Getting Started

### Installation

```bash
npm install
```

### Environment Variables

Create a `.env.local` file in the root directory:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
```

For Gmail, you need to:
1. Enable 2-Step Verification
2. Generate an App Password: https://myaccount.google.com/apppasswords

### Development

```bash
npm run dev
```

The API will be available at `http://localhost:3000`

### Production

```bash
npm run build
npm start
```

## API Endpoints

### POST `/api/email/send`

Send an email.

**Request Body:**
```json
{
  "to": "recipient@example.com",
  "subject": "Hello",
  "text": "This is a test email.",
  "html": "<h1>Hello</h1><p>This is a test email.</p>"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "<message-id>",
  "response": "250 2.0.0 OK"
}
```

### GET `/api/email/verify`

Verify email connection.

**Response:**
```json
{
  "success": true,
  "message": "Email connection verified successfully"
}
```

### GET `/api/email/health`

Health check endpoint.

**Response:**
```json
{
  "success": true,
  "message": "Email service is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Deployment

### Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard:
   - `EMAIL_USER`
   - `EMAIL_PASS`
4. Deploy

### Render

1. Connect your GitHub repository
2. Set build command: `npm install && npm run build`
3. Set start command: `npm start`
4. Add environment variables:
   - `EMAIL_USER`
   - `EMAIL_PASS`

## Troubleshooting

### Serverless Function Crashes

If you see `FUNCTION_INVOCATION_FAILED` errors:

1. Check that environment variables are set correctly
2. Verify email credentials are valid
3. Check Vercel/Render logs for detailed error messages
4. Ensure `nodemailer` is in dependencies (not devDependencies)

### Connection Timeouts

If emails timeout on cloud platforms:

- Cloud platforms often block SMTP connections
- Consider using a transactional email service (Resend, SendGrid, Mailgun)
- These services use HTTP APIs instead of SMTP

## License

ISC

