import Link from "next/link";
import type { Content } from "@/content";
import { otherLocale, type Locale } from "@/lib/i18n";

type Props = { lang: Locale; content: Content; altHref: string };

export default function Header({ lang, content, altHref }: Props) {
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
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-x-8 gap-y-1 px-5 py-3 sm:px-8">
        <Link href={`/${lang}`} className="font-serif text-lg font-medium text-ink">
          {content.hero.name}
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
    </header>
  );
}
