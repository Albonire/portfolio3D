"use client";

import { useState } from "react";
import type { ChartFigure } from "@/content/types";
import type { Locale } from "@/lib/i18n";

// Gráfica de una sola serie, dibujada a mano en SVG: 2 px de línea, marcadores de 9 px con anillo del color
// de la superficie, cuadrícula fina y sin etiquetar cada punto. Los hitos de tandas posteriores van con
// línea punteada porque salen de otras corridas del mismo banco.
const W = 600;
const H = 300;
const M = { left: 44, right: 20, top: 28, bottom: 58 };
const PLOT_W = W - M.left - M.right;
const PLOT_H = H - M.top - M.bottom;
const TICKS = [0, 25, 50, 75, 100];

export default function AccuracyChart({ figure, lang }: { figure: ChartFigure; lang: Locale }) {
  const { points } = figure;
  const last = points.length - 1;
  const [active, setActive] = useState(figure.focus);

  const x = (i: number) => M.left + (i * PLOT_W) / last;
  const y = (v: number) => M.top + (1 - v / 100) * PLOT_H;
  const step = PLOT_W / last;
  const fmt = (v: number) => {
    const n = new Intl.NumberFormat(lang === "es" ? "es-CO" : "en-US", { minimumFractionDigits: 1, maximumFractionDigits: 1 }).format(v);
    return lang === "es" ? `${n} %` : `${n}%`;
  };

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
    <figure className="my-8">
      <div className="overflow-x-auto">
        <div
          role="group"
          tabIndex={0}
          aria-label={`${figure.label}. ${figure.keysHint}`}
          onKeyDown={onKeyDown}
          className="min-w-[26rem] max-w-3xl"
        >
          <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full select-none" aria-hidden="true">
            <text x={M.left} y={14} className="fill-muted font-mono" fontSize="12">
              {figure.yLabel}
            </text>

            {TICKS.map((t) => (
              <g key={t}>
                <line x1={M.left} x2={W - M.right} y1={y(t)} y2={y(t)} className="stroke-rule" strokeWidth="1" />
                <text x={M.left - 8} y={y(t) + 4} textAnchor="end" className="fill-muted font-mono" fontSize="12">
                  {t}
                </text>
              </g>
            ))}

            {points.map((p, i) => (
              <text key={p.label} x={x(i)} y={H - M.bottom + 18} textAnchor="middle" className="fill-muted font-mono" fontSize="12">
                {i + 1}
              </text>
            ))}

            {firstLater > 0 && (
              <g>
                <path
                  d={`M${x(firstLater) - 6} ${H - M.bottom + 28} v6 H${x(last) + 6} v-6`}
                  fill="none"
                  className="stroke-muted"
                  strokeWidth="1"
                />
                <text x={(x(firstLater) + x(last)) / 2} y={H - M.bottom + 50} textAnchor="middle" className="fill-muted" fontSize="12">
                  {figure.laterLabel}
                </text>
              </g>
            )}

            <line x1={x(active)} x2={x(active)} y1={M.top} y2={M.top + PLOT_H} className="stroke-muted" strokeWidth="1" />

            {points.slice(1).map((p, k) => {
              const i = k + 1;
              return (
                <line
                  key={p.label}
                  x1={x(i - 1)}
                  y1={y(points[i - 1].value)}
                  x2={x(i)}
                  y2={y(p.value)}
                  className="stroke-accent"
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
                className={`${i === dipIndex ? "fill-stop" : "fill-accent"} stroke-paper`}
                strokeWidth="2"
              />
            ))}

            <text x={x(0)} y={y(points[0].value) + 24} textAnchor="start" className="fill-ink font-mono" fontSize="12">
              {fmt(points[0].value)}
            </text>
            <text x={x(last)} y={y(points[last].value) - 12} textAnchor="end" className="fill-ink font-mono" fontSize="12">
              {fmt(points[last].value)}
            </text>
            <text x={x(dipIndex) + 24} y={y(points[dipIndex].value) - 2} className="fill-ink" fontSize="12">
              {figure.callout.title}
            </text>
            <text x={x(dipIndex) + 24} y={y(points[dipIndex].value) + 14} className="fill-muted" fontSize="12">
              {figure.callout.text}
            </text>

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

      <div aria-live="polite" className="mt-3 min-h-[5.5rem] max-w-3xl border-t border-rule pt-3">
        <p className="font-mono text-xs text-muted">
          {active + 1}/{points.length}
          {current.phase === "later" ? ` · ${figure.laterLabel}` : ""}
        </p>
        <p className="mt-0.5 text-ink">
          {current.label}: <span className="font-mono">{fmt(current.value)}</span>
        </p>
        <p className="text-sm text-body">{current.note}</p>
      </div>

      <details className="mt-3 max-w-3xl text-sm">
        <summary className="cursor-pointer text-accent underline decoration-rule underline-offset-4 hover:decoration-accent">
          {figure.dataLabel}
        </summary>
        <table className="mt-3 w-full border-collapse text-left">
          <caption className="sr-only">{figure.label}</caption>
          <thead>
            <tr className="border-b border-ink">
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
              <tr key={p.label} className="border-b border-rule align-top">
                <td className="py-1.5 pr-3 font-mono text-xs text-muted">{i + 1}</td>
                <td className="py-1.5 pr-3 text-body">{p.label}</td>
                <td className="py-1.5 text-right font-mono text-ink">{fmt(p.value)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>

      <figcaption className="mt-3 max-w-3xl text-sm text-muted">{figure.caption}</figcaption>
    </figure>
  );
}
