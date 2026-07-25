"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

const STATUSES = [
  "SYSTEM BOOT",
  "COMPILING SHADERS",
  "LOADING 3D SCENE",
  "OPTIMIZING MEMORY",
  "SYSTEM READY"
];

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const [isComplete, setIsComplete] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return !!sessionStorage.getItem("boot_sequence_seen");
    } catch {
      return false;
    }
  });

  const isExitingRef = useRef(false);

  const handleFinish = useCallback(() => {
    if (isExitingRef.current) return;
    isExitingRef.current = true;

    try {
      sessionStorage.setItem("boot_sequence_seen", "true");
    } catch {
      // ignore
    }

    if (containerRef.current) {
      gsap.to(containerRef.current, {
        yPercent: -100,
        duration: 0.5,
        ease: "power3.inOut",
        onComplete: () => {
          document.body.style.overflow = "";
          setIsComplete(true);
        }
      });
    } else {
      document.body.style.overflow = "";
      setIsComplete(true);
    }
  }, []);

  useEffect(() => {
    if (isComplete) return;

    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleFinish();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    const counter = { val: 0 };

    const tween = gsap.to(counter, {
      val: 100,
      duration: 1.1,
      ease: "power2.inOut",
      onUpdate: () => {
        const v = Math.floor(counter.val);
        if (percentRef.current) {
          percentRef.current.innerText = v.toString().padStart(2, "0");
        }
        if (progressBarRef.current) {
          progressBarRef.current.style.width = `${v}%`;
        }
        if (statusRef.current) {
          const idx = Math.min(
            Math.floor((v / 100) * STATUSES.length),
            STATUSES.length - 1
          );
          statusRef.current.innerText = STATUSES[idx];
        }
      },
      onComplete: () => {
        handleFinish();
      }
    });

    const fallbackTimer = setTimeout(() => {
      handleFinish();
    }, 2000);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      tween.kill();
      clearTimeout(fallbackTimer);
      document.body.style.overflow = "";
    };
  }, [handleFinish, isComplete]);

  if (isComplete) return null;

  return (
    <div 
      ref={containerRef}
      className="fixed inset-0 z-[99999] bg-[var(--bg-primary)] text-[var(--text-primary)] flex flex-col justify-between p-6 md:p-12 cursor-wait select-none transition-colors duration-300"
    >
      {/* Top Header */}
      <div className="flex justify-between items-center font-mono text-[10px] md:text-xs uppercase tracking-widest text-[var(--color-muted)]">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse" />
          <span ref={statusRef}>SYSTEM BOOT</span>
        </div>
        
        <button
          onClick={handleFinish}
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
          <span ref={percentRef}>00</span>
          <span className="text-2xl md:text-4xl align-top text-[var(--color-accent)] ml-1">%</span>
        </h1>

        {/* Minimal Progress Line */}
        <div className="w-48 sm:w-64 h-[2px] bg-[var(--color-border)] mt-8 relative overflow-hidden rounded-full">
          <div 
            ref={progressBarRef}
            className="h-full bg-[var(--color-accent)] w-0"
          />
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="flex justify-between items-end font-mono text-[10px] md:text-xs uppercase tracking-widest text-[var(--color-muted)]">
        <div className="flex gap-4 sm:gap-8">
          <span>MEM: OK</span>
          <span>GPU: ACCEL</span>
          <span>NET: READY</span>
        </div>
        <div>
          <span>FABIAN GONZÁLEZ ©</span>
        </div>
      </div>
    </div>
  );
}
