import { NextResponse, type NextRequest } from "next/server";
import { pickLocale } from "@/lib/i18n";

// "/" redirige al idioma del visitante: el de la cookie NEXT_LOCALE (la fija components/LangSwitch.tsx al elegir un
// idioma) o, si no hay, el de Accept-Language. Solo corre en "/": /es, /en y los casos son HTML estático que sirve la CDN.
export function proxy(request: NextRequest) {
  const locale = pickLocale(request.cookies.get("NEXT_LOCALE")?.value, request.headers.get("accept-language"));
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}`;
  return NextResponse.redirect(url, 307);
}

export const config = {
  matcher: ["/"],
};
