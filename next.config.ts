import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 优化配置
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // 确保正确处理图片和资源
  images: {
    unoptimized: true,
  },
  
  // 确保正确处理 trailing slashes
  trailingSlash: false,
};

export default nextConfig;
