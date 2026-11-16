"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { ChartFigure } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { KNOT_THREAD, crossSegs, hash, holesPath, knotPath, segPath, starSegs, stitchLine, HOLE, type Seg } from "@/lib/thread";
import { useSunny } from "./Sunny";
import Thread from "./Thread";

// Gráfica de una sola serie, dibujada a mano en SVG: 2 px de línea, marcadores con anillo del color
// de la superficie, cuadrícula fina y sin etiquetar cada punto. Los hitos de tandas posteriores van con
// línea punteada porque salen de otras corridas del mismo banco.
// `compact` es la versión de la portada: más angosta, sin la nota del hundimiento dentro del dibujo
// (la dice el texto de al lado), sin pie de figura y sin tabla (están en el caso de estudio).
const SIZES = {
  full: { W: 600, H: 300, M: { left: 44, right: 20, top: 28, bottom: 58 }, font: 12 },
  compact: { W: 400, H: 258, M: { left: 40, right: 16, top: 30, bottom: 62 }, font: 15 },
};
const TICKS = [0, 25, 50, 75, 100];

// Modo Sol: la gráfica se borda con el hilo de lib/thread.ts.
//   Rejilla    hilván fino en lino.
//   Línea      pespunte azul; cada tramo lleva puntadas enteras, de una medición a la siguiente. Las tandas posteriores
//              van en hilván suelto.
//   Mediciones nudos franceses (el de la caída, en rojo). La elegida lleva alrededor una estrella de puntadas.
//   Relleno    punto de cruz sobre una cuadrícula de CELL unidades, con cruces enteras: ninguna queda cortada por la
//              curva, que se resuelve en escalera como en un bordado real. Se sombrea como lo haría una bordadora, con
//              madejas cada vez más claras al alejarse de la línea (dos azules), luego medias puntadas y al final
//              puntadas sueltas. La semilla de cada puntada sale de su celda: el dibujo no cambia entre visitas.
const CELL = 8;
const LINE_W = 2.3;
type Box = { x: number; y: number; width: number; height: number };
type Fill = { denim: [string, string]; sky: [string, string]; loose: string };

function stitchFill(curve: [number, number][], base: number, cuts: Box[]): Fill {
  const shade = { denim: { under: [] as Seg[], over: [] as Seg[] }, sky: { under: [] as Seg[], over: [] as Seg[] } };
  const loose: Seg[] = [];
  const [x0] = curve[0];
  const xEnd = curve[curve.length - 1][0];
  const curveY = (px: number) => {
    const i = Math.min(curve.findIndex(([cx]) => cx >= px), curve.length - 1);
    if (i <= 0) return curve[0][1];
    const [ax, ay] = curve[i - 1];
    const [bx, by] = curve[i];
    return ay + ((px - ax) / (bx - ax)) * (by - ay);
  };
  for (let left = x0 + 1; left + CELL <= xEnd; left += CELL) {
    const right = left + CELL;
    // El punto más bajo de la curva dentro de la columna: la celda entera tiene que quedar por debajo, con aire.
    const lowest = Math.max(curveY(left), curveY(right), ...curve.filter(([cx]) => cx > left && cx < right).map(([, cy]) => cy));
    const rows = Math.floor((base - lowest - 4.5) / CELL);
    for (let row = rows - 1; row >= 0; row--) {
      const depth = rows - 1 - row;
      const top = base - (row + 1) * CELL;
      if (cuts.some((c) => left < c.x + c.width && right > c.x && top < c.y + c.height && top + CELL > c.y)) continue;
      // Dos razones para saltarse una celda: está lejos de la línea, o está pegada al eje (ahí siempre va ralo).
      const seed = hash(left, row);
      if (depth >= 6 && seed > 0.64 - (depth - 6) * 0.085) continue;
      if (row < 3 && seed > 0.2 + row * 0.22) continue;
      const { under, over } = crossSegs(left, top, CELL, 1.5);
      if (depth < 6 && row >= 3) {
        const tone = depth < 3 ? "denim" : "sky";
        shade[tone].under.push(under);
        shade[tone].over.push(over);
      } else loose.push(under);
    }
  }
  return {
    denim: [segPath(shade.denim.under), segPath(shade.denim.over)],
    sky: [segPath(shade.sky.under), segPath(shade.sky.over)],
    loose: segPath(loose),
  };
}

type Props = { figure: ChartFigure; lang: Locale; compact?: boolean };

export default function AccuracyChart({ figure, lang, compact = false }: Props) {
  const { W, H, M, font } = SIZES[compact ? "compact" : "full"];
  const PLOT_W = W - M.left - M.right;
  const PLOT_H = H - M.top - M.bottom;
  const { points } = figure;
  const last = points.length - 1;
  const [active, setActive] = useState(figure.focus);
  const svgRef = useRef<SVGSVGElement>(null);
  const sunny = useSunny();
  const [cuts, setCuts] = useState<Box[] | null>(null);

  const x = (i: number) => M.left + (i * PLOT_W) / last;
  const y = (v: number) => M.top + (1 - v / 100) * PLOT_H;
  const step = PLOT_W / last;
  const fmt = (v: number) => {
    const n = new Intl.NumberFormat(lang === "es" ? "es-CO" : "en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(v);
    return lang === "es" ? `${n} %` : `${n}%`;
  };

  // El relleno bordado deja libre el sitio de cada etiqueta marcada con data-cut: se mide el texto real (y otra vez
  // cuando termina de cargar la fuente) y las celdas que lo tocan no se bordan.
  useEffect(() => {
    if (!sunny) return;
    let cancelled = false;
    const measure = () => {
      if (cancelled || !svgRef.current) return;
      const boxes = Array.from(svgRef.current.querySelectorAll<SVGGraphicsElement>("[data-cut]"), (el) => {
        const box = el.getBBox();
        return { x: box.x - 4, y: box.y - 2, width: box.width + 8, height: box.height + 4 };
      });
      setCuts(boxes);
    };
    measure();
    void document.fonts?.ready.then(measure);
    return () => {
      cancelled = true;
    };
  }, [sunny, lang, compact]);

  const fill = useMemo(() => {
    if (!sunny || !cuts) return null;
    const curve = points.map((p, i): [number, number] => [M.left + (i * PLOT_W) / last, M.top + (1 - p.value / 100) * PLOT_H]);
    return stitchFill(curve, M.top + PLOT_H, cuts);
  }, [sunny, cuts, points, last, M, PLOT_W, PLOT_H]);

  // Lo que no depende del punto elegido: rejilla, línea y corchete de las tandas posteriores.
  const sewn = useMemo(() => {
    if (!sunny) return null;
    const px = (i: number) => M.left + (i * PLOT_W) / last;
    const py = (v: number) => M.top + (1 - v / 100) * PLOT_H;
    const grid = TICKS.flatMap((t) => stitchLine(M.left, py(t), W - M.right, py(t), { length: 5.6, gap: 4.4, wobble: 0.3, seed: t }));
    const back: Seg[] = [];
    const running: Seg[] = [];
    points.slice(1).forEach((p, k) => {
      const i = k + 1;
      const [ax, ay, bx, by] = [px(i - 1), py(points[i - 1].value), px(i), py(p.value)];
      if (p.phase === "later") running.push(...stitchLine(ax, ay, bx, by, { length: 5.4, gap: 6, wobble: 0.3, seed: i }));
      else back.push(...stitchLine(ax, ay, bx, by, { length: 8.6, gap: LINE_W + 0.7, wobble: 0.28, seed: i }));
    });
    const later = points.findIndex((p) => p.phase === "later");
    const bracket: Seg[] = [];
    if (later > 0) {
      const [bx0, bx1, by0] = [px(later) - 6, px(last) + 6, H - M.bottom + 28];
      bracket.push([bx0, by0, bx0, by0 + 6], ...stitchLine(bx0, by0 + 6, bx1, by0 + 6, { length: 6, gap: 3.2, wobble: 0.2, seed: 5 }), [bx1, by0 + 6, bx1, by0]);
    }
    return { grid, back: segPath(back), running: segPath(running), holes: holesPath([...back, ...running], LINE_W), bracket: segPath(bracket) };
  }, [sunny, points, last, M, PLOT_W, PLOT_H, W, H]);
  // La rejilla tampoco pasa por detrás de las etiquetas: se quitan las puntadas que las tocan.
  const gridPath = useMemo(() => {
    if (!sewn) return "";
    const clear = ([x1, y1, x2]: Seg) => !cuts?.some((c) => x2 > c.x && x1 < c.x + c.width && y1 > c.y - 1 && y1 < c.y + c.height + 1);
    return segPath(sewn.grid.filter(clear));
  }, [sewn, cuts]);

  const firstLater = points.findIndex((p) => p.phase === "later");
  const dipIndex = points.reduce((min, p, i) => (p.value < points[min].value ? i : min), 0);
  const current = points[active];

  function onKeyDown(event: React.KeyboardEvent) {
    const keys: Record<string, number> = {
      ArrowRight: Math.min(active + 1, last),
      ArrowLeft: Math.max(active - 1, 0),
      Home: 0,
      End: last,
    };
    if (event.key in keys) {
      event.preventDefault();
      setActive(keys[event.key]);
    }
  }

  return (
    <figure className={compact ? "mt-4" : "my-8"}>
      <div className={compact ? undefined : "overflow-x-auto"}>
        <div
          role="group"
          tabIndex={0}
          aria-label={`${figure.label}. ${figure.keysHint}`}
          onKeyDown={onKeyDown}
          className={compact ? "w-full" : "min-w-[26rem] max-w-3xl"}
        >
          <div className="relative">
            <svg ref={svgRef} viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full select-none" aria-hidden="true">
              {sewn && <Thread className="tx-sol-only" d={gridPath} tone="linen" w={1.2} shadow={0.2} sheen={0.5} />}
              {fill && (
                <g className="tx-sol-only">
                  <Thread d={fill.loose} tone="sky" w={1.3} shadow={0.18} sheen={0.4} />
                  <Thread d={fill.sky[0]} tone="sky" w={1.5} shadow={0.2} sheen={0.35} />
                  <Thread d={fill.denim[0]} tone="denim" w={1.5} shadow={0.2} sheen={0.35} />
                  <Thread d={fill.sky[1]} tone="sky" w={1.5} />
                  <Thread d={fill.denim[1]} tone="denim" w={1.5} />
                </g>
              )}

              <text x={M.left} y={14} className="fill-muted font-mono" fontSize={font}>
                {figure.yLabel}
              </text>

              {TICKS.map((t) => (
                <g key={t}>
                  <line x1={M.left} x2={W - M.right} y1={y(t)} y2={y(t)} className="tx-sol-hide stroke-rule" strokeWidth="1" />
                  <text x={M.left - 8} y={y(t) + 4} textAnchor="end" className="fill-muted font-mono" fontSize={font}>
                    {t}
                  </text>
                </g>
              ))}

              {points.map((p, i) => (
                <text key={p.label} x={x(i)} y={H - M.bottom + 18} textAnchor="middle" className="fill-muted font-mono" fontSize={compact ? 13 : font}>
                  {i + 1}
                </text>
              ))}

              {firstLater > 0 && (
                <g>
                  <path
                    d={`M${x(firstLater) - 6} ${H - M.bottom + 28} v6 H${x(last) + 6} v-6`}
                    fill="none"
                    className="tx-sol-hide stroke-muted"
                    strokeWidth="1"
                  />
                  {sewn && <Thread className="tx-sol-only" d={sewn.bracket} tone="slate" w={1.25} shadow={0.2} />}
                  <text
                    x={compact ? x(last) + 6 : (x(firstLater) + x(last)) / 2}
                    y={H - M.bottom + 52}
                    textAnchor={compact ? "end" : "middle"}
                    className="fill-muted"
                    fontSize={font}
                  >
                    {figure.laterLabel}
                  </text>
                </g>
              )}

              <line x1={x(active)} x2={x(active)} y1={M.top} y2={M.top + PLOT_H} className="tx-sol-hide stroke-muted" strokeWidth="1" />
              {sunny && (
                <Thread
                  className="tx-sol-only"
                  d={segPath(stitchLine(x(active), M.top, x(active), M.top + PLOT_H, { length: 4.2, gap: 4.6, wobble: 0.2, seed: 9 }))}
                  tone="slate"
                  w={1.1}
                  shadow={0.16}
                  sheen={0.4}
                />
              )}

              {points.slice(1).map((p, k) => {
                const i = k + 1;
                return (
                  <line
                    key={p.label}
                    x1={x(i - 1)}
                    y1={y(points[i - 1].value)}
                    x2={x(i)}
                    y2={y(p.value)}
                    className="tx-sol-hide stroke-accent"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray={p.phase === "later" ? "5 5" : undefined}
                  />
                );
              })}

              {points.map((p, i) => (
                <circle
                  key={p.label}
                  cx={x(i)}
                  cy={y(p.value)}
                  r={i === active ? 7 : i === dipIndex ? 6 : 4.5}
                  className={`tx-sol-hide ${i === dipIndex ? "fill-stop" : "fill-accent"} stroke-paper`}
                  strokeWidth="2"
                />
              ))}

              {/* Modo Sol: la línea en pespunte y cada medición en un nudo francés. */}
              {sewn && (
                <g className="tx-sol-only">
                  <path d={sewn.holes} fill="none" stroke={HOLE} strokeOpacity="0.4" strokeWidth="1.1" strokeLinecap="round" />
                  <Thread d={sewn.back} tone="navy" w={LINE_W} />
                  <Thread d={sewn.running} tone="navy" w={LINE_W} />
                  {points.map((p, i) => {
                    const dip = i === dipIndex;
                    const r = (dip ? 4.6 : 3.5) + (i === active ? 1.3 : 0);
                    const tone = dip ? "red" : "navy";
                    return (
                      <g key={p.label}>
                        <circle cx={x(i)} cy={y(p.value)} r={r + 1.5} className="fill-paper" />
                        {i === active && <Thread d={segPath(starSegs(x(i), y(p.value), r + 2.6, r + 6.8, 8, i))} tone={tone} w={1.35} />}
                        <Thread d={knotPath(x(i), y(p.value), r, hash(i, 3) * 6.28)} tone={tone} w={r * KNOT_THREAD} shadow={0.36} />
                      </g>
                    );
                  })}
                </g>
              )}

              <text data-cut x={x(0)} y={y(points[0].value) + 24} textAnchor="start" className="tx-halo fill-ink font-mono" fontSize={font}>
                {fmt(points[0].value)}
              </text>
              <text data-cut x={x(last)} y={y(points[last].value) - 12} textAnchor="end" className="tx-halo fill-ink font-mono" fontSize={font}>
                {fmt(points[last].value)}
              </text>
              {compact ? (
                <text data-cut x={x(dipIndex) + 14} y={y(points[dipIndex].value) + 5} className="tx-halo fill-ink font-mono" fontSize={font}>
                  {fmt(points[dipIndex].value)}
                </text>
              ) : (
                <>
                  <text data-cut x={x(dipIndex) + 24} y={y(points[dipIndex].value) - 2} className="tx-halo fill-ink" fontSize={font}>
                    {figure.callout.title}
                  </text>
                  <text data-cut x={x(dipIndex) + 24} y={y(points[dipIndex].value) + 14} className="tx-halo fill-muted" fontSize={font}>
                    {figure.callout.text}
                  </text>
                </>
              )}

              {points.map((p, i) => (
                <rect
                  key={p.label}
                  x={x(i) - step / 2}
                  y={M.top}
                  width={step}
                  height={PLOT_H}
                  fill="transparent"
                  onPointerEnter={() => setActive(i)}
                  onPointerDown={() => setActive(i)}
                />
              ))}
            </svg>
          </div>
        </div>
      </div>

      <div aria-live="polite" className={`tx-seam-t tx-fine mt-3 min-h-[5.5rem] border-t border-rule pt-3 ${compact ? "" : "max-w-3xl"}`}>
        <p className="font-mono text-xs text-muted">
          {active + 1}/{points.length}
          {current.phase === "later" ? ` · ${figure.laterLabel}` : ""}
        </p>
        <p className="mt-0.5 text-ink">
          {current.label}: <span className="font-mono">{fmt(current.value)}</span>
        </p>
        <p className="text-sm text-body">{current.note}</p>
      </div>

      {!compact && (
        <>
          <details className="mt-3 max-w-3xl text-sm">
            <summary className="group cursor-pointer text-accent">
              <span className="underline decoration-rule underline-offset-4 group-hover:decoration-accent">{figure.dataLabel}</span>
            </summary>
            <table className="mt-3 w-full border-collapse text-left">
              <caption className="sr-only">{figure.label}</caption>
              <thead>
                <tr className="tx-seam-b tx-ink border-b border-ink">
                  <th scope="col" className="w-8 py-1.5 pr-3 font-mono text-xs font-normal text-muted">
                    #
                  </th>
                  <th scope="col" className="py-1.5 pr-3 font-medium text-ink">
                    {figure.yLabel}
                  </th>
                  <th scope="col" className="py-1.5 text-right font-medium text-ink">
                    %
                  </th>
                </tr>
              </thead>
              <tbody>
                {points.map((p, i) => (
                  <tr key={p.label} className="tx-seam-b tx-fine border-b border-rule align-top">
                    <td className="py-1.5 pr-3 font-mono text-xs text-muted">{i + 1}</td>
                    <td className="py-1.5 pr-3 text-body">{p.label}</td>
                    <td className="py-1.5 text-right font-mono text-ink">{fmt(p.value)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>

          <figcaption className="mt-3 max-w-3xl text-sm text-muted">{figure.caption}</figcaption>
        </>
      )}
    </figure>
  );
}
