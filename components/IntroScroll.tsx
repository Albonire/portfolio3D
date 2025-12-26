"use client";
import { useRef, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function IntroScroll({ description }: { description: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wordsRef = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    if (!containerRef.current) return;

    const words = wordsRef.current.filter(Boolean);
    
    const ctx = gsap.context(() => {
      gsap.fromTo(
        words,
        { 
          opacity: 0.2,
          color: "currentColor" // Start with dim base color
        },
        {
          opacity: 1,
          stagger: 0.1,
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 80%",
            end: "bottom 50%",
            scrub: 1,
          }
        }
      );
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <h2 ref={containerRef} className="font-display text-4xl md:text-7xl lg:text-8xl leading-[0.9] text-[var(--color-text)] uppercase mb-12">
      {description.split(" ").map((word, i) => (
        <span 
          key={i} 
          ref={(el) => { wordsRef.current[i] = el; }}
          className="inline-block mr-4 transition-colors duration-300"
        >
          {word}
        </span>
      ))}
    </h2>
  );
}
