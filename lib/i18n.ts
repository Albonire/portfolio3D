export const locales = ["es", "en"] as const;
export type Locale = (typeof locales)[number];
export const defaultLocale: Locale = "en";

export function hasLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function otherLocale(locale: Locale): Locale {
  return locale === "es" ? "en" : "es";
}

// Elige el idioma de "/" a partir de la cookie guardada o del encabezado Accept-Language.
// Recorre los idiomas por prioridad (q) y toma el primero que sea es o en; si no hay, inglés.
export function pickLocale(cookie: string | undefined, acceptLanguage: string | null): Locale {
  if (cookie && hasLocale(cookie)) return cookie;
  const ranked = (acceptLanguage ?? "")
    .split(",")
    .map((part) => {
      const [tag, ...params] = part.trim().split(";");
      const q = params.map((p) => p.trim()).find((p) => p.startsWith("q="));
      return { base: tag.toLowerCase().split("-")[0], q: q ? Number(q.slice(2)) || 0 : 1 };
    })
    .filter((entry) => entry.base)
    .sort((a, b) => b.q - a.q);
  for (const { base } of ranked) {
    if (hasLocale(base)) return base;
  }
  return defaultLocale;
}
