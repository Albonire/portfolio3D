import type { Link } from "@/content/types";

const style =
  "text-accent underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent";

// `context` nombra el proyecto solo para lectores de pantalla: varios enlaces de una lista dicen "Código" y no se distinguen.
export default function ExternalLink({ link, context }: { link: Link; context?: string }) {
  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={style}>
      {link.label}
      {context && <span className="sr-only"> ({context})</span>}
    </a>
  );
}
