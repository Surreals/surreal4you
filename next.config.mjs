/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      // Vercel Blob public URLs (admin-uploaded product/cover images).
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
    ],
  },
  // The admin moved from /admin to /adminka on 2026-11-26; old bookmarks follow.
  async redirects() {
    return [
      { source: "/admin", destination: "/adminka", permanent: true },
      { source: "/admin/:path*", destination: "/adminka/:path*", permanent: true },
    ];
  },
};

export default nextConfig;
