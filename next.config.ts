import type { NextConfig } from "next";
import path from 'path';

const nextConfig: NextConfig = {
  // For Static Export
  reactStrictMode: true,
  trailingSlash: true, 
  images: {
    unoptimized: true,
  },
  nitro: {
      preset: "vercel",
    },
  sassOptions: {
    includePaths: [path.join(__dirname, 'styles')],
    // Additional Sass options can go here
  },
};

export default nextConfig;