"use client";
import dynamic from 'next/dynamic';
import MaskText from './MaskText';

// Lazy load ONLY the heavy 3D canvas
const HeroCanvas = dynamic(() => import('./HeroCanvas'), { 
  ssr: false,
  loading: () => <div className="absolute inset-0 flex items-center justify-center opacity-20" />
});

export default function HeroSection() {
  return (
    <section className="h-screen w-full relative flex items-center overflow-hidden bg-transparent px-6 md:px-20">
      {/* 3D Canvas - Soft organic element floating behind */}
      <div className="absolute inset-0 z-0 cursor-pointer overflow-hidden transition-opacity duration-1000">
        <HeroCanvas />
      </div>
      
      {/* Editorial Typography - Precise spacing, typographic focus */}
      <div className="relative z-10 w-full max-w-7xl mx-auto h-full pointer-events-none select-none flex flex-col items-start justify-center">
        <div className="will-change-transform max-w-2xl md:max-w-3xl lg:max-w-4xl relative z-10">
          <MaskText priority={true}>
            <h1 className="font-display font-medium text-[11vw] sm:text-6xl md:text-7xl lg:text-[7.5rem] leading-[1.05] tracking-tight text-[var(--color-text)] drop-shadow-sm">
              Digital engineering <br />
              <span className="text-[var(--color-accent)] italic">& creativity.</span>
            </h1>
          </MaskText>
        </div>
        <div className="will-change-transform mt-6 md:mt-10 max-w-sm md:max-w-lg relative z-10">
          <MaskText delay={0.1} priority={true}>
            <p className="font-body text-base md:text-lg lg:text-xl text-[var(--color-text)]/80 leading-relaxed font-light">
              Transforming complex systems into calm, intellectual, and highly functional web experiences.
            </p>
          </MaskText>
        </div>
        
        <div className="absolute bottom-6 md:bottom-10 left-0 font-sans text-[var(--color-text)]/60 text-[10px] md:text-xs uppercase tracking-widest z-20">
          Scroll to explore &darr;
        </div>
      </div>
    </section>
  );
}