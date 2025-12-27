"use client";
import { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { SKILLS } from "@/data/content";

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
      setDisplay(text);
      clearInterval(intervalRef.current!);
    }

    return () => clearInterval(intervalRef.current!);
  }, [active, text]);

  return <span>{display}</span>;
};

export default function StackBrutalist() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
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
    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section ref={containerRef} className="relative z-30 py-32 px-6 md:px-20 border-b border-current/10 bg-[var(--color-dark)] text-[var(--color-text)] transition-colors duration-500 overflow-hidden">
      
      {/* Background Grid Decoration */}
      <div className="absolute inset-0 z-0 pointer-events-none opacity-[0.03]" 
           style={{ backgroundImage: 'linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)', backgroundSize: '40px 40px' }} 
      />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-16">
          <div className="w-2 h-2 bg-neon-readable animate-pulse" />
          <h3 className="font-mono text-neon-readable text-sm tracking-widest uppercase">
            [ SYSTEM ARCHITECTURE_V2.0 ]
          </h3>
          <div className="h-px flex-grow bg-current/20 grid-line origin-left" />
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
    <div 
      className="stack-card relative bg-[var(--color-dark)] border border-current/10 p-6 h-48 flex flex-col justify-between transition-all duration-300 group hover:border-neon-readable hover:-translate-y-1 hover:shadow-[0_10px_30px_-10px_rgba(0,0,0,0.5)] overflow-hidden"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {/* Hover Background Fill */}
      <div className="absolute inset-0 bg-neon-readable translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] z-0" />
      
      {/* Content */}
      <div className="relative z-10 flex flex-col h-full justify-between group-hover:text-white dark:group-hover:text-black transition-colors duration-300">
        
        {/* Header */}
        <div className="flex justify-between items-start">
          <span className="font-mono text-[10px] opacity-60 group-hover:opacity-100 transition-opacity">
            0{index + 1} // {skill.category.toUpperCase()}
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
          <h4 className="font-display text-2xl font-bold uppercase leading-none mb-2">
            <ScrambleText text={skill.name} active={hover} />
          </h4>
          
          {/* Dynamic Progress Bar */}
          <div className="w-full h-0.5 bg-current/10 mt-4 overflow-hidden relative">
            <div className={`absolute inset-0 bg-current transition-transform duration-1000 ${hover ? 'translate-x-0' : '-translate-x-full'}`} />
            {/* Glitch bar */}
            <div className={`absolute inset-0 bg-white mix-blend-difference translate-x-full ${hover ? 'animate-pulse' : ''}`} style={{ animationDuration: '0.2s' }} />
          </div>
        </div>
      </div>

      {/* Corner Accents */}
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-current opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 group-hover:border-white dark:group-hover:border-black" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-current opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20 group-hover:border-white dark:group-hover:border-black" />
    </div>
  );
}