"use client";
import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { PROJECTS } from '@/data/content';
import Image from 'next/image';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

export default function ProjectGallery() {
  const containerRef = useRef<HTMLDivElement>(null); // El contenedor alto (scroll track)
  const stickyRef = useRef<HTMLDivElement>(null);    // El viewport sticky
  const sliderRef = useRef<HTMLDivElement>(null);    // La tira horizontal
  const [activeVideo, setActiveVideo] = useState<number | null>(null);

  // Intro + Projects
  const slides = [0, ...PROJECTS]; 

  useEffect(() => {
    if (!containerRef.current || !sliderRef.current || !stickyRef.current) return;

    const ctx = gsap.context(() => {
      const slider = sliderRef.current!;
      const container = containerRef.current!;
      
      // Calculate total movable width
      // (Slider Width - Viewport Width)
      const maxScroll = -(slider.scrollWidth - window.innerWidth);

      gsap.to(slider, {
        x: maxScroll,
        ease: "none",
        scrollTrigger: {
          trigger: container, // Trigger based on the tall parent
          start: "top top",
          end: "bottom bottom", // Scroll until the parent finishes
          scrub: 1,             // Smooth scrubbing
          invalidateOnRefresh: true,
        }
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    // PARENT CONTAINER: Defines the SCROLL DURATION via height.
    // 500vh means user scrolls 5 screen heights to finish the gallery.
    <section ref={containerRef} className="relative h-[500vh] bg-[var(--color-dark)] z-20">
      
      {/* STICKY VIEWPORT: Stays fixed while scrolling the parent */}
      <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden">
        
        {/* SLIDER: The actual horizontal content */}
        <div ref={sliderRef} className="flex h-full w-max will-change-transform">
          
          {/* SLIDE 0: INTRO */}
          <div className="w-screen h-screen flex flex-col justify-center items-center shrink-0 border-r border-current/10 bg-[var(--color-dark)] text-[var(--color-text)]">
             <h2 className="font-display text-[8vw] leading-none uppercase text-center">
               SELECTED<br/>
               <span className="text-neon stroke-black dark:stroke-neon dark:text-transparent">WORKS</span>
             </h2>
             <p className="font-mono text-neon mt-8 animate-pulse text-xl">[ SCROLL TO EXPLORE &gt;&gt;&gt; ]</p>
          </div>

          {/* SLIDES 1..N: PROJECTS */}
          {PROJECTS.map((project, index) => (
            <div key={project.id} className="w-screen h-screen flex flex-col justify-center items-center relative group shrink-0 border-r border-current/10 bg-[var(--color-dark)]">
              
              {/* Media Container - Fixed border to prevent layout shift */}
              <div 
                className="relative w-[90vw] md:w-[700px] h-[50vh] md:h-[450px] overflow-hidden bg-gray-900 border-2 border-transparent transition-all duration-300 z-10 shadow-2xl"
                onMouseEnter={() => setActiveVideo(project.id)}
                onMouseLeave={() => setActiveVideo(null)}
              >
                {/* Border effect separate div to avoid box-model issues */}
                <div className="absolute inset-0 border-2 border-transparent group-hover:border-neon pointer-events-none z-50 transition-colors duration-300" />

                <div className="absolute inset-0 bg-neon opacity-0 group-hover:opacity-10 transition-opacity z-30 mix-blend-multiply pointer-events-none" />
                
                {project.video ? (
                  <>
                    <Image 
                      src={project.image} 
                      alt={project.title}
                      fill
                      className={`object-cover transition-opacity duration-500 ${activeVideo === project.id ? 'opacity-0' : 'opacity-100 grayscale group-hover:grayscale-0'}`}
                    />
                    <video 
                      src={project.video}
                      loop 
                      muted 
                      playsInline
                      autoPlay
                      className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${activeVideo === project.id ? 'opacity-100' : 'opacity-0'}`}
                    />
                  </>
                ) : (
                  <Image 
                    src={project.image} 
                    alt={project.title}
                    fill
                    className="object-cover grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-in-out"
                  />
                )}

                <div className="glitch-layer hidden group-hover:block absolute inset-0 z-20 bg-transparent mix-blend-overlay" />
              </div>

              {/* Info */}
              <div className="absolute z-40 pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full mix-blend-difference text-white">
                <a href={project.link} target="_blank" className="pointer-events-auto cursor-none block">
                  <h2 className="font-display text-[8vw] leading-none uppercase tracking-tighter translate-y-[40%] group-hover:translate-y-[-20%] transition-transform duration-500 ease-in-out hover:text-neon">
                    {project.title}
                  </h2>
                </a>
                <div className="flex justify-between items-center w-[90vw] md:w-[700px] mx-auto mt-4 px-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100 bg-black/50 backdrop-blur-sm p-2 rounded">
                  <div className="flex gap-2 flex-wrap">
                    {project.tech.map(t => (
                      <span key={t} className="font-mono text-[10px] md:text-xs bg-neon text-black px-2 py-1 uppercase">{t}</span>
                    ))}
                  </div>
                  <span className="font-mono text-neon text-lg font-bold">{project.year}</span>
                </div>
              </div>
              
              <div className="absolute bottom-10 left-10 font-mono opacity-10 text-[12rem] -z-10 select-none font-display text-[var(--color-text)]">
                0{index + 1}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}