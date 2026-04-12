"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed top-8 right-6 md:top-8 md:right-8 z-[100] font-sans text-[10px] md:text-xs tracking-widest uppercase text-[var(--color-muted)] hover:text-[var(--color-accent)] transition-colors duration-200"
    >
      [{theme === "dark" ? "LIGHT MODE" : "DARK MODE"}]
    </button>
  );
}
