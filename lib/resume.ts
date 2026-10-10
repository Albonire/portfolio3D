// Análisis del texto de un PDF de hoja de vida. Es lógica pura: recibe los trozos de texto que entrega
// pdf.js (con su posición) y devuelve un informe. No toca el DOM ni la red, así que se puede probar en Node.

export type RawItem = { str: string; x: number; y: number; width: number; height: number; eol: boolean };
export type RawPage = { items: RawItem[]; links: string[] };

export type SectionKey = "summary" | "experience" | "education" | "skills" | "projects" | "languages" | "certifications";

export type Report = {
  pages: number;
  chars: number;
  charsPerPage: number;
  emails: string[];
  phones: string[];
  urls: string[];
  clickableLinks: number;
  sectionsFound: SectionKey[];
  /** Números de página (desde 1) donde hay una separación vertical en dos columnas. */
  columnPages: number[];
  streamText: string;
  rowsText: string;
};

// Títulos de sección convencionales, sin tildes ni mayúsculas.
const HEADINGS: Record<SectionKey, string[]> = {
  summary: ["perfil", "perfil profesional", "resumen", "resumen profesional", "sobre mi", "acerca de mi", "summary", "professional summary", "profile", "about me", "about", "objective", "objetivo"],
  experience: ["experiencia", "experiencia laboral", "experiencia profesional", "historial laboral", "trayectoria profesional", "work experience", "experience", "professional experience", "employment history", "work history", "employment"],
  education: ["educacion", "formacion", "formacion academica", "educacion y formacion", "estudios", "education", "academic background", "academic history"],
  skills: ["habilidades", "competencias", "conocimientos", "habilidades tecnicas", "tecnologias", "skills", "technical skills", "technologies", "core skills"],
  projects: ["proyectos", "proyectos destacados", "projects", "selected projects"],
  languages: ["idiomas", "languages"],
  certifications: ["certificaciones", "certificados", "cursos", "licencias", "certifications", "certificates", "licenses", "courses"],
};

export const SECTION_KEYS = Object.keys(HEADINGS) as SectionKey[];

// Una separación horizontal mayor que esto entre dos trozos de una misma fila se toma como hueco, no como espacio.
const GAP = 16;
const MIN_SIDE_CHARS = 80;
const MIN_GUTTER = 12;
const MAX_CROSSING_SHARE = 0.15;

type Segment = { x0: number; x1: number; text: string };
type Row = { y: number; segments: Segment[] };

export function normalize(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9 ]+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

// Agrupa los trozos en filas por altura (de arriba hacia abajo) y, dentro de cada fila, une los que están
// pegados en segmentos. Los trozos sin texto se descartan.
export function buildRows(items: RawItem[]): Row[] {
  const live = items.filter((item) => item.str.trim() !== "");
  const heights = live.map((item) => item.height).filter((h) => h > 0).sort((a, b) => a - b);
  const median = heights.length ? heights[Math.floor(heights.length / 2)] : 10;
  const tolerance = Math.max(2, median * 0.5);

  const sorted = [...live].sort((a, b) => b.y - a.y || a.x - b.x);
  const groups: RawItem[][] = [];
  for (const item of sorted) {
    const group = groups[groups.length - 1];
    if (group && Math.abs(group[0].y - item.y) <= tolerance) group.push(item);
    else groups.push([item]);
  }

  return groups.map((group) => {
    const ordered = [...group].sort((a, b) => a.x - b.x);
    const segments: Segment[] = [];
    for (const item of ordered) {
      const last = segments[segments.length - 1];
      const end = item.x + item.width;
      if (last && item.x - last.x1 <= GAP) {
        const joiner = item.x - last.x1 > 1.2 && !last.text.endsWith(" ") && !item.str.startsWith(" ") ? " " : "";
        last.text += joiner + item.str;
        last.x1 = Math.max(last.x1, end);
      } else {
        segments.push({ x0: item.x, x1: end, text: item.str });
      }
    }
    return { y: group[0].y, segments: segments.map((s) => ({ ...s, text: s.text.replace(/\s+/g, " ").trim() })) };
  });
}

// Dos columnas: existe una franja vertical libre de texto, con bastante texto a cada lado, que casi ningún
// trozo cruza, y los dos lados ocupan alturas parecidas. Las fechas alineadas a la derecha no la forman
// porque los párrafos de ancho completo la cruzan. Se mide sobre trozos y no sobre filas, porque las
// líneas de una columna casi nunca quedan a la misma altura que las de la otra.
export function hasColumns(rows: Row[]): boolean {
  const segments = rows.flatMap((row) => row.segments.map((s) => ({ ...s, y: row.y })));
  if (segments.length < 6) return false;

  const minX = Math.min(...segments.map((s) => s.x0));
  const maxX = Math.max(...segments.map((s) => s.x1));
  const half = MIN_GUTTER / 2;

  for (let x = minX + MIN_SIDE_CHARS / 2; x < maxX; x += 2) {
    const crossing = segments.filter((s) => s.x0 < x + half && s.x1 > x - half);
    if (crossing.length / segments.length > MAX_CROSSING_SHARE) continue;
    const left = segments.filter((s) => s.x1 <= x - half);
    const right = segments.filter((s) => s.x0 >= x + half);
    const chars = (list: typeof left) => list.reduce((n, s) => n + s.text.replace(/\s/g, "").length, 0);
    if (chars(left) < MIN_SIDE_CHARS || chars(right) < MIN_SIDE_CHARS) continue;

    const span = (list: typeof left) => [Math.min(...list.map((s) => s.y)), Math.max(...list.map((s) => s.y))];
    const [l0, l1] = span(left);
    const [r0, r1] = span(right);
    const shared = Math.min(l1, r1) - Math.max(l0, r0);
    if (shared >= 0.5 * Math.min(l1 - l0, r1 - r0)) return true;
  }
  return false;
}

export function findSections(rows: Row[]): Set<SectionKey> {
  const found = new Set<SectionKey>();
  for (const row of rows) {
    for (const segment of row.segments) {
      if (segment.text.length > 40) continue;
      const text = normalize(segment.text);
      if (!text) continue;
      for (const key of SECTION_KEYS) {
        if (HEADINGS[key].includes(text)) found.add(key);
      }
    }
  }
  return found;
}

const EMAIL = /[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.[A-Za-z]{2,}/g;
const PHONE = /\+?\(?\d[\d \u00a0().-]{7,18}\d/g;
const URL_LIKE = /\b(?:https?:\/\/|www\.|linkedin\.com\/|github\.com\/)[^\s<>"')\]]+/gi;
const YEAR = /^(?:19|20)\d{2}$/;
// Números de identificación con puntos de miles (cédula 1.098.765.432, NIT 900.123.456-7): no son teléfonos.
const DOTTED_ID = /^\d{1,3}(?:\.\d{3}){2,}(?:-\d)?$/;

const unique = (values: string[]) => [...new Set(values)];

export function findContacts(text: string) {
  const emails = unique(text.match(EMAIL) ?? []);
  const phones = unique(
    (text.match(PHONE) ?? [])
      .map((m) => m.trim())
      .filter((m) => {
        const digits = m.replace(/\D/g, "").length;
        if (digits < 9 || digits > 15 || DOTTED_ID.test(m)) return false;
        // Dos o más años seguidos ("2019 - 2022", "2022 2023 2024") son fechas.
        const groups = m.split(/\D+/).filter(Boolean);
        if (groups.length >= 2 && groups.every((g) => YEAR.test(g))) return false;
        // Una cadena de solo dígitos sin formato es teléfono únicamente si tiene 10 (como un celular colombiano);
        // si no, suele ser un número de documento o de certificado.
        return /[+ \u00a0().-]/.test(m) || digits === 10;
      }),
  );
  const urls = unique((text.match(URL_LIKE) ?? []).map((u) => u.replace(/[.,;:]+$/, "")));
  return { emails, phones, urls };
}

// Texto tal como lo entrega el PDF: el orden del flujo de contenido, que no siempre es el orden visual.
function streamOf(items: RawItem[]): string {
  let out = "";
  for (const item of items) out += item.str + (item.eol ? "\n" : "");
  return out;
}

// Texto leído por filas, de arriba hacia abajo y de izquierda a derecha: así lo hacen algunos extractores.
function rowsOf(rows: Row[]): string {
  return rows.map((row) => row.segments.map((s) => s.text).join(" | ")).join("\n");
}

export function analyze(pages: RawPage[]): Report {
  const streams: string[] = [];
  const rowTexts: string[] = [];
  const found = new Set<SectionKey>();
  const columnPages: number[] = [];
  let clickable = 0;

  pages.forEach((page, index) => {
    const rows = buildRows(page.items);
    streams.push(streamOf(page.items));
    rowTexts.push(rowsOf(rows));
    findSections(rows).forEach((key) => found.add(key));
    if (hasColumns(rows)) columnPages.push(index + 1);
    clickable += page.links.length;
  });

  const streamText = streams.join("\n\n");
  const contacts = findContacts(rowTexts.join("\n"));
  const chars = streamText.replace(/\s/g, "").length;

  return {
    pages: pages.length,
    chars,
    charsPerPage: pages.length ? Math.round(chars / pages.length) : 0,
    ...contacts,
    clickableLinks: clickable,
    sectionsFound: SECTION_KEYS.filter((key) => found.has(key)),
    columnPages,
    streamText,
    rowsText: rowTexts.join("\n\n"),
  };
}
