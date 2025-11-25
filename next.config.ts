import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // NÃO usar output: 'export' aqui
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Deixa as imagens sem otimização no build, simplifica pro Firebase
    unoptimized: true,
  },
};

export default nextConfig;
