import type { NextConfig } from "next"

const nextConfig: NextConfig = {
  // typedRoutes: true,
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8080",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "img.icons8.com",
      },
    ],
  },
}

export default nextConfig
