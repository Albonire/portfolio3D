// Módulo aparte para que el empaquetador deje fuera los demás shaders de la biblioteca: solo se usa HalftoneDots.
// Se carga con import() desde Halftone.tsx, solo cuando el modo Sol está encendido.
export { HalftoneDots as default } from "@paper-design/shaders-react";
