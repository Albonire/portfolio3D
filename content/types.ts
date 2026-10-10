import type { SectionKey } from "../lib/resume";

export type Link = { label: string; href: string };

export type ImageFigure = {
  kind: "image";
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
};

export type ChartPoint = {
  label: string;
  value: number;
  note: string;
  /** "table" son los 10 pasos de la tabla Resultado; "later" son hitos de tandas posteriores. */
  phase: "table" | "later";
};

export type ChartFigure = {
  kind: "chart";
  label: string;
  caption: string;
  yLabel: string;
  laterLabel: string;
  dataLabel: string;
  keysHint: string;
  /** Índice del punto que se muestra al cargar (la caída). */
  focus: number;
  callout: { title: string; text: string };
  points: ChartPoint[];
};

export type CircuitFigure = {
  kind: "circuit";
  label: string;
  caption: string;
  hint: string;
  summary: string;
  tableLabel: string;
  inputLabels: [string, string, string];
  outputLabels: [string, string];
};

export type Source = {
  title: string;
  where: string;
  date?: string;
  note?: string;
  href?: string;
};

export type FlowFigure = {
  kind: "flow";
  label: string;
  caption: string;
  steps: { title: string; detail: string }[];
};

export type Table = { head: string[]; rows: string[][]; note?: string };

export type CaseSection = {
  heading: string;
  paragraphs?: string[];
  bullets?: string[];
  /** Frase final, se muestra después de la lista. */
  closing?: string;
  table?: Table;
  figures?: (ImageFigure | FlowFigure | ChartFigure | CircuitFigure)[];
};

export type CaseStudy = {
  title: string;
  lead: string;
  meta: { label: string; value: string }[];
  links: Link[];
  sections: CaseSection[];
};

export type Project = {
  /** Si existe, el proyecto tiene página de caso de estudio en /work/[slug]. */
  slug?: string;
  title: string;
  context: string;
  period: string;
  stack: string;
  summary: string;
  facts: string[];
  links: Link[];
};

export type Job = {
  title: string;
  org: string;
  place: string;
  period: string;
  bullets: string[];
};

export type OverlapContent = {
  title: string;
  intro: string;
  noscript: string;
  zoneLabel: string;
  detecting: string;
  detected: string;
  nowLabel: string;
  now: string;
  rows: { me: string; you: string; both: string };
  axisLabel: string;
  assumption: string;
  /** Plantillas con {duration}, {from}, {to}, {meFrom} y {meTo}; los textos van en el idioma de cada diccionario. */
  summary: { overlap: string; same: string; none: string };
  zones: { id: string; label: string }[];
};

export type ReaderContent = {
  title: string;
  lead: string;
  noscript: string;
  privacy: string;
  pick: string;
  dropHint: string;
  samplesLabel: string;
  samples: { own: Link; columns: Link };
  busy: string;
  reset: string;
  errors: { notPdf: string; tooBig: string; password: string; broken: string };
  /** Plantillas: {name}, {n}, {total}, {chars}. */
  resultFor: string;
  pageOne: string;
  pageMany: string;
  cap: string;
  status: { ok: string; review: string };
  checks: {
    text: { label: string; ok: string; few: string; none: string };
    contact: { label: string; email: string; phone: string; links: string; clickable: string; notFound: string; missingHint: string };
    sections: { label: string; found: string; missing: string; none: string };
    columns: { label: string; none: string; some: string };
  };
  sectionNames: Record<SectionKey, string>;
  previewTitle: string;
  previewRowsTitle: string;
  previewCut: string;
  limits: string;
};

export type Content = {
  htmlLang: string;
  meta: { title: string; description: string };
  ui: {
    skip: string;
    navLabel: string;
    switchLabel: string;
    switchTo: string;
    back: string;
    caseStudy: string;
    private: string;
    sourceLabel: string;
    sunny: { label: string };
  };
  nav: { work: string; experience: string; education: string; skills: string; contact: string };
  hero: {
    name: string;
    role: string;
    intro: string;
    facts: { label: string; value: string }[];
    curve: { title: string; text: string; caseLabel: string; chart: ChartFigure };
    cvPrimary: Link;
    cvSecondary: Link;
  };
  reader: ReaderContent;
  work: {
    title: string;
    intro: string;
    projects: Project[];
    alsoTitle: string;
    also: { title: string; text: string; href: string; linkLabel: string }[];
  };
  experience: { title: string; jobs: Job[] };
  education: {
    title: string;
    degrees: { title: string; place: string; period: string; detail?: string }[];
    certsTitle: string;
    certs: { title: string; issuer: string; date: string; href?: string; linkLabel?: string; note?: string }[];
  };
  skills: {
    title: string;
    groups: { label: string; items: string }[];
    languagesLabel: string;
    languages: string;
  };
  contact: {
    title: string;
    text: string;
    items: Link[];
    overlap: OverlapContent;
  };
  sources: { title: string; intro: string; items: Record<string, Source> };
  footer: string;
  notFound: { title: string; text: string; link: string };
  cases: Record<string, CaseStudy>;
};
