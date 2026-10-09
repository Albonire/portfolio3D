import type { Link } from "@/content/types";

const style =
  "text-accent underline decoration-rule underline-offset-4 transition-colors hover:decoration-accent";

export default function ExternalLink({ link }: { link: Link }) {
  return (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={style}>
      {link.label}
    </a>
  );
}
