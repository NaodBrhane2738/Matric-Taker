import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  transpilePackages: [
    '@matric/shared-types',
    '@matric/shared-utils',
    '@matric/curriculum-schema',
    '@matric/database',
  ],
};

export default nextConfig;
