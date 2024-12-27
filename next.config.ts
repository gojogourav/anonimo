import type { NextConfig } from "next";
//TODO:This is not secure to allow any host to upload image
const nextConfig: NextConfig = {
  /* config options here */
  image:{
    remotePatterns:[
      {
        protocol:"https",
        hostname:"**",
      }
    ]
  }
};

export default nextConfig;
