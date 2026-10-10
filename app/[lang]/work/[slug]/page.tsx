import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import CaseFigure from "@/components/CaseFigure";
import ExternalLink from "@/components/ExternalLink";
import Header from "@/components/Header";
import Inline from "@/components/Inline";
import Sources from "@/components/Sources";
import { getContent } from "@/content";
import { hasLocale, locales, otherLocale } from "@/lib/i18n";
import { collectRefs } from "@/lib/refs";

type Props = { params: Promise<{ lang: string; slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.flatMap((lang) => Object.keys(getContent(lang).cases).map((slug) => ({ lang, slug })));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) return {};
  const study = getContent(lang).cases[slug];
  if (!study) return {};
  const siblings = Object.fromEntries(locales.map((l) => [l, `/${l}/work/${slug}`]));
  return {
    title: study.title,
    description: study.lead,
    alternates: { canonical: `/${lang}/work/${slug}`, languages: { ...siblings, "x-default": `/en/work/${slug}` } },
    openGraph: { type: "article", url: `/${lang}/work/${slug}`, title: study.title, description: study.lead, images: [`/og-${lang}.png`] },
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const { lang, slug } = await params;
  if (!hasLocale(lang)) notFound();
  const c = getContent(lang);
  const study = c.cases[slug];
  if (!study) notFound();
  const refs = { keys: collectRefs(study), label: c.ui.sourceLabel };

  return (
    <>
      <Header lang={lang} content={c} altHref={`/${otherLocale(lang)}/work/${slug}`} />
      <main id="main" className="mx-auto max-w-5xl px-5 pb-24 sm:px-8">
        <Link
          href={`/${lang}#work`}
          className="mt-10 inline-block text-sm text-accent underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent"
        >
          {c.ui.back}
        </Link>
        <h1 className="mt-6 max-w-3xl font-serif text-3xl font-medium leading-tight text-ink sm:text-4xl">{study.title}</h1>
        <p className="mt-5 max-w-2xl text-lg leading-relaxed text-body">{study.lead}</p>

        <dl className="mt-10 grid gap-x-8 gap-y-3 border-y border-rule py-6 text-sm sm:grid-cols-[8rem_minmax(0,1fr)]">
          {study.meta.map((item) => (
            <div key={item.label} className="contents">
              <dt className="font-mono text-xs text-muted sm:pt-0.5">{item.label}</dt>
              <dd className="text-ink">
                <Inline text={item.value} refs={refs} />
              </dd>
            </div>
          ))}
        </dl>
        {study.links.length > 0 && (
          <p className="mt-5 flex flex-wrap gap-x-6 gap-y-1 text-sm">
            {study.links.map((link) => (
              <ExternalLink key={link.href} link={link} />
            ))}
          </p>
        )}

        {study.sections.map((section) => (
          <section key={section.heading} className="mt-14">
            <h2 className="max-w-2xl font-serif text-2xl font-medium text-ink">{section.heading}</h2>
            <div className="mt-4 max-w-2xl space-y-4 text-body">
              {section.paragraphs?.map((p) => (
                <p key={p}>
                  <Inline text={p} refs={refs} />
                </p>
              ))}
              {section.bullets && (
                <ul className="list-disc space-y-2 pl-5 marker:text-muted">
                  {section.bullets.map((b) => (
                    <li key={b}>
                      <Inline text={b} refs={refs} />
                    </li>
                  ))}
                </ul>
              )}
              {section.closing && (
                <p>
                  <Inline text={section.closing} refs={refs} />
                </p>
              )}
            </div>
            {section.table && (
              <div className="mt-6 max-w-2xl overflow-x-auto">
                <table className="w-full border-collapse text-left text-sm">
                  <thead>
                    <tr className="border-b border-ink">
                      {section.table.head.map((h) => (
                        <th key={h} scope="col" className="py-2 pr-4 font-medium text-ink">
                          {h}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {section.table.rows.map((row) => (
                      <tr key={row[0]} className="border-b border-rule align-top">
                        {row.map((cell, i) => (
                          <td key={i} className={`py-2 pr-4 ${i === 0 ? "text-ink" : "text-body"}`}>
                            <Inline text={cell} refs={refs} />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
                {section.table.note && <p className="mt-3 text-sm text-muted">{section.table.note}</p>}
              </div>
            )}
            {section.figures?.map((figure, i) => (
              <CaseFigure key={i} figure={figure} lang={lang} />
            ))}
          </section>
        ))}
        {refs.keys.length > 0 && (
          <section aria-labelledby="fuentes-title" className="mt-16 border-t border-rule pt-8">
            <h2 id="fuentes-title" className="font-serif text-xl font-medium text-ink">
              {c.sources.title}
            </h2>
            <Sources keys={refs.keys} items={c.sources.items} />
          </section>
        )}
      </main>
    </>
  );
}
