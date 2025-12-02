/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  images: {
    // next/image kullanıyorsan static export için şart
    unoptimized: true,
  },
};

export default nextConfig;
