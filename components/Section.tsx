import type { ReactNode } from "react";

export default function Section({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className="scroll-mt-16 border-t border-rule py-14">
      <div className="grid gap-6 md:grid-cols-[11rem_minmax(0,1fr)] md:gap-12">
        <h2 id={`${id}-title`} className="font-serif text-xl font-medium text-ink md:pt-0.5">
          {title}
        </h2>
        <div>{children}</div>
      </div>
    </section>
  );
}
