import type { NextConfig } from "next";
import path from "path";

/** Root shim so Vercel detects Next.js; app lives in ./frontend */
const nextConfig: NextConfig = {
  transpilePackages: ["@merchops/backend"],
};
export default nextConfig;
