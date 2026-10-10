import { Fragment } from "react";
import type { Refs } from "@/lib/refs";

// Dos marcas dentro de un texto:
//   `código`          se muestra como <code>
//   [[cifra|clave]]   la cifra más un superíndice que lleva a su fuente (ver components/Sources.tsx)
const PATTERN = /(\[\[[^\]|]+\|[\w-]+\]\]|`[^`]+`)/g;
const CITE = /^\[\[([^\]|]+)\|([\w-]+)\]\]$/;

export default function Inline({ text, refs }: { text: string; refs?: Refs }) {
  return (
    <>
      {text.split(PATTERN).map((part, i) => {
        if (part.startsWith("`") && part.endsWith("`") && part.length > 1) {
          return (
            <code key={i} className="rounded-sm bg-wash px-1 py-0.5 font-mono text-[0.85em] text-ink">
              {part.slice(1, -1)}
            </code>
          );
        }
        const cite = CITE.exec(part);
        if (cite) {
          const [, shown, key] = cite;
          const index = refs ? refs.keys.indexOf(key) : -1;
          if (index === -1) return <Fragment key={i}>{shown}</Fragment>;
          return (
            <Fragment key={i}>
              {shown}
              <sup className="ml-px text-[0.7em] leading-none">
                <a
                  href={`#fuente-${key}`}
                  aria-label={`${refs?.label} ${index + 1}`}
                  className="text-accent underline decoration-rule underline-offset-2 hover:decoration-accent"
                >
                  {index + 1}
                </a>
              </sup>
            </Fragment>
          );
        }
        return <Fragment key={i}>{part}</Fragment>;
      })}
    </>
  );
}
