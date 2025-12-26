"use client";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className="fixed top-8 right-8 z-[100] font-mono text-sm uppercase mix-blend-difference text-white hover:text-neon transition-colors"
    >
      [{theme === "dark" ? "LIGHT MODE" : "DARK MODE"}]
    </button>
  );
}
