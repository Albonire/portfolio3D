"use client";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import ScrollTrigger from "gsap/ScrollTrigger";

// Ensure ScrollTrigger is registered
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface MaskTextProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  priority?: boolean;
}

export default function MaskText({ children, className = "", delay = 0, priority = false }: MaskTextProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (!textRef.current || !containerRef.current) return;

    gsap.fromTo(
      textRef.current,
      { 
        yPercent: priority ? 0 : 100, // If priority, don't hide it
        opacity: priority ? 1 : 0,
        rotate: 5
      }, 
      {
        yPercent: 0,
        opacity: 1,
        rotate: 0,
        duration: 1,
        ease: "power4.out",
        delay: delay,
        scrollTrigger: priority ? null : { // Disable scrollTrigger for LCP elements
          trigger: containerRef.current,
          start: "top 90%",
          toggleActions: "play none none reverse",
        },
      }
    );
  }, { scope: containerRef, dependencies: [delay, priority] });

  return (
    <div ref={containerRef} className={`overflow-hidden py-1 ${className}`}>
      <div 
        ref={textRef} 
        className="will-change-transform"
        style={priority ? { opacity: 1, transform: 'none' } : { opacity: 0 }}
      >
        {children}
      </div>
    </div>
  );
}
