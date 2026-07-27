"use client";

import { useMemo, memo } from "react";

/**
 * PixelDivider — separadores y micro-plantas pixel-art entre y dentro de componentes.
 *
 *   <PixelDivider variant="horizonte" />
 *   <PixelPlant type="clover" className="h-5" />
 *
 * - Fondo transparente: hereda el bg de la sección (funciona en light y dark).
 * - Un <path> por color (~15 nodos), sin imágenes ni canvas.
 * - Estética biofílica tipo arquitectura de Singapur (plantas vivas sobre estructuras).
 * - Determinista: mismo dibujo en server y client (sin Math.random).
 */

export type DividerVariant =
  | "pradera"
  | "horizonte"
  | "dosel"
  | "sendero"
  | "brotes";

export type PlantType =
  | "fernA"
  | "fernB"
  | "fernC"
  | "tuft"
  | "tuftL"
  | "clover"
  | "flowerY"
  | "flowerP"
  | "flowerV"
  | "flowerC"
  | "flowerW"
  | "dandel"
  | "daisyS"
  | "mushroom"
  | "mushS"
  | "leaf"
  | "seed"
  | "butterfly"
  | "butterfly2"
  | "bee"
  | "ladybug"
  | "snail"
  | "frog"
  | "bird"
  | "cater"
  | "dfly"
  | "ant"
  | "worm"
  | "firefly"
  | "reed"
  | "bush"
  | "berry"
  | "stump"
  | "log"
  | "rock"
  | "pebble";

type Props = {
  variant?: DividerVariant;
  /** tamaño del pixel en unidades del viewBox (no afecta al ancho renderizado) */
  pixel?: number;
  /** paleta sobria (por defecto) o la vívida original */
  tone?: "sobrio" | "vivido";
  /** espeja el separador en horizontal */
  flip?: boolean;
  className?: string;
  ariaHidden?: boolean;
  customViewBox?: string;
  preserveAspectRatio?: string;
};

const PALETTES = {
  sobrio: {
    D: "#2E4A34", g: "#3F6B45", G: "#5C8C5A", h: "#4E7A4C", l: "#8FAE86", L: "#B4C9A9",
    w: "#BFB49B", y: "#8F7B45", p: "#A9737E", P: "#C6A4A8", v: "#7B769B", V: "#9C97B4",
    b: "#4A4038", s: "#5A4F44", B: "#332C26", t: "#6E6055", e: "#7A7268", E: "#9A9186",
    k: "#4A443C", c: "#4E7A9E", C: "#7FA0BE",
  },
  vivido: {
    D: "#23702D", g: "#2E862E", G: "#4FAE33", h: "#66BA3E", l: "#9ED283", L: "#C4E4A2",
    w: "#FFFFFF", y: "#FDEA73", p: "#E58AA8", P: "#F7C0CE", v: "#9B7FC7", V: "#C4B2E4",
    b: "#715A39", s: "#806843", B: "#4A3A2A", t: "#94733E", e: "#ABA29B", E: "#C9C2BA",
    k: "#2D3C47", c: "#6FA9D6", C: "#A9CBEA",
  },
} as const;

const S: Record<string, string[]> = {
  fernA: ["  L  ", " DgD ", "  g  ", " LgD ", "D g L", " DgD ", "  g  ", "  g  "],
  fernB: ["   L   ", "  DGD  ", " D G L ", "  LGD  ", "D  G  L", " D G D ", "  DGD  ", "   g   ", "   g   "],
  fernC: ["  L  ", " DGD ", "  G  ", "L G D", " DgD ", "  g  "],
  tuft: ["G   L", " G L ", "L GGG", " GgG "],
  tuftL: ["l  L", " ll ", " llg"],
  reed: [" b ", " t ", " g ", "L g", " g ", " gD", " g ", " g "],
  bush: ["  DhLD   ", " DhGLhD  ", "DhGGGGhD ", "  GgGg   "],
  berry: ["  DhpD   ", " DhGLhD  ", "DhpGGGpD ", "  GpGg   "],
  clover: [" L L ", "GLGLG", "  g  "],
  sign: ["BBBBBB", "BttstB", "BtDDtB", "BttstB", "BBBBBB", "  BB  "],
  log: [" BBBBBBBBBB ", "BtsttttsttbB", " BBBBBBBBBB "],
  rock: [" eEe ", "eeeee"],
  pebble: [" E", "ee"],
  stump: [" tt ", "tsBt", "ttts"],
  flowerY: [" w ", "wyw", " w ", " g ", "Lg "],
  flowerP: ["pPp", " p ", " g ", "Lg "],
  flowerV: [" V ", "vVv", " v ", " g ", " gL"],
  flowerW: [" w ", "wyw", " g ", "Lg "],
  flowerC: [" C ", "cCc", " g ", " gL"],
  dandel: ["w w", "ywy", "w w", " g ", "Lg "],
  daisyS: [" w ", "wyw", " g "],
  mushroom: [" ppp ", "pwpwp", " eEe "],
  mushS: [" t ", "tEt"],
  leaf: [" Ll", "LlD"],
  seed: [" w ", "wyw", " w "],
  butterfly: ["yw wy", "ywkwy", " yky "],
  butterfly2: ["vV Vv", "vVkVv", " vkv "],
  bee: [" ww ", "kyky"],
  ladybug: [" kk ", "pkkp"],
  snail: [" BtB ", "BtEtB", "kkkkk"],
  frog: [" k k ", "GGLGG"],
  bird: [" kC  ", "cCccc", " k k "],
  cater: [" GLG L", "GGgGGg"],
  dfly: [" C C C ", "cckckcc"],
  ant: [" Ek ", "tEtk"],
  worm: [" Ee", "Ee "],
  firefly: [" y ", "ywy", " y "],
};

type Grid = { W: number; H: number; g: string[][] };
type StampOpts = { flip?: boolean; flipV?: boolean };

function makeGrid(W: number, H: number): string[][] {
  return Array.from({ length: H }, () => new Array<string>(W).fill(""));
}

function stamp(g: string[][], name: string, x: number, bottom: number, o: StampOpts = {}) {
  const sp = S[name];
  if (!sp) return;
  const rows = o.flipV ? [...sp].reverse() : sp;
  const top = bottom - rows.length + 1;
  rows.forEach((row, ry) => {
    for (let rx = 0; rx < row.length; rx++) {
      const ch = row[o.flip ? row.length - 1 - rx : rx];
      if (ch === " ") continue;
      const gx = x + rx;
      const gy = top + ry;
      if (gy < 0 || gy >= g.length || gx < 0 || gx >= g[0].length) continue;
      g[gy][gx] = ch;
    }
  });
}

/** PRNG determinista: mismo resultado en SSR y en el cliente */
function makeRnd(seedInit = 20260726) {
  let seed = seedInit;
  return () => (seed = (seed * 1103515245 + 12345) % 2147483648) / 2147483648;
}

function buildVariant(variant: DividerVariant): Grid {
  const rnd = makeRnd();

  const ground = (g: string[][], W: number, gy: number, deep: number, roots: boolean) => {
    for (let x = 0; x < W; x++) {
      g[gy][x] = rnd() < 0.18 ? "L" : rnd() < 0.3 ? "h" : "G";
      if (deep > 1) g[gy + 1][x] = rnd() < 0.24 ? "D" : "g";
      if (deep > 2) g[gy + 2][x] = rnd() < 0.3 ? "s" : "b";
      if (deep > 3) g[gy + 3][x] = rnd() < 0.14 ? "e" : rnd() < 0.35 ? "b" : "B";
      if (roots && rnd() < 0.14) {
        const len = 1 + Math.floor(rnd() * 2);
        for (let i = 0; i < len; i++) if (gy + deep + i < g.length) g[gy + deep + i][x] = "D";
      }
      if (rnd() < 0.18 && gy - 1 >= 0 && !g[gy - 1][x]) g[gy - 1][x] = rnd() < 0.4 ? "L" : "h";
    }
  };

  type Place = [string, number];

  if (variant === "pradera") {
    const W = 170, H = 16, GY = 11, g = makeGrid(W, H), base = GY - 1;
    ground(g, W, GY, 3, true);
    ([["tuftL", 2], ["fernA", 6], ["pebble", 12], ["tuft", 14], ["fernC", 19], ["mushroom", 24],
      ["fernB", 29], ["leaf", 37], ["reed", 40], ["bush", 44], ["clover", 55], ["fernA", 60],
      ["stump", 66], ["tuftL", 71], ["fernB", 75], ["tuft", 84], ["sign", 90], ["rock", 99],
      ["fernC", 104], ["berry", 109], ["leaf", 119], ["reed", 122], ["tuft", 126], ["fernB", 131],
      ["mushS", 140], ["clover", 143], ["fernA", 149], ["log", 155], ["tuftL", 168]] as Place[])
      .forEach(([n, x], i) => stamp(g, n, x, base, { flip: i % 3 === 0 }));
    ([["flowerY", 10], ["daisyS", 18], ["flowerP", 36], ["dandel", 52], ["flowerV", 58],
      ["flowerW", 73], ["flowerC", 82], ["daisyS", 89], ["flowerP", 98], ["flowerY", 108],
      ["dandel", 117], ["flowerC", 129], ["flowerV", 138], ["daisyS", 147], ["flowerP", 153],
      ["flowerY", 166]] as Place[])
      .forEach(([n, x], i) => stamp(g, n, x, base, { flip: i % 2 === 1 }));
    stamp(g, "butterfly", 31, 2);
    stamp(g, "butterfly2", 112, 1, { flip: true });
    stamp(g, "bee", 50, 4);
    stamp(g, "dfly", 79, 3);
    stamp(g, "bee", 136, 3, { flip: true });
    stamp(g, "ladybug", 21, base);
    stamp(g, "snail", 146, base);
    stamp(g, "frog", 101, base);
    stamp(g, "bird", 128, base);
    stamp(g, "cater", 93, base);
    stamp(g, "worm", 70, GY + 2);
    stamp(g, "ant", 160, base - 3);
    stamp(g, "mushS", 164, base - 3);
    ([[7, 1], [43, 0], [62, 3], [88, 1], [120, 2], [133, 0], [143, 4]] as [number, number][])
      .forEach(([x, y]) => stamp(g, "firefly", x, y));
    return { W, H, g };
  }

  if (variant === "horizonte") {
    const W = 170, H = 9, GY = 6, g = makeGrid(W, H), base = GY - 1;
    ground(g, W, GY, 2, true);
    ([["tuftL", 4], ["fernC", 15], ["tuft", 27], ["clover", 39], ["tuftL", 49], ["fernC", 61],
      ["pebble", 73], ["tuft", 81], ["tuftL", 97], ["fernC", 107], ["clover", 119], ["tuft", 131],
      ["pebble", 143], ["tuftL", 151], ["fernC", 161]] as Place[])
      .forEach(([n, x], i) => stamp(g, n, x, base, { flip: i % 2 === 0 }));
    ([["daisyS", 10], ["flowerW", 34], ["daisyS", 56], ["flowerC", 89], ["daisyS", 102],
      ["flowerP", 125], ["daisyS", 148], ["flowerW", 167]] as Place[])
      .forEach(([n, x], i) => stamp(g, n, x, base, { flip: i % 2 === 1 }));
    stamp(g, "butterfly", 69, 1);
    stamp(g, "bee", 113, 0);
    stamp(g, "ladybug", 22, base);
    stamp(g, "cater", 136, base);
    ([[46, 0], [93, 1], [158, 0]] as [number, number][]).forEach(([x, y]) => stamp(g, "firefly", x, y));
    return { W, H, g };
  }

  if (variant === "dosel") {
    const W = 170, H = 12, g = makeGrid(W, H);
    for (let x = 0; x < W; x++) {
      g[0][x] = rnd() < 0.26 ? "D" : "g";
      g[1][x] = rnd() < 0.2 ? "L" : rnd() < 0.3 ? "h" : "G";
    }
    ([["fernA", 3], ["tuft", 13], ["fernB", 20], ["reed", 33], ["fernC", 41], ["tuftL", 51],
      ["fernA", 57], ["fernC", 69], ["tuft", 79], ["fernB", 86], ["fernA", 99], ["tuftL", 109],
      ["fernC", 116], ["reed", 125], ["fernB", 132], ["tuft", 145], ["fernA", 151], ["fernC", 161]] as Place[])
      .forEach(([n, x], i) => stamp(g, n, x, 1 + S[n].length, { flipV: true, flip: i % 2 === 0 }));
    ([["flowerY", 9], ["dandel", 28], ["daisyS", 47], ["flowerC", 64], ["flowerP", 76],
      ["daisyS", 95], ["flowerY", 112], ["flowerV", 122], ["daisyS", 141], ["flowerC", 158]] as Place[])
      .forEach(([n, x], i) => stamp(g, n, x, 1 + S[n].length, { flipV: true, flip: i % 2 === 1 }));
    stamp(g, "butterfly", 55, 11);
    stamp(g, "bee", 104, 10);
    stamp(g, "dfly", 138, 11);
    ([[18, 10], [71, 11], [129, 9]] as [number, number][]).forEach(([x, y]) => stamp(g, "firefly", x, y));
    return { W, H, g };
  }

  if (variant === "sendero") {
    const W = 170, H = 7, GY = 2, g = makeGrid(W, H);
    for (let x = 0; x < W; x++) {
      if (rnd() < 0.4) g[GY - 1][x] = rnd() < 0.35 ? "L" : "h";
      g[GY][x] = rnd() < 0.25 ? "D" : "g";
      g[GY + 1][x] = rnd() < 0.3 ? "s" : "b";
      g[GY + 2][x] = rnd() < 0.14 ? "e" : rnd() < 0.35 ? "b" : "B";
      if (rnd() < 0.13 && GY + 3 < H) g[GY + 3][x] = "D";
    }
    const base = GY - 1;
    ([["pebble", 15], ["rock", 39], ["pebble", 67], ["leaf", 89], ["pebble", 105], ["rock", 129],
      ["leaf", 153], ["pebble", 164]] as Place[])
      .forEach(([n, x], i) => stamp(g, n, x, base, { flip: i % 2 === 0 }));
    stamp(g, "snail", 53, base);
    stamp(g, "ant", 97, base);
    stamp(g, "worm", 119, GY + 1);
    stamp(g, "cater", 23, base);
    stamp(g, "mushS", 142, base);
    return { W, H, g };
  }

  // brotes
  const W = 170, H = 10, GY = 7, g = makeGrid(W, H), base = GY - 1;
  for (let x = 0; x < W; x += 3) g[GY][x] = x % 6 === 0 ? "l" : "D";
  ([["fernC", 8], ["clover", 27], ["tuftL", 45], ["fernC", 63], ["clover", 87], ["tuftL", 105],
    ["fernC", 127], ["clover", 149], ["tuftL", 163]] as Place[])
    .forEach(([n, x], i) => stamp(g, n, x, base, { flip: i % 2 === 0 }));
  ([["daisyS", 19], ["flowerW", 36], ["dandel", 54], ["flowerC", 73], ["flowerV", 96],
    ["daisyS", 115], ["flowerP", 135], ["flowerW", 157]] as Place[])
    .forEach(([n, x], i) => stamp(g, n, x, base, { flip: i % 2 === 1 }));
  stamp(g, "butterfly", 79, 2);
  stamp(g, "dfly", 121, 2);
  stamp(g, "bee", 31, 1);
  ([[14, 3], [51, 0], [69, 4], [101, 2], [145, 1], [167, 3]] as [number, number][])
    .forEach(([x, y]) => stamp(g, "seed", x, y));
  return { W, H, g };
}

const CACHE = new Map<string, { paths: [string, string][]; viewBox: string }>();

function getDividerData(variant: DividerVariant, pixel: number, tone: "sobrio" | "vivido") {
  const key = `${variant}-${pixel}-${tone}`;
  if (CACHE.has(key)) return CACHE.get(key)!;

  const P = PALETTES[tone] as Record<string, string>;
  const { W, H, g } = buildVariant(variant);
  const byColor: Record<string, string> = {};
  for (let y = 0; y < H; y++) {
    let x = 0;
    while (x < W) {
      const ch = g[y][x];
      if (!ch) { x++; continue; }
      let run = 1;
      while (x + run < W && g[y][x + run] === ch) run++;
      const c = P[ch] || "#000";
      byColor[c] =
        (byColor[c] || "") +
        `M${x * pixel} ${y * pixel}h${run * pixel}v${pixel}h${-run * pixel}z`;
      x += run;
    }
  }
  const result = {
    paths: Object.entries(byColor),
    viewBox: `0 0 ${W * pixel} ${H * pixel}`,
  };
  CACHE.set(key, result);
  return result;
}

export default memo(function PixelDivider({
  variant = "pradera",
  pixel = 5,
  tone = "sobrio",
  flip = false,
  className = "",
  ariaHidden = true,
  customViewBox,
  preserveAspectRatio: propPreserveAspect,
}: Props) {
  const { paths, viewBox } = useMemo(
    () => getDividerData(variant, pixel, tone),
    [variant, pixel, tone]
  );

  const preserveAspect = propPreserveAspect || (variant === "dosel" ? "xMidYMin meet" : "xMidYMax meet");

  return (
    <svg
      viewBox={customViewBox || viewBox}
      shapeRendering="crispEdges"
      preserveAspectRatio={preserveAspect}
      aria-hidden={ariaHidden}
      className={`block select-none pointer-events-none transform-gpu ${className}`}
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      {paths.map(([color, d]) => (
        <path key={color} d={d} fill={color} />
      ))}
    </svg>
  );
});

const STAMP_CACHE = new Map<string, { paths: [string, string][]; viewBox: string }>();

export function getStampData(type: PlantType, pixel = 4, tone: "sobrio" | "vivido" = "sobrio") {
  const key = `${type}-${pixel}-${tone}`;
  if (STAMP_CACHE.has(key)) return STAMP_CACHE.get(key)!;

  const sp = S[type];
  if (!sp) return { paths: [], viewBox: "0 0 0 0" };

  const P = PALETTES[tone] as Record<string, string>;
  const H = sp.length;
  const W = Math.max(...sp.map((r) => r.length));

  const byColor: Record<string, string> = {};
  for (let y = 0; y < H; y++) {
    const row = sp[y];
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === " ") {
        x++;
        continue;
      }
      let run = 1;
      while (x + run < row.length && row[x + run] === ch) run++;
      const c = P[ch] || "#000";
      byColor[c] =
        (byColor[c] || "") +
        `M${x * pixel} ${y * pixel}h${run * pixel}v${pixel}h${-run * pixel}z`;
      x += run;
    }
  }

  const result = {
    paths: Object.entries(byColor),
    viewBox: `0 0 ${W * pixel} ${H * pixel}`,
  };
  STAMP_CACHE.set(key, result);
  return result;
}

/**
 * PixelPlant — micro-plantas y brotes pixel art independientes.
 * Úsalos para decorar esquinas de cards, líneas de tiempo o marcos estructurales (estilo bioclimático / Singapore green architecture).
 */
export const PixelPlant = memo(function PixelPlant({
  type = "clover",
  pixel = 4,
  tone = "sobrio",
  flip = false,
  className = "",
  ariaHidden = true,
}: {
  type?: PlantType;
  pixel?: number;
  tone?: "sobrio" | "vivido";
  flip?: boolean;
  className?: string;
  ariaHidden?: boolean;
}) {
  const { paths, viewBox } = useMemo(
    () => getStampData(type, pixel, tone),
    [type, pixel, tone]
  );

  if (!paths.length) return null;

  return (
    <svg
      viewBox={viewBox}
      shapeRendering="crispEdges"
      aria-hidden={ariaHidden}
      className={`inline-block select-none pointer-events-none transform-gpu ${className}`}
      style={{
        height: "1.25em",
        width: "auto",
        transform: flip ? "scaleX(-1)" : undefined,
      }}
    >
      {paths.map(([color, d]) => (
        <path key={color} d={d} fill={color} />
      ))}
    </svg>
  );
});
