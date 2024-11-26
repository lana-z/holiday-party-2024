/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: [],
    },
    env: {
        GUEST_LIST: process.env.GUEST_LIST,
    },
};

export default nextConfig;
