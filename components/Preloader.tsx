"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export default function Preloader() {
  const containerRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLDivElement>(null);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    // Disable scroll during preload
    document.body.style.overflow = "hidden";

    const counter = { value: 0 };
    const tl = gsap.timeline({
      onComplete: () => setIsComplete(true)
    });

    tl.to(counter, {
      value: 100,
      duration: 1.2,
      ease: "power2.inOut",
      onUpdate: () => {
        if (percentRef.current) {
          percentRef.current.innerText = Math.floor(counter.value).toString();
        }
      }
    });

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

  if (isComplete) return null;

  return (
    <div 
      ref={containerRef}
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
        </div>
      </div>

      {/* Bottom Footer */}
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