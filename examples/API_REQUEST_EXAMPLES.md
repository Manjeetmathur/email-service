# Email API Request Examples

## Endpoints

### POST `/api/email/send`

Send an email through the service.

**Content-Type:** `application/json`

**Required Fields:**
- `to` (string) - Recipient email address
- `subject` (string) - Email subject
- `text` OR `html` (string) - Email content (at least one is required)

**Optional Fields:**
- `from` (string) - Sender email address (defaults to configured EMAIL_USER)
- `cc` (array of strings) - CC recipients
- `bcc` (array of strings) - BCC recipients
- `attachments` (array of objects) - Email attachments

---

## Request Examples

### 1. Simple Text Email

```json
{
  "to": "recipient@example.com",
  "subject": "Hello from Email Service",
  "text": "This is a simple text email message."
}
```

**cURL:**
```bash
curl -X POST http://localhost:3000/api/email/send \
  -H 'Content-Type: application/json' \
  -d '{
    "to": "recipient@example.com",
    "subject": "Hello from Email Service",
    "text": "This is a simple text email message."
  }'
```

---

### 2. HTML Email with Text Fallback

```json
{
  "to": "recipient@example.com",
  "subject": "Welcome to Our Service",
  "text": "Welcome to our service! Click the link below to get started.",
  "html": "<h1>Welcome to Our Service</h1><p>Click the <a href='https://example.com'>link</a> below to get started.</p>"
}
```

**cURL:**
```bash
curl -X POST http://localhost:3000/api/email/send \
  -H 'Content-Type: application/json' \
  -d '{
    "to": "recipient@example.com",
    "subject": "Welcome to Our Service",
    "text": "Welcome to our service! Click the link below to get started.",
    "html": "<h1>Welcome to Our Service</h1><p>Click the <a href=\"https://example.com\">link</a> below to get started.</p>"
  }'
```

---

### 3. HTML-Only Email

```json
{
  "to": "recipient@example.com",
  "subject": "HTML Email",
  "html": "<html><body><h1>Hello</h1><p>This is an HTML email.</p></body></html>"
}
```

---

### 4. Email with Custom Sender

```json
{
  "to": "recipient@example.com",
  "subject": "Email from Custom Sender",
  "text": "This email is sent from a custom sender address.",
  "from": "custom-sender@example.com"
}
```

---

### 5. Email with CC Recipients

```json
{
  "to": "recipient@example.com",
  "subject": "Email with CC",
  "text": "This email has CC recipients.",
  "cc": ["cc1@example.com", "cc2@example.com"]
}
```

---

### 6. Email with BCC Recipients

```json
{
  "to": "recipient@example.com",
  "subject": "Email with BCC",
  "text": "This email has BCC recipients.",
  "bcc": ["bcc1@example.com", "bcc2@example.com"]
}
```

---

### 7. Email with CC and BCC

```json
{
  "to": "recipient@example.com",
  "subject": "Email with CC and BCC",
  "text": "This email has both CC and BCC recipients.",
  "cc": ["cc@example.com"],
  "bcc": ["bcc@example.com"]
}
```

---

### 8. Email with File Attachment (File Path)

```json
{
  "to": "recipient@example.com",
  "subject": "Email with Attachment",
  "text": "Please find the attached file.",
  "attachments": [
    {
      "filename": "document.pdf",
      "path": "/path/to/document.pdf"
    },
    {
      "filename": "image.png",
      "path": "/path/to/image.png",
      "contentType": "image/png"
    }
  ]
}
```

---

### 9. Email with Base64 Attachment

```json
{
  "to": "recipient@example.com",
  "subject": "Email with Base64 Attachment",
  "text": "Please find the attached file.",
  "attachments": [
    {
      "filename": "document.pdf",
      "content": "base64EncodedContentHere",
      "encoding": "base64",
      "contentType": "application/pdf"
    }
  ]
}
```

---

### 10. Email with Raw Content Attachment

```json
{
  "to": "recipient@example.com",
  "subject": "Email with Raw Attachment",
  "text": "Please find the attached file.",
  "attachments": [
    {
      "filename": "data.txt",
      "content": "Raw file content here",
      "contentType": "text/plain"
    }
  ]
}
```

---

### 11. Complete Email Example (All Options)

```json
{
  "to": "recipient@example.com",
  "subject": "Complete Email Example",
  "text": "This is a complete email example with all features.",
  "html": "<html><body><h1>Complete Email Example</h1><p>This is a complete email example with all features.</p></body></html>",
  "from": "sender@example.com",
  "cc": ["cc1@example.com", "cc2@example.com"],
  "bcc": ["bcc@example.com"],
  "attachments": [
    {
      "filename": "report.pdf",
      "path": "/path/to/report.pdf"
    }
  ]
}
```

---

## JavaScript Examples

### Using Fetch API

```javascript
fetch('http://localhost:3000/api/email/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: 'recipient@example.com',
    subject: 'Hello from API',
    text: 'This is a test email sent via API.',
    html: '<h1>Hello</h1><p>This is a test email sent via API.</p>'
  })
})
  .then(response => response.json())
  .then(data => console.log('Success:', data))
  .catch(error => console.error('Error:', error));
```

### Using Axios

```javascript
const axios = require('axios');

axios.post('http://localhost:3000/api/email/send', {
  to: 'recipient@example.com',
  subject: 'Hello from API',
  text: 'This is a test email sent via API.',
  html: '<h1>Hello</h1><p>This is a test email sent via API.</p>'
})
  .then(response => console.log('Success:', response.data))
  .catch(error => console.error('Error:', error));
```

### Using Node.js with Fetch

```javascript
const response = await fetch('http://localhost:3000/api/email/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    to: 'recipient@example.com',
    subject: 'Hello from API',
    text: 'This is a test email sent via API.'
  })
});

const data = await response.json();
console.log(data);
```

---

## Attachment Format

Attachments are an array of objects with the following structure:

### Using File Path

```json
{
  "filename": "document.pdf",
  "path": "/path/to/document.pdf",
  "contentType": "application/pdf"
}
```

### Using Base64 Content

```json
{
  "filename": "document.pdf",
  "content": "base64EncodedString",
  "encoding": "base64",
  "contentType": "application/pdf"
}
```

### Using Raw Content

```json
{
  "filename": "data.txt",
  "content": "Raw file content",
  "contentType": "text/plain"
}
```

### For Inline Images in HTML

```json
{
  "filename": "logo.png",
  "path": "/path/to/logo.png",
  "cid": "uniqueContentId",
  "contentType": "image/png"
}
```

Then reference in HTML:
```html
<img src="cid:uniqueContentId" alt="Logo">
```

**Attachment Properties:**
- `filename` (string, required) - Name of the file as it will appear in the email
- `path` (string, optional) - Path to the file on the server (use `path` OR `content`, not both)
- `content` (string | Buffer, optional) - File content as string, Buffer, or base64 encoded string
- `encoding` (string, optional) - Encoding of the content (e.g., 'base64')
- `contentType` (string, optional) - MIME type of the file (e.g., 'application/pdf', 'image/png')
- `cid` (string, optional) - Content ID for inline images in HTML emails

---

## Response Examples

### Success Response

**Status Code:** `200 OK`

```json
{
  "success": true,
  "message": "Email sent successfully",
  "messageId": "<message-id@example.com>",
  "response": "250 2.0.0 OK"
}
```

### Error Response (Validation)

**Status Code:** `400 Bad Request`

```json
{
  "success": false,
  "message": "Missing required fields: to, subject, and either text or html are required"
}
```

### Error Response (Server Error)

**Status Code:** `500 Internal Server Error`

```json
{
  "success": false,
  "message": "Failed to send email",
  "error": "Error details here"
}
```

---

## Other Endpoints

### GET `/api/email/verify`

Verify email connection.

**Request:** No body required

**cURL:**
```bash
curl -X GET http://localhost:3000/api/email/verify
```

**Success Response (200):**
```json
{
  "success": true,
  "message": "Email connection verified successfully"
}
```

**Error Response (500):**
```json
{
  "success": false,
  "message": "Email connection verification failed",
  "error": "Error message here"
}
```

---

### GET `/api/email/health`

Health check endpoint.

**Request:** No body required

**cURL:**
```bash
curl -X GET http://localhost:3000/api/email/health
```

**Response (200):**
```json
{
  "success": true,
  "message": "Email service is running",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

