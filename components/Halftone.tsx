"use client";

import { Component, useEffect, useRef, useState, type ComponentType, type ReactNode } from "react";
import { useSunny } from "./Sunny";

// EXPERIMENTO (modo Sol). Textura de puntos de media tinta sobre un componente, con el shader HalftoneDots de
// Paper Shaders (Apache-2.0, https://github.com/paper-design/shaders). La idea está tomada de dany.works, que lo pone
// sobre sus imágenes y lo quita al pasar el cursor; aquí es fija y solo existe con el modo Sol encendido.
// Parte de los parámetros de dany (rejilla hexagonal, puntos "gooey", contraste 0,4, grano 0,2).
const INK = "#1f3a5f"; // azul marino del acento
const FADE_MS = 700;

type ShaderProps = Record<string, unknown>;
type Shader = ComponentType<ShaderProps>;

export type HalftoneProps = {
  /** Función que genera la imagen en el cliente y devuelve una URL de datos. Los puntos salen de su luminosidad. */
  image: () => string | undefined;
  /** Tamaño de la rejilla relativo a la imagen (0 a 1) y radio máximo del punto en celdas (0 a 2). */
  size?: number;
  radius?: number;
  contrast?: number;
  /** Grano superpuesto (0 a 1). En una placa transparente conviene 0: el grano mancharía todo el recuadro. */
  grain?: number;
  /** Valor de clip-path para la capa. El shader dibuja puntos mínimos también sobre las zonas blancas; recortar a la forma evita manchar lo que hay fuera (ejes, etiquetas). */
  clip?: string;
};

// Sin WebGL no se pinta nada y queda el original. El contexto de prueba se suelta enseguida para no gastar uno de los pocos que permite el navegador.
function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    const gl = canvas.getContext("webgl2") || canvas.getContext("webgl");
    gl?.getExtension("WEBGL_lose_context")?.loseContext();
    return Boolean(gl);
  } catch {
    return false;
  }
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

export default function HalftoneLayer({ image, size = 0.2, radius = 1, contrast = 0.4, grain = 0.2, clip }: HalftoneProps) {
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
      .then((mod) => {
        if (cancelled) return;
        setSrc(image());
        setShader(() => mod.default as unknown as Shader);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [on, near, Shader, image]);

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
            colorBack="#00000000"
            grid="hex"
            type="gooey"
            fit="cover"
            size={size}
            radius={radius}
            contrast={contrast}
            grainMixer={0.2}
            grainOverlay={grain}
            grainSize={0.5}
            style={{ width: "100%", height: "100%", backgroundColor: "transparent" }}
          />
        </Quiet>
      )}
    </div>
  );
}
