import type { Locale } from "@/lib/i18n";
import type { Content } from "./types";
import { es } from "./es";
import { en } from "./en";

const dictionaries: Record<Locale, Content> = { es, en };

export function getContent(locale: Locale): Content {
  return dictionaries[locale];
}

export type { Content } from "./types";
