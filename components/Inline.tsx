import { Fragment } from "react";

// Convierte `texto` entre comillas invertidas en <code>. El resto se deja tal cual.
export default function Inline({ text }: { text: string }) {
  return (
    <>
      {text.split("`").map((part, i) =>
        i % 2 === 1 ? (
          <code key={i} className="rounded-sm bg-wash px-1 py-0.5 font-mono text-[0.85em] text-ink">
            {part}
          </code>
        ) : (
          <Fragment key={i}>{part}</Fragment>
        ),
      )}
    </>
  );
}
