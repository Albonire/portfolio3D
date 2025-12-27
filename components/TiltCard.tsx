"use client";
import { useRef, MouseEvent, ReactNode } from "react";
import gsap from "gsap";

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  intensity?: number; // Max rotation degrees
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
}

export default function TiltCard({
  children,
  className = "",
  intensity = 15,
  onMouseEnter,
  onMouseLeave
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;

    const rect = ref.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -intensity;
    const rotateY = ((x - centerX) / centerX) * intensity;

    gsap.to(ref.current, {
      rotateX: rotateX,
      rotateY: rotateY,
      scale: 1.02,
      duration: 0.4,
      ease: "power2.out",
      transformPerspective: 1000,
      transformOrigin: "center",
    });

    if (sheenRef.current) {
      const sheenX = x - rect.width / 2;
      const sheenY = y - rect.height / 2;

      gsap.to(sheenRef.current, {
        x: sheenX,
        y: sheenY,
        opacity: 0.3,
        duration: 0.1,
      });
    }
  };

  const handleLeave = () => {
    if (onMouseLeave) onMouseLeave();

    if (!ref.current) return;

    gsap.to(ref.current, {
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      duration: 0.8,
      ease: "elastic.out(1, 0.5)",
    });

    if (sheenRef.current) {
      gsap.to(sheenRef.current, { opacity: 0, duration: 0.5 });
    }
  };

  const handleEnter = () => {
    if (onMouseEnter) onMouseEnter();
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      onMouseEnter={handleEnter}
      className={`relative will-change-transform transform-gpu ${className}`}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
        transition: "none"
      }}
    >
      {children}

      {/* Premium Sheen Gradient */}
      <div
        ref={sheenRef}
        className="absolute inset-0 z-[60] pointer-events-none mix-blend-soft-light opacity-0"
        style={{
          background: "radial-gradient(circle at center, rgba(255,255,255,0.6) 0%, rgba(255,255,255,0) 50%)",
          width: "150%",
          height: "150%",
          left: "-25%",
          top: "-25%",
          transform: "translateZ(100px)",
          transition: "none"
        }}
      />
    </div>
  );
}