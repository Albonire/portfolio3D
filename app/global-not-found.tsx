import type { Metadata } from "next";
import NotFoundBody from "@/components/NotFoundBody";
import { mono, sans, serif } from "./fonts";
import "./globals.css";

// Requiere experimental.globalNotFound en next.config.ts. Esta página no pasa por ningún layout, así que lleva
// su propio <html>, las fuentes y los estilos.
// Next ya agrega noindex a las páginas 404.
export const metadata: Metadata = { title: "404" };

export default function GlobalNotFound() {
  return (
    <html lang="es" className={`${sans.variable} ${serif.variable} ${mono.variable}`}>
      <body className="min-h-screen">
        <NotFoundBody />
      </body>
    </html>
  );
}
