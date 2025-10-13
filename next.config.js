// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   images: {
//     remotePatterns: [
//       {
//         protocol: "http",
//         hostname: process.env.STRAPI_HOSTNAME || "localhost",
//         port: process.env.STRAPI_PORT || "1337",
//         pathname: "/uploads/**",
//       },
//       // ADD THIS NEW CONFIGURATION FOR PORT 3001
//       {
//         protocol: "http",
//         hostname: "localhost",
//         port: "3001",
//         pathname: "/**", // This allows all paths from localhost:3001
//       },
//     ],
//   },
// };

// module.exports = nextConfig;

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'http', hostname: '127.0.0.1', port: '1337', pathname: '/uploads/**' },
      { protocol: 'http', hostname: 'localhost', port: '1337', pathname: '/uploads/**' },
      // If you use Tailscale IP instead of localhost:
      // { protocol: 'http', hostname: '100.80.118.10', port: '1337', pathname: '/uploads/**' },
    ],
  },
};
module.exports = nextConfig;
