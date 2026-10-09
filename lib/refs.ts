// Recorre el contenido en el orden en que se muestra y devuelve las claves de fuente
// ([[texto|clave]]) sin repetir. El número de cada fuente en la página es su posición + 1.
const TOKEN = /\[\[[^\]|]+\|([\w-]+)\]\]/g;

export function collectRefs(value: unknown): string[] {
  const keys: string[] = [];
  const walk = (node: unknown) => {
    if (typeof node === "string") {
      for (const match of node.matchAll(TOKEN)) {
        if (!keys.includes(match[1])) keys.push(match[1]);
      }
    } else if (Array.isArray(node)) {
      node.forEach(walk);
    } else if (node && typeof node === "object") {
      Object.values(node).forEach(walk);
    }
  };
  walk(value);
  return keys;
}

export type Refs = { keys: string[]; label: string };
