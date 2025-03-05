/** @type {import('next').NextConfig} */
const path = require('path');

const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig = {
  basePath,
  assetPrefix: basePath,
  trailingSlash: false,

  webpack: (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': path.resolve(__dirname, 'src'),
    };
    return config;
  },

  // Enforce basePath usage for images, fonts, and static files
  images: {
    loader: 'default',
    path: `${basePath}/_next/image/`,
    domains: ["azure.microsoft.com", "logos-world.net", "miro.medium.com"],
  },
};

module.exports = nextConfig; // ✅ Use module.exports instead of export default
