/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    turbo: true,       // ✅ Turbopack فعال
    optimizeCss: true, // ✅ Tailwind 3 با LightningCSS سازگار
  },
};

export default nextConfig;
