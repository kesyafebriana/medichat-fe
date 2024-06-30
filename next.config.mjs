/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "standalone",
  reactStrictMode: true,
  redirects: async () => {
    return [
      {
        source: "/",
        destination: "/login",
        permanent: true,
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: process.env.CLOUDINARY_IMAGE_PROTOCOL,
        hostname: process.env.CLOUDINARY_IMAGE_HOSTNAME,
        port: process.env.CLOUDINARY_IMAGE_PORT,
        pathname: process.env.CLOUDINARY_IMAGE_PATHNAME,
      },
      {
        protocol: "https",
        hostname: "d2qjkwm11akmwu.cloudfront.net",
        port: "",
        pathname: "/categories/**",
      },
    ],
  },
  basePath: "/vm1",
};

export default nextConfig;
