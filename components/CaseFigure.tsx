import Image from "next/image";
import type { ChartFigure, CircuitFigure, FlowFigure, ImageFigure } from "@/content/types";
import type { Locale } from "@/lib/i18n";
import AccuracyChart from "./AccuracyChart";
import CircuitToy from "./CircuitToy";
import HalftoneLayer from "./Halftone";

const columns: Record<number, string> = {
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
};

type Props = { figure: ImageFigure | FlowFigure | ChartFigure | CircuitFigure; lang: Locale };

export default function CaseFigure({ figure, lang }: Props) {
  if (figure.kind === "chart") return <AccuracyChart figure={figure} lang={lang} />;
  if (figure.kind === "circuit") return <CircuitToy figure={figure} />;

  if (figure.kind === "image") {
    return (
      <figure className="my-8">
        <div className="relative">
          <Image
            src={figure.src}
            alt={figure.alt}
            width={figure.width}
            height={figure.height}
            sizes="(min-width: 1024px) 64rem, 100vw"
            className="h-auto w-full border border-rule"
          />
          {/* Modo Sol (experimento): la captura se convierte en puntos de media tinta con los colores de la interfaz.
              `boost` oscurece lo que no es blanco antes del shader; sin él, una captura casi blanca da puntos diminutos. */}
          <HalftoneLayer image={figure.src} solid colors boost={4} size={0.14} contrast={0.5} grain={0} />
        </div>
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
