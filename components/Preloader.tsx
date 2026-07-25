"use client";
<<<<<<< HEAD
import { useEffect, useRef, useState } from "react";
=======
import { useEffect, useRef, useState, useCallback } from "react";
>>>>>>> 3f99fab (feat: integrate SideRays component in dark mode and refine hero UI)
import gsap from "gsap";

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLDivElement>(null);
<<<<<<< HEAD
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const hasSeenBoot = sessionStorage.getItem("boot_sequence_seen");
    if (hasSeenBoot) {
      setIsComplete(true);
      return;
=======
  const statusRef = useRef<HTMLSpanElement>(null);
  const progressLineRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);

  const handleSkip = useCallback(() => {
    sessionStorage.setItem("boot_sequence_seen", "true");
    if (timelineRef.current) {
      timelineRef.current.kill();
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

    const hasSeenBoot = sessionStorage.getItem("boot_sequence_seen");
    if (hasSeenBoot) {
      const raf = requestAnimationFrame(() => {
        setIsComplete(true);
      });
      return () => cancelAnimationFrame(raf);
>>>>>>> 3f99fab (feat: integrate SideRays component in dark mode and refine hero UI)
    }

    // Disable scroll during preload
    document.body.style.overflow = "hidden";

<<<<<<< HEAD
    const counter = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => {
        setIsComplete(true);
        sessionStorage.setItem("boot_sequence_seen", "true");
      }
    });

    tl.to(counter, {
      value: 100,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: () => {
        if (percentRef.current) {
          percentRef.current.innerText = Math.floor(counter.value).toString();
=======
    // Handle ESC key to skip
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleSkip();
      }
    };
    window.addEventListener("keydown", onKeyDown);

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
        sessionStorage.setItem("boot_sequence_seen", "true");
        setIsComplete(true);
      }
    });

    timelineRef.current = tl;

    tl.to(counter, {
      value: 100,
      duration: 1.4,
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
>>>>>>> 3f99fab (feat: integrate SideRays component in dark mode and refine hero UI)
        }
      }
    });

<<<<<<< HEAD
    // Exit Animation
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 1.2,
      ease: "power4.inOut",
      delay: 0.2
    });

    // Re-enable scroll
    tl.add(() => {
      document.body.style.overflow = "";
    }, "-=0.8");

    return () => {
      tl.kill();
      document.body.style.overflow = "";
    };
  }, []);
=======
    // Elegant curtain raise exit
    tl.to(containerRef.current, {
      yPercent: -100,
      duration: 0.9,
      ease: "power4.inOut",
      delay: 0.1
    });

    // Re-enable scroll early during slide up
    tl.add(() => {
      document.body.style.overflow = "";
    }, "-=0.7");

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      tl.kill();
      document.body.style.overflow = "";
    };
  }, [isComplete, handleSkip]);
>>>>>>> 3f99fab (feat: integrate SideRays component in dark mode and refine hero UI)

  if (isComplete) return null;

  return (
    <div 
      ref={containerRef}
<<<<<<< HEAD
      className="fixed inset-0 z-[99999] bg-[#050505] text-white flex flex-col justify-between p-10 cursor-wait"
    >
      {/* Top Header */}
      <div className="flex justify-between items-start font-sans text-xs uppercase tracking-widest text-[var(--color-muted)]">
        <span>System Boot</span>
        <span className="transition-opacity">Loading</span>
      </div>

      {/* Center Counter */}
      <div className="flex flex-col items-center justify-center">
        <div className="relative">
          <h1 className="font-display font-medium text-7xl md:text-9xl leading-none tracking-tight">
            <span ref={percentRef}>0</span>
            <span className="text-2xl align-top text-[var(--color-accent)]">%</span>
          </h1>
=======
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
>>>>>>> 3f99fab (feat: integrate SideRays component in dark mode and refine hero UI)
        </div>
      </div>

      {/* Bottom Footer */}
<<<<<<< HEAD
      <div className="flex justify-between items-end font-sans text-xs uppercase tracking-widest text-[var(--color-muted)]">
        <div className="flex gap-4">
          <span>Mem: OK</span>
          <span>Net: OK</span>
        </div>
        <div>
          Initializing
        </div>
      </div>

      {/* Background Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.05]" 
           style={{ 
             backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)', 
             backgroundSize: '100px 100px' 
           }} 
      />
    </div>
  );
}
=======
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
>>>>>>> 3f99fab (feat: integrate SideRays component in dark mode and refine hero UI)
