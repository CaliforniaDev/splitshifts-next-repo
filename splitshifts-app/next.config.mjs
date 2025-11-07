/** @type {import('next').NextConfig} */
const nextConfig = {
  // Reduce router cache for more responsive navigation
  experimental: {
    // Disable static generation for dynamic routes to prevent stale data
    staleTimes: {
      dynamic: 0, // Immediately revalidate dynamic routes
      static: 180, // Keep static pages cached for 3 minutes
    },
  },
};

export default nextConfig;
