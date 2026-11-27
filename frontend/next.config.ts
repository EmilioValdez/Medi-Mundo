import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "medimundo.mx",
      },
    ],
  },
  // Redirecciones permanentes (Google pasa el posicionamiento a la URL nueva).
  async redirects() {
    return [
      // www.medimundo.mx → medimundo.mx (una sola versión del sitio para Google).
      {
        source: "/:path*",
        has: [{ type: "host", value: "www.medimundo.mx" }],
        destination: "https://medimundo.mx/:path*",
        permanent: true,
      },
      // /respiratorio era la página de Inogen en el sitio viejo (Vite); se perdió en
      // la migración a Next.js y Google la tenía indexada → 404.
      { source: "/respiratorio", destination: "/inogen", permanent: true },
    ];
  },
  async rewrites() {
    const backend = process.env.BACKEND_URL ?? "http://localhost:8001";
    return [
      { source: "/api/:path*", destination: `${backend}/api/:path*` },
      { source: "/uploads/:path*", destination: `${backend}/uploads/:path*` },
    ];
  },
};

export default nextConfig;
