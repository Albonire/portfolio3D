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
          className="relative w-[92vw] md:w-[800px] aspect-[4/3] md:aspect-video overflow-hidden bg-[var(--color-border)] border border-[var(--color-border)] z-10 shadow-sm group-hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:group-hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.4)] transition-shadow duration-700"
          intensity={5}
        >
          {/* Elegant soft border on hover instead of neon */}
          <div className="absolute inset-0 border border-transparent group-hover:border-[var(--color-accent)]/30 pointer-events-none z-50 transition-colors duration-700" />
  
          {/* Subtle overlay to help title pop, but keeping video clear */}
          <div className="absolute inset-0 bg-black/5 group-hover:bg-black/20 transition-colors duration-500 z-30 pointer-events-none" />
          
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
  
        </TiltCard>
  
        {/* Info - Title stays central but slightly higher */}
        <div className="absolute z-40 pointer-events-none top-[35%] md:top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full mix-blend-difference text-white px-4">
          <Magnetic>
            <a href={project.link} target="_blank" className="pointer-events-auto cursor-none block">
              <h2 className="font-display font-medium text-[8vw] md:text-[6vw] leading-none tracking-tight transition-colors duration-700 hover:text-[var(--color-accent)] break-words">
                {project.title}
              </h2>
            </a>
          </Magnetic>
        </div>

        {/* Technical Spec Module - Adaptive for Mobile */}
        <div className="absolute bottom-10 left-6 right-6 md:left-auto md:right-10 z-50 w-auto md:w-[400px] opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 md:translate-x-4 md:group-hover:translate-x-0 transition-all duration-700 delay-100 pointer-events-none">
          <div className="bg-[var(--bg-primary)]/90 backdrop-blur-md border border-[var(--color-border)] p-5 md:p-8 shadow-sm">
            <div className="flex justify-between items-center mb-3">
              <span className="font-sans font-medium text-[10px] md:text-xs text-[var(--color-accent)] tracking-widest uppercase">Project Spec</span>
              <span className="font-sans text-[var(--color-muted)] text-xs">{project.year}</span>
            </div>
            
            <p className="font-body text-sm text-[var(--color-text)] leading-relaxed mb-6 line-clamp-3 md:line-clamp-none">
              {project.description}
            </p>

            <div className="flex gap-2 flex-wrap">
              {project.tech.map(t => (
                <span key={t} className="font-sans text-[10px] text-[var(--color-muted)] px-2 py-1 bg-[var(--color-border)]/50 rounded-sm">
                  {t}
                </span>
              ))}
            </div>
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
                      <div className="w-screen h-screen flex flex-col justify-center items-center shrink-0 border-r border-[var(--color-border)] bg-[var(--bg-primary)] text-[var(--color-text)]">
                        <div className="text-center max-w-lg">
                          <MaskText>
                            <h2 className="font-display font-medium text-4xl md:text-6xl leading-[1.1] tracking-tight">
                              Selected
                            </h2>
                          </MaskText>
                          <MaskText delay={0.1}>
                            <h2 className="font-display font-medium text-4xl md:text-6xl leading-[1.1] tracking-tight text-[var(--color-accent)] italic">
                              Works.
                            </h2>
                          </MaskText>
                        </div>
                        <MaskText delay={0.4}>
                          <p className="font-sans text-[var(--color-muted)] text-sm tracking-widest uppercase mt-12 transition-opacity duration-1000">Scroll to explore</p>
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