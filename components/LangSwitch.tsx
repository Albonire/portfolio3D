"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import type { Locale } from "@/lib/i18n";

// Recuerda el idioma elegido para la próxima vez que se abra "/" (proxy.ts lee la cookie). Se guarda aquí, al hacer clic,
// y no en el proxy: las precargas de los enlaces también pasan por él y cambiaban la cookie sin que nadie eligiera nada.
export default function LangSwitch({ locale, ...props }: ComponentProps<typeof Link> & { locale: Locale }) {
  return (
    <Link
      {...props}
      onClick={() => {
        try {
          const secure = location.protocol === "https:" ? "; secure" : "";
          document.cookie = `NEXT_LOCALE=${locale}; path=/; max-age=31536000; samesite=lax${secure}`;
        } catch {
          // Sin cookies (bloqueadas): el idioma se sigue cambiando, solo no se recuerda.
        }
      }}
    />
  );
}
