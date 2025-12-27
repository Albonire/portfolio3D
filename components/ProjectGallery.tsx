  "use client";
  import { useEffect, useRef, useState } from 'react';
  import gsap from 'gsap';
  import ScrollTrigger from 'gsap/ScrollTrigger';
  import { PROJECTS } from '@/data/content';
  import Image from 'next/image';
  import TiltCard from './TiltCard';
  import MaskText from './MaskText';
  import Magnetic from './Magnetic';  
  if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
  }
  
  function ProjectCard({ project, isActive, onHover, onLeave }: { 
    project: typeof PROJECTS[0], 
    isActive: boolean,
    onHover: (id: number) => void,
    onLeave: () => void
  }) {
    const videoRef = useRef<HTMLVideoElement>(null);
  
    useEffect(() => {
      if (!videoRef.current) return;
      
      if (isActive) {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.log("Video play prevented:", error);
          });
        }
      } else {
        videoRef.current.pause();
        videoRef.current.currentTime = 0;
      }
    }, [isActive]);
  
    return (
      <div className="w-screen h-screen flex flex-col justify-center items-center relative group shrink-0 border-r border-current/10 bg-[var(--color-dark)]">
        
        {/* Media Container - 16:9 Aspect Ratio */}
        <TiltCard
          className="relative w-[90vw] md:w-[800px] aspect-video overflow-hidden bg-gray-900 border border-current/10 z-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          onMouseEnter={() => onHover(project.id)}
          onMouseLeave={onLeave}
          intensity={10}
        >
          {/* Border effect */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-neon-readable pointer-events-none z-50 transition-colors duration-500" />
  
          {/* Subtle dark overlay that fades out on hover */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-500 z-30 pointer-events-none" />
          
          {project.video ? (
            <>
              <Image 
                src={project.image} 
                alt={project.title}
                fill
                className={`object-cover transition-all duration-700 ${isActive ? 'opacity-0 scale-110' : 'opacity-100 grayscale-[0.5] group-hover:grayscale-0'}`}
                priority={false}
                loading="lazy"
              />
              <video 
                ref={videoRef}
                src={project.video}
                loop 
                muted 
                playsInline
                preload="none"
                crossOrigin="anonymous"
                suppressHydrationWarning
                className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`}
              />
            </>
          ) : (
            <Image 
              src={project.image} 
              alt={project.title}
              fill
              className="object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-in-out"
            />
          )}
  
          <div className="glitch-layer hidden group-hover:block absolute inset-0 z-20 bg-transparent mix-blend-overlay opacity-30" />
        </TiltCard>
  
        {/* Info - Refined animation */}
        <div className="absolute z-40 pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full mix-blend-difference text-white">
          <Magnetic>
            <a href={project.link} target="_blank" className="pointer-events-auto cursor-none block">
              <h2 className="font-display text-[8vw] leading-none uppercase tracking-tighter translate-y-[20%] group-hover:translate-y-[-10%] transition-transform duration-700 cubic-bezier(0.23, 1, 0.32, 1) hover:text-neon-readable">
                {project.title}
              </h2>
            </a>
          </Magnetic>
          <div className="flex justify-between items-center w-[90vw] md:w-[800px] mx-auto mt-8 px-6 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-100 bg-black/40 backdrop-blur-md p-3 border border-white/10 rounded">
            <div className="flex gap-3 flex-wrap">
              {project.tech.map(t => (
                <span key={t} className="font-mono text-[10px] md:text-xs bg-neon-readable text-white dark:text-black px-3 py-1 uppercase tracking-wider font-bold">{t}</span>
              ))}
            </div>
            <span className="font-mono text-neon-readable text-xl font-black">{project.year}</span>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-10 font-mono opacity-5 text-[12rem] -z-10 select-none font-display text-[var(--color-text)]">
          0{project.id}
        </div>
      </div>
    );
  }
  
  export default function ProjectGallery() {
    const containerRef = useRef<HTMLDivElement>(null); // The tall parent container
    const stickyRef = useRef<HTMLDivElement>(null);    // The sticky viewport
    const sliderRef = useRef<HTMLDivElement>(null);    // The horizontal slider
    const [activeVideo, setActiveVideo] = useState<number | null>(null);
  
    // Slides including intro slide
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
                        <div className="text-center">
                          <MaskText>
                            <h2 className="font-display text-[8vw] leading-none uppercase">
                              SELECTED
                            </h2>
                          </MaskText>
                          <MaskText delay={0.1}>
                            <h2 className="font-display text-[8vw] leading-none uppercase text-neon-readable">
                              WORKS
                            </h2>
                          </MaskText>
                        </div>
                        <MaskText delay={0.4}>
                          <p className="font-mono text-neon-readable mt-8 animate-pulse text-xl">[ SCROLL TO EXPLORE &gt;&gt;&gt; ]</p>
                        </MaskText>
                      </div>  
            {/* SLIDES 1..N: PROJECTS */}
            {PROJECTS.map((project, index) => (
              <ProjectCard 
                key={project.id}
                project={project}
                isActive={activeVideo === project.id}
                onHover={setActiveVideo}
                onLeave={() => setActiveVideo(null)}
              />
            ))}
          </div>
        </div>
      </section>
    );
  }