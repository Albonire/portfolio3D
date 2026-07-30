"use client";

import { useEffect, useRef, useState } from "react";

// Paleta de La Ramita (Paleta Sobria)
const PALETTE: Record<string, string> = {
  B: "#332C26", // Contorno madera oscura
  t: "#6E6055", // Cuerpo madera claro
  s: "#5A4F44", // Sombra madera
  b: "#4A4038", // Base madera
  L: "#B4C9A9", // Verde hoja claro
  g: "#3F6B45", // Verde hoja oscuro
  l: "#8FAE86", // Verde hoja medio
  w: "#BFB49B", // Crema flor
  y: "#8F7B45", // Amarillo flor
  E: "#9A9186", // Seco claro
  e: "#7A7268", // Seco oscuro
};

// Sprites de La Ramita (Twig Cursor Family)
const TWIG_SPRITES: Record<string, string[]> = {
  twigDefault: [
    "BB",
    "BtsB",
    " BtsB      BB",
    "  BtsB   BLLB",
    "   BtsB BLLLB",
    "    BtsBBLLgB",
    "     BtsBLggB",
    "      BtsBgB",
    "       BtsB",
    "        BtsB",
    "         BsbB",
    "          BbB",
    "           BB",
  ],
  twigPointer: [
    "BB",
    "BtsB",
    " BtsB     BB",
    "  BtsB  BLLLB",
    "   BtsBBLLLLB",
    "    BtsBLLLgB",
    "     BtsBLggB",
    "   BLBBtsBgB",
    "  BLLLBtsB",
    "  BLLgBtsB",
    "   BggBsbB",
    "    BB BbB",
    "        BB",
  ],
  twigActive: [
    "BB",
    "BtsB",
    " BtsB",
    "  BtsB   BB",
    "   BtsB BLgB",
    "    BtsBLgB",
    "     BtsBB",
    "      BtsB",
    "       BsbB",
    "        BbB",
    "         BB",
  ],
  twigText: [
    " BLB ",
    "BLLLB",
    "BLgLB",
    " BsB ",
    " BtB ",
    " BsB ",
    " BtB ",
    " BsB ",
    " BtB ",
    " BsB ",
    " BtB ",
    "BLgLB",
    "BLLLB",
    " BLB ",
  ],
  twigWait: [
    "BB",
    "BtsB",
    " BtsB     BB",
    "  BtsB   BwwB",
    "   BtsB BwywB",
    "    BtsBBwywB",
    "     BtsBByB",
    "      BtsB",
    "       BsbB",
    "        BbB",
    "         BB",
  ],
  twigDeny: [
    "BB",
    "BEeB",
    " BEeB    BB",
    "  BEeB  BwwB",
    "   BEeBBwBBB",
    "    BEeBBwB",
    "     BEeBwwB",
    "      BEeBB",
    "       BEeB",
    "        BeB",
    "         BB",
  ],
};

type TwigState = "twigDefault" | "twigPointer" | "twigActive" | "twigText" | "twigWait" | "twigDeny";

function renderTwigSVG(state: TwigState, scale = 2) {
  const sprite = TWIG_SPRITES[state] || TWIG_SPRITES.twigDefault;
  let maxW = 0;
  sprite.forEach((row) => {
    if (row.length > maxW) maxW = row.length;
  });

  const H = sprite.length;
  const W = maxW;
  const colorPaths: Record<string, string> = {};

  for (let y = 0; y < H; y++) {
    const row = sprite[y];
    let x = 0;
    while (x < row.length) {
      const ch = row[x];
      if (ch === " ") {
        x++;
        continue;
      }
      let run = 1;
      while (x + run < row.length && row[x + run] === ch) run++;
      const color = PALETTE[ch] || "#000000";
      if (!colorPaths[color]) colorPaths[color] = "";
      colorPaths[color] += `M${x * scale} ${y * scale}h${run * scale}v${scale}h${-run * scale}z `;
      x += run;
    }
  }

  // Hotspot adjustment for twigText (2, 7) vs standard (0, 0)
  const isText = state === "twigText";
  const offsetX = isText ? -2 * scale : 0;
  const offsetY = isText ? -7 * scale : 0;

  return (
    <svg
      width={W * scale}
      height={H * scale}
      viewBox={`0 0 ${W * scale} ${H * scale}`}
      shapeRendering="crispEdges"
      className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)] transition-transform duration-100"
      style={{
        display: "block",
        transform: `translate(${offsetX}px, ${offsetY}px)`,
      }}
    >
      {Object.entries(colorPaths).map(([color, d]) => (
        <path key={color} d={d} fill={color} />
      ))}
    </svg>
  );
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [cursorState, setCursorState] = useState<TwigState>("twigDefault");

  useEffect(() => {
    // Solo activar en dispositivos de puntero fino (escritorio)
    const mq = window.matchMedia("(any-hover: hover) and (any-pointer: fine)");
    if (!mq.matches) return;

    setIsVisible(true);
    let rafId = 0;
    let targetX = 0;
    let targetY = 0;
    let isMouseDown = false;

    const updatePosition = () => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      }
      rafId = 0;
    };

    const onPointerMove = (e: PointerEvent) => {
      if (e.pointerType === "touch") return;
      targetX = e.clientX;
      targetY = e.clientY;

      if (!rafId) {
        rafId = requestAnimationFrame(updatePosition);
      }

      // Evaluar estado del cursor según el elemento debajo
      const target = e.target as HTMLElement | null;
      if (target) {
        if (isMouseDown) {
          setCursorState("twigActive");
          return;
        }

        const isDeny = Boolean(target.closest("[disabled], .cursor-not-allowed"));
        if (isDeny) {
          setCursorState("twigDeny");
          return;
        }

        const isText = Boolean(target.closest("input[type='text'], input[type='email'], textarea, [contenteditable='true']"));
        if (isText) {
          setCursorState("twigText");
          return;
        }

        const isClickable = Boolean(
          target.closest("a, button, [role='button'], .cursor-pointer")
        );
        if (isClickable) {
          setCursorState("twigPointer");
          return;
        }

        setCursorState("twigDefault");
      }
    };

    const onMouseDown = () => {
      isMouseDown = true;
      setCursorState("twigActive");
    };

    const onMouseUp = () => {
      isMouseDown = false;
      setCursorState("twigDefault");
    };

    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("mousedown", onMouseDown);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("mousedown", onMouseDown);
      window.removeEventListener("mouseup", onMouseUp);
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 z-[99999] pointer-events-none will-change-transform"
      style={{
        transform: "translate3d(-100px, -100px, 0)",
      }}
    >
      {renderTwigSVG(cursorState, 2)}
    </div>
  );
}
