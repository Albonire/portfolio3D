"use client";

import { useState } from "react";
import type { CircuitFigure } from "@/content/types";
import { KNOT_THREAD, between, hash, knotPath, mulberry32, segPath, stitchLine, type Seg } from "@/lib/thread";
import { useSunny } from "./Sunny";
import Thread from "./Thread";

// Sumador completo: dos medios sumadores (XOR + AND) y una OR para el acarreo, el mismo circuito
// de las capturas de CircuitBreve. Los cables toman el color del valor que llevan.
type Bit = 0 | 1;

const W = 680;
const H = 280;

const ROWS: [Bit, Bit, Bit][] = [0, 1].flatMap((a) => [0, 1].flatMap((b) => [0, 1].map((c) => [a, b, c] as [Bit, Bit, Bit])));

function evaluate(a: Bit, b: Bit, c: Bit) {
  const x1 = (a ^ b) as Bit;
  const a1 = (a & b) as Bit;
  const sum = (x1 ^ c) as Bit;
  const a2 = (x1 & c) as Bit;
  const cout = (a1 | a2) as Bit;
  return { x1, a1, a2, sum, cout };
}

// Modo Sol: el sumador se borda. Los cables son hilo (pespunte azul si llevan un 1, hilván suelto y gris si llevan un
// 0), con puntadas enteras en cada tramo recto; los empalmes son nudos franceses, las compuertas parches de fieltro
// con la orilla en festón y las entradas y salidas, etiquetas cosidas.
type Sewn = { sunny: boolean };

// Los cables solo usan M, H y V: se parten en tramos rectos para que ninguna puntada doble una esquina.
function wireSegs(d: string): Seg[] {
  const out: Seg[] = [];
  let x = 0;
  let y = 0;
  for (const [, cmd, a, b] of d.matchAll(/([MHV])\s*([\d.]+)(?:\s+([\d.]+))?/g)) {
    if (cmd === "M") [x, y] = [Number(a), Number(b)];
    else if (cmd === "H") out.push([x, y, (x = Number(a)), y]);
    else out.push([x, y, x, (y = Number(a))]);
  }
  return out;
}
const sewWire = (d: string, on: boolean) =>
  segPath(
    wireSegs(d).flatMap(([x1, y1, x2, y2], i) =>
      stitchLine(x1, y1, x2, y2, on ? { length: 9, gap: 3.5, wobble: 0.3, seed: i } : { length: 5.2, gap: 6.2, wobble: 0.3, seed: i }),
    ),
  );

// Hilván por dentro del borde de una caja.
function boxStitches(x: number, y: number, w: number, h: number, inset: number, seed: number) {
  const [l, t, r, b] = [x + inset, y + inset, x + w - inset, y + h - inset];
  const opts = { length: 5, gap: 3.7, wobble: 0.2, seed };
  return segPath([...stitchLine(l, t, r, t, opts), ...stitchLine(r, t, r, b, opts), ...stitchLine(r, b, l, b, opts), ...stitchLine(l, b, l, t, opts)]);
}

// Festón alrededor de una caja: la orilla y los dientes hacia dentro, con uno en diagonal en cada esquina.
function blanketBox(x: number, y: number, w: number, h: number, seed: number) {
  const rand = mulberry32(seed);
  const tooth = 4.3;
  const teeth: Seg[] = [];
  const along = (from: number, to: number, place: (t: number, depth: number) => Seg) => {
    const count = Math.round((to - from) / 6.6);
    for (let i = 1; i < count; i++) teeth.push(place(from + ((to - from) * i) / count + between(rand, -0.4, 0.4), tooth + between(rand, -0.5, 0.5)));
  };
  along(x, x + w, (t, d) => [t, y, t + 0.3, y + d]);
  along(y, y + h, (t, d) => [x + w, t, x + w - d, t + 0.3]);
  along(x, x + w, (t, d) => [t, y + h, t - 0.3, y + h - d]);
  along(y, y + h, (t, d) => [x, t, x + d, t - 0.3]);
  for (const [cx, cy, sx, sy] of [[x, y, 1, 1], [x + w, y, -1, 1], [x + w, y + h, -1, -1], [x, y + h, 1, -1]]) {
    teeth.push([cx + sx * 0.6, cy + sy * 0.6, cx + sx * 3.6, cy + sy * 3.6]);
  }
  const base = `M${x + 3} ${y}H${x + w - 3}Q${x + w} ${y} ${x + w} ${y + 3}V${y + h - 3}Q${x + w} ${y + h} ${x + w - 3} ${y + h}H${x + 3}Q${x} ${y + h} ${x} ${y + h - 3}V${y + 3}Q${x} ${y} ${x + 3} ${y}`;
  return { base, teeth: segPath(teeth) };
}

function Wire({ d, on, sunny }: { d: string; on: boolean } & Sewn) {
  return (
    <>
      <path
        d={d}
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={on ? 2.5 : 1.5}
        className={`tx-sol-hide ${on ? "stroke-accent" : "stroke-muted opacity-40"}`}
        style={{ transition: "stroke 150ms, stroke-width 150ms, opacity 150ms" }}
      />
      {sunny && <Thread className={`tx-sol-only ${on ? "" : "opacity-60"}`} d={sewWire(d, on)} tone={on ? "navy" : "slate"} w={on ? 2.5 : 1.6} shadow={on ? 0.3 : 0.18} />}
    </>
  );
}

function Dot({ cx, cy, on, sunny }: { cx: number; cy: number; on: boolean } & Sewn) {
  return (
    <>
      <circle cx={cx} cy={cy} r={3.5} className={`tx-sol-hide ${on ? "fill-accent" : "fill-muted opacity-40"}`} />
      {sunny && <Thread className="tx-sol-only" d={knotPath(cx, cy, 4, hash(cx, cy) * 6.28)} tone={on ? "navy" : "slate"} w={4 * KNOT_THREAD} shadow={0.34} />}
    </>
  );
}

function Gate({ x, y, label, on, sunny }: { x: number; y: number; label: string; on: boolean } & Sewn) {
  const edge = sunny ? blanketBox(x, y, 70, 44, x + y) : null;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={70}
        height={44}
        rx={3}
        className={`tx-gate fill-paper ${on ? "stroke-accent" : "stroke-muted"}`}
        strokeWidth={on ? 2 : 1.25}
        style={{ transition: "stroke 150ms" }}
      />
      {edge && (
        <g className="tx-sol-only">
          <Thread d={edge.teeth} tone={on ? "navy" : "slate"} w={1.3} shadow={0.22} />
          <Thread d={edge.base} tone={on ? "navy" : "slate"} w={1.4} />
        </g>
      )}
      <text x={x + 35} y={y + 27} textAnchor="middle" className="fill-ink font-mono" fontSize="13">
        {label}
      </text>
    </g>
  );
}

// Entrada o salida: con un 1 es una etiqueta azul cosida con hilo crudo; con un 0, un recuadro en hilván gris.
function IoStitches({ x, y, on }: { x: number; y: number; on: boolean }) {
  return on ? (
    <Thread className="tx-sol-only" d={boxStitches(x, y, 72, 34, 3.4, y)} tone="cream" w={1.15} shadow={0.3} sheen={0} />
  ) : (
    <Thread className="tx-sol-only tx-io-off" d={boxStitches(x, y, 72, 34, 0.8, y)} tone="slate" w={1.35} shadow={0.22} />
  );
}

export default function CircuitToy({ figure }: { figure: CircuitFigure }) {
  const sunny = useSunny();
  const [bits, setBits] = useState<[Bit, Bit, Bit]>([1, 1, 0]);
  const [a, b, c] = bits;
  const v = evaluate(a, b, c);
  const [nameA, nameB, nameC] = figure.inputLabels;
  const [nameSum, nameCout] = figure.outputLabels;

  const toggle = (index: number) =>
    setBits((prev) => {
      const next = [...prev] as [Bit, Bit, Bit];
      next[index] = (1 - next[index]) as Bit;
      return next;
    });

  const inputs = [
    { name: nameA, value: a, cy: 48 },
    { name: nameB, value: b, cy: 124 },
    { name: nameC, value: c, cy: 236 },
  ];
  const activeRow = ROWS.findIndex((r) => r[0] === a && r[1] === b && r[2] === c);

  return (
    <figure className="my-8">
      <p className="text-sm text-muted">{figure.hint}</p>
      <div className="mt-3 grid gap-6 lg:grid-cols-[minmax(0,1fr)_12.5rem]">
        <div className="overflow-x-auto">
          <svg viewBox={`0 0 ${W} ${H}`} role="group" aria-label={figure.label} className="h-auto w-full min-w-[30rem]">
            {/* cables */}
            <Wire sunny={sunny} on={a === 1} d="M80 48 H160 M112 48 V130 H160" />
            <Wire sunny={sunny} on={b === 1} d="M80 124 H96 V68 H160 M96 124 V150 H160" />
            <Wire sunny={sunny} on={v.x1 === 1} d="M230 58 H280 V170 H340 M280 70 H340" />
            <Wire sunny={sunny} on={v.a1 === 1} d="M230 140 H460 V148 H500" />
            <Wire sunny={sunny} on={c === 1} d="M80 236 H310 V90 H340 M310 190 H340" />
            <Wire sunny={sunny} on={v.a2 === 1} d="M410 180 H460 V172 H500" />
            <Wire sunny={sunny} on={v.sum === 1} d="M410 80 H600" />
            <Wire sunny={sunny} on={v.cout === 1} d="M570 160 H600" />
            <Dot sunny={sunny} cx={112} cy={48} on={a === 1} />
            <Dot sunny={sunny} cx={96} cy={124} on={b === 1} />
            <Dot sunny={sunny} cx={280} cy={70} on={v.x1 === 1} />
            <Dot sunny={sunny} cx={310} cy={190} on={c === 1} />

            {/* compuertas */}
            <Gate sunny={sunny} x={160} y={36} label="XOR" on={v.x1 === 1} />
            <Gate sunny={sunny} x={160} y={118} label="AND" on={v.a1 === 1} />
            <Gate sunny={sunny} x={340} y={58} label="XOR" on={v.sum === 1} />
            <Gate sunny={sunny} x={340} y={158} label="AND" on={v.a2 === 1} />
            <Gate sunny={sunny} x={500} y={138} label="OR" on={v.cout === 1} />

            {/* entradas: interruptores */}
            {inputs.map((input, index) => (
              <g
                key={input.name}
                role="switch"
                aria-checked={input.value === 1}
                aria-label={input.name}
                tabIndex={0}
                onClick={() => toggle(index)}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    toggle(index);
                  }
                }}
                className="cursor-pointer"
              >
                <rect
                  x={8}
                  y={input.cy - 17}
                  width={72}
                  height={34}
                  rx={3}
                  strokeWidth={1.5}
                  className={`tx-io ${input.value === 1 ? "fill-accent stroke-accent" : "fill-paper stroke-muted hover:stroke-accent"}`}
                  style={{ transition: "fill 150ms, stroke 150ms" }}
                />
                {sunny && <IoStitches x={8} y={input.cy - 17} on={input.value === 1} />}
                <text x={20} y={input.cy + 5} className={`font-mono ${input.value === 1 ? "fill-paper" : "fill-ink"}`} fontSize="14">
                  {input.name}
                </text>
                <text x={68} y={input.cy + 5} textAnchor="end" className={`font-mono ${input.value === 1 ? "fill-paper" : "fill-muted"}`} fontSize="14">
                  {input.value}
                </text>
              </g>
            ))}

            {/* salidas */}
            {[
              { name: nameSum, value: v.sum, cy: 80 },
              { name: nameCout, value: v.cout, cy: 160 },
            ].map((out) => (
              <g key={out.name}>
                <rect
                  x={600}
                  y={out.cy - 17}
                  width={72}
                  height={34}
                  rx={3}
                  strokeWidth={1.5}
                  className={`tx-io ${out.value === 1 ? "fill-accent stroke-accent" : "fill-paper stroke-muted"}`}
                  style={{ transition: "fill 150ms, stroke 150ms" }}
                />
                {sunny && <IoStitches x={600} y={out.cy - 17} on={out.value === 1} />}
                <text x={612} y={out.cy + 5} className={`font-mono ${out.value === 1 ? "fill-paper" : "fill-ink"}`} fontSize="14">
                  {out.name}
                </text>
                <text x={662} y={out.cy + 5} textAnchor="end" className={`font-mono ${out.value === 1 ? "fill-paper" : "fill-muted"}`} fontSize="14">
                  {out.value}
                </text>
              </g>
            ))}
          </svg>
          <p className="mt-2 font-mono text-sm text-ink" aria-live="polite">
            {a} + {b} + {c} = {v.cout}
            {v.sum} <span className="text-muted">({figure.summary})</span>
          </p>
        </div>

        <table className="h-fit w-full border-collapse text-left font-mono text-xs">
          <caption className="pb-2 text-left font-sans text-sm text-muted">{figure.tableLabel}</caption>
          <thead>
            <tr className="tx-seam-b tx-ink border-b border-ink text-ink">
              {[nameA, nameB, nameC, nameSum, nameCout].map((h) => (
                <th key={h} scope="col" className="py-1.5 pr-2 font-normal">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((row, index) => {
              const out = evaluate(row[0], row[1], row[2]);
              const isActive = index === activeRow;
              return (
                <tr
                  key={row.join("")}
                  aria-current={isActive ? "true" : undefined}
                  className={`tx-seam-b tx-fine border-b border-rule transition-colors ${isActive ? "bg-wash text-ink" : "text-muted"}`}
                >
                  {[...row, out.sum, out.cout].map((bit, i) => (
                    <td key={i} className={`py-1.5 pr-2 ${isActive ? "font-medium" : ""}`}>
                      {bit}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <figcaption className="mt-3 max-w-3xl text-sm text-muted">{figure.caption}</figcaption>
    </figure>
  );
}
