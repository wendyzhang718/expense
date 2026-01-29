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
  
  // Webpack 配置：排除 Snowflake SDK 的原生模块
  webpack: (config, { isServer }) => {
    if (isServer) {
      // 对于服务器端，将 snowflake-sdk 标记为外部依赖
      config.externals = config.externals || [];
      config.externals.push('snowflake-sdk');
    }
    
    // 忽略原生模块文件
    config.module = config.module || {};
    config.module.rules = config.module.rules || [];
    config.module.rules.push({
      test: /\.node$/,
      use: 'node-loader',
    });
    
    return config;
  },
  
  // 服务器组件配置
  serverComponentsExternalPackages: ['snowflake-sdk'],
};

export default nextConfig;
