"use client";
import dynamic from 'next/dynamic';
import MaskText from './MaskText';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';

// Lazy load heavy canvas and WebGL components
const HeroCanvas = dynamic(() => import('./HeroCanvas'), { 
  ssr: false,
  loading: () => <div className="absolute inset-0 flex items-center justify-center opacity-20" />
});

const SideRays = dynamic(() => import('./SideRays'), {
  ssr: false
});

export default function HeroSection() {
  const { theme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  const isDark = mounted && (resolvedTheme === 'dark' || theme === 'dark');

  return (
    <section className="h-screen w-full relative flex items-center overflow-hidden bg-transparent px-6 md:px-20">
      {/* SideRays - React Bits WebGL ray light active strictly in dark mode inside the Hero section */}
      {isDark && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden transition-opacity duration-700 opacity-90">
          <SideRays
            speed={2.5}
            rayColor1="#fb923c"
            rayColor2="#f59e0b"
            intensity={2}
            spread={2}
            origin="top-right"
            tilt={0}
            saturation={1.5}
            blend={0.75}
            falloff={1.6}
            opacity={1.0}
          />
        </div>
      )}

      {/* 3D Canvas - Soft organic element floating behind */}
      <div className="absolute inset-0 z-0 cursor-pointer overflow-hidden transition-opacity duration-1000">
        <HeroCanvas />
      </div>
      
      {/* Editorial Typography - Precise spacing, typographic focus */}
      <div className="relative z-10 w-full max-w-7xl mx-auto h-full pointer-events-none select-none flex flex-col items-start justify-center">
        <div className="will-change-transform max-w-2xl md:max-w-3xl lg:max-w-4xl relative z-10">
          <MaskText priority={true}>
            <h1 className="font-display font-medium text-[8.5vw] sm:text-6xl md:text-7xl lg:text-[7.5rem] leading-[1.05] tracking-tight text-[var(--color-text)] drop-shadow-sm">
              Digital engineering <br />
              <span className="text-[var(--color-accent)] italic">& creativity.</span>
            </h1>
          </MaskText>
        </div>

        <div className="will-change-transform mt-6 md:mt-10 max-w-sm md:max-w-lg relative z-10">
          <MaskText delay={0.1} priority={true}>
            <p className="font-body text-base md:text-lg lg:text-xl text-[var(--color-text)]/80 leading-relaxed font-light">
              Building high-performance systems where AI meets intuitive web design.
            </p>
          </MaskText>
        </div>
        
        <div className="absolute bottom-8 md:bottom-12 left-0 font-sans text-[var(--color-text)]/60 text-[10px] md:text-xs uppercase tracking-widest z-20">
          Scroll to explore &darr;
        </div>
      </div>
    </section>
  );
}
