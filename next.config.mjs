/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  reactStrictMode: true,
  images: {
    domains: [],
  },
  env: {
    GUEST_LIST: process.env.GUEST_LIST,
    PARTY_ADDRESS: process.env.PARTY_ADDRESS,
  },
  async redirects() {
    return [
      {
        source: '/',
        has: [
          {
            type: 'host',
            value: 'www.swankyholidayparty.xyz',
          },
        ],
        destination: 'https://swankyholidayparty.xyz',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
