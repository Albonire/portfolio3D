"use client";

import { useEffect } from "react";

// Marca en la cabecera la sección que se está leyendo (aria-current) y, en pantallas angostas, donde el menú se
// desplaza de lado, deja a la vista su enlace. La cabecera se genera en el servidor: aquí solo se cambia un atributo
// de sus enlaces. En las páginas sin esas secciones (los casos de estudio) no hace nada.
export default function NavSpy() {
  useEffect(() => {
    const links = new Map<string, HTMLAnchorElement>();
    for (const link of document.querySelectorAll<HTMLAnchorElement>("header nav a[href*='#']")) {
      links.set(link.hash.slice(1), link);
    }
    const sections = Array.from(document.querySelectorAll<HTMLElement>("main > section[id]"));
    if (sections.length === 0 || links.size === 0) return;

    let current: string | null = null;
    let frame = 0;
    const update = () => {
      frame = 0;
      // La sección activa es la última cuyo borde ya subió hasta el tercio alto de la ventana. Si esa sección no
      // está en el menú (el lector, las fuentes), no se marca ninguna.
      const line = Math.min(window.innerHeight * 0.35, 280);
      let active: string | null = null;
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= line) active = section.id;
      }
      if (active === current) return;
      if (current) links.get(current)?.removeAttribute("aria-current");
      current = active;
      const link = active ? links.get(active) : undefined;
      if (!link) return;
      link.setAttribute("aria-current", "true");
      const list = link.closest("ul");
      if (list && list.scrollWidth > list.clientWidth) {
        const left = link.offsetLeft - (list.clientWidth - link.offsetWidth) / 2;
        list.scrollTo({ left, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
      }
    };
    const onScroll = () => {
      frame ||= requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (frame) cancelAnimationFrame(frame);
      if (current) links.get(current)?.removeAttribute("aria-current");
    };
  }, []);
  return null;
}
