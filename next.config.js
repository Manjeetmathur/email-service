/** @type {import('next').NextConfig} */
const nextConfig = {
  // Enable server-side logging
  logging: {
    fetches: {
      fullUrl: true
    }
  }
}

module.exports = nextConfig

