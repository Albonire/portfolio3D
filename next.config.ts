import type { NextConfig } from "next";

// Cabeceras de seguridad para todas las rutas. No hay CSP: el video del modo Sol se enlaza desde otro dominio y el
// worker de pdf.js corre desde un blob, y una CSP estricta habría que mantenerla a mano por esas dos cosas.
const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,
  experimental: {
    // 404 con el estilo del sitio para las direcciones que no coinciden con ninguna ruta (/foo, /es/xyz).
    globalNotFound: true,
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
