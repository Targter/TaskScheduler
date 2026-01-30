// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   /* config options here */
//    images: {
//     domains: ["lh3.googleusercontent.com"],
//   },
// };

// export default nextConfig;


import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lh3.googleusercontent.com', // For Google Auth Images
      },
      {
        protocol: 'https',
        hostname: 'pbs.twimg.com', // For Twitter Profile Images
      },
    ],
  },
  // Remove any 'middleware' key from inside this object
};

export default nextConfig;