/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  eslint: {
    dirs: ["src", "playwright-tests"],
  },
};

module.exports = nextConfig;
