"use client";

import { Component, useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { useSunny } from "./Sunny";

// EXPERIMENTO (modo Sol). Textura de puntos de media tinta sobre un componente, con el shader HalftoneDots de
// Paper Shaders (Apache-2.0, https://github.com/paper-design/shaders). La idea está tomada de dany.works, que lo pone
// sobre sus imágenes y lo quita al pasar el cursor; aquí es fija y solo existe con el modo Sol encendido.
// Parte de los parámetros de dany (rejilla hexagonal, puntos "gooey", contraste 0,4, grano 0,2).
const SUNNY_PAPER = "#f7f1e3"; // papel del modo Sol (app/globals.css)
const INK = "#1f3a5f"; // azul marino del acento
const FADE_MS = 700;

type ShaderProps = Record<string, unknown>;
type Shader = ComponentType<ShaderProps>;

export type HalftoneProps = {
  /** Dirección de la imagen, o función que la genera (solo en el cliente) y devuelve una URL de datos. */
  image: string | (() => string | undefined);
  /** true: el fondo tapa por completo lo que hay debajo (una imagen); false: solo se ven los puntos. */
  solid?: boolean;
  /** Tamaño de la rejilla relativo a la imagen (0 a 1) y radio máximo del punto en celdas (0 a 2). */
  size?: number;
  radius?: number;
  contrast?: number;
  inverted?: boolean;
  /** true: los puntos conservan los colores de la imagen en vez de la tinta azul. */
  colors?: boolean;
  /** Grano superpuesto (0 a 1). En una placa transparente conviene 0: el grano mancharía todo el recuadro. */
  grain?: number;
  type?: "classic" | "gooey" | "holes" | "soft";
  /** Solo para imágenes con fondo casi blanco (capturas de interfaz): multiplica la tinta de cada canal antes de pasarla al shader. 1 = sin cambio. */
  boost?: number;
  /** Valor de clip-path para la capa. El shader dibuja puntos mínimos también sobre las zonas blancas; recortar a la forma evita manchar lo que hay fuera (ejes, etiquetas). */
  clip?: string;
};

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(canvas.getContext("webgl2") || canvas.getContext("webgl"));
  } catch {
    return false;
  }
}

// Una captura de interfaz es casi toda blanca: sin ayuda, los puntos salen diminutos y el dibujo se pierde. Esto oscurece
// lo que no es blanco (el blanco sigue siendo blanco) y devuelve una URL de datos; si algo falla devuelve undefined.
function boosted(src: string, boost: number): Promise<string | undefined> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      try {
        const canvas = document.createElement("canvas");
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext("2d");
        if (!ctx) return resolve(undefined);
        ctx.drawImage(img, 0, 0);
        const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const px = data.data;
        for (let i = 0; i < px.length; i += 4) {
          for (let k = 0; k < 3; k++) px[i + k] = 255 - Math.min(255, (255 - px[i + k]) * boost);
        }
        ctx.putImageData(data, 0, 0);
        resolve(canvas.toDataURL("image/png"));
      } catch {
        resolve(undefined);
      }
    };
    img.onerror = () => resolve(undefined);
    img.src = src;
  });
}

// Si el shader falla al montarse (sin WebGL, contexto perdido), no se pinta nada y queda el original.
class Quiet extends Component<{ children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export default function HalftoneLayer({
  image,
  solid = false,
  size = 0.2,
  radius = 1,
  contrast = 0.4,
  inverted = false,
  colors = false,
  grain = 0.2,
  type = "gooey",
  boost = 1,
  clip,
}: HalftoneProps) {
  const on = useSunny();
  const box = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [Shader, setShader] = useState<Shader | null>(null);
  const [src, setSrc] = useState<string | undefined>(undefined);
  const [live, setLive] = useState(false);
  const [shown, setShown] = useState(false);

  // Solo está "cerca" si el modo está encendido y el componente está a menos de 150 px de la pantalla (como dany):
  // fuera de pantalla se desmonta el canvas y se libera el contexto WebGL.
  useEffect(() => {
    const el = box.current;
    if (!on || !el) return;
    const observer = new IntersectionObserver(([entry]) => setNear(entry.isIntersecting), { rootMargin: "150px" });
    observer.observe(el);
    return () => {
      observer.disconnect();
      setNear(false);
    };
  }, [on]);

  // El shader se descarga la primera vez que hace falta y la imagen se prepara en ese momento.
  useEffect(() => {
    if (!on || !near || Shader || !hasWebGL()) return;
    let cancelled = false;
    import("./HalftoneShader")
      .then(async (mod) => {
        const raw = typeof image === "function" ? image() : image;
        const ready = raw !== undefined && boost > 1 ? await boosted(raw, boost) : raw;
        if (cancelled) return;
        setSrc(ready);
        setShader(() => mod.default as unknown as Shader);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [on, near, Shader, image, boost]);

  const active = on && near && Shader !== null && src !== undefined;
  useEffect(() => {
    if (active) {
      setLive(true);
      const frame = requestAnimationFrame(() => setShown(true));
      return () => cancelAnimationFrame(frame);
    }
    setShown(false);
    const timer = window.setTimeout(() => setLive(false), FADE_MS);
    return () => window.clearTimeout(timer);
  }, [active]);

  return (
    <div ref={box} className="halftone-layer" data-on={shown} aria-hidden="true" style={clip ? { clipPath: clip } : undefined}>
      {live && Shader && src !== undefined && (
        <Quiet>
          <Shader
            image={src}
            colorFront={INK}
            colorBack={solid ? SUNNY_PAPER : "#00000000"}
            grid="hex"
            type={type}
            originalColors={colors}
            fit="cover"
            size={size}
            radius={radius}
            contrast={contrast}
            inverted={inverted}
            grainMixer={0.2}
            grainOverlay={grain}
            grainSize={0.5}
            style={{ width: "100%", height: "100%", backgroundColor: solid ? SUNNY_PAPER : "transparent" }}
          />
        </Quiet>
      )}
    </div>
  );
}
