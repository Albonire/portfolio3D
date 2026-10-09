import { NextResponse, type NextRequest } from "next/server";
import { hasLocale, pickLocale } from "@/lib/i18n";

// "/" redirige al idioma del visitante; /es y /en recuerdan la elección en una cookie.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const first = pathname.split("/")[1];

  if (hasLocale(first)) {
    const response = NextResponse.next();
    if (request.cookies.get("NEXT_LOCALE")?.value !== first) {
      response.cookies.set("NEXT_LOCALE", first, { path: "/", maxAge: 60 * 60 * 24 * 365, sameSite: "lax" });
    }
    return response;
  }

  if (pathname === "/") {
    const locale = pickLocale(request.cookies.get("NEXT_LOCALE")?.value, request.headers.get("accept-language"));
    const url = request.nextUrl.clone();
    url.pathname = `/${locale}`;
    return NextResponse.redirect(url, 307);
  }

  return NextResponse.next();
}

// No toca _next, api ni ningún archivo con extensión (sitemap, robots, /cv/*.pdf, imágenes).
export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
