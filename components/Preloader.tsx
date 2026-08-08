"use client";

import { useEffect, useState, useCallback, useRef } from "react";

export default function Preloader() {
  const [isDismissed, setIsDismissed] = useState(false);
  const [percent, setPercent] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const dismissedRef = useRef(false);

  const dismiss = useCallback(() => {
    if (dismissedRef.current) return;
    dismissedRef.current = true;
    setIsExiting(true);
    try {
      sessionStorage.setItem("boot_sequence_seen", "true");
    } catch {
      // ignore
    }
    setTimeout(() => {
      document.body.style.overflow = "";
      setIsDismissed(true);
    }, 500);
  }, []);

  useEffect(() => {
    if (isExiting) return;

    // Check sessionStorage AFTER hydration to prevent SSR mismatch
    try {
      if (sessionStorage.getItem("boot_sequence_seen") === "true") {
        setIsDismissed(true);
        document.body.style.overflow = "";
        return;
      }
    } catch {
      // ignore
    }

    document.body.style.overflow = "hidden";

    let animationFrameId: number;
    let startTime: number | null = null;
    const duration = 1200; // 1.2s total duration

    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / duration, 1);

      // easeOutCubic
      const easedProgress = 1 - Math.pow(1 - progress, 3);
      const currentVal = Math.floor(easedProgress * 100);

      setPercent(currentVal);

      if (progress < 1) {
        animationFrameId = requestAnimationFrame(step);
      } else {
        dismiss();
      }
    };

    animationFrameId = requestAnimationFrame(step);

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        dismiss();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    // Hard safety fallback timer (2s max)
    const fallbackTimer = setTimeout(() => {
      dismiss();
    }, 2000);

    return () => {
      cancelAnimationFrame(animationFrameId);
      clearTimeout(fallbackTimer);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [dismiss, isExiting]);

  if (isDismissed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      aria-label="Loading"
      className={`fixed inset-0 z-[99999] bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between p-6 md:p-12 cursor-wait select-none transition-transform duration-500 ease-in-out ${
        isExiting ? "-translate-y-full pointer-events-none" : "translate-y-0"
      }`}
    >
      {/* Top Header */}
      <div className="flex justify-end items-center font-mono text-[10px] md:text-xs uppercase tracking-widest text-[var(--color-muted)]">
        <button
          type="button"
          onClick={dismiss}
          className="group px-3 py-1.5 rounded-full border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)] hover:text-white transition-all duration-200 cursor-pointer flex items-center gap-1.5"
          title="Press ESC to skip"
        >
          <span>SKIP</span>
          <span className="text-[9px] opacity-60 font-sans group-hover:opacity-100">[ESC]</span>
        </button>
      </div>

      {/* Center Counter & Progress Line */}
      <div className="flex flex-col items-center justify-center relative my-auto">
        <h1 className="font-display font-medium text-7xl sm:text-9xl md:text-[12rem] leading-none tracking-tight">
          <span>{percent.toString().padStart(2, "0")}</span>
          <span className="text-2xl md:text-4xl align-top text-[var(--color-accent)] ml-1">%</span>
        </h1>

        {/* Minimal Progress Line */}
        <div className="w-48 sm:w-64 h-[2px] bg-[var(--color-border)] mt-8 relative overflow-hidden rounded-full">
          <div 
            className="h-full bg-[var(--color-accent)] transition-all duration-75"
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>

    </div>
  );
}
