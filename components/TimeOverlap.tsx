"use client";

import { useId, useState, useSyncExternalStore } from "react";
import type { OverlapContent } from "@/content/types";
import type { Locale } from "@/lib/i18n";

// Pamplona está en America/Bogota: UTC-5 todo el año, sin horario de verano.
const HOME_ZONE = "America/Bogota";
const DAY = 1440;
const WORK_START = 9 * 60;
const WORK_END = 18 * 60;

type Interval = [number, number];

// El servidor no conoce la zona de quien visita, así que el HTML estático sale sin barras y se llenan
// al hidratar. useSyncExternalStore da null en el servidor y el valor real en el cliente, sin
// advertencias de hidratación.
const noSubscribe = () => () => {};

// Algunos navegadores devuelven el nombre antiguo de la zona; se pasan al nombre de la lista.
const ALIASES: Record<string, string> = {
  "Asia/Calcutta": "Asia/Kolkata",
  "America/Buenos_Aires": "America/Argentina/Buenos_Aires",
  "Etc/UTC": "UTC",
  "Etc/GMT": "UTC",
};
function detectZone() {
  const zone = Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
  return ALIASES[zone] ?? zone;
}

function useDetectedZone(): string | null {
  return useSyncExternalStore(noSubscribe, detectZone, () => null);
}

function subscribeMinute(onChange: () => void) {
  const id = window.setInterval(onChange, 15_000);
  return () => window.clearInterval(id);
}
function useMinute(): number | null {
  return useSyncExternalStore(
    subscribeMinute,
    () => Math.floor(Date.now() / 60_000),
    () => null,
  );
}

// Diferencia en minutos entre la hora de pared de la zona y UTC en ese instante.
function offsetMinutes(zone: string, at: Date): number | null {
  try {
    const parts = new Intl.DateTimeFormat("en-US", {
      timeZone: zone,
      hourCycle: "h23",
      year: "numeric",
      month: "numeric",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
    }).formatToParts(at);
    const get = (type: string) => Number(parts.find((p) => p.type === type)?.value);
    const wall = Date.UTC(get("year"), get("month") - 1, get("day"), get("hour"), get("minute"), get("second"));
    return Math.round((wall - Math.floor(at.getTime() / 1000) * 1000) / 60_000);
  } catch {
    return null;
  }
}

const mod = (n: number) => ((n % DAY) + DAY) % DAY;

// Un tramo de `length` minutos que empieza en `start` dentro de un día de 24 h; si cruza la
// medianoche se parte en dos.
function span(start: number, length: number): Interval[] {
  const s = mod(start);
  return s + length <= DAY
    ? [[s, s + length]]
    : [
        [s, DAY],
        [0, s + length - DAY],
      ];
}

function intersect(a: Interval[], b: Interval[]): Interval[] {
  const out: Interval[] = [];
  for (const [a0, a1] of a) {
    for (const [b0, b1] of b) {
      const lo = Math.max(a0, b0);
      const hi = Math.min(a1, b1);
      if (hi > lo) out.push([lo, hi]);
    }
  }
  return out;
}

function formatOffset(minutes: number) {
  const sign = minutes < 0 ? "-" : "+";
  const abs = Math.abs(minutes);
  const h = Math.floor(abs / 60);
  const m = abs % 60;
  return `UTC${sign}${h}${m ? `:${String(m).padStart(2, "0")}` : ""}`;
}

function formatClock(minutes: number, lang: Locale) {
  const t = mod(minutes);
  const h = Math.floor(t / 60);
  const m = String(t % 60).padStart(2, "0");
  if (lang === "es") return `${h}:${m}`;
  return `${h % 12 === 0 ? 12 : h % 12}:${m} ${h < 12 ? "AM" : "PM"}`;
}

function formatHourTick(hour: number, lang: Locale) {
  if (lang === "es") return `${hour}:00`;
  const h = hour % 24;
  return `${h % 12 === 0 ? 12 : h % 12} ${h < 12 ? "AM" : "PM"}`;
}

function formatDuration(minutes: number) {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return m === 0 ? `${h} h` : `${h} h ${m} min`;
}

function fill(template: string, values: Record<string, string>) {
  return template.replace(/\{(\w+)\}/g, (_, key: string) => values[key] ?? "");
}

function cityOf(zone: string) {
  return (zone.split("/").pop() ?? zone).replace(/_/g, " ");
}

function Bar({ segments, className }: { segments: Interval[]; className: string }) {
  return (
    <>
      {segments.map(([from, to]) => (
        <span
          key={from}
          className={`absolute inset-y-0 ${className}`}
          style={{ left: `${(from / DAY) * 100}%`, width: `${((to - from) / DAY) * 100}%` }}
        />
      ))}
    </>
  );
}

export default function TimeOverlap({ content, lang }: { content: OverlapContent; lang: Locale }) {
  const selectId = useId();
  const detected = useDetectedZone();
  const minute = useMinute();
  const [picked, setPicked] = useState<string | null>(null);
  const zone = picked ?? detected;

  const options = content.zones.map((z) => ({ ...z, label: z.id === detected ? `${z.label} (${content.detected})` : z.label }));
  if (detected && !content.zones.some((z) => z.id === detected)) {
    options.unshift({ id: detected, label: `${cityOf(detected)} (${content.detected})` });
  }

  let view: {
    meOffset: number;
    youOffset: number;
    me: Interval[];
    you: Interval[];
    both: Interval[];
    nowAxis: number;
    summary: string;
    now: string;
  } | null = null;

  if (zone && minute !== null) {
    const at = new Date(minute * 60_000);
    const meOffset = offsetMinutes(HOME_ZONE, at);
    const youOffset = offsetMinutes(zone, at);
    if (meOffset !== null && youOffset !== null) {
      // La hora de Pamplona t_p corresponde, en la zona de quien visita, a t_p + shift.
      const shift = youOffset - meOffset;
      const me = span(WORK_START + shift, WORK_END - WORK_START);
      const you: Interval[] = [[WORK_START, WORK_END]];
      const both = intersect(me, you);
      const nowAxis = mod(minute + youOffset);

      let summary = fill(content.summary.none, {});
      if (both.length > 0) {
        const [from, to] = both.reduce((best, cur) => (cur[1] - cur[0] > best[1] - best[0] ? cur : best));
        const values = {
          duration: formatDuration(to - from),
          from: formatClock(from, lang),
          to: formatClock(to, lang),
          meFrom: formatClock(from - shift, lang),
          meTo: formatClock(to - shift, lang),
        };
        summary = fill(shift === 0 ? content.summary.same : content.summary.overlap, values);
      }
      view = {
        meOffset,
        youOffset,
        me,
        you,
        both,
        nowAxis,
        summary,
        now: fill(content.now, {
          me: formatClock(mod(minute + meOffset), lang),
          you: formatClock(nowAxis, lang),
        }),
      };
    }
  }

  const nowPct = view ? (view.nowAxis / DAY) * 100 : 0;
  const nowAlign = nowPct < 10 ? "left-0" : nowPct > 90 ? "right-0" : "-translate-x-1/2";
  const rows = [
    { key: "me", label: content.rows.me, offset: view?.meOffset ?? -300, segments: view?.me ?? [], color: "bg-muted/60" },
    { key: "you", label: content.rows.you, offset: view?.youOffset ?? null, segments: view?.you ?? [], color: "bg-muted/60" },
    { key: "both", label: content.rows.both, offset: null, segments: view?.both ?? [], color: "bg-accent" },
  ];

  return (
    <div>
      <h3 className="font-serif text-xl font-medium text-ink">{content.title}</h3>
      <p className="mt-2 max-w-2xl text-body">{content.intro}</p>

      <div className="mt-5 flex flex-wrap items-center gap-x-3 gap-y-2">
        <label htmlFor={selectId} className="text-sm text-muted">
          {content.zoneLabel}
        </label>
        <select
          id={selectId}
          value={zone ?? ""}
          onChange={(event) => setPicked(event.target.value)}
          disabled={zone === null}
          className="rounded-sm border border-rule bg-paper px-2.5 py-1.5 text-sm text-ink"
        >
          {zone === null && <option value="">{content.detecting}</option>}
          {options.map((o) => (
            <option key={o.id} value={o.id}>
              {o.label}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-6 max-w-2xl" aria-hidden="true">
        <div className="relative pt-5">
          {view && (
            <div className="absolute inset-y-0 z-10" style={{ left: `${nowPct}%` }}>
              <span className={`absolute top-0 whitespace-nowrap font-mono text-[11px] leading-none text-ink ${nowAlign}`}>{content.nowLabel}</span>
              <span className="absolute inset-y-4 w-px bg-ink" />
            </div>
          )}
          <div className="space-y-3">
            {rows.map((row) => (
              <div key={row.key}>
                <p className="mb-1 font-mono text-xs text-muted">
                  {row.label}
                  {row.offset !== null && ` (${formatOffset(row.offset)})`}
                </p>
                <div className="relative h-5 border border-rule bg-wash">
                  <Bar segments={row.segments} className={row.color} />
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="relative mt-1 h-4 font-mono text-[11px] text-muted">
          {[0, 6, 12, 18, 24].map((hour) => (
            <span
              key={hour}
              className={`absolute top-0 whitespace-nowrap ${hour === 0 ? "" : hour === 24 ? "-translate-x-full" : "-translate-x-1/2"}`}
              style={{ left: `${(hour / 24) * 100}%` }}
            >
              {formatHourTick(hour, lang)}
            </span>
          ))}
        </div>
        <p className="mt-1 font-mono text-[11px] text-muted">{content.axisLabel}</p>
      </div>

      <div aria-live="polite" className="mt-4 min-h-[5.5rem] max-w-2xl sm:min-h-[4rem]">
        {view && (
          <>
            <p className="text-ink">{view.summary}</p>
            <p className="mt-1 text-sm text-muted">{view.now}</p>
          </>
        )}
      </div>
      <p className="max-w-2xl text-sm text-muted">{content.assumption}</p>
    </div>
  );
}
