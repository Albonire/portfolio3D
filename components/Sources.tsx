import type { Source } from "@/content/types";

type Props = { keys: string[]; items: Record<string, Source>; intro?: string };

// Lista numerada de fuentes. El orden y la numeración vienen de collectRefs.
export default function Sources({ keys, items, intro }: Props) {
  if (keys.length === 0) return null;
  return (
    <>
      {intro && <p className="max-w-2xl text-sm text-muted">{intro}</p>}
      <ol className="mt-4 space-y-4 text-sm">
        {keys.map((key, index) => {
          const source = items[key];
          if (!source) return null;
          return (
            <li
              key={key}
              id={`fuente-${key}`}
              className="grid scroll-mt-28 grid-cols-[1.75rem_minmax(0,1fr)] gap-x-2 target:bg-wash"
            >
              <span className="font-mono text-xs text-muted">{index + 1}</span>
              <div className="max-w-2xl">
                <p className="text-ink">{source.title}</p>
                <p className="font-mono text-xs text-muted">
                  {source.where}
                  {source.date ? ` · ${source.date}` : ""}
                </p>
                {source.note && <p className="mt-1 text-body">{source.note}</p>}
                {source.href && (
                  <p className="mt-1">
                    <a
                      href={source.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent underline decoration-rule underline-offset-4 hover:decoration-accent"
                    >
                      {source.href.replace("https://", "")}
                    </a>
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </>
  );
}
