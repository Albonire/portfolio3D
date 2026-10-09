import type { MetadataRoute } from "next";
import { getContent } from "@/content";
import { locales } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const slugs = Object.keys(getContent("en").cases);
  const paths = ["", ...slugs.map((slug) => `/work/${slug}`)];
  return locales.flatMap((lang) =>
    paths.map((path) => ({
      url: `${SITE_URL}/${lang}${path}`,
      alternates: { languages: Object.fromEntries(locales.map((l) => [l, `${SITE_URL}/${l}${path}`])) },
    })),
  );
}
