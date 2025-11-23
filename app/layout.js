export const metadata = {
  title: 'Email API Service',
  description: 'Next.js email service using Nodemailer API',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

