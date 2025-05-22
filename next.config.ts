
import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'hostedimages-cdn.aweber-static.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'fitnexcommandos.s3.eu-north-1.amazonaws.com', // Corrected S3 bucket hostname
        port: '',
        pathname: '/**', // Allows any path within this bucket
      },
    ],
  },
};

export default nextConfig;
