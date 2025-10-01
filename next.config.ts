import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    images: {
        remotePatterns: [
            {
                hostname: "lh3.googleusercontent.com",
            },
            {
                hostname: "img.icons8.com",
            },
        ],
    },
    eslint: {
        ignoreDuringBuilds: true,
    },
    /* config options here */
};

export default nextConfig;
