"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";

// EXPERIMENTO. El video es de dany.works (https://dany.works/): sombras de hojas, 720x1280, 12 s, sin audio.
// Se enlaza desde su sitio y no se copia al repositorio. Para publicar el sitio hay que cambiarlo por un
// archivo propio o tener permiso de su autor: aquí solo se prueba cómo quedaría.
const SUNNY_VIDEO = "https://dany.works/leaves.mp4";
const FADE_MS = 700;

// Sonido ambiente del modo Sol: bosque de cigarras (higurashi) de Japón, un archivo de loop con fundido cruzado ya hecho
// (public/audio/cigarras.mp3, recodificado desde el original que aportó el dueño del sitio; confirmar su licencia antes de
// publicar). Se reproduce con Web Audio y no con <audio loop>: un buffer en bucle repite sin el hueco que deja el
// relleno del mp3. Se descarga al encender el modo por primera vez.
const SUNNY_AUDIO = "/audio/cigarras.mp3";
const AUDIO_FADE_S = 1.5;
const AUDIO_LEVEL = 0.6;

type Ambient = { ctx: AudioContext; gain: GainNode; source: AudioBufferSourceNode };
let ambientPromise: Promise<Ambient | null> | null = null;

function loadAmbient(): Promise<Ambient | null> {
  ambientPromise ??= (async () => {
    try {
      const ctx = new AudioContext();
      const gain = ctx.createGain();
      gain.gain.value = 0;
      gain.connect(ctx.destination);
      const response = await fetch(SUNNY_AUDIO);
      const buffer = await ctx.decodeAudioData(await response.arrayBuffer());
      const source = ctx.createBufferSource();
      source.buffer = buffer;
      source.loop = true;
      source.connect(gain);
      source.start();
      return { ctx, gain, source };
    } catch {
      return null;
    }
  })();
  return ambientPromise;
}

function fadeAmbient(a: Ambient, to: number) {
  const now = a.ctx.currentTime;
  a.gain.gain.cancelScheduledValues(now);
  a.gain.gain.setValueAtTime(a.gain.gain.value, now);
  a.gain.gain.linearRampToValueAtTime(to, now + AUDIO_FADE_S);
}

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

  // Audio: encendido, fundido de entrada; apagado, fundido de salida y se suspende. Si el navegador no deja sonar sin un
  // gesto (al cambiar de página con el modo ya encendido), se reanuda con el primer toque o tecla.
  useEffect(() => {
    let cancelled = false;
    let stop = () => {};
    if (on) {
      void loadAmbient().then(async (ambient) => {
        if (!ambient || cancelled) return;
        const start = () => {
          void ambient.ctx.resume().then(() => !cancelled && fadeAmbient(ambient, AUDIO_LEVEL));
        };
        start();
        if (ambient.ctx.state !== "running") {
          const events = ["pointerdown", "keydown"] as const;
          const retry = () => {
            events.forEach((e) => window.removeEventListener(e, retry));
            start();
          };
          events.forEach((e) => window.addEventListener(e, retry, { once: true }));
          stop = () => events.forEach((e) => window.removeEventListener(e, retry));
        }
      });
    } else if (ambientPromise) {
      void ambientPromise.then((ambient) => {
        if (!ambient || cancelled) return;
        fadeAmbient(ambient, 0);
        window.setTimeout(() => !cancelled && void ambient.ctx.suspend(), AUDIO_FADE_S * 1000 + 100);
      });
    }
    return () => {
      cancelled = true;
      stop();
    };
  }, [on]);

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
