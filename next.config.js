/** @type {import('next').NextConfig} */
const nextConfig = {
    eslint: {
        // ✅ This allows production builds even if there are ESLint errors
        ignoreDuringBuilds: true,
    },
};

module.exports = nextConfig;
