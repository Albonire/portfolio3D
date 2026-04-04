"use client";
import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { SKILLS } from "@/data/content";
import TiltCard from './TiltCard';

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

    // Animate Cards Entry
    gsap.fromTo(
      ".stack-card",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        stagger: 0.05,
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 70%",
        }
      }
    );
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative z-30 py-8 md:py-32 px-6 md:px-20 border-b border-current/10 bg-[var(--color-dark)] text-[var(--color-text)] transition-colors duration-500 overflow-hidden">
      
      {/* Background Grid Decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full" />
          <h3 className="font-sans text-[var(--color-muted)] text-[10px] md:text-xs tracking-widest uppercase">
            Technical Stack
          </h3>
          <div className="h-px flex-grow bg-[var(--color-border)] grid-line origin-left" />
        </div>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
          {SKILLS.map((skill, i) => (
            <StackCard key={skill.name} skill={skill} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

function StackCard({ skill, index }: { skill: typeof SKILLS[0], index: number }) {
  const [hover, setHover] = useState(false);

  return (
    <TiltCard 
      className="stack-card relative bg-[var(--bg-primary)] border border-[var(--color-border)] rounded-sm p-6 h-48 flex flex-col justify-between group hover:border-[var(--color-accent)]/50 hover:shadow-sm overflow-hidden"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      intensity={20}
    >
      {/* Hover Background Fill */}
      <div className="absolute inset-0 bg-[var(--color-border)]/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full justify-between transition-colors duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <span className="font-sans text-[10px] text-[var(--color-muted)] tracking-widest uppercase">
            0{index + 1} &middot; {skill.category}
          </span>
          {/* Signal Icon */}
          <div className="flex gap-0.5 items-end h-3">
            {[1,2,3].map(bar => (
              <div 
                key={bar} 
                className={`w-1 bg-current transition-all duration-300 ${hover ? 'animate-bounce' : ''}`} 
                style={{ height: `${bar * 30}%`, animationDelay: `${bar * 0.1}s` }}
              />
            ))}
          </div>
        </div>

        {/* Main Title */}
        <div>
          <h4 className="font-display font-medium text-2xl tracking-tight leading-none mb-2">
            <ScrambleText text={skill.name} active={hover} />
          </h4>
          
          {/* Dynamic Progress Bar */}
          <div className="w-full h-px bg-[var(--color-border)] mt-4 overflow-hidden relative">
            <div className={`absolute inset-0 bg-[var(--color-accent)] transition-transform duration-1000 ease-out ${hover ? 'translate-x-0' : '-translate-x-full'}`} />
          </div>
        </div>
      </div>
    </TiltCard>
  );
}