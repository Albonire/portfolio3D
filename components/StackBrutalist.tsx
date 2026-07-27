"use client";
import { useRef, useState, useEffect, memo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { SKILLS } from "@/data/content";
import TiltCard from './TiltCard';
import { PixelPlant, PlantType } from './PixelDivider';
import { InteractiveGridPattern } from "@/components/ui/interactive-grid-pattern";
import { cn } from "@/lib/utils";

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890@#$%&";

const ScrambleText = ({ text, active }: { text: string; active: boolean }) => {
  const [display, setDisplay] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (active) {
      let iteration = 0;
      clearInterval(intervalRef.current!);
      
      intervalRef.current = setInterval(() => {
        setDisplay(
          text
            .split("")
            .map((letter, index) => {
              if (index < iteration) return text[index];
              return CHARS[Math.floor(Math.random() * CHARS.length)];
            })
            .join("")
        );

        if (iteration >= text.length) {
          clearInterval(intervalRef.current!);
        }
        
        iteration += 1 / 2; // Speed of decode
      }, 30);
    } else {
      setTimeout(() => {
        setDisplay(text);
        clearInterval(intervalRef.current!);
      }, 0);
    }

    return () => clearInterval(intervalRef.current!);
  }, [active, text]);

  return <span>{display}</span>;
};

export default function StackBrutalist() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Animate Grid Lines Entry
    gsap.fromTo(
      ".grid-line",
      { scaleX: 0, opacity: 0 },
      { 
        scaleX: 1, 
        opacity: 1, 
        duration: 1.5, 
        stagger: 0.1, 
        ease: "power3.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
        }
      }
    );

    // Animate Cards Entry with subtle 3D stagger
    gsap.fromTo(
      ".stack-card",
      { y: 60, opacity: 0, rotateX: -15 },
      {
        y: 0,
        opacity: 1,
        rotateX: 0,
        duration: 0.8,
        stagger: 0.06,
        ease: "power2.out",
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 75%",
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative z-30 py-16 md:py-36 px-6 md:px-20 bg-[var(--bg-primary)] text-[var(--color-text)] transition-colors duration-500 overflow-hidden">
      
      {/* Top & Bottom Seamless Blend Overlays - Erases sharp section borders completely */}
      <div className="absolute top-0 inset-x-0 h-40 bg-gradient-to-b from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-transparent pointer-events-none z-10" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-[var(--bg-primary)] via-[var(--bg-primary)]/80 to-transparent pointer-events-none z-10" />

      {/* Interactive Grid Background - Seamless gradient fade in at top and fade out at bottom */}
      <div className="absolute inset-0 z-0 pointer-events-auto overflow-hidden opacity-60 dark:opacity-40">
        <InteractiveGridPattern
          width={110}
          height={110}
          squares={[35, 35]}
          className={cn(
            "absolute inset-x-0 -top-[35%] h-[175%] w-full skew-y-12 stroke-[var(--color-border)] opacity-85",
            "[mask-image:linear-gradient(to_bottom,transparent_0%,white_25%,white_65%,transparent_98%)]"
          )}
          squaresClassName="hover:fill-[var(--color-accent)]/30 transition-colors duration-150"
        />
      </div>

      <div className="max-w-7xl mx-auto w-full relative z-10">
        {/* Ultra-Clean Minimalist Header */}
        <div className="flex items-center gap-2.5 mb-16">
          <PixelPlant type="clover" className="text-sm opacity-80" />
          <h3 className="font-sans text-[var(--color-muted)] text-[10px] md:text-xs tracking-[0.25em] uppercase font-medium">
            Technical Stack
          </h3>
        </div>
        
        {/* 3D Perspective Card Layout aligned with angled grid plane */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 [perspective:1000px]">
          {SKILLS.map((skill, i) => (
            <StackCard key={skill.name} skill={skill} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

// Unique plant type per category with matching proportions & vertical stems
const CATEGORY_PLANTS: Record<string, PlantType> = {
  frontend: "fernC",   // Small green fern sprout (5x6)
  backend:  "flowerY", // Yellow flower sprout (3x5)
  database: "flowerC", // Cyan flower sprout (3x4)
  tools:    "clover",  // Clover sprout (5x3)
};

// Diagonal grid layout pattern & UNIFORM scale (text-sm) for all cards
const LAYOUT_POSITIONS: { pos: "tr" | "bl"; size: string }[] = [
  // Row 1 (index 0..3) — top-right
  { pos: "tr", size: "text-sm" },
  { pos: "tr", size: "text-sm" },
  { pos: "tr", size: "text-sm" },
  { pos: "tr", size: "text-sm" },
  // Row 2 (index 4..7) — alternating bl / tr
  { pos: "bl", size: "text-sm" },
  { pos: "tr", size: "text-sm" },
  { pos: "bl", size: "text-sm" },
  { pos: "tr", size: "text-sm" },
  // Row 3 (index 8..11) — bottom-left
  { pos: "bl", size: "text-sm" },
  { pos: "bl", size: "text-sm" },
  { pos: "bl", size: "text-sm" },
  { pos: "bl", size: "text-sm" },
];

const StackCard = memo(function StackCard({ skill, index }: { skill: typeof SKILLS[0], index: number }) {
  const [hover, setHover] = useState(false);
  const plantType = CATEGORY_PLANTS[skill.category] || "clover";
  const layout = LAYOUT_POSITIONS[index] || LAYOUT_POSITIONS[0];

  return (
    <TiltCard 
      className="stack-card relative bg-[var(--bg-primary)]/80 backdrop-blur-md border border-[var(--color-border)] rounded-sm p-6 h-52 flex flex-col justify-between group hover:border-[var(--color-accent)]/70 hover:shadow-xl [transform-style:preserve-3d] transition-all duration-300 overflow-hidden"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      intensity={25}
    >
      {/* 1 plant type per category, placed with diagonal grid pattern */}
      <PixelPlant 
        type={plantType} 
        flip={index % 2 === 1}
        className={cn(
          "absolute opacity-75 group-hover:opacity-100 transition-all duration-300 pointer-events-none z-20 drop-shadow-sm",
          layout.size,
          layout.pos === "tr"
            ? "top-2.5 right-4 group-hover:-translate-y-0.5"
            : "bottom-2.5 left-4 group-hover:translate-y-0.5"
        )}
      />
      {/* Hover Background Accent Fill */}
      <div className="absolute inset-0 bg-[var(--color-accent)]/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0 pointer-events-none" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full justify-between transition-colors duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <span className="font-sans text-[10px] text-[var(--color-muted)] tracking-widest uppercase">
            0{index + 1} &middot; {skill.category}
          </span>
        </div>

        {/* Main Skill Title & Progress */}
        <div>
          <h4 className="font-display font-medium text-2xl tracking-tight leading-none mb-2">
            <ScrambleText text={skill.name} active={hover} />
          </h4>
          
          {/* Dynamic Progress Bar */}
          <div className="w-full h-px bg-[var(--color-border)] mt-4 overflow-hidden relative">
            <div className={`absolute inset-0 bg-[var(--color-accent)] transition-transform duration-700 ease-out ${hover ? 'translate-x-0' : '-translate-x-full'}`} />
          </div>
        </div>
      </div>
    </TiltCard>
  );
});