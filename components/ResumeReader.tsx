"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { ReaderContent } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import { SECTION_KEYS, analyze, type RawPage, type Report, type SectionKey } from "@/lib/resume";

const MAX_BYTES = 15 * 1024 * 1024;
const MAX_PAGES = 10;
const PREVIEW_CHARS = 3000;
const ESSENTIAL: SectionKey[] = ["experience", "education", "skills"];

type Result = { name: string; report: Report; totalPages: number };
type State = { kind: "idle" } | { kind: "busy" } | { kind: "error"; message: string } | { kind: "done"; result: Result };

class ReaderError extends Error {
  constructor(public code: "notPdf" | "tooBig" | "password" | "broken") {
    super(code);
  }
}

// pdf.js se descarga al elegir el primer archivo, no al abrir la página. Se usa la compilación "legacy"
// porque la actual exige funciones de JavaScript que los Chrome anteriores a 142 no tienen.
async function loadPdfjs() {
  const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
  if (!pdfjs.GlobalWorkerOptions.workerSrc) {
    pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/legacy/build/pdf.worker.min.mjs", import.meta.url).toString();
  }
  return pdfjs;
}

async function readPdf(data: Uint8Array): Promise<{ pages: RawPage[]; totalPages: number }> {
  const pdfjs = await loadPdfjs();
  const task = pdfjs.getDocument({ data });
  try {
    const doc = await task.promise;
    const pages: RawPage[] = [];
    const count = Math.min(doc.numPages, MAX_PAGES);
    for (let i = 1; i <= count; i++) {
      const page = await doc.getPage(i);
      const content = await page.getTextContent();
      const items = content.items.flatMap((item) =>
        "str" in item
          ? [{ str: item.str, x: item.transform[4], y: item.transform[5], width: item.width, height: item.height, eol: item.hasEOL }]
          : [],
      );
      const annotations = await page.getAnnotations();
      const links = annotations.flatMap((a) => (a.subtype === "Link" && (a.url || a.unsafeUrl) ? [String(a.url || a.unsafeUrl)] : []));
      pages.push({ items, links });
    }
    return { pages, totalPages: doc.numPages };
  } catch (error) {
    const name = error instanceof Error ? error.name : "";
    throw new ReaderError(name === "PasswordException" ? "password" : "broken");
  } finally {
    await task.destroy();
  }
}

const fill = (template: string, values: Record<string, string | number>) =>
  template.replace(/\{(\w+)\}/g, (_, key: string) => String(values[key] ?? ""));

export default function ResumeReader({ content, lang }: { content: ReaderContent; lang: Locale }) {
  const inputId = useId();
  const inputRef = useRef<HTMLInputElement>(null);
  const [state, setState] = useState<State>({ kind: "idle" });
  const [dragging, setDragging] = useState(false);
  const number = new Intl.NumberFormat(lang === "es" ? "es-CO" : "en-US");
  const busy = state.kind === "busy";

  async function run(name: string, load: () => Promise<Uint8Array>) {
    setState({ kind: "busy" });
    try {
      const data = await load();
      const { pages, totalPages } = await readPdf(data);
      setState({ kind: "done", result: { name, report: analyze(pages), totalPages } });
    } catch (error) {
      const code = error instanceof ReaderError ? error.code : "broken";
      setState({ kind: "error", message: content.errors[code] });
    }
  }

  function fromFile(file: File | undefined) {
    if (!file) return;
    void run(file.name, async () => {
      if (file.type !== "application/pdf" && !file.name.toLowerCase().endsWith(".pdf")) throw new ReaderError("notPdf");
      if (file.size > MAX_BYTES) throw new ReaderError("tooBig");
      return new Uint8Array(await file.arrayBuffer());
    });
    if (inputRef.current) inputRef.current.value = "";
  }

  function fromSample(href: string) {
    void run(href.split("/").pop() ?? href, async () => {
      const response = await fetch(href);
      if (!response.ok) throw new ReaderError("broken");
      return new Uint8Array(await response.arrayBuffer());
    });
  }

  return (
    <div>
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          if (!busy) fromFile(event.dataTransfer.files[0]);
        }}
        className={`border p-5 transition-colors ${dragging ? "border-accent bg-wash" : "border-rule"}`}
      >
        <div className="flex flex-wrap items-center gap-x-4 gap-y-3">
          <label
            htmlFor={inputId}
            className="inline-flex cursor-pointer items-center rounded-sm bg-accent px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-accent-strong has-[:disabled]:cursor-default has-[:disabled]:opacity-60 has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-offset-3 has-[:focus-visible]:outline-accent"
          >
            {content.pick}
            <input
              id={inputId}
              ref={inputRef}
              type="file"
              accept="application/pdf,.pdf"
              disabled={busy}
              onChange={(event) => fromFile(event.target.files?.[0])}
              className="sr-only"
            />
          </label>
          <span className="text-sm text-muted">{content.dropHint}</span>
        </div>
        <p className="mt-4 flex flex-wrap items-baseline gap-x-3 gap-y-1 text-sm text-muted">
          <span>{content.samplesLabel}</span>
          {[content.samples.own, content.samples.columns].map((sample) => (
            <button
              key={sample.href}
              type="button"
              disabled={busy}
              onClick={() => fromSample(sample.href)}
              className="text-accent underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent disabled:opacity-60"
            >
              {sample.label}
            </button>
          ))}
        </p>
        <p className="mt-4 text-sm text-muted">{content.privacy}</p>
      </div>

      <div aria-live="polite" className="mt-6 empty:mt-0">
        {state.kind === "busy" && <p className="text-sm text-muted">{content.busy}</p>}
        {state.kind === "error" && <p className="text-sm text-stop">{state.message}</p>}
      </div>
      {state.kind === "done" && (
        <div className="mt-6">
          <Findings result={state.result} content={content} number={number} onReset={() => setState({ kind: "idle" })} />
        </div>
      )}

      <p className="mt-6 max-w-2xl text-sm text-muted">{content.limits}</p>
    </div>
  );
}

function Findings({
  result,
  content,
  number,
  onReset,
}: {
  result: Result;
  content: ReaderContent;
  number: Intl.NumberFormat;
  onReset: () => void;
}) {
  const { report, name, totalPages } = result;
  const c = content.checks;
  // Al aparecer el resultado, el foco pasa al título para que un lector de pantalla lo anuncie.
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => heading.current?.focus({ preventScroll: true }), []);
  const pagesLabel = fill(report.pages === 1 ? content.pageOne : content.pageMany, { n: report.pages });
  const textValues = { chars: number.format(report.chars), pages: pagesLabel };

  const text =
    report.chars < 40
      ? { ok: false, detail: c.text.none }
      : report.charsPerPage < 300
        ? { ok: false, detail: fill(c.text.few, textValues) }
        : { ok: true, detail: fill(c.text.ok, textValues) };

  const email = report.emails[0];
  const phone = report.phones[0];
  const contactOk = Boolean(email && phone);

  const names = (keys: SectionKey[]) => keys.map((key) => content.sectionNames[key]).join(", ");
  const missing = ESSENTIAL.filter((key) => !report.sectionsFound.includes(key));
  const sections =
    report.sectionsFound.length === 0
      ? { ok: false, detail: c.sections.none }
      : missing.length > 0
        ? { ok: false, detail: fill(c.sections.missing, { list: names(missing) }) }
        : { ok: true, detail: fill(c.sections.found, { list: names(SECTION_KEYS.filter((key) => report.sectionsFound.includes(key))) }) };

  const columns =
    report.columnPages.length > 0
      ? { ok: false, detail: fill(c.columns.some, { pages: report.columnPages.join(", ") }) }
      : { ok: true, detail: c.columns.none };

  const rows = [
    { key: "text", label: c.text.label, ...text, extra: null as React.ReactNode },
    {
      key: "contact",
      label: c.contact.label,
      ok: contactOk,
      detail: null as string | null,
      extra: (
        <>
          <p>
            {c.contact.email}: <span className="font-mono text-ink">{email ?? c.contact.notFound}</span>
          </p>
          <p>
            {c.contact.phone}: <span className="font-mono text-ink">{phone ?? c.contact.notFound}</span>
          </p>
          <p>
            {c.contact.links}: <span className="font-mono text-ink">{report.urls.length > 0 ? report.urls.join(", ") : c.contact.notFound}</span>
            {report.clickableLinks > 0 && <span className="text-muted"> · {fill(c.contact.clickable, { n: report.clickableLinks })}</span>}
          </p>
          {!contactOk && <p className="text-muted">{c.contact.missingHint}</p>}
        </>
      ),
    },
    { key: "sections", label: c.sections.label, ...sections, extra: null },
    { key: "columns", label: c.columns.label, ...columns, extra: null },
  ];

  const stream = report.streamText.trim();
  const rowsText = report.rowsText.trim();
  const cut = (value: string) => (value.length > PREVIEW_CHARS ? value.slice(0, PREVIEW_CHARS) : value);
  const previews = [{ key: "stream", title: content.previewTitle, text: stream }];
  if (report.columnPages.length > 0) previews.push({ key: "rows", title: content.previewRowsTitle, text: rowsText });

  return (
    <div>
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
        <h3 ref={heading} tabIndex={-1} className="font-serif text-lg font-medium text-ink">
          {fill(content.resultFor, { name })}
        </h3>
        <button
          type="button"
          onClick={onReset}
          className="text-sm text-accent underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent"
        >
          {content.reset}
        </button>
      </div>
      <p className="mt-1 font-mono text-xs text-muted">
        {pagesLabel}
        {totalPages > report.pages && ` · ${fill(content.cap, { n: report.pages, total: totalPages })}`}
      </p>

      <dl className="mt-4 divide-y divide-rule border-y border-rule text-sm">
        {rows.map((row) => (
          <div key={row.key} className="grid gap-x-6 gap-y-1 py-3 sm:grid-cols-[7rem_5rem_minmax(0,1fr)]">
            <dt className="font-mono text-xs text-muted sm:pt-0.5">{row.label}</dt>
            <dd className={`font-mono text-xs sm:pt-0.5 ${row.ok ? "text-ink" : "text-stop"}`}>{row.ok ? content.status.ok : content.status.review}</dd>
            <dd className="text-body">{row.detail ?? row.extra}</dd>
          </div>
        ))}
      </dl>

      {stream.length > 0 && (
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          {previews.map((preview) => (
            <div key={preview.key} className={previews.length === 1 ? "lg:col-span-2" : undefined}>
              <h4 className="font-mono text-xs text-muted">{preview.title}</h4>
              <pre
                tabIndex={0}
                aria-label={preview.title}
                className="mt-2 max-h-72 overflow-auto whitespace-pre-wrap break-words border border-rule bg-wash p-3 font-mono text-xs leading-relaxed text-ink"
              >
                {cut(preview.text)}
              </pre>
              {preview.text.length > PREVIEW_CHARS && <p className="mt-1 text-xs text-muted">{fill(content.previewCut, { n: number.format(PREVIEW_CHARS) })}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
