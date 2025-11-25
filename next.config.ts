import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Gera HTML estático na pasta "out"
  output: 'export',
  distDir: 'out',

  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    // Next não vai tentar otimizar imagens (bom pra export estático)
    unoptimized: true,
  },
};

export default nextConfig;
