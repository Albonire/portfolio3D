import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ExternalLink from "@/components/ExternalLink";
import Header from "@/components/Header";
import Section from "@/components/Section";
import { getContent } from "@/content";
import { hasLocale, otherLocale } from "@/lib/i18n";
import { EMAIL } from "@/lib/site";

type Props = { params: Promise<{ lang: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { lang } = await params;
  if (!hasLocale(lang)) return {};
  const { meta } = getContent(lang);
  return {
    title: { absolute: meta.title },
    description: meta.description,
    alternates: { canonical: `/${lang}`, languages: { es: "/es", en: "/en", "x-default": "/en" } },
    openGraph: {
      type: "website",
      locale: lang === "es" ? "es_CO" : "en_US",
      url: `/${lang}`,
      title: meta.title,
      description: meta.description,
      images: [{ url: "/og.png", width: 1200, height: 630, alt: meta.title }],
    },
    twitter: { card: "summary_large_image", title: meta.title, description: meta.description, images: ["/og.png"] },
  };
}

export default async function Home({ params }: Props) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const c = getContent(lang);

  return (
    <>
      <Header lang={lang} content={c} altHref={`/${otherLocale(lang)}`} />
      <main id="main" className="mx-auto max-w-5xl px-5 sm:px-8">
        <section className="grid gap-12 py-16 sm:py-24 md:grid-cols-[minmax(0,1fr)_17rem]">
          <div>
            <h1 className="font-serif text-4xl font-medium leading-[1.1] text-ink sm:text-5xl">{c.hero.name}</h1>
            <p className="mt-3 text-lg text-muted">{c.hero.role}</p>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-body">{c.hero.intro}</p>
            <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
              <a
                href={c.hero.cvPrimary.href}
                className="inline-flex items-center rounded-sm bg-accent px-4 py-2.5 text-sm font-medium text-paper transition-colors hover:bg-accent-strong"
              >
                {c.hero.cvPrimary.label}
              </a>
              <a
                href={c.hero.cvSecondary.href}
                className="text-sm text-accent underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent"
              >
                {c.hero.cvSecondary.label}
              </a>
            </div>
          </div>
          <dl className="grid content-start gap-4 border-t border-rule pt-6 text-sm md:border-l md:border-t-0 md:pl-8 md:pt-1">
            {c.hero.facts.map((fact) => (
              <div key={fact.label}>
                <dt className="font-mono text-xs text-muted">{fact.label}</dt>
                <dd className="mt-0.5 text-ink">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </section>

        <Section id="work" title={c.work.title}>
          <p className="max-w-2xl text-body">{c.work.intro}</p>
          <div className="mt-10">
            {c.work.projects.map((project) => (
              <article key={project.title} className="border-t border-rule py-8 first:border-t-0 first:pt-0">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="font-serif text-xl font-medium text-ink">
                    {project.slug ? (
                      <Link href={`/${lang}/work/${project.slug}`} className="hover:text-accent">
                        {project.title}
                      </Link>
                    ) : (
                      project.title
                    )}
                  </h3>
                  <p className="font-mono text-xs text-muted">
                    {project.period} · {project.stack}
                  </p>
                </div>
                <p className="mt-1 text-sm text-muted">{project.context}</p>
                <p className="mt-3 max-w-2xl text-body">{project.summary}</p>
                <ul className="mt-3 max-w-2xl list-disc space-y-1 pl-5 text-sm text-body marker:text-muted">
                  {project.facts.map((fact) => (
                    <li key={fact}>{fact}</li>
                  ))}
                </ul>
                <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-sm">
                  {project.slug && (
                    <Link
                      href={`/${lang}/work/${project.slug}`}
                      className="text-accent underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent"
                    >
                      {c.ui.caseStudy}
                    </Link>
                  )}
                  {project.links.map((link) => (
                    <ExternalLink key={link.href} link={link} />
                  ))}
                  {project.links.length === 0 && <span className="text-muted">{c.ui.private}</span>}
                </p>
              </article>
            ))}
          </div>

          <h3 className="mt-6 border-t border-rule pt-8 font-serif text-xl font-medium text-ink">{c.work.alsoTitle}</h3>
          <ul className="mt-4 divide-y divide-rule">
            {c.work.also.map((item) => (
              <li key={item.title} className="py-4">
                <p className="max-w-2xl text-body">
                  <span className="font-medium text-ink">{item.title}.</span> {item.text}{" "}
                  <ExternalLink link={{ label: item.linkLabel, href: item.href }} />
                </p>
              </li>
            ))}
          </ul>
        </Section>

        <Section id="experience" title={c.experience.title}>
          <div className="space-y-10">
            {c.experience.jobs.map((job) => (
              <article key={job.title}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="font-medium text-ink">{job.title}</h3>
                  <p className="font-mono text-xs text-muted">{job.period}</p>
                </div>
                <p className="text-sm text-muted">
                  {job.org} · {job.place}
                </p>
                <ul className="mt-3 max-w-2xl list-disc space-y-2 pl-5 text-body marker:text-muted">
                  {job.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </Section>

        <Section id="education" title={c.education.title}>
          <ul className="space-y-6">
            {c.education.degrees.map((degree) => (
              <li key={degree.title}>
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <h3 className="font-medium text-ink">{degree.title}</h3>
                  <p className="font-mono text-xs text-muted">{degree.period}</p>
                </div>
                <p className="text-sm text-muted">{degree.place}</p>
                {degree.detail && <p className="mt-1 max-w-2xl text-body">{degree.detail}</p>}
              </li>
            ))}
          </ul>
          <h3 className="mt-10 border-t border-rule pt-8 font-serif text-xl font-medium text-ink">{c.education.certsTitle}</h3>
          <ul className="mt-4 divide-y divide-rule">
            {c.education.certs.map((cert) => (
              <li key={cert.title} className="py-4">
                <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                  <p className="font-medium text-ink">{cert.title}</p>
                  <p className="font-mono text-xs text-muted">{cert.date}</p>
                </div>
                <p className="text-sm text-muted">{cert.issuer}</p>
                {cert.href && cert.linkLabel && (
                  <p className="mt-1 text-sm">
                    <ExternalLink link={{ label: cert.linkLabel, href: cert.href }} />
                  </p>
                )}
                {cert.note && <p className="mt-1 text-sm text-muted">{cert.note}</p>}
              </li>
            ))}
          </ul>
        </Section>

        <Section id="skills" title={c.skills.title}>
          <dl className="grid gap-x-8 gap-y-3 sm:grid-cols-[9rem_minmax(0,1fr)]">
            {c.skills.groups.map((group) => (
              <div key={group.label} className="contents">
                <dt className="font-mono text-xs text-muted sm:pt-1">{group.label}</dt>
                <dd className="text-body">{group.items}</dd>
              </div>
            ))}
            <div className="contents">
              <dt className="font-mono text-xs text-muted sm:pt-1">{c.skills.languagesLabel}</dt>
              <dd className="text-body">{c.skills.languages}</dd>
            </div>
          </dl>
        </Section>

        <Section id="contact" title={c.contact.title}>
          <p className="max-w-2xl text-lg text-body">{c.contact.text}</p>
          <p className="mt-6">
            <a
              href={`mailto:${EMAIL}`}
              className="font-serif text-2xl text-accent underline decoration-rule underline-offset-8 transition-colors hover:decoration-accent sm:text-3xl"
            >
              {EMAIL}
            </a>
          </p>
          <p className="mt-6 flex flex-wrap gap-x-6 gap-y-1 text-sm">
            {c.contact.items.map((item) => (
              <ExternalLink key={item.href} link={item} />
            ))}
          </p>
        </Section>
      </main>
    </>
  );
}
