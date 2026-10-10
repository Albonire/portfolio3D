"use client";

import { useState } from "react";
import type { CircuitFigure } from "@/content/types";

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

function Wire({ d, on }: { d: string; on: boolean }) {
  return (
    <path
      d={d}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={on ? 2.5 : 1.5}
      className={on ? "stroke-accent" : "stroke-muted opacity-40"}
      style={{ transition: "stroke 150ms, stroke-width 150ms, opacity 150ms" }}
    />
  );
}

function Dot({ cx, cy, on }: { cx: number; cy: number; on: boolean }) {
  return <circle cx={cx} cy={cy} r={3.5} className={on ? "fill-accent" : "fill-muted opacity-40"} />;
}

function Gate({ x, y, label, on }: { x: number; y: number; label: string; on: boolean }) {
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={70}
        height={44}
        rx={3}
        className={`fill-paper ${on ? "stroke-accent" : "stroke-muted"}`}
        strokeWidth={on ? 2 : 1.25}
        style={{ transition: "stroke 150ms" }}
      />
      <text x={x + 35} y={y + 27} textAnchor="middle" className="fill-ink font-mono" fontSize="13">
        {label}
      </text>
    </g>
  );
}

export default function CircuitToy({ figure }: { figure: CircuitFigure }) {
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
            <Wire on={a === 1} d="M80 48 H160 M112 48 V130 H160" />
            <Wire on={b === 1} d="M80 124 H96 V68 H160 M96 124 V150 H160" />
            <Wire on={v.x1 === 1} d="M230 58 H280 V170 H340 M280 70 H340" />
            <Wire on={v.a1 === 1} d="M230 140 H460 V148 H500" />
            <Wire on={c === 1} d="M80 236 H310 V90 H340 M310 190 H340" />
            <Wire on={v.a2 === 1} d="M410 180 H460 V172 H500" />
            <Wire on={v.sum === 1} d="M410 80 H600" />
            <Wire on={v.cout === 1} d="M570 160 H600" />
            <Dot cx={112} cy={48} on={a === 1} />
            <Dot cx={96} cy={124} on={b === 1} />
            <Dot cx={280} cy={70} on={v.x1 === 1} />
            <Dot cx={310} cy={190} on={c === 1} />

            {/* compuertas */}
            <Gate x={160} y={36} label="XOR" on={v.x1 === 1} />
            <Gate x={160} y={118} label="AND" on={v.a1 === 1} />
            <Gate x={340} y={58} label="XOR" on={v.sum === 1} />
            <Gate x={340} y={158} label="AND" on={v.a2 === 1} />
            <Gate x={500} y={138} label="OR" on={v.cout === 1} />

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
                  className={input.value === 1 ? "fill-accent stroke-accent" : "fill-paper stroke-muted hover:stroke-accent"}
                  style={{ transition: "fill 150ms, stroke 150ms" }}
                />
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
                  className={out.value === 1 ? "fill-accent stroke-accent" : "fill-paper stroke-muted"}
                  style={{ transition: "fill 150ms, stroke 150ms" }}
                />
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
            <tr className="border-b border-ink text-ink">
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
                  className={`border-b border-rule transition-colors ${isActive ? "bg-wash text-ink" : "text-muted"}`}
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
