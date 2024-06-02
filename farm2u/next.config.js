const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
  env: {
    VERCEL_URL: process.env.VERCEL_URL,
  }
};

module.exports = nextConfig;
