/** @type {import('next').NextConfig} */
const nextConfig = {
  // Allow building without type errors blocking
  typescript: {
    ignoreBuildErrors: false,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [],
  },
};

export default nextConfig;
