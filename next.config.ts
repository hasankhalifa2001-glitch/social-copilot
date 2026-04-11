import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: [
    "riskless-teddy-doxologically.ngrok-free.dev"
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
        port: '',
        pathname: '/**', // هذا يسمح لجميع المسارات تحت هذا الدومين
      },
    ],
  },
};

export default nextConfig;
