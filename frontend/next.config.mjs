/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
    remotePatterns: [
      { protocol: 'https', hostname: '**' }, // Allow cloud images
      { protocol: 'https', hostname: '*.devtunnels.ms' }, // Allow your tunnel images
    ],
  },
};
export default nextConfig;