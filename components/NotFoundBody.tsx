import Link from "next/link";
import { getContent } from "@/content";
import { locales } from "@/lib/i18n";

// Cuerpo de la página 404. No sabe en qué idioma estaba el visitante (la URL no existe), así que muestra los dos,
// con el texto de cada diccionario.
export default function NotFoundBody() {
  return (
    <main id="main" tabIndex={-1} className="mx-auto max-w-5xl px-5 py-24 outline-none sm:px-8">
      <h1 className="font-serif text-3xl font-medium text-ink">404</h1>
      <div className="mt-6 space-y-6">
        {locales.map((locale) => {
          const { htmlLang, notFound } = getContent(locale);
          return (
            <section key={locale} lang={htmlLang}>
              <h2 className="font-serif text-lg font-medium text-ink">{notFound.title}</h2>
              <p className="mt-1 max-w-xl text-body">{notFound.text}</p>
              <p className="mt-2 text-sm">
                <Link href={`/${locale}`} className="text-accent underline decoration-rule underline-offset-4 hover:decoration-accent">
                  {notFound.link}
                </Link>
              </p>
            </section>
          );
        })}
      </div>
    </main>
  );
}
