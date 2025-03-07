/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    scrollRestoration: true,
    esmExternals: true
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com'
      },
      {
        protocol: 'https',
        hostname: 'assets.pokemon.com'
      }
    ],
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    contentDispositionType: 'attachment',
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  webpack: (config, { dev, isServer }) => {
    if (dev && !isServer) {
      config.watchOptions = {
        ignored: ['**/node_modules/**', '**/.git/**'],
        aggregateTimeout: 300,
        poll: 1000,
        followSymlinks: false,
      };
      
      config.optimization.runtimeChunk = 'single';
    }
    return config;
  },
};

export default nextConfig;