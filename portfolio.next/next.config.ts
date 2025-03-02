import type { NextConfig } from "next";

const basePath : string = process.env.NEXT_PUBLIC_BASE_PATH || '';

const nextConfig: NextConfig = {
  basePath,
  assetPrefix: basePath,
  trailingSlash: true,
};

export default nextConfig;
