// Genera app/textile-tiles.css: las teselas SVG del tejido del modo Sol (puntadas, trama del lino, punto de media,
// cenefa y flecos), como variables CSS con URL de datos. Lo "hecho a mano" sale de aquí: cada puntada lleva un largo,
// una separación y una inclinación distintos, tomados de un generador con semilla fija, así que el resultado es
// siempre el mismo. Uso: node scripts/textile/build.mjs
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";

// Hilos. Los dos primeros son lino sin teñir (costuras); los demás repiten la paleta del sitio.
const THREAD = "#ad9a72";
const THREAD_FINE = "#bfae8a";
const NAVY = "#1f3a5f";
const INK = "#0f172a";
const CREAM = "#f7f1e3";
const SHADOW = "#4a3a1c";

function mulberry32(seed) {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const n = (v) => String(Math.round(v * 100) / 100).replace(/^(-?)0\./, "$1.");
const n1 = (v) => String(Math.round(v * 10) / 10);
const between = (rand, lo, hi) => lo + rand() * (hi - lo);

const svg = (w, h, body) =>
  `<svg xmlns='http://www.w3.org/2000/svg' width='${n(w)}' height='${n(h)}' viewBox='0 0 ${n(w)} ${n(h)}'>${body}</svg>`;
const dataUrl = (markup) =>
  `url("data:image/svg+xml,${markup.replace(/%/g, "%25").replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E")}")`;

// Puntadas a lo largo de un eje. Devuelve tramos [inicio, fin, desvío al inicio, desvío al fin] que llenan `length`
// exactos y terminan en un hueco, para que la tesela repita sin cortar ninguna puntada.
function stitches(rand, length, { stitch, gap, width, wobble }) {
  const out = [];
  let pos = gap[0] / 2 + width / 2;
  for (;;) {
    const len = between(rand, stitch[0], stitch[1]);
    const end = pos + len;
    if (end + width / 2 + gap[0] / 2 > length) break;
    out.push([pos, end, between(rand, -wobble, wobble), between(rand, -wobble, wobble)]);
    pos = end + width + between(rand, gap[0], gap[1]);
  }
  // Lo que sobra al final se reparte entre los huecos.
  const last = out[out.length - 1];
  const spare = length - (last[1] + width / 2 + gap[0] / 2);
  out.forEach((s, i) => {
    const shift = (spare * (i + 1)) / (out.length + 1);
    s[0] += shift;
    s[1] += shift;
  });
  return out;
}

// El hilo y, debajo, la sombra que deja sobre la tela.
function threadGroup(d, { color, width, relief }) {
  const shadow = relief > 0 ? `<use href='#t' y='.7' stroke='${SHADOW}' stroke-opacity='${relief}'/>` : "";
  return `<g fill='none' stroke-width='${width}' stroke-linecap='round'><defs><path id='t' d='${d}'/></defs>${shadow}<use href='#t' stroke='${color}'/></g>`;
}

// Línea de puntadas horizontal.
function seam(seed, { length, height = 4, color, width, stitch, gap, wobble = 0.35, relief = 0.2 }) {
  const rand = mulberry32(seed);
  const mid = height / 2 - 0.25;
  const d = stitches(rand, length, { stitch, gap, width, wobble })
    .map(([a, b, ya, yb]) => `M${n(a)} ${n(mid + ya)}L${n(b)} ${n(mid + yb)}`)
    .join("");
  return svg(length, height, threadGroup(d, { color, width, relief }));
}

// Marco de puntadas para border-image (9 partes): esquinas de `corner` px con dos puntadas que salen del mismo
// agujero, y lados de `edge` px que se repiten.
function frame(seed, { corner = 12, edge = 46, color, width, stitch, gap, wobble = 0.35, relief = 0.2 }) {
  const size = corner * 2 + edge;
  const c = corner / 2;
  const far = size - c;
  const rand = mulberry32(seed);
  const parts = [];
  const side = (map) => {
    for (const [a, b, da, db] of stitches(rand, edge, { stitch, gap, width, wobble })) {
      const [x1, y1] = map(corner + a, da);
      const [x2, y2] = map(corner + b, db);
      parts.push(`M${n(x1)} ${n(y1)}L${n(x2)} ${n(y2)}`);
    }
  };
  side((t, o) => [t, c + o]);
  side((t, o) => [far + o, t]);
  side((t, o) => [t, far + o]);
  side((t, o) => [c + o, t]);
  const reach = corner - c - width / 2 - gap[0] / 2;
  for (const [x, y, sx, sy] of [
    [c, c, 1, 1],
    [far, c, -1, 1],
    [far, far, -1, -1],
    [c, far, 1, -1],
  ]) {
    const jx = between(rand, -0.3, 0.3);
    const jy = between(rand, -0.3, 0.3);
    parts.push(`M${n(x + jx)} ${n(y + jy)}L${n(x + sx * reach)} ${n(y + between(rand, -wobble, wobble))}`);
    parts.push(`M${n(x + jx)} ${n(y + jy)}L${n(x + between(rand, -wobble, wobble))} ${n(y + sy * reach)}`);
  }
  return svg(size, size, threadGroup(parts.join(""), { color, width, relief }));
}

// Lino: dos ruidos estirados (fibras de la urdimbre y de la trama, con sus grosores irregulares). El filtro se
// rasteriza una vez por tesela.
function linen() {
  const fibre = (id, freq, seed) =>
    `<filter id='${id}' x='0' y='0' width='100%' height='100%'><feTurbulence type='fractalNoise' baseFrequency='${freq}' numOctaves='2' seed='${seed}' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 .36 0 0 0 0 .27 0 0 0 0 .11 .27 0 0 0 -.096'/></filter>`;
  return svg(
    256,
    256,
    `${fibre("a", ".008 .42", 4)}${fibre("b", ".42 .008", 9)}<rect width='256' height='256' filter='url(#a)'/><rect width='256' height='256' filter='url(#b)'/>`,
  );
}

// Cruce de hilos (tafetán): cada hilo pasa una vez por encima y una por debajo.
function plainWeave() {
  return svg(
    6,
    6,
    `<g fill='${SHADOW}'><path d='M0 2.5h3v.5H0zM3 5.5h3v.5H3z' fill-opacity='.07'/><path d='M2.5 3h.5v3h-.5zM5.5 0h.5v3h-.5z' fill-opacity='.05'/></g>`,
  );
}

// Punto de media (jersey): columnas de V. Sirve sobre cualquier color de fondo: la lana va en claro y el hueco en oscuro.
function knit() {
  const w = 8;
  const h = 6;
  const v = (dy) => `M1.9 ${n(dy - 0.4)}L4 ${n(dy + 5)}L6.1 ${n(dy - 0.4)}`;
  const rows = [-h, 0, h].map(v).join("");
  return svg(
    w,
    h,
    `<path d='M0 0v${h}M${w} 0v${h}' stroke='#000' stroke-opacity='.2' stroke-width='1.6'/><g fill='none' stroke-linejoin='round' stroke-width='1.9'><path d='${rows}' transform='translate(0 .9)' stroke='#000' stroke-opacity='.16'/><path d='${rows}' stroke='#fff' stroke-opacity='.3'/></g>`,
  );
}

// Viñeta de lista: una cruz de punto de cruz.
function crossBullet() {
  return svg(7, 7, `<g fill='none' stroke='#475569' stroke-width='1.3' stroke-linecap='round'><path d='M1.1 1.3L5.9 5.8'/><path d='M5.8 1.1L1.3 5.9'/></g>`);
}

// Cenefa: banda tejida en zigzag con rombos, hecha de cuadros como las pasadas de un telar.
function cenefa() {
  const u = 2;
  const cols = 12;
  const rows = 7;
  const zigzag = [];
  for (let x = 0; x < cols; x++) zigzag.push([x, 6 - (x < 6 ? x : 12 - x)]);
  const diamonds = [
    [0, 0],
    [1, 0],
    [11, 0],
    [0, 1],
    [5, 6],
    [6, 6],
    [7, 6],
    [6, 5],
  ];
  const rects = (list) => list.map(([x, y]) => `M${x * u} ${y * u}h${u}v${u}h-${u}z`).join("");
  return svg(cols * u, rows * u, `<path d='${rects(zigzag)}' fill='${NAVY}'/><path d='${rects(diamonds)}' fill='${THREAD}'/>`);
}

// Flecos: el final de la tela. Mechones anudados, cada uno con su caída.
function fringe(seed) {
  const rand = mulberry32(seed);
  const width = 132;
  const height = 34;
  const step = 12;
  const threads = [];
  const knots = [];
  for (let i = 0; i < width / step; i++) {
    const cx = i * step + step / 2 + between(rand, -0.8, 0.8);
    const knotY = 5 + between(rand, -0.5, 0.7);
    knots.push(`M${n(cx - 2.1)} ${n(knotY)}h4.2`);
    for (const dx of [-3.4, 0, 3.4]) threads.push(`M${n(cx + dx)} 0L${n(cx + dx * 0.25)} ${n(knotY)}`);
    for (const dx of [-3, -1, 1, 3]) {
      const len = between(rand, height - 9, height - 1.5);
      const sway = between(rand, -1.6, 1.6);
      threads.push(`M${n(cx + dx * 0.25)} ${n(knotY)}Q${n1(cx + dx * 0.9 + sway)} ${n1(knotY + len * 0.5)} ${n1(cx + dx + sway * 0.6)} ${n1(len)}`);
    }
  }
  return svg(
    width,
    height,
    `<g fill='none' stroke-linecap='round'><path d='${threads.join("")}' stroke='${THREAD}'/><path d='${knots.join("")}' stroke='#8f7d57' stroke-width='2.4'/></g>`,
  );
}

const tiles = {
  // Costuras (hilván). La principal separa secciones; la fina, filas de una lista o de una tabla.
  "tx-seam": seam(11, { length: 229, color: THREAD, width: 1.5, stitch: [6, 9.5], gap: [2.6, 4.2] }),
  "tx-seam-fine": seam(23, { length: 193, color: THREAD_FINE, width: 1.2, stitch: [4.5, 7], gap: [2.4, 3.8], relief: 0.14 }),
  // Pespunte: puntadas largas casi seguidas, para la línea fuerte de las cabeceras de tabla.
  "tx-seam-ink": seam(37, { length: 211, color: INK, width: 1.4, stitch: [7, 11], gap: [1.2, 1.9], wobble: 0.25, relief: 0 }),
  // Marcos cosidos.
  "tx-frame": frame(5, { color: THREAD, width: 1.5, stitch: [6, 8.5], gap: [2.6, 4] }),
  "tx-frame-navy": frame(5, { color: NAVY, width: 1.5, stitch: [6, 8.5], gap: [2.6, 4], relief: 0 }),
  "tx-frame-cream": frame(8, { corner: 8, edge: 30, color: CREAM, width: 1.2, stitch: [4, 6], gap: [2.2, 3.2], wobble: 0.25, relief: 0 }),
  "tx-linen": linen(),
  "tx-weave": plainWeave(),
  "tx-knit": knit(),
  "tx-cross": crossBullet(),
  "tx-cenefa": cenefa(),
  "tx-fringe": fringe(41),
};

const lines = Object.entries(tiles).map(([name, markup]) => `  --${name}: ${dataUrl(markup)};`);
const css = `/* Archivo generado por scripts/textile/build.mjs: no editar a mano. */\nhtml[data-sunny] {\n${lines.join("\n")}\n}\n`;
writeFileSync(fileURLToPath(new URL("../../app/textile-tiles.css", import.meta.url)), css);
console.log(Object.fromEntries(Object.entries(tiles).map(([k, v]) => [k, v.length])), "total", css.length);
