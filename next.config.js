/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    return [
      {
        source: "/uploads/:filename",
        destination: "/api/uploads/:filename",
      },
    ];
  },
};

module.exports = nextConfig;
