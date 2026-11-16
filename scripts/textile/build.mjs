// Genera public/textile-tiles.css: las teselas SVG del bordado del modo Sol (costuras, marcos, orillas de parche, punto
// raso, cenefa, viñetas, ojal y botón), como variables CSS con URL de datos. El archivo no va en el CSS del sitio:
// components/Sunny.tsx lo pide la primera vez que se enciende el modo.
//
// Lo "hecho a mano" sale de aquí. Cada puntada lleva un largo, una separación y una inclinación distintos, tomados de
// un generador con semilla fija (el resultado es siempre el mismo), y se dibuja con el hilo de lib/thread.ts: sombra,
// borde, cuerpo y brillo. Donde la puntada entra en el papel asoma el agujero de la aguja.
//
// Uso: npm run textile   (Node 22.18 o más: importa lib/thread.ts sin compilar)
import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { HOLE, KNOT_THREAD, SHADOW, TONES, between, knotPath, layerColor, mulberry32, threadLayers } from "../../lib/thread.ts";

const n = (v) => String(Math.round(v * 10) / 10).replace(/^(-?)0\./, "$1.");
const n2 = (v) => String(Math.round(v * 100) / 100).replace(/^(-?)0\./, "$1.");

let uid = 0;
// `stretch`: la tesela se puede estirar en un solo eje (el subrayado, que se ajusta al ancho de cada enlace).
const svg = (w, h, body, stretch = false) => {
  uid = 0;
  return `<svg xmlns='http://www.w3.org/2000/svg' width='${n(w)}' height='${n(h)}' viewBox='0 0 ${n(w)} ${n(h)}'${stretch ? " preserveAspectRatio='none'" : ""}><g fill='none' stroke-linecap='round' stroke-linejoin='round'>${body()}</g></svg>`;
};
const dataUrl = (markup) =>
  `url("data:image/svg+xml,${markup.replace(/%/g, "%25").replace(/#/g, "%23").replace(/</g, "%3C").replace(/>/g, "%3E")}")`;

// Un trazo con las capas del hilo. El trazo se define una vez y cada capa lo reutiliza con su desvío.
function thread(d, tone, w, opts) {
  const id = `t${uid++}`;
  const layers = threadLayers(w, opts)
    .map((l) => {
      const move = l.dx || l.dy ? ` transform='translate(${n2(l.dx)} ${n2(l.dy)})'` : "";
      const alpha = l.opacity < 1 ? ` stroke-opacity='${n2(l.opacity)}'` : "";
      return `<use href='#${id}'${move} stroke='${layerColor(tone, l.key)}'${alpha} stroke-width='${n2(l.width)}'/>`;
    })
    .join("");
  return `<path id='${id}' d='${d}'/>${layers}`;
}
const segD = (segs) => segs.map(([x1, y1, x2, y2]) => `M${n(x1)} ${n(y1)}L${n(x2)} ${n(y2)}`).join("");
function holes(segs, w) {
  const d = segs
    .map(([x1, y1, x2, y2]) => {
      const len = Math.hypot(x2 - x1, y2 - y1) || 1;
      const ux = ((x2 - x1) / len) * w * 0.42;
      const uy = ((y2 - y1) / len) * w * 0.42;
      return `M${n(x1 - ux)} ${n(y1 - uy)}h0M${n(x2 + ux)} ${n(y2 + uy)}h0`;
    })
    .join("");
  return `<path d='${d}' stroke='${HOLE}' stroke-opacity='.42' stroke-width='${n2(Math.max(0.9, w * 0.5))}'/>`;
}

// Las puntadas se describen sobre un eje: x a lo largo de la costura y `y` a través. `map` las lleva a su sitio en la
// tesela; así un mismo punto sirve para una costura horizontal y para los cuatro lados de un marco, y la luz del
// hilo no gira con él.
const ident = (x, y) => [x, y];
const mapSeg = (map, [x1, y1, x2, y2]) => [...map(x1, y1), ...map(x2, y2)];
const pt = (map, x, y) => {
  const [X, Y] = map(x, y);
  return `${n(X)} ${n(Y)}`;
};
// Desvíos por puntada. Las costuras se repiten, así que la puntada i y la i + count son la misma.
const jitter = (rand, count, ranges) => Array.from({ length: count }, () => ranges.map(([lo, hi]) => between(rand, lo, hi)));
const wrap = (list, i) => list[((i % list.length) + list.length) % list.length];

// Hilván y pespunte: puntadas con hueco. Llenan `length` exactos y terminan en medio hueco, para repetir sin cortes.
function runSegs(rand, length, mid, { stitch, gap, wobble = 0.35 }, map = ident) {
  const out = [];
  let pos = gap[0] / 2;
  for (;;) {
    const len = between(rand, stitch[0], stitch[1]);
    if (pos + len + gap[0] / 2 > length) break;
    out.push([pos, mid + between(rand, -wobble, wobble), pos + len, mid + between(rand, -wobble, wobble)]);
    pos += len + between(rand, gap[0], gap[1]);
  }
  const last = out[out.length - 1];
  const spare = length - (last[2] + gap[0] / 2);
  out.forEach((s, i) => {
    const shift = (spare * (i + 1)) / (out.length + 1);
    s[0] += shift;
    s[2] += shift;
  });
  return out.map((s) => mapSeg(map, s));
}

// Punto de tallo: puntadas inclinadas que se montan una sobre otra, como una cuerda.
function stemSegs(rand, length, mid, { pitch = 5.2, rise = 1.1 }, map = ident) {
  const count = Math.round(length / pitch);
  const p = length / count;
  const j = jitter(rand, count, [[-0.3, 0.3], [-0.3, 0.3]]);
  const out = [];
  for (let i = -1; i <= count; i++) {
    const [a, b] = wrap(j, i);
    out.push(mapSeg(map, [i * p, mid + rise + a, i * p + p * 1.75, mid - rise + b]));
  }
  return out;
}

// Cadeneta: cada eslabón sale de dentro del anterior.
function chainD(rand, length, mid, { pitch = 8.4, bulge = 2.5 }, map = ident) {
  const count = Math.round(length / pitch);
  const p = length / count;
  const j = jitter(rand, count, [[-0.35, 0.35], [0.85, 1.12]]);
  let d = "";
  for (let i = -1; i <= count; i++) {
    const [dy, k] = wrap(j, i);
    const x0 = i * p;
    const x1 = x0 + p + 2.1;
    const y = mid + dy;
    const b = bulge * k;
    for (const side of [-1, 1]) {
      d += `M${pt(map, x0, y)}C${pt(map, x0 + p * 0.3, y + side * b * 1.3)} ${pt(map, x1 - p * 0.18, y + side * b * 1.15)} ${pt(map, x1, y)}`;
    }
  }
  return d;
}

// Punto de espina: una rama con una espina a cada lado, alternas.
function featherD(rand, length, mid, { pitch = 7.5, arm = 4.2 }, map = ident) {
  const count = Math.round(length / pitch / 2) * 2;
  const p = length / count;
  const j = jitter(rand, count, [[-0.35, 0.35], [-0.4, 0.4]]);
  const spine = (i) => {
    const [jx, jy] = wrap(j, i);
    return [i * p + jx, mid + (i % 2 === 0 ? -1 : 1) * 1.15 + jy];
  };
  let d = "";
  for (let i = -1; i <= count + 1; i++) {
    const [sx, sy] = spine(i);
    const [px, py] = spine(i - 1);
    const side = i % 2 === 0 ? -1 : 1;
    d += `M${pt(map, sx - p * 0.62, mid + side * arm)}Q${pt(map, sx - p * 0.12, mid + side * arm * 0.92)} ${pt(map, sx, sy)}`;
    d += `M${pt(map, px, py)}Q${pt(map, (px + sx) / 2, (py + sy) / 2 + side * 0.9)} ${pt(map, sx, sy)}`;
  }
  return d;
}

// Punto de escapulario: diagonales largas que se cruzan arriba y abajo. Devuelve las que suben y las que bajan,
// para dibujar las segundas encima.
function herringSegs(rand, length, { top, bottom, run = 6.6, back = 2.3 }, map = ident) {
  const period = 2 * run - 2 * back;
  const count = Math.round(length / period);
  const p = length / count;
  const k = p / period;
  const j = jitter(rand, count, [[-0.3, 0.3], [-0.3, 0.3], [-0.3, 0.3], [-0.3, 0.3]]);
  const up = [];
  const down = [];
  for (let i = -1; i <= count; i++) {
    const [a, b, c, e] = wrap(j, i);
    const x = i * p;
    up.push(mapSeg(map, [x + a, bottom, x + run * k + b, top]));
    down.push(mapSeg(map, [x + (run - back) * k + c, top, x + (2 * run - back) * k + e, bottom]));
  }
  return { up, down };
}

// Punto de mosca: una V sujeta por una puntada corta.
function flyD(rand, length, { top, pitch = 9.4, half = 3.3, drop = 4.4, tail = 3 }, map = ident) {
  const count = Math.round(length / pitch);
  const p = length / count;
  const j = jitter(rand, count, [[-0.35, 0.35], [-0.35, 0.35], [-0.3, 0.3], [-0.4, 0.4]]);
  let arms = "";
  const tails = [];
  for (let i = 0; i < count; i++) {
    const [a, b, c, e] = j[i];
    const x = i * p + p / 2;
    const y = top + drop + c;
    arms += `M${pt(map, x - half + a, top)}Q${pt(map, x - half * 0.3, y - 0.4)} ${pt(map, x, y)}Q${pt(map, x + half * 0.3, y - 0.4)} ${pt(map, x + half + b, top)}`;
    tails.push(mapSeg(map, [x, y - 0.3, x + e * 0.4, y + tail + e]));
  }
  return { arms, tails };
}

// Punto de festón: la orilla de un parche. Una línea de borde y dientes hacia dentro.
function blanketParts(rand, length, { edge = 1.6, pitch = 5.4, tooth = 4.6 }, map = ident) {
  const count = Math.round(length / pitch);
  const p = length / count;
  const j = jitter(rand, count, [[-0.3, 0.3], [-0.5, 0.5], [-0.25, 0.25]]);
  let base = "";
  const teeth = [];
  for (let i = -1; i <= count; i++) {
    const [jx, jt, jy] = wrap(j, i);
    const [nx, , ny] = wrap(j, i + 1);
    const x = i * p + jx;
    base += `M${pt(map, x, edge + jy)}Q${pt(map, x + p / 2, edge + 0.55)} ${pt(map, (i + 1) * p + nx, edge + ny)}`;
    teeth.push(mapSeg(map, [x, edge + jy, x + 0.3, edge + tooth + jt]));
  }
  return { base, teeth };
}

// Punto de cruz sobre una cuadrícula. `cells` es una lista de [columna, fila, tono]. Primero van todas las
// puntadas de abajo (/) y luego las de arriba (\), que les hacen sombra.
function crosses(rand, cells, { cell, pad, w, ox = 0, oy = 0 }) {
  const tones = new Map();
  for (const [cx, cy, tone] of cells) {
    const g = tones.get(tone) ?? { under: [], over: [] };
    const j = () => between(rand, -0.2, 0.2);
    const x = ox + cx * cell;
    const y = oy + cy * cell;
    g.under.push([x + pad + j(), y + cell - pad + j(), x + cell - pad + j(), y + pad + j()]);
    g.over.push([x + pad + j(), y + pad + j(), x + cell - pad + j(), y + cell - pad + j()]);
    tones.set(tone, g);
  }
  let out = "";
  for (const [tone, g] of tones) out += thread(segD(g.under), tone, w, { shadow: 0.22, sheen: 0.35 });
  for (const [tone, g] of tones) out += thread(segD(g.over), tone, w);
  return out;
}

// ---- Costuras (se repiten en horizontal) ----

function seamTile(seed, { length, height = 6, tone, w, stitch, gap, wobble, shadow = 0.3, pierced = true }) {
  const segs = runSegs(mulberry32(seed), length, height / 2 - 0.3, { stitch, gap, wobble });
  return svg(length, height, () => (pierced ? holes(segs, w) : "") + thread(segD(segs), tone, w, { shadow }));
}
const stemTile = (seed, { length, height = 7, tone, w }) =>
  svg(length, height, () => thread(segD(stemSegs(mulberry32(seed), length, height / 2 - 0.2, {})), tone, w));
const chainTile = (seed, { length, height = 9, tone, w }) =>
  svg(length, height, () => thread(chainD(mulberry32(seed), length, height / 2 - 0.2, {}), tone, w));
const featherTile = (seed, { length, height = 12, tone, w }) =>
  svg(length, height, () => thread(featherD(mulberry32(seed), length, height / 2, {}), tone, w));
function herringTile(seed, { length, height = 11, tone, w }) {
  const { up, down } = herringSegs(mulberry32(seed), length, { top: 1.6, bottom: height - 2 });
  return svg(length, height, () => holes([...up, ...down], w) + thread(segD(up), tone, w) + thread(segD(down), tone, w));
}
function flyTile(seed, { length, height = 11, tone, w }) {
  const { arms, tails } = flyD(mulberry32(seed), length, { top: 1.4 });
  return svg(length, height, () => thread(arms, tone, w) + thread(segD(tails), tone, w));
}
function blanketTile(seed, { length, height = 8, tone, w }) {
  const { base, teeth } = blanketParts(mulberry32(seed), length, {});
  return svg(length, height, () => thread(segD(teeth), tone, w) + thread(base, tone, w));
}
function crossRowTile(seed, { count, cell = 6, pitch = 7.4, tone, w }) {
  const rand = mulberry32(seed);
  const cells = Array.from({ length: count }, (_, i) => [i, 0, tone]);
  // El paso es mayor que la celda: cada cruz queda suelta, con aire a los lados.
  return svg(count * pitch, cell + 1, () => {
    let out = "";
    const under = [];
    const over = [];
    for (const [i] of cells) {
      const x = i * pitch + (pitch - cell) / 2;
      const j = () => between(rand, -0.25, 0.25);
      under.push([x + 0.8 + j(), cell - 0.5 + j(), x + cell - 0.8 + j(), 1.1 + j()]);
      over.push([x + 0.8 + j(), 1.1 + j(), x + cell - 0.8 + j(), cell - 0.5 + j()]);
    }
    out += thread(segD(under), tone, w, { shadow: 0.22, sheen: 0.35 }) + thread(segD(over), tone, w);
    return out;
  });
}

// ---- Marcos (border-image de 9 partes) ----

// Los cuatro lados y las cuatro esquinas de un marco de `size` px. Cada lado mira hacia dentro: y crece hacia el centro.
const sides = (size, corner) => [
  (x, y) => [corner + x, y],
  (x, y) => [size - y, corner + x],
  (x, y) => [size - corner - x, size - y],
  (x, y) => [y, size - corner - x],
];
const corners = (size) => [(x, y) => [x, y], (x, y) => [size - y, x], (x, y) => [size - x, size - y], (x, y) => [y, size - x]];

// Marco de puntadas sueltas (hilván o pespunte). En cada esquina, dos puntadas que salen del mismo agujero.
function runFrame(seed, { corner = 12, edge = 58, inset, tone, w, stitch, gap, wobble = 0.35, shadow = 0.3 }) {
  const size = corner * 2 + edge;
  const at = inset ?? corner / 2;
  const rand = mulberry32(seed);
  const segs = [];
  for (const map of sides(size, corner)) segs.push(...runSegs(rand, edge, at, { stitch, gap, wobble }, map));
  const reach = corner - at - gap[0] / 2;
  for (const map of corners(size)) {
    const jx = between(rand, -0.25, 0.25);
    const jy = between(rand, -0.25, 0.25);
    segs.push(mapSeg(map, [at + jx, at + jy, at + reach, at + between(rand, -wobble, wobble)]));
    segs.push(mapSeg(map, [at + jx, at + jy, at + between(rand, -wobble, wobble), at + reach]));
  }
  return svg(size, size, () => holes(segs, w) + thread(segD(segs), tone, w, { shadow }));
}

// Marco de festón: la pieza queda como un parche aplicado. En cada esquina la orilla dobla y un diente va en diagonal.
function blanketFrame(seed, { corner = 11, edge = 54, tone, w, tooth = 4.6, pitch = 5.4, knot }) {
  const size = corner * 2 + edge;
  const rand = mulberry32(seed);
  const e = 1.6;
  let base = "";
  const teeth = [];
  for (const map of sides(size, corner)) {
    const part = blanketParts(rand, edge, { edge: e, tooth, pitch }, map);
    base += part.base;
    teeth.push(...part.teeth);
  }
  let knots = "";
  for (const map of corners(size)) {
    base += `M${pt(map, corner + 0.3, e)}L${pt(map, e + 1.4, e)}Q${pt(map, e, e)} ${pt(map, e, e + 1.4)}L${pt(map, e, corner + 0.3)}`;
    const reach = e + tooth * 0.78 + between(rand, -0.3, 0.3);
    teeth.push(mapSeg(map, [e + 0.2, e + 0.2, reach, reach]));
    if (knot) {
      const [kx, ky] = map(e + tooth + 2.6, e + tooth + 2.6);
      knots += thread(knotPath(kx, ky, 1.9, between(rand, 0, 6.28)), knot, 1.9 * KNOT_THREAD);
    }
  }
  return svg(size, size, () => thread(segD(teeth), tone, w) + thread(base, tone, w) + knots);
}

// Orilla de parche (remallado): puntadas cortas y apretadas que envuelven el borde. En las esquinas se abren en abanico.
function merrowFrame(seed, { corner = 7, edge = 30, depth = 5, pitch = 1.9, tone, w = 1.5 }) {
  const size = corner * 2 + edge;
  const rand = mulberry32(seed);
  const segs = [];
  const count = Math.round(edge / pitch);
  const p = edge / count;
  for (const map of sides(size, corner)) {
    for (let i = 0; i < count; i++) {
      const x = i * p + p / 2;
      segs.push(mapSeg(map, [x - 0.7 + between(rand, -0.15, 0.15), 0.9 + between(rand, 0, 0.3), x + 0.7 + between(rand, -0.15, 0.15), depth + between(rand, -0.3, 0.2)]));
    }
  }
  const fan = Math.max(3, Math.round(((Math.PI / 2) * (corner - 0.9)) / pitch));
  for (const map of corners(size)) {
    for (let i = 0; i < fan; i++) {
      const a = Math.PI + ((i + 0.5) / fan) * (Math.PI / 2);
      const outer = corner - 0.9 - between(rand, 0, 0.3);
      const inner = Math.max(0.4, corner - depth);
      segs.push(mapSeg(map, [corner + Math.cos(a - 0.12) * outer, corner + Math.sin(a - 0.12) * outer, corner + Math.cos(a + 0.1) * inner, corner + Math.sin(a + 0.1) * inner]));
    }
  }
  return svg(size, size, () => thread(segD(segs), tone, w, { shadow: 0.22, sheen: 0.5 }));
}

// ---- Piezas sueltas ----

// Punto raso: hilos paralelos y apretados, cada uno con su caída y su brillo. Para las barras del horario.
function satinTile(seed, { width = 110, height = 20, tone, pitch = 2.2 }) {
  const rand = mulberry32(seed);
  const count = Math.round(width / pitch);
  const p = width / count;
  const t = TONES[tone];
  let edge = "";
  let core = "";
  let sheen = "";
  for (let i = 0; i < count; i++) {
    const x = i * p + p / 2;
    const y0 = p / 2 + between(rand, 0, 0.8);
    const y1 = height - p / 2 - between(rand, 0, 0.8);
    const lean = between(rand, -0.25, 0.25);
    edge += `M${n(x)} ${n(y0)}L${n(x + lean)} ${n(y1)}`;
    core += `M${n2(x - p * 0.08)} ${n(y0)}L${n2(x + lean - p * 0.08)} ${n(y1)}`;
    const s0 = height * between(rand, 0.16, 0.34);
    sheen += `M${n2(x - p * 0.14)} ${n(s0)}L${n2(x + lean * 0.4 - p * 0.14)} ${n(s0 + height * between(rand, 0.14, 0.34))}`;
  }
  return svg(width, height, () => `<path d='${edge}' stroke='${t.edge}' stroke-width='${n2(p * 1.02)}'/><path d='${core}' stroke='${t.core}' stroke-width='${n2(p * 0.72)}'/><path d='${sheen}' stroke='${t.sheen}' stroke-opacity='.5' stroke-width='${n2(p * 0.3)}'/>`);
}

// Viñeta: un nudo francés.
const knotTile = (tone, turn) => svg(8, 9, () => thread(knotPath(3.7, 4.6, 2.5, turn), tone, 2.5 * KNOT_THREAD, { shadow: 0.34 }));

// Subrayado de los enlaces: pocas puntadas, de largos distintos, que se repiten enteras (background-repeat: round).
function underlineTile(seed, { length, tone, w, stitch, gap }) {
  const segs = runSegs(mulberry32(seed), length, 2.4, { stitch, gap, wobble: 0.3 });
  return svg(length, 5, () => thread(segD(segs), tone, w, { shadow: 0.24 }), true);
}

// Cenefa del pie: la compuerta AND de la marca en punto de cruz, entre dos hileras y con un rombo entre compuertas.
function cenefaTile(seed) {
  const cell = 3.4;
  const gate = ["..###....", "###..#...", "..#...#..", "..#...###", "..#...#..", "###..#...", "..###...."];
  const diamond = [".#.", "#.#", ".#."];
  const cols = 20;
  const cells = [];
  gate.forEach((row, y) => [...row].forEach((c, x) => c === "#" && cells.push([x + 1, y + 2, "navy"])));
  diamond.forEach((row, y) => [...row].forEach((c, x) => c === "#" && cells.push([x + 14, y + 4, "ochre"])));
  for (let x = 0; x < cols; x += 2) cells.push([x, 0, "ochre"], [x + 1, 10, "ochre"]);
  return svg(cols * cell, 11 * cell + 1, () => crosses(mulberry32(seed), cells, { cell, pad: 0.5, w: 1.05, oy: 0.4 }));
}

// El ojal del interruptor: una ranura rodeada de puntadas cortas y apretadas, con un remate en abanico en cada punta.
function buttonholeTile(seed) {
  const rand = mulberry32(seed);
  const W = 28;
  const H = 16;
  const mid = H / 2;
  const x0 = 6.4;
  const x1 = W - 6.4;
  const reach = 3.2;
  const segs = [];
  for (let x = x0; x <= x1 + 0.01; x += 1.36) {
    for (const side of [-1, 1]) segs.push([x + between(rand, -0.12, 0.12), mid + side * 0.8, x + between(rand, -0.2, 0.2), mid + side * (reach + between(rand, -0.25, 0.25))]);
  }
  for (const [cx, dir] of [[x0 - 0.5, -1], [x1 + 0.5, 1]]) {
    for (let i = 0; i < 6; i++) {
      const a = (-0.4 + (i / 5) * 0.8) * Math.PI;
      segs.push([cx + dir * Math.cos(a) * 0.5, mid + Math.sin(a) * 0.8, cx + dir * Math.cos(a) * reach, mid + Math.sin(a) * reach]);
    }
  }
  return svg(W, H, () => `<path d='M${x0 - 0.4} ${mid}H${x1 + 0.4}' stroke='${HOLE}' stroke-opacity='.75' stroke-width='1.2'/>` + thread(segD(segs), "navy", 1.05, { shadow: 0.22, sheen: 0.55 }));
}

// El botón: de hueso, con cuatro agujeros y el hilo en cruz.
function buttonTile() {
  const c = 7;
  const holesAt = [[-1.45, -1.45], [1.45, -1.45], [1.45, 1.45], [-1.45, 1.45]];
  return svg(14, 14, () => {
    const dots = holesAt.map(([x, y]) => `<circle cx='${c + x}' cy='${c + y}' r='.8' fill='${HOLE}' fill-opacity='.75' stroke='none'/>`).join("");
    return (
      `<circle cx='${c + 0.35}' cy='${c + 0.8}' r='5.9' fill='${SHADOW}' fill-opacity='.35' stroke='none'/>` +
      `<circle cx='${c}' cy='${c}' r='5.9' fill='#d9cdb0' stroke='none'/>` +
      `<circle cx='${c - 0.25}' cy='${c - 0.35}' r='5.3' fill='#f6efdf' stroke='none'/>` +
      `<circle cx='${c}' cy='${c}' r='3.7' fill='none' stroke='#cdbf9d' stroke-width='.7'/>` +
      `<path d='M${c - 3.4} ${c - 3.9}A5.2 5.2 0 0 1 ${c + 2.6} ${c - 4.5}' stroke='#fff' stroke-opacity='.9' stroke-width='.8'/>` +
      dots +
      thread(`M${c - 1.45} ${c - 1.45}L${c + 1.45} ${c + 1.45}M${c + 1.45} ${c - 1.45}L${c - 1.45} ${c + 1.45}`, "navy", 0.95, { shadow: 0.2, sheen: 0.5 })
    );
  });
}

const tiles = {
  // Costuras. La principal es un hilván en ocre; la fina separa filas de una lista o de una tabla; el pespunte en
  // tinta va bajo las cabeceras de tabla.
  "tx-seam": seamTile(11, { length: 176, tone: "ochre", w: 2, stitch: [7, 10.5], gap: [3.6, 5.2] }),
  "tx-seam-fine": seamTile(23, { length: 148, height: 5, tone: "linen", w: 1.4, stitch: [5, 7.5], gap: [2.9, 4.2], shadow: 0.24, pierced: false }),
  "tx-seam-ink": seamTile(37, { length: 164, tone: "ink", w: 1.7, stitch: [7, 10], gap: [1.9, 2.5], wobble: 0.25, shadow: 0.2, pierced: false }),
  // Muestrario: cada sección de la portada se abre con un punto distinto.
  "tx-band-chain": chainTile(5, { length: 151.2, tone: "ochre", w: 1.35 }),
  "tx-band-herringbone": herringTile(9, { length: 137.6, tone: "ochre", w: 1.35 }),
  "tx-band-feather": featherTile(7, { length: 150, tone: "ochre", w: 1.35 }),
  "tx-band-cross": crossRowTile(2, { count: 18, tone: "ochre", w: 1.45 }),
  "tx-band-fly": flyTile(15, { length: 150.4, tone: "ochre", w: 1.35 }),
  "tx-band-stem": stemTile(3, { length: 145.6, tone: "ochre", w: 1.9 }),
  "tx-band-blanket": blanketTile(13, { length: 151.2, tone: "ochre", w: 1.4 }),
  // Marcos.
  "tx-frame": blanketFrame(5, { edge: 57.6, tone: "ochre", w: 1.4, pitch: 6.4, tooth: 4.4, knot: "navy" }),
  "tx-frame-drop": runFrame(6, { tone: "ochre", w: 1.9, stitch: [6.5, 9], gap: [3.6, 5] }),
  "tx-frame-drop-on": runFrame(6, { tone: "navy", w: 2.1, stitch: [6.5, 9], gap: [2.5, 3.1] }),
  "tx-frame-fine": runFrame(8, { corner: 8, edge: 50, tone: "linen", w: 1.3, stitch: [4.6, 6.6], gap: [2.8, 3.8], shadow: 0.22 }),
  "tx-frame-patch": blanketFrame(14, { corner: 10, edge: 48.6, tone: "ochre", w: 1.3, tooth: 4.2 }),
  "tx-merrow": merrowFrame(4, { tone: "navy" }),
  // Piezas.
  "tx-satin-navy": satinTile(17, { tone: "navy" }),
  "tx-satin-slate": satinTile(19, { tone: "slate" }),
  "tx-knot": knotTile("slate", 0.6),
  "tx-underline": underlineTile(31, { length: 34, tone: "ochre", w: 1.5, stitch: [5.6, 8], gap: [3, 3.8] }),
  "tx-underline-on": underlineTile(33, { length: 34, tone: "navy", w: 1.6, stitch: [6.4, 9], gap: [1.9, 2.4] }),
  "tx-cenefa": cenefaTile(41),
  "tx-buttonhole": buttonholeTile(43),
  "tx-button": buttonTile(),
};

const lines = Object.entries(tiles).map(([name, markup]) => `  --${name}: ${dataUrl(markup)};`);
const css = `/* Archivo generado por scripts/textile/build.mjs: no editar a mano. */\nhtml[data-sunny] {\n${lines.join("\n")}\n}\n`;
writeFileSync(fileURLToPath(new URL("../../public/textile-tiles.css", import.meta.url)), css);
console.log(Object.fromEntries(Object.entries(tiles).map(([k, v]) => [k, v.length])), "total", css.length);
