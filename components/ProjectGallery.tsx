  "use client";
  import { useRef, useState, useEffect } from 'react';
  import gsap from 'gsap';
  import { useGSAP } from '@gsap/react';
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
      <div 
        className="w-screen h-screen flex flex-col justify-center items-center relative group shrink-0 border-r border-current/10 bg-[var(--color-dark)]"
        onMouseEnter={() => onHover(project.id)}
        onMouseLeave={onLeave}
      >
        
        {/* Media Container - Responsive Aspect Ratio */}
        <TiltCard
          className="relative w-[92vw] md:w-[800px] aspect-[4/3] md:aspect-video overflow-hidden bg-gray-900 border border-current/10 z-10 shadow-[0_20px_50px_rgba(0,0,0,0.3)] group-hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
          intensity={10}
        >
          {/* Border effect */}
          <div className="absolute inset-0 border-2 border-transparent group-hover:border-neon-readable pointer-events-none z-50 transition-colors duration-500" />
  
          {/* Subtle overlay to help title pop, but keeping video clear */}
          <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-colors duration-500 z-30 pointer-events-none" />
          
          {project.video ? (
            <>
              <Image 
                src={project.image} 
                alt={project.title}
                fill
                className={`object-cover transition-all duration-700 ${isActive ? 'opacity-0 scale-110' : 'opacity-100 grayscale-[0.5] group-hover:grayscale-0'}`}
                priority={project.id === 1}
                loading={project.id === 1 ? "eager" : "lazy"}
                sizes="(max-width: 768px) 92vw, 800px"
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
              priority={project.id === 1}
              loading={project.id === 1 ? "eager" : "lazy"}
              sizes="(max-width: 768px) 92vw, 800px"
              className="object-cover grayscale-[0.5] group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700 ease-in-out"
            />
          )}
  
          <div className="glitch-layer hidden group-hover:block absolute inset-0 z-20 bg-transparent mix-blend-overlay opacity-30" />
        </TiltCard>
  
        {/* Info - Title stays central but slightly higher */}
        <div className="absolute z-40 pointer-events-none top-[35%] md:top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full mix-blend-difference text-white px-4">
          <Magnetic>
            <a href={project.link} target="_blank" className="pointer-events-auto cursor-none block">
              <h2 className="font-display text-[10vw] md:text-[8vw] leading-none uppercase tracking-tighter transition-transform duration-700 hover:text-neon-readable break-words">
                {project.title}
              </h2>
            </a>
          </Magnetic>
        </div>

        {/* Technical Spec Module - Adaptive for Mobile */}
        <div className="absolute bottom-10 left-6 right-6 md:left-auto md:right-10 z-50 w-auto md:w-[400px] opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 md:translate-x-10 md:group-hover:translate-x-0 transition-all duration-700 delay-200 pointer-events-none">
          <div className="bg-white/95 dark:bg-black/95 backdrop-blur-sm border-l-2 border-neon-readable p-4 md:p-6 shadow-[20px_20px_60px_rgba(0,0,0,0.1)] dark:shadow-[20px_20px_60px_rgba(0,0,0,0.5)]">
            <div className="flex justify-between items-start mb-2 md:mb-4">
              <span className="font-mono text-[9px] md:text-[10px] text-neon-readable tracking-[0.2em] uppercase">Project_Spec_v2</span>
              <span className="font-mono text-black/40 dark:text-white/40 text-[9px] md:text-[10px]">{project.year}</span>
            </div>
            
            <p className="font-mono text-xs md:text-sm text-black/80 dark:text-white/90 leading-relaxed mb-4 md:mb-6 line-clamp-3 md:line-clamp-none">
              {project.description}
            </p>

            <div className="flex gap-1.5 md:gap-2 flex-wrap">
              {project.tech.map(t => (
                <span key={t} className="font-mono text-[8px] md:text-[9px] border border-black/10 dark:border-white/20 text-black/60 dark:text-white/60 px-1.5 py-0.5 uppercase tracking-wider">
                  {t}
                </span>
              ))}
            </div>
          </div>
          
          {/* Decorative corner element */}
          <div className="absolute -top-2 -right-2 w-4 h-4 border-t-2 border-r-2 border-neon-readable" />
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
  
    useGSAP(() => {
      if (!sliderRef.current || !containerRef.current) return;

      const slider = sliderRef.current;
      const container = containerRef.current;
      
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
    }, { scope: containerRef });
  
    return (
      // PARENT CONTAINER: Optimized height for mobile to avoid dead space
      <section ref={containerRef} id="work" className="relative h-[250vh] md:h-[500vh] bg-[var(--color-dark)] z-20">
        
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
            {PROJECTS.map((project) => (
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