export default function Home() {
  return (
    <div style={{ 
      fontFamily: 'system-ui, -apple-system, sans-serif',
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      lineHeight: '1.6'
    }}>
      <h1>Email API Service</h1>
      <p>Version 1.0.0</p>
      
      <h2>Available Endpoints</h2>
      <ul>
        <li>
          <strong>POST</strong> <code>/api/email/send</code> - Send an email
        </li>
        <li>
          <strong>GET</strong> <code>/api/email/verify</code> - Verify email connection
        </li>
        <li>
          <strong>GET</strong> <code>/api/email/health</code> - Health check
        </li>
      </ul>
      
      <h2>Send Email Example</h2>
      <pre style={{
        background: '#f5f5f5',
        padding: '1rem',
        borderRadius: '4px',
        overflow: 'auto'
      }}>
{`POST /api/email/send
Content-Type: application/json

{
  "to": "recipient@example.com",
  "subject": "Hello",
  "text": "This is a test email."
}`}
      </pre>
    </div>
  )
}

