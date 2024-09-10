/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.2ebook.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
