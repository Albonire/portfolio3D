import NotFoundBody from "@/components/NotFoundBody";

// Se muestra cuando una página dentro de /es o /en llama a notFound(), por ejemplo /es/work/nope. Las direcciones
// que no coinciden con ninguna ruta (/foo, /es/xyz) van a app/global-not-found.tsx.
export default NotFoundBody;
