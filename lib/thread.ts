// El hilo del bordado del modo Sol. Lógica pura, sin DOM: la usan las piezas SVG (components/Thread.tsx, la gráfica,
// el sumador, la marca) y el generador de teselas (scripts/textile/build.mjs), para que el hilo sea el mismo en todas
// partes.
//
// Un hilo no es una raya: tiene volumen. Cada trazo se dibuja en cuatro capas con la luz arriba a la izquierda:
// la sombra que deja sobre el papel, el borde oscuro, el cuerpo corrido hacia la luz y un brillo fino.

export type Tone = "navy" | "denim" | "sky" | "ink" | "ochre" | "linen" | "slate" | "red" | "cream";

export const TONES: Record<Tone, { edge: string; core: string; sheen: string }> = {
  // Azules: el marino del sitio y dos madejas más claras para sombrear, como en un punto de cruz.
  navy: { edge: "#12233b", core: "#1f3a5f", sheen: "#7d9cc7" },
  denim: { edge: "#2c4568", core: "#4a6a94", sheen: "#a9c0de" },
  sky: { edge: "#62799a", core: "#8ea8c9", sheen: "#dbe6f3" },
  ink: { edge: "#020617", core: "#1a2436", sheen: "#64748b" },
  // Ocre: el hilo de las costuras. Lino: el mismo, sin teñir, para las costuras finas.
  ochre: { edge: "#86692c", core: "#b8934a", sheen: "#f0dba4" },
  linen: { edge: "#8a7850", core: "#b3a07a", sheen: "#ebe0c4" },
  slate: { edge: "#3b4a60", core: "#66768e", sheen: "#bcc7d6" },
  // Solo para la caída de la gráfica (el mismo papel que --color-stop).
  red: { edge: "#6b0c26", core: "#a3153d", sheen: "#ee7b9b" },
  cream: { edge: "#bfb28e", core: "#f7f1e3", sheen: "#ffffff" },
};
export const SHADOW = "#3d2f14";
export const HOLE = "#2a1f0c";

export type Layer = { key: "shadow" | "edge" | "core" | "sheen"; dx: number; dy: number; width: number; opacity: number };

export const r2 = (v: number) => Math.round(v * 100) / 100;
export const r1 = (v: number) => Math.round(v * 10) / 10;

// Las cuatro capas de un hilo de grosor `w`. El desvío de cada capa es fijo (no gira con la puntada): así la luz viene
// del mismo lado en una puntada horizontal, en una vertical y en una curva.
export function threadLayers(w: number, { shadow = 0.3, sheen = 0.62 }: { shadow?: number; sheen?: number } = {}): Layer[] {
  const layers: Layer[] = [];
  if (shadow > 0) layers.push({ key: "shadow", dx: r2(0.2 + w * 0.12), dy: r2(0.35 + w * 0.22), width: r2(w), opacity: shadow });
  layers.push({ key: "edge", dx: 0, dy: 0, width: r2(w), opacity: 1 });
  layers.push({ key: "core", dx: r2(-w * 0.07), dy: r2(-w * 0.1), width: r2(w * 0.78), opacity: 1 });
  if (sheen > 0) layers.push({ key: "sheen", dx: r2(-w * 0.16), dy: r2(-w * 0.24), width: r2(w * 0.2), opacity: sheen });
  return layers;
}
export const layerColor = (tone: Tone, key: Layer["key"]) => (key === "shadow" ? SHADOW : TONES[tone][key]);

// Generador con semilla: el bordado sale igual en cada visita y en cada build.
export function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export const between = (rand: () => number, lo: number, hi: number) => lo + rand() * (hi - lo);
// Desvío estable a partir de dos coordenadas (para puntadas cuya posición ya las identifica).
export function hash(a: number, b: number, salt = 0) {
  const h = Math.sin(a * 127.1 + b * 311.7 + salt * 74.7) * 43758.5453;
  return h - Math.floor(h);
}

export type Seg = [number, number, number, number];
export const segPath = (segs: Seg[]) => segs.map(([x1, y1, x2, y2]) => `M${r1(x1)} ${r1(y1)}L${r1(x2)} ${r1(y2)}`).join("");

// Los agujeros de la aguja: un punto oscuro que asoma en cada extremo de la puntada.
export function holesPath(segs: Seg[], w: number) {
  return segs
    .map(([x1, y1, x2, y2]) => {
      const len = Math.hypot(x2 - x1, y2 - y1) || 1;
      const ux = ((x2 - x1) / len) * w * 0.42;
      const uy = ((y2 - y1) / len) * w * 0.42;
      return `M${r1(x1 - ux)} ${r1(y1 - uy)}h0M${r1(x2 + ux)} ${r1(y2 + uy)}h0`;
    })
    .join("");
}

// Puntadas sobre la recta de A a B. Caben enteras: la primera sale de A y la última entra en B, como en un bordado
// (una puntada no dobla una esquina). `gap` es el hueco entre los centros de los extremos, no el que se ve: el hilo
// tiene punta redonda y se come su grosor.
export function stitchLine(
  ax: number,
  ay: number,
  bx: number,
  by: number,
  { length, gap, wobble = 0.3, seed = 0 }: { length: number; gap: number; wobble?: number; seed?: number },
): Seg[] {
  const total = Math.hypot(bx - ax, by - ay);
  if (total < 0.5) return [];
  const count = Math.max(1, Math.round((total + gap) / (length + gap)));
  const stitch = (total - (count - 1) * gap) / count;
  const ux = (bx - ax) / total;
  const uy = (by - ay) / total;
  const out: Seg[] = [];
  for (let i = 0; i < count; i++) {
    const s = i * (stitch + gap);
    const e = s + stitch;
    // El desvío es perpendicular a la recta; los extremos que tocan A y B no se mueven.
    const j = (k: number) => (hash(ax + i * 7.3, ay + bx, seed + k) - 0.5) * 2 * wobble;
    const ja = i === 0 ? 0 : j(1);
    const jb = i === count - 1 ? 0 : j(2);
    out.push([ax + ux * s - uy * ja, ay + uy * s + ux * ja, ax + ux * e - uy * jb, ay + uy * e + ux * jb]);
  }
  return out;
}

// Nudo francés: el hilo enrollado sobre sí mismo. Una espiral de medias vueltas que termina en un anillo; `turn`
// gira el nudo para que no haya dos iguales. El grosor del hilo que le va es 0,56 r.
export function knotPath(cx: number, cy: number, r: number, turn = 0) {
  const ux = Math.cos(turn);
  const uy = Math.sin(turn);
  const at = (t: number) => `${r1(cx + ux * t * r)} ${r1(cy + uy * t * r)}`;
  const arc = (radius: number, t: number) => `A${r1(radius * r)} ${r1(radius * r)} 0 0 1 ${at(t)}`;
  return `M${at(0.12)}${arc(0.3, -0.48)}${arc(0.6, 0.72)}${arc(0.72, -0.72)}${arc(0.72, 0.72)}`;
}
export const KNOT_THREAD = 0.56;

// Estrella de puntadas alrededor de un punto (punto de ojete): marca la medición elegida en la gráfica.
export function starSegs(cx: number, cy: number, inner: number, outer: number, count: number, seed = 0): Seg[] {
  const out: Seg[] = [];
  for (let i = 0; i < count; i++) {
    const a = (i / count) * Math.PI * 2 + Math.PI / count + (hash(cx, i, seed) - 0.5) * 0.16;
    const reach = outer + (hash(cy, i, seed + 3) - 0.5) * 0.9;
    out.push([cx + Math.cos(a) * inner, cy + Math.sin(a) * inner, cx + Math.cos(a) * reach, cy + Math.sin(a) * reach]);
  }
  return out;
}

// Punto de cruz en la celda cuya esquina superior izquierda es (x, y): la puntada de abajo (/) y la de arriba (\).
export function crossSegs(x: number, y: number, cell: number, pad: number, seed = 0): { under: Seg; over: Seg } {
  const j = (k: number) => (hash(x, y, seed + k) - 0.5) * 0.5;
  return {
    under: [x + pad + j(1), y + cell - pad + j(2), x + cell - pad + j(3), y + pad + j(4)],
    over: [x + pad + j(5), y + pad + j(6), x + cell - pad + j(7), y + cell - pad + j(8)],
  };
}
