/** @type {import('next').NextConfig} */
const nextConfig = {
  // API-only configuration
  api: {
    bodyParser: {
      sizeLimit: '10mb', // Allow larger payloads for CSV uploads
    },
    externalResolver: true,
  },
  
  // Disable static optimization for API-only app
  output: 'standalone',
  
  // Security headers
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-XSS-Protection',
            value: '1; mode=block',
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains',
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin',
          },
        ],
      },
    ];
  },
  
  // Environment variables to expose
  env: {
    API_BASE_URL: process.env.API_BASE_URL || 'http://localhost:3001',
  },
  
  // TypeScript and ESLint
  typescript: {
    tsconfigPath: './tsconfig.json',
  },
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
