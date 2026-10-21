/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // The profiles folder lives outside app/, so let Next trace files from the repo root.
  outputFileTracingRoot: new URL("..", import.meta.url).pathname,
};
export default nextConfig;
