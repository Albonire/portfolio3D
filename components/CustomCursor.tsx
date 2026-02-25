"use client";
import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return; // Exit if touch device

    const cursor = cursorRef.current;
    if (!cursor) return;
    
    const xTo = gsap.quickTo(cursor, "x", {duration: 0.3, ease: "power3"});
    const yTo = gsap.quickTo(cursor, "y", {duration: 0.3, ease: "power3"});

    const moveCursor = (e: MouseEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
    };

    // Performance: Use Event Delegation instead of multiple listeners
    const handleOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, .cursor-pointer')) {
        gsap.to(cursor, {
          scale: 1.5,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };

    const handleOut = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.closest('a, button, .cursor-pointer')) {
        gsap.to(cursor, {
          scale: 1,
          duration: 0.3,
          ease: "power2.out"
        });
      }
    };

    window.addEventListener('mousemove', moveCursor);
    window.addEventListener('mouseover', handleOver);
    window.addEventListener('mouseout', handleOut);

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      window.removeEventListener('mouseover', handleOver);
      window.removeEventListener('mouseout', handleOut);
    };
  }, []);

  return (
    <div 
      ref={cursorRef} 
      className="fixed top-0 left-0 w-8 h-8 bg-white rounded-full pointer-events-none z-[10000] mix-blend-difference -translate-x-1/2 -translate-y-1/2 hidden [@media(pointer:fine)]:block"
    />
  );
}
