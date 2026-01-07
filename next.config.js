// // /** @type {import('next').NextConfig} */
// // const nextConfig = {
// //   images: {
// //     remotePatterns: [
// //       {
// //         protocol: "http",
// //         hostname: process.env.STRAPI_HOSTNAME || "localhost",
// //         port: process.env.STRAPI_PORT || "1337",
// //         pathname: "/uploads/**",
// //       },
// //       // ADD THIS NEW CONFIGURATION FOR PORT 3001
// //       {
// //         protocol: "http",
// //         hostname: "localhost",
// //         port: "3001",
// //         pathname: "/**", // This allows all paths from localhost:3001
// //       },
// //     ],
// //   },
// // };

// // module.exports = nextConfig;

// // /** @type {import('next').NextConfig} */
// // const nextConfig = {
// //   images: {
// //     remotePatterns: [
// //       // Strapi media (Docker / local)
// //       {
// //         protocol: 'http',
// //         hostname: 'localhost',
// //         port: '1337',
// //         pathname: '/uploads/**',
// //       },

// //       {
// //         protocol: 'http',
// //         hostname: 'localhost', // Docker internal hostname
// //         port: '3001',
// //         pathname: "/**",
// //       },
// //       {
// //         protocol: 'http',
// //         hostname: '127.0.0.1',
// //         port: '1337',
// //         pathname: '/uploads/**',
// //       },
// //       {
// //         protocol: 'http',
// //         hostname: 'host.docker.internal',
// //         port: '1337',
// //         pathname: '/uploads/**',
// //       },
// //     ],

// //     // Faster dev, safe in production
// //     unoptimized: process.env.NODE_ENV === 'development',
// //   },

// //   async rewrites() {
// //     return [
// //       {
// //         source: '/strapi/:path*',
// //         destination: 'http://localhost:1337/:path*', // Proxy to Strapi backend
// //       },
// //     ];
// //   }
// // };

// // module.exports = nextConfig;

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: 'http',
//         hostname: 'localhost',
//         port: '1337',
//         pathname: '/uploads/**',
//       },
//       {
//         protocol: 'http',
//         hostname: 'localhost',
//         port: '3001',
//         pathname: "/**",
//       },
//       {
//         protocol: 'http',
//         hostname: '127.0.0.1',
//         port: '1337',
//         pathname: '/uploads/**',
//       },
//     ],
//     unoptimized: process.env.NODE_ENV === 'development',
//   },
  
//   // Proxy /strapi to localhost:1337 as a fallback
//   async rewrites() {
//     return [
//       {
//         source: '/strapi/:path*',
//         destination: 'http://localhost:1337/:path*',
//       },
//     ];
//   },
// };

// module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      // Local development
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
        pathname: '/uploads/**',
      },
      // Production (update with your domain)
      {
        protocol: 'https',
        hostname: 'api.cherryblisshealth.com',
        pathname: '/uploads/**',
      },
    ],
    // Disable optimization in development for faster loads
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

module.exports = {
  eslint: {
    ignoreDuringBuilds: true,
  },
};