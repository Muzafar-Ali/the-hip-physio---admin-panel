
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "https://hip-physio-api.onrender.com/api/:path*",
      },
    ];
  },
};

export default nextConfig;


// import type { NextConfig } from "next";

// const nextConfig: NextConfig = {
//   async rewrites() {
//     return [
//       {
//         source: "/api/:path*",
//         destination:
//           process.env.NODE_ENV === "development"
//             ? "http://localhost:4000/api/:path*"
//             : "https://hip-physio-api.onrender.com/api/:path*",
//       },
//     ];
//   },
// };

// export default nextConfig;
