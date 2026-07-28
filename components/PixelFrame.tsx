"use client";

import { useMemo, type ReactNode } from "react";

/**
 * PixelFrame — marco pixel-art (enredadera) alrededor de una tarjeta.
 *
 * Copiar a components/PixelFrame.tsx
 *
 *   <PixelFrame variant="hedge">
 *     <ProjectCard … />
 *   </PixelFrame>
 *
 * Variantes: vid (enredadera) · hedge (seto) · cane (juncos) ·
 *            garland (guirnalda) · root (raíz) · bamboo (bambú)
 * La vegetación crece hacia AFUERA; el tallo continuo queda pegado a la tarjeta.
 *
 * - Teselas SVG sin viewBox: 1 unidad = 1 px CSS, así el grosor es constante
 *   a cualquier ancho y el píxel no se deforma.
 * - Fondo transparente: solo pinta la vegetación, la tarjeta sigue siendo tuya.
 * - Determinista, sin estado: seguro en SSR.
 */

type Props = {
  children: ReactNode;
  /** estilo del marco */
  variant?: FrameVariant;
  /** tamaño del pixel (por defecto 4) */
  pixel?: number;
  tone?: "sobrio" | "vivido";
  /** bichos posados en el marco */
  critters?: boolean;
  className?: string;
  /** id único si usas dos marcos de la MISMA variante en una página */
  id?: string;
};

const PALETTES = {
  sobrio: {
    D: "#2E4A34", g: "#3F6B45", G: "#5C8C5A", h: "#4E7A4C", l: "#8FAE86", L: "#B4C9A9",
    w: "#BFB49B", y: "#8F7B45", p: "#A9737E", P: "#C6A4A8", v: "#7B769B", V: "#9C97B4",
    b: "#4A4038", s: "#5A4F44",
    B: "#332C26", t: "#6E6055", e: "#7A7268", E: "#9A9186", k: "#4A443C", c: "#4E7A9E", C: "#7FA0BE",
  },
  vivido: {
    D: "#23702D", g: "#2E862E", G: "#4FAE33", h: "#66BA3E", l: "#9ED283", L: "#C4E4A2",
    w: "#FFFFFF", y: "#FDEA73", p: "#E58AA8", P: "#F7C0CE", v: "#9B7FC7", V: "#C4B2E4",
    b: "#715A39", s: "#806843",
    B: "#4A3A2A", t: "#94733E", e: "#ABA29B", E: "#C9C2BA", k: "#2D3C47", c: "#6FA9D6", C: "#A9CBEA",
  },
} as const;

const S: Record<string, string[]> = {
  // Regla del marco: grosor T constante. El tallo continuo va en la fila
  // INTERIOR (la última arriba, la primera abajo) y en la columna INTERIOR del
  // lateral, con la vegetación creciendo HACIA AFUERA. Las esquinas son T×T con
  // el tallo en esas mismas fila/columna, así el marco cierra sin huecos.

  // 06 enredadera · T=4
  vid_top: ["  L     D   ", "  g     g   ", " L D   D L  ", "gggggggggggg"],
  vid_bottom: ["gggggggggggg", " L D   D L  ", "  g     g   ", "  L     D   "],
  vid_side: ["   g", "  Lg", " D g", "   g", "  Dg", " L g", "   g", "  Lg", " D g", "   g", "  Dg", " L g"],
  vid_cTL: ["   g", " L g", " D g", "gggg"],
  vid_cBL: ["gggg", " D g", " L g", "   g"],
  // 07 seto · T=3
  hedge_top: ["DGhGDGhGDG", "hGGhGGGhGh", "GhGGhGGhGG"],
  hedge_bottom: ["GhGGhGGhGG", "hGGhGGGhGh", "DGhGDGhGDG"],
  hedge_side: ["DhG", "GGh", "hGG", "DGh", "GhG", "hGG"],
  hedge_cTL: ["GhG", "hGG", "GhG"],
  hedge_cBL: ["GhG", "hGG", "GhG"],
  // 08 juncos · T=4
  cane_top: ["g g g  g g", "L D L  D L", "g g g  g g", "gggggggggg"],
  cane_bottom: ["gggggggggg", "g g g  g g", "L D L  D L", "g g g  g g"],
  cane_side: ["   g", "  Lg", " g g", "  Dg", "   g", "  Dg", " g g", "  Lg"],
  cane_cTL: ["   g", "  Lg", " g g", "gggg"],
  cane_cBL: ["gggg", " g g", "  Lg", "   g"],
  // 09 guirnalda · T=4
  garland_top: [" w   P   V  ", "wyw PpP vVv ", " w   P   V  ", "ssssssssssss"],
  garland_bottom: ["ssssssssssss", " w   P   V  ", "wyw PpP vVv ", " w   P   V  "],
  garland_side: [" w s", "wyws", " w s", "   s", " P s", "PpPs", " P s", "   s"],
  garland_cTL: [" w s", "wyws", " w s", "ssss"],
  garland_cBL: ["ssss", " w s", "wyws", " w s"],
  // 10 raíz · T=4
  root_top: [" g    g     ", " L    D     ", "tsttbttsttbt", "bbbbbbbbbbbb"],
  root_bottom: ["bbbbbbbbbbbb", "tsttbttsttbt", " L    D     ", " g    g     "],
  root_side: ["  tb", " Lst", "  tb", "  bt", " Dsb", "  ts", "  tb", "  bt"],
  root_cTL: ["  tb", " Ltb", "tstb", "bbbb"],
  root_cBL: ["bbbb", "tstb", " Ltb", "  tb"],
  // 11 bambú · T=4
  bamboo_top: [" L    L     ", "  w    w    ", "wwwwtwwwwtww", "yyyytyyyytyy"],
  bamboo_bottom: ["yyyytyyyytyy", "wwwwtwwwwtww", "  w    w    ", " L    L     "],
  bamboo_side: [" Lwy", "  wy", " Lwy", "  tt", "  wy", " Lwy", "  wy", "  tt"],
  bamboo_cTL: [" Lwy", "  wy", "wwww", "yyyy"],
  bamboo_cBL: ["yyyy", "wwww", "  wy", " Lwy"],
  // bichos
  butterfly: ["yw wy", "ywkwy", " yky "],
  butterfly2: ["vV Vv", "vVkVv", " vkv "],
  bee: [" ww ", "kyky"],
  snail: [" BtB ", "BtEtB", "kkkkk"],
  ladybug: [" kk ", "pkkp"],
  cater: [" GLG L", "GGgGGg"],
  dfly: [" C C C ", "cckckcc"],
  worm: [" Ee", "Ee "],
  flowerY: [" w ", "wyw", " w ", " g ", "Lg "],
  mushroom: [" ppp ", "pwpwp", " eEe "],
};

export type FrameVariant = "vid" | "hedge" | "cane" | "garland" | "root" | "bamboo";

type CritterSpec = [string, React.CSSProperties];

const CRITTERS: Record<FrameVariant, CritterSpec[]> = {
  vid: [
    ["butterfly", { top: 0, right: "12%" }],
    ["bee", { top: 0, left: "22%" }],
    ["snail", { bottom: 0, left: "34%" }],
    ["mushroom", { bottom: 0, right: "24%" }],
    ["flowerY", { bottom: 0, left: "8%" }],
  ],
  hedge: [
    ["bee", { top: 0, right: "18%" }],
    ["ladybug", { bottom: 0, left: "26%" }],
  ],
  cane: [
    ["dfly", { top: 0, left: "30%" }],
    ["cater", { bottom: 0, right: "20%" }],
  ],
  garland: [
    ["butterfly2", { top: 0, right: "14%" }],
    ["bee", { bottom: 0, left: "18%" }],
  ],
  root: [
    ["snail", { bottom: 0, left: "40%" }],
    ["mushroom", { bottom: 0, right: "16%" }],
    ["worm", { top: 0, left: "12%" }],
  ],
  bamboo: [
    ["dfly", { top: 0, right: "22%" }],
    ["ladybug", { bottom: 0, left: "30%" }],
    ["bee", { top: 0, left: "14%" }],
  ],
};


type Art = { w: number; h: number; viewBox: string; paths: [string, string][] };

function toArt(name: string, px: number, P: Record<string, string>): Art {
  const sp = S[name];
  const W = sp[0].length;
  const H = sp.length;
  const byColor: Record<string, string> = {};
  for (let y = 0; y < H; y++) {
    let x = 0;
    while (x < W) {
      const ch = sp[y][x];
      if (ch === " ") { x++; continue; }
      let run = 1;
      while (x + run < W && sp[y][x + run] === ch) run++;
      const c = P[ch] || "#000";
      byColor[c] = (byColor[c] || "") + `M${x * px} ${y * px}h${run * px}v${px}h${-run * px}z`;
      x += run;
    }
  }
  return {
    w: W * px,
    h: H * px,
    viewBox: `0 0 ${W * px} ${H * px}`,
    paths: Object.entries(byColor),
  };
}

function Paths({ art }: { art: Art }) {
  return (
    <>
      {art.paths.map(([color, d]) => (
        <path key={color} d={d} fill={color} />
      ))}
    </>
  );
}

function Critter({ art, style }: { art: Art; style: React.CSSProperties }) {
  return (
    <svg
      viewBox={art.viewBox}
      width={art.w}
      height={art.h}
      shapeRendering="crispEdges"
      aria-hidden
      style={{ position: "absolute", display: "block", pointerEvents: "none", ...style }}
    >
      <Paths art={art} />
    </svg>
  );
}

export default function PixelFrame({
  children,
  variant = "vid",
  pixel = 4,
  tone = "sobrio",
  critters = true,
  className = "",
  id: idProp,
}: Props) {
  const id = idProp ?? `pf-${variant}`;
  const { edges, bugs } = useMemo(() => {
    const P = PALETTES[tone] as Record<string, string>;
    const e = {
      top: toArt(`${variant}_top`, pixel, P),
      bottom: toArt(`${variant}_bottom`, pixel, P),
      side: toArt(`${variant}_side`, pixel, P),
      cTL: toArt(`${variant}_cTL`, pixel, P),
      cBL: toArt(`${variant}_cBL`, pixel, P),
    };
    const b = CRITTERS[variant].map(([name, style]) => ({
      name,
      art: toArt(name, pixel, P),
      style,
    }));
    return { edges: e, bugs: b };
  }, [variant, pixel, tone]);

  const a = {
    tileTop: edges.top, tileBottom: edges.bottom, tileSide: edges.side,
    cornerTL: edges.cTL, cornerBL: edges.cBL,
  };
  // grosor T único: tiras y esquinas comparten medida, el marco cierra sin huecos
  const inset = edges.top.h;

  return (
    <div className={`relative ${className}`} style={{ padding: inset }}>
      {/* bordes en teselas */}
      <div style={{ position: "absolute", top: 0, left: inset, right: inset, height: a.tileTop.h, overflow: "hidden", pointerEvents: "none" }}>
        <svg width="100%" height={a.tileTop.h} shapeRendering="crispEdges" aria-hidden style={{ display: "block" }}>
          <defs>
            <pattern id={`${id}-top`} patternUnits="userSpaceOnUse" width={a.tileTop.w} height={a.tileTop.h}>
              <Paths art={a.tileTop} />
            </pattern>
          </defs>
          <rect width="100%" height={a.tileTop.h} fill={`url(#${id}-top)`} />
        </svg>
      </div>
      <div style={{ position: "absolute", bottom: 0, left: inset, right: inset, height: a.tileBottom.h, overflow: "hidden", pointerEvents: "none" }}>
        <svg width="100%" height={a.tileBottom.h} shapeRendering="crispEdges" aria-hidden style={{ display: "block" }}>
          <defs>
            <pattern id={`${id}-bottom`} patternUnits="userSpaceOnUse" width={a.tileBottom.w} height={a.tileBottom.h}>
              <Paths art={a.tileBottom} />
            </pattern>
          </defs>
          <rect width="100%" height={a.tileBottom.h} fill={`url(#${id}-bottom)`} />
        </svg>
      </div>
      <div style={{ position: "absolute", left: 0, top: inset, bottom: inset, width: a.tileSide.w, overflow: "hidden", pointerEvents: "none" }}>
        <svg width={a.tileSide.w} height="100%" shapeRendering="crispEdges" aria-hidden style={{ display: "block" }}>
          <defs>
            <pattern id={`${id}-side`} patternUnits="userSpaceOnUse" width={a.tileSide.w} height={a.tileSide.h}>
              <Paths art={a.tileSide} />
            </pattern>
          </defs>
          <rect width={a.tileSide.w} height="100%" fill={`url(#${id}-side)`} />
        </svg>
      </div>
      <div style={{ position: "absolute", right: 0, top: inset, bottom: inset, width: a.tileSide.w, overflow: "hidden", transform: "scaleX(-1)", pointerEvents: "none" }}>
        <svg width={a.tileSide.w} height="100%" shapeRendering="crispEdges" aria-hidden style={{ display: "block" }}>
          <rect width={a.tileSide.w} height="100%" fill={`url(#${id}-side)`} />
        </svg>
      </div>

      {/* esquinas */}
      <Critter art={a.cornerTL} style={{ top: 0, left: 0 }} />
      <Critter art={a.cornerTL} style={{ top: 0, right: 0, transform: "scaleX(-1)" }} />
      <Critter art={a.cornerBL} style={{ bottom: 0, left: 0 }} />
      <Critter art={a.cornerBL} style={{ bottom: 0, right: 0, transform: "scaleX(-1)" }} />

      {critters &&
        bugs.map((b) => (
          <Critter key={b.name + String(b.style.left) + String(b.style.right)} art={b.art} style={b.style} />
        ))}

      <div className="relative">{children}</div>
    </div>
  );
}
