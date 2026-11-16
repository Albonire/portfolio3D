import type { ReactNode } from "react";

export default function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="tx-seam-t scroll-mt-24 border-t border-rule py-14 sm:scroll-mt-16">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-12">
        <h2 id={`${id}-title`} className="font-serif text-xl font-medium text-ink md:pt-0.5">
          {title}
        </h2>
        <div className="min-w-0">{children}</div>
      </div>
    </section>
  );
}
