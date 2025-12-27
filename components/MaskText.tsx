"use client";
import { useRef, useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

// Ensure ScrollTrigger is registered
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface MaskTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
}

export default function MaskText({ children, className = "", delay = 0 }: MaskTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!textRef.current || !containerRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        textRef.current,
        { 
          yPercent: 100, // Start fully pushed down
          rotate: 5      // Slight rotation for flair
        }, 
        {
          yPercent: 0,
          rotate: 0,
          duration: 1.2,
          ease: "power4.out", // Elegant easing
          delay: delay,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 85%", // Trigger when slightly visible
            toggleActions: "play none none reverse", // Replay on scroll back? Optional
          },
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, [delay]);

  return (
    <div 
      ref={containerRef} 
      className={`relative overflow-hidden ${className}`} // overflow-hidden creates the mask
    >
      <div ref={textRef} className="will-change-transform origin-top-left">
        {children}
      </div>
    </div>
  );
}
