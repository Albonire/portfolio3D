import Link from "next/link";

// Se muestra para /es/xyz y /en/xyz. Sin acceso a params, así que es bilingüe y breve.
export default function NotFound() {
  return (
    <main id="main" className="mx-auto max-w-5xl px-5 py-24 sm:px-8">
      <h1 className="font-serif text-3xl font-medium text-ink">404</h1>
      <p className="mt-4 max-w-xl text-body">
        No encontré esa página. / I couldn&apos;t find that page.
      </p>
      <p className="mt-6 flex gap-6 text-sm">
        <Link href="/es" className="text-accent underline decoration-rule underline-offset-4 hover:decoration-accent">
          Español
        </Link>
        <Link href="/en" className="text-accent underline decoration-rule underline-offset-4 hover:decoration-accent">
          English
        </Link>
      </p>
    </main>
  );
}
