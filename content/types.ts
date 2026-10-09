export type Link = { label: string; href: string };

export type ImageFigure = {
  kind: "image";
  src: string;
  alt: string;
  width: number;
  height: number;
  caption: string;
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
  figures?: (ImageFigure | FlowFigure)[];
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

export type Content = {
  htmlLang: string;
  meta: { title: string; description: string };
  ui: {
    skip: string;
    home: string;
    switchLabel: string;
    switchTo: string;
    back: string;
    caseStudy: string;
    private: string;
  };
  nav: { work: string; experience: string; education: string; skills: string; contact: string };
  hero: {
    name: string;
    role: string;
    intro: string;
    facts: { label: string; value: string }[];
    cvPrimary: Link;
    cvSecondary: Link;
  };
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
    emailLabel: string;
    items: Link[];
  };
  footer: string;
  notFound: { title: string; text: string; link: string };
  cases: Record<string, CaseStudy>;
};
