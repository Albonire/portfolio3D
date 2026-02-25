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
    <section className="h-screen w-full relative flex items-center justify-center overflow-hidden bg-transparent">
      {/* Background Text - ALWAYS VISIBLE TO BROWSER SCANNER */}
      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-0 select-none">
        <div className="will-change-transform">
          <MaskText priority={true}>
            <h1 className="font-display text-[18vw] md:text-[15vw] leading-none text-transparent bg-clip-text bg-gradient-to-b from-current to-transparent opacity-10 uppercase tracking-tighter">
              Creative
            </h1>
          </MaskText>
        </div>
        <div className="will-change-transform">
          <MaskText delay={0.1} priority={true}>
            <h1 className="font-display text-[18vw] md:text-[15vw] leading-none text-current uppercase tracking-tighter mix-blend-overlay opacity-50">
              Developer
            </h1>
          </MaskText>
        </div>
      </div>
      
      {/* 3D Canvas - Loaded in background */}
      <div className="absolute inset-0 z-10 cursor-pointer overflow-hidden">
        <HeroCanvas />
      </div>
      
      <div className="absolute bottom-10 left-10 font-mono text-current text-sm animate-pulse z-20 font-bold mix-blend-difference">
        [SCROLL TO EXPLORE]
      </div>
    </section>
  );
}