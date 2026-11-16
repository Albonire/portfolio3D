import { layerColor, threadLayers, type Tone } from "@/lib/thread";

type Props = { d: string; tone: Tone; w: number; shadow?: number; sheen?: number; dash?: string; className?: string };

// Un trazo bordado: el mismo camino dibujado en las cuatro capas del hilo (sombra, borde, cuerpo y brillo; ver
// lib/thread.ts). `dash` reparte el camino en puntadas cuando no se dan una por una.
export default function Thread({ d, tone, w, shadow, sheen, dash, className }: Props) {
  if (!d) return null;
  return (
    <g className={className} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeDasharray={dash}>
      {threadLayers(w, { shadow, sheen }).map((layer) => (
        <path
          key={layer.key}
          data-layer={layer.key}
          d={d}
          transform={layer.dx || layer.dy ? `translate(${layer.dx} ${layer.dy})` : undefined}
          stroke={layerColor(tone, layer.key)}
          strokeOpacity={layer.opacity < 1 ? layer.opacity : undefined}
          strokeWidth={layer.width}
        />
      ))}
    </g>
  );
}
