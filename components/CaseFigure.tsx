import Image from "next/image";
import type { FlowFigure, ImageFigure } from "@/content/types";

const columns: Record<number, string> = {
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};

export default function CaseFigure({ figure }: { figure: ImageFigure | FlowFigure }) {
  if (figure.kind === "image") {
    return (
      <figure className="my-8">
        <Image
          src={figure.src}
          alt={figure.alt}
          width={figure.width}
          height={figure.height}
          sizes="(min-width: 1024px) 64rem, 100vw"
          className="h-auto w-full border border-rule"
        />
        <figcaption className="mt-2 text-sm text-muted">{figure.caption}</figcaption>
      </figure>
    );
  }

  return (
    <figure className="my-8">
      <ol
        aria-label={figure.label}
        className={`grid gap-px overflow-hidden border border-rule bg-rule sm:grid-cols-2 ${columns[figure.steps.length] ?? "lg:grid-cols-3"}`}
      >
        {figure.steps.map((step, index) => (
          <li key={step.title} className="bg-paper p-4">
            <span className="font-mono text-xs text-muted">{index + 1}</span>
            <p className="mt-1 font-medium text-ink">{step.title}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">{step.detail}</p>
          </li>
        ))}
      </ol>
      <figcaption className="mt-2 text-sm text-muted">{figure.caption}</figcaption>
    </figure>
  );
}
