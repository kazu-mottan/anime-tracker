/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['framer-motion', 'lucide-react'],
  images: {
    domains: ['cdn.myanimelist.net'],
    unoptimized: true,
  },
}

module.exports = nextConfig
