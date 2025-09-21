/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  env: {
    NEXT_TELEMETRY_DISABLED: '1'
  },
  eslint: {
    // Ignore ESLint during build (we run it separately)
    ignoreDuringBuilds: true
  },
  typescript: {
    // Ignore TypeScript errors during build (we check it separately)
    ignoreBuildErrors: true
  },
  webpack: (config, { isServer }) => {
    // Fixes for Prisma
    if (isServer) {
      config.externals.push('@prisma/client');
    }
    return config;
  }
}

module.exports = nextConfig
