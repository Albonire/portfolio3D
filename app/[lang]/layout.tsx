import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getContent } from "@/content";
import { SunnyBoot, SunnyLayer } from "@/components/Sunny";
import { hasLocale, locales } from "@/lib/i18n";
import { SITE_URL } from "@/lib/site";
import { mono, sans, serif } from "../fonts";
import "../globals.css";

export const dynamicParams = false;

export function generateStaticParams() {
  return locales.map((lang) => ({ lang }));
}

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "32x32" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-touch-icon.png",
  },
};

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ lang: string }>;
}) {
  const { lang } = await params;
  if (!hasLocale(lang)) notFound();
  const content = getContent(lang);

  return (
    // suppressHydrationWarning: el guion de arranque puede poner data-sunny en <html> antes de hidratar.
    // data-scroll-behavior: el desplazamiento suave de globals.css es para las anclas de la misma página. Desde Next 16
    // hay que pedir con este atributo que al cambiar de página se salte arriba de una vez; sin él, al abrir un caso
    // desde la mitad de la portada la página nueva se desplazaba animada desde esa altura.
    <html
      lang={content.htmlLang}
      className={`${sans.variable} ${serif.variable} ${mono.variable}`}
      data-scroll-behavior="smooth"
      suppressHydrationWarning
    >
      <body className="min-h-screen">
        <SunnyBoot />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-sm focus:bg-accent focus:px-4 focus:py-2 focus:text-sm focus:text-paper"
        >
          {content.ui.skip}
        </a>
        {children}
        <SunnyLayer />
        <footer className="tx-seam-t tx-hem border-t border-rule">
          <div className="mx-auto max-w-5xl px-5 py-8 text-sm text-muted sm:px-8">
            © {new Date().getFullYear()} {content.footer}
          </div>
        </footer>
      </body>
    </html>
  );
}
