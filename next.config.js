/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: [
      'res.cloudinary.com',
      'images.unsplash.com',
      'picsum.photos'
    ],
  },
  experimental: {
    serverActions: true,
  },
}
module.exports = nextConfig
