"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

// EXPERIMENTO. El video es de dany.works (https://dany.works/): sombras de hojas, 720x1280, 12 s, sin audio.
// Se enlaza desde su sitio y no se copia al repositorio. Para publicar el sitio hay que cambiarlo por un
// archivo propio o tener permiso de su autor: aquí solo se prueba cómo quedaría.
const SUNNY_VIDEO = "https://dany.works/leaves.mp4";
const FADE_MS = 700;

// El estado vive fuera de React para que lo compartan el interruptor (cabecera) y la capa (layout) sin
// contexto, y se guarda en sessionStorage para que sobreviva al cambio de idioma y de página. El servidor
// siempre dice "apagado", así que no hay diferencia de hidratación.
const KEY = "sunny";
let memory = false;
const listeners = new Set<() => void>();
const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => void listeners.delete(listener);
};
const read = () => {
  try {
    return sessionStorage.getItem(KEY) === "on";
  } catch {
    return false;
  }
};
function write(on: boolean) {
  try {
    sessionStorage.setItem(KEY, on ? "on" : "off");
  } catch {
    // Sin almacenamiento (ventana privada): el interruptor sigue funcionando hasta recargar.
    memory = on;
  }
  listeners.forEach((listener) => listener());
}
const snapshot = () => read() || memory;
export const useSunny = () => useSyncExternalStore(subscribe, snapshot, () => false);

// `labelFromSm`: en pantallas angostas la etiqueta queda solo para lectores de pantalla, para que la cabecera de los
// casos de estudio (marca, nombre, interruptor e idioma) quepa en una fila.
export function SunnySwitch({ label, labelFromSm = false }: { label: string; labelFromSm?: boolean }) {
  const on = useSunny();
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={() => write(!on)}
      className="-my-2 flex items-center gap-2 py-2 text-muted transition-colors hover:text-ink"
    >
      <span className={`font-mono text-xs ${labelFromSm ? "sr-only sm:not-sr-only" : ""}`}>{label}</span>
      <span
        aria-hidden="true"
        className={`relative h-4 w-7 rounded-full border transition-colors ${on ? "border-accent bg-accent" : "border-muted/60"}`}
      >
        <span
          className={`absolute left-0.5 top-0.5 size-2.5 rounded-full transition-transform ${on ? "translate-x-3 bg-paper" : "bg-muted"}`}
        />
      </span>
    </button>
  );
}

export function SunnyLayer() {
  const on = useSunny();
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = video.current;
    if (!el) return;
    document.documentElement.toggleAttribute("data-sunny", on);
    if (on) {
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        // Con movimiento reducido el video no se anima: se carga y queda quieto en su primer fotograma.
        el.preload = "auto";
        el.load();
      } else {
        el.play().catch(() => {});
      }
      return;
    }
    // Apagado: se deja terminar el fundido y luego se pausa, para no pagar la mezcla sobre toda la página.
    const timer = window.setTimeout(() => el.pause(), FADE_MS);
    return () => window.clearTimeout(timer);
  }, [on]);

  useEffect(() => () => document.documentElement.removeAttribute("data-sunny"), []);

  return (
    <video
      ref={video}
      src={SUNNY_VIDEO}
      className="sunny-layer"
      data-on={on}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
