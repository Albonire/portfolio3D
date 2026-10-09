"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { LabContent } from "@/content/types";

const STEP_MS = 320;

// Simulación del flujo de una petición en Control Vehicular. Cada escenario y cada paso salen de
// content/es.ts y content/en.ts, que a su vez se verificaron contra el código y las pruebas.
export default function RequestLab({ lab, caseHref }: { lab: LabContent; caseHref: string }) {
  const total = lab.steps.length;
  const [selected, setSelected] = useState(0);
  // Al cargar se ve el resultado completo del primer escenario (también sin JavaScript).
  const [revealed, setRevealed] = useState(total);
  const timers = useRef<number[]>([]);

  useEffect(() => {
    const pending = timers.current;
    return () => pending.forEach((id) => window.clearTimeout(id));
  }, []);

  function run(index: number) {
    timers.current.forEach((id) => window.clearTimeout(id));
    timers.current = [];
    setSelected(index);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(total);
      return;
    }
    setRevealed(0);
    for (let step = 1; step <= total; step++) {
      timers.current.push(window.setTimeout(() => setRevealed(step), step * STEP_MS));
    }
  }

  const scenario = lab.scenarios[selected];
  const done = revealed >= total;
  const rejected = scenario.states.includes("stop");

  return (
    <section aria-labelledby="lab-title" className="border border-rule p-5">
      <h2 id="lab-title" className="font-serif text-lg font-medium text-ink">
        {lab.title}
      </h2>
      <p className="mt-1 text-xs leading-relaxed text-muted">{lab.note}</p>

      <div role="group" aria-label={lab.scenariosLabel} className="mt-4 grid grid-cols-2 gap-2">
        {lab.scenarios.map((item, index) => (
          <button
            key={item.id}
            type="button"
            aria-pressed={index === selected}
            onClick={() => run(index)}
            className={`rounded-sm border px-3 py-2 text-left text-sm transition-colors ${
              index === selected
                ? "border-accent bg-accent text-paper"
                : "border-rule text-ink hover:border-accent"
            }`}
          >
            {item.label}
          </button>
        ))}
      </div>

      <p className="mt-4 font-mono text-xs text-muted">{lab.requestLabel}</p>
      <p className="font-mono text-sm text-ink">{scenario.request}</p>

      <ol className="mt-3 border-y border-rule">
        {lab.steps.map((step, index) => {
          const state = scenario.states[index];
          const shown = index < revealed;
          const note = shown && scenario.notes[index] ? scenario.notes[index] : step.detail;
          const tone = !shown ? "text-muted" : state === "ok" ? "text-accent" : state === "stop" ? "text-stop" : "text-muted";
          return (
            <li
              key={step.title}
              className={`grid min-h-[4.25rem] grid-cols-[1.25rem_minmax(0,1fr)_auto] gap-x-2 border-b border-rule py-2 transition-colors last:border-b-0 ${
                shown && state === "stop" ? "bg-wash" : ""
              }`}
            >
              <span className="pt-0.5 font-mono text-xs text-muted">{index + 1}</span>
              <div>
                <p className={`text-sm font-medium ${shown && state === "skip" ? "text-muted" : "text-ink"}`}>{step.title}</p>
                <p className="text-xs leading-snug text-muted">{note}</p>
              </div>
              <span className={`pt-0.5 font-mono text-xs transition-colors ${tone}`}>{shown ? lab.stateLabels[state] : ""}</span>
            </li>
          );
        })}
      </ol>

      <div aria-live="polite" className="mt-4 min-h-[4.75rem]">
        {done && (
          <>
            <p className="font-mono text-xs text-muted">{lab.resultLabel}</p>
            <div className="mt-1 grid grid-cols-[auto_minmax(0,1fr)] items-baseline gap-x-4">
              <p className={`font-mono text-2xl ${rejected ? "text-stop" : "text-accent"}`}>{scenario.result.code}</p>
              <p className="text-sm leading-snug text-body">{scenario.result.text}</p>
            </div>
          </>
        )}
      </div>

      <p className="mt-3 text-xs leading-relaxed text-muted">{lab.sourceNote}</p>
      <p className="mt-2 text-sm">
        <Link
          href={caseHref}
          className="text-accent underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent"
        >
          {lab.caseLabel}
        </Link>
      </p>
    </section>
  );
}
