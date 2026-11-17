import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  transpilePackages: [
    '@matric/shared-types',
    '@matric/shared-utils',
    '@matric/curriculum-schema',
    '@matric/database',
  ],
};

export default nextConfig;
