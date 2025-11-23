/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable server-side logging
  logging: {
    fetches: {
      fullUrl: true
    }
  },
  // Ensure proper handling of serverless functions
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb'
    }
  }
}

module.exports = nextConfig

