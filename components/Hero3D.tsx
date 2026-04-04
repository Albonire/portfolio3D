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
    <section className="h-screen w-full relative flex items-center justify-center overflow-hidden bg-transparent px-6 md:px-12">
      {/* 3D Canvas - Soft organic element floating behind */}
      <div className="absolute inset-0 z-0 cursor-pointer overflow-hidden transition-opacity duration-1000">
        <HeroCanvas />
      </div>
      
      {/* Editorial Typography - Precise spacing, typographic focus */}
      <div className="relative z-10 max-w-4xl w-full mx-auto pointer-events-none select-none flex flex-col items-start justify-center">
        <div className="will-change-transform">
          <MaskText priority={true}>
            <h1 className="font-display font-medium text-5xl md:text-7xl lg:text-8xl leading-[1.1] tracking-tight text-[var(--color-text)]">
              Digital craft <br />
              <span className="text-[var(--color-accent)] italic">& engineering.</span>
            </h1>
          </MaskText>
        </div>
        <div className="will-change-transform mt-8 max-w-md">
          <MaskText delay={0.1} priority={true}>
            <p className="font-body text-base md:text-lg text-[var(--color-muted)] leading-relaxed">
              Transforming complex systems into calm, intellectual, and highly functional web experiences.
            </p>
          </MaskText>
        </div>
      </div>
      
      <div className="absolute bottom-10 left-6 md:left-12 font-sans text-[var(--color-muted)] text-[10px] md:text-xs uppercase tracking-widest z-20">
        Scroll to explore &darr;
      </div>
    </section>
  );
}