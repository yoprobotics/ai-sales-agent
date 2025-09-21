/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  experimental: {
    outputFileTracingRoot: require('path').join(__dirname, '../../')
  },
  env: {
    NEXT_TELEMETRY_DISABLED: '1'
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    // We handle TypeScript errors separately
    ignoreBuildErrors: true
  }
}

module.exports = nextConfig
