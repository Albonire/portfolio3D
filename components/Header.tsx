import Link from "next/link";
import type { Content } from "@/content";
import { otherLocale, type Locale } from "@/lib/i18n";
import LangSwitch from "./LangSwitch";
import Mark from "./Mark";
import NavSpy from "./NavSpy";
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
    <header className="tx-seam-b sticky top-0 z-20 border-b border-rule bg-paper">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-3 gap-y-1 px-5 pb-1 pt-3 sm:gap-x-8 sm:px-8 sm:pb-3">
        <Link
          href={`/${lang}`}
          aria-label={brand === "mark" ? content.hero.name : undefined}
          className="flex items-center gap-2.5 font-serif text-lg font-medium text-ink"
        >
          <Mark />
          {brand === "name" && <span>{content.hero.name}</span>}
        </Link>
        {/* En pantallas angostas el menú va en una sola fila bajo la marca: los cinco enlaces caben repartidos desde
            375 px de ancho y, por debajo de eso, la fila se desplaza de lado en vez de partirse en dos. */}
        <nav aria-label={content.ui.navLabel} className="order-3 w-full min-w-0 sm:order-none sm:w-auto">
          <ul className="-mx-5 flex justify-between gap-x-2.5 overflow-x-auto px-5 text-[13px] [scrollbar-width:none] sm:mx-0 sm:justify-start sm:gap-x-5 sm:overflow-visible sm:px-0 sm:text-sm [&::-webkit-scrollbar]:hidden">
            {items.map((item) => (
              <li key={item.href} className="shrink-0">
                <Link
                  href={item.href}
                  className="tx-nav block py-2 text-muted transition-colors hover:text-ink aria-[current]:text-ink aria-[current]:shadow-[inset_0_-2px_0_var(--color-accent)] sm:-my-2"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <NavSpy />
        <div className="flex items-center gap-3 sm:gap-6">
          <SunnySwitch label={content.ui.sunny.label} hint={content.ui.sunny.hint} labelFromSm={brand === "name"} />
          <LangSwitch
            locale={other}
            href={altHref}
            hrefLang={other}
            lang={other}
            aria-label={`${content.ui.switchLabel}: ${content.ui.switchTo}`}
            className="text-sm text-accent underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent"
          >
            {content.ui.switchTo}
          </LangSwitch>
        </div>
      </div>
    </header>
  );
}
