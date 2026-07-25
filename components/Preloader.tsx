"use client";
import { useEffect, useRef, useState, useCallback } from "react";
import gsap from "gsap";

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLSpanElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(() => {
    if (typeof window === "undefined") return false;
    try {
      return !!sessionStorage.getItem("boot_sequence_seen");
    } catch {
      return false;
    }
  });
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const handleSkip = useCallback(() => {
    try {
      sessionStorage.setItem("boot_sequence_seen", "true");
    } catch {
      // ignore
    }
    if (timelineRef.current) {
      timelineRef.current.kill();
    }
    if (containerRef.current) {
      gsap.to(containerRef.current, {
        yPercent: -100,
        duration: 0.4,
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

    // Disable scroll during preload
    document.body.style.overflow = "hidden";

    // Handle ESC key to skip
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", onKeyDown);

    // Safety fallback timer ensuring the preloader NEVER blocks the screen indefinitely
    const safetyTimer = setTimeout(() => {
      try {
        sessionStorage.setItem("boot_sequence_seen", "true");
      } catch {
        // ignore
      }
      document.body.style.overflow = "";
      setIsComplete(true);
    }, 2200);

    const ctx = gsap.context(() => {
      const counter = { value: 0 };
      const statuses = [
        "SYSTEM BOOT",
        "COMPILING SHADERS",
        "LOADING 3D SCENE",
        "OPTIMIZING MEMORY",
        "SYSTEM READY"
      ];

      const tl = gsap.timeline({
        onComplete: () => {
          clearTimeout(safetyTimer);
          try {
            sessionStorage.setItem("boot_sequence_seen", "true");
          } catch {
            // ignore
          }
          document.body.style.overflow = "";
          setIsComplete(true);
        }
      });

      timelineRef.current = tl;

      tl.to(counter, {
        value: 100,
        duration: 1.1,
        ease: "power2.inOut",
        onUpdate: () => {
          const val = Math.floor(counter.value);
          if (percentRef.current) {
            percentRef.current.innerText = val.toString().padStart(2, "0");
          }
          if (progressLineRef.current) {
            progressLineRef.current.style.width = `${val}%`;
          }
          if (statusRef.current) {
            const statusIdx = Math.min(
              Math.floor((val / 100) * statuses.length),
              statuses.length - 1
            );
            statusRef.current.innerText = statuses[statusIdx];
          }
        }
      });

      if (containerRef.current) {
        tl.to(containerRef.current, {
          yPercent: -100,
          duration: 0.6,
          ease: "power4.inOut",
          delay: 0.1
        });
      }

      tl.add(() => {
        document.body.style.overflow = "";
      }, "-=0.4");
    }, containerRef);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      clearTimeout(safetyTimer);
      ctx.revert();
      document.body.style.overflow = "";
    };
  }, [isComplete, handleSkip]);

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
          onClick={handleSkip}
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
            ref={progressLineRef} 
            className="h-full bg-[var(--color-accent)] w-0 transition-all duration-75"
          />
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="flex justify-between items-end font-mono text-[10px] md:text-xs uppercase tracking-widest text-[var(--color-muted)]">
        <div className="flex gap-4">
          <span>MEM: OK</span>
          <span className="hidden sm:inline">GPU: ACCEL</span>
          <span>NET: READY</span>
        </div>
        <div className="text-right">
          FABIAN GONZÁLEZ ©
        </div>
      </div>

      {/* Subtle Grid Background matching theme */}
      <div 
        className="absolute inset-0 pointer-events-none opacity-[0.04]" 
        style={{ 
          backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', 
          backgroundSize: '80px 80px' 
        }} 
      />
    </div>
  );
}
