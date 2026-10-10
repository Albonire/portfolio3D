import Link from "next/link";
import type { Content } from "@/content";
import { otherLocale, type Locale } from "@/lib/i18n";
import Mark from "./Mark";
import { SunnySwitch } from "./Sunny";

// En la portada el nombre ya está en el título grande, así que la cabecera solo lleva la marca (con el nombre
// como etiqueta accesible). En el resto de páginas lleva la marca y el nombre.
type Props = { lang: Locale; content: Content; altHref: string; brand?: "mark" | "name" };

export default function Header({ lang, content, altHref, brand = "name" }: Props) {
  const other = otherLocale(lang);
  const items = [
    { href: `/${lang}#work`, label: content.nav.work },
    { href: `/${lang}#experience`, label: content.nav.experience },
    { href: `/${lang}#education`, label: content.nav.education },
    { href: `/${lang}#skills`, label: content.nav.skills },
    { href: `/${lang}#contact`, label: content.nav.contact },
  ];

  return (
    <header className="sticky top-0 z-20 border-b border-rule bg-paper">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-3 gap-y-1 px-5 py-3 sm:gap-x-8 sm:px-8">
        <Link
          href={`/${lang}`}
          aria-label={brand === "mark" ? content.hero.name : undefined}
          className="flex items-center gap-2.5 font-serif text-lg font-medium text-ink"
        >
          <Mark />
          {brand === "name" && <span>{content.hero.name}</span>}
        </Link>
        <nav aria-label={content.ui.home} className="order-3 w-full sm:order-none sm:w-auto">
          <ul className="flex flex-wrap gap-x-5 gap-y-1 text-sm">
            {items.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="text-muted transition-colors hover:text-ink">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="flex items-center gap-3 sm:gap-6">
          <SunnySwitch label={content.ui.sunny.label} labelFromSm={brand === "name"} />
          <Link
            href={altHref}
            hrefLang={other}
            lang={other}
            aria-label={`${content.ui.switchLabel}: ${content.ui.switchTo}`}
            className="text-sm text-accent underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent"
          >
            {content.ui.switchTo}
          </Link>
        </div>
      </div>
    </header>
  );
}
