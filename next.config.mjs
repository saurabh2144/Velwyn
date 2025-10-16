// @ts-check
import withPlaiceholder from '@plaiceholder/next'

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // ✅ ImageKit CDN
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
      // ✅ Cloudinary CDN (supports both .com and subdomains)
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
      // ✅ Your Production Domain (Velwyn)
      {
        protocol: 'https',
        hostname: 'velwyn.in',
      },
    
    ],
    // Modern optimized formats
    formats: ['image/avif', 'image/webp'],
  },

  // Optional experimental features
  // experimental: {
  //   ppr: true,
  // },
}

export default withPlaiceholder(nextConfig)
