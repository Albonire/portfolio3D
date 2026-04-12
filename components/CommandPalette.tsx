"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTheme } from "next-themes";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

type Command = {
  id: string;
  label: string;
  category: "NAVIGATION" | "SYSTEM" | "THEME";
  action: () => void;
  shortcut?: string;
};

export default function CommandPalette() {
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const { setTheme } = useTheme();

  const handleNavigation = (id: string) => {
    close();
    setTimeout(() => {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      } else {
        router.push(`/#${id}`);
      }
    }, 300);
  };

  const commands: Command[] = [
    { id: "home", label: "GO TO HOME", category: "NAVIGATION", action: () => { close(); router.push("/"); } },
    { id: "work", label: "VIEW PROJECTS", category: "NAVIGATION", action: () => handleNavigation("work") },
    { id: "about", label: "ABOUT ME", category: "NAVIGATION", action: () => handleNavigation("about") },
    { id: "theme-dark", label: "SET THEME: DARK", category: "THEME", action: () => setTheme("dark") },
    { id: "theme-light", label: "SET THEME: LIGHT", category: "THEME", action: () => setTheme("light") },
    { id: "copy-email", label: "COPY EMAIL", category: "SYSTEM", action: () => { navigator.clipboard.writeText("fabianagcris@gmail.com"); alert("Email copied!"); }, shortcut: "⌘C" },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  const close = () => {
    setIsOpen(false);
    setQuery("");
    setSelectedIndex(0);
  };

  // Toggle with Cmd+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape") {
        close();
      }
    };

    const handleOpenEvent = () => {
      setIsOpen(true);
      setTimeout(() => inputRef.current?.focus(), 100);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("open-cmd-palette", handleOpenEvent);
    
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("open-cmd-palette", handleOpenEvent);
    };
  }, []);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  // Keyboard Navigation
  const handleNavigationKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % filteredCommands.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      filteredCommands[selectedIndex]?.action();
      close();
    }
  };

  // Animations
  useGSAP(() => {
    if (isOpen) {
      gsap.to(overlayRef.current, { opacity: 1, duration: 0.3, ease: "power2.out" });
      gsap.fromTo(
        panelRef.current,
        { scale: 0.95, opacity: 0, y: 20 },
        { scale: 1, opacity: 1, y: 0, duration: 0.4, ease: "back.out(1.7)" }
      );
    }
  }, { scope: overlayRef, dependencies: [isOpen] });

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-start justify-center pt-[20vh] bg-black/60 backdrop-blur-sm px-4 opacity-0"
      onClick={(e) => { if (e.target === overlayRef.current) close(); }}
    >
      <div
        ref={panelRef}
        className="w-full max-w-xl bg-[var(--bg-primary)] border border-[var(--color-border)] shadow-md overflow-hidden text-[var(--color-text)] rounded-sm"
      >
        {/* Header / Input */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-[var(--color-border)]">
          <span className="font-sans text-[var(--color-accent)] text-lg transition-opacity">{">"}</span>
          <input
            ref={inputRef}
            className="flex-1 bg-transparent font-body text-base text-[var(--color-text)] placeholder-[var(--color-muted)] outline-none"
            placeholder="Type a command..."
            value={query}
            onChange={(e) => { setQuery(e.target.value); setSelectedIndex(0); }}
            onKeyDown={handleNavigationKey}
          />
          <span className="font-sans text-[10px] text-[var(--color-muted)] bg-[var(--color-border)]/50 px-2 py-1 rounded">ESC</span>
        </div>

        {/* Results */}
        <div className="max-h-[300px] overflow-y-auto py-2">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-8 text-center font-sans tracking-widest text-[var(--color-muted)] text-xs uppercase">
              No commands found
            </div>
          ) : (
            filteredCommands.map((cmd, i) => (
              <button
                key={cmd.id}
                className={`w-full flex items-center justify-between px-4 py-3 text-left font-sans text-sm transition-all duration-200
                  ${i === selectedIndex ? "bg-[var(--color-accent)] text-white" : "text-[var(--color-text)] hover:bg-[var(--color-border)]/20"}
                `}
                onClick={() => { cmd.action(); }}
                onMouseEnter={() => setSelectedIndex(i)}
              >
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] uppercase tracking-widest opacity-80 ${i === selectedIndex ? "text-white/80" : "text-[var(--color-accent)]"}`}>
                    {cmd.category}
                  </span>
                  <span>{cmd.label}</span>
                </div>
                {cmd.shortcut && (
                  <span className="opacity-50 text-[10px]">{cmd.shortcut}</span>
                )}
              </button>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="bg-[var(--color-border)]/20 px-4 py-2 border-t border-[var(--color-border)] flex justify-between items-center">
          <div className="flex gap-4">
            <span className="font-sans text-[10px] text-[var(--color-muted)]">Select ↑↓</span>
            <span className="font-sans text-[10px] text-[var(--color-muted)]">Open ↵</span>
          </div>
        </div>
      </div>
    </div>
  );
}
