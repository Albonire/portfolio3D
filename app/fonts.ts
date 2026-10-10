import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";

// Las tres fuentes de la familia IBM Plex, compartidas por el layout de cada idioma y por la página 404 global.
// El serif solo se usa en 500 (títulos con font-medium); los pesos que nada pide no se descargan.
export const sans = IBM_Plex_Sans({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-plex-sans", display: "swap" });
export const serif = IBM_Plex_Serif({ subsets: ["latin"], weight: ["500"], variable: "--font-plex-serif", display: "swap" });
export const mono = IBM_Plex_Mono({ subsets: ["latin"], weight: ["400"], variable: "--font-plex-mono", display: "swap" });
