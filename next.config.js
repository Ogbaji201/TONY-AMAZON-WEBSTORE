/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Local Strapi (dev)
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1338',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '1338',
        pathname: '/uploads/**',
      },

      // Production Strapi (update if needed)
      {
        protocol: 'https',
        hostname: 'api.cheryblisshealth.com',
        pathname: '/uploads/**',
      },

      {
        protocol: 'https',
        hostname: 'www.cheryblisshealth.com',
        pathname: '/uploads/**',
      },
    ],

    // Faster dev, safe to disable optimization locally
    unoptimized: process.env.NODE_ENV === 'development',
  },

  eslint: {
    ignoreDuringBuilds: true,
  },
};

module.exports = nextConfig;
