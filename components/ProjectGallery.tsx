"use client";
import { useRef, useState, useEffect, memo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { PROJECTS } from '@/data/content';
import Image from 'next/image';
import TiltCard from './TiltCard';
import MaskText from './MaskText';
import Magnetic from './Magnetic';  
import { PixelPlant, PlantType } from './PixelDivider';

if (typeof window !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
}

const PROJECT_PLANTS: PlantType[] = [
  "fernA",
  "flowerP",
  "mushroom",
  "berry",
  "dandel",
  "butterfly2",
  "ladybug",
  "snail",
  "dfly",
];

const ProjectCard = memo(function ProjectCard({ project, isActive, onHover, onLeave }: { 
  project: typeof PROJECTS[0], 
  isActive: boolean,
  onHover: (id: number) => void,
  onLeave: () => void
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    let cancelled = false;
    
    if (isActive) {
      // Small delay to avoid play/pause race condition
      const timer = setTimeout(() => {
        if (cancelled) return;
        video.play().catch(() => {});
      }, 50);
      return () => { cancelled = true; clearTimeout(timer); };
    } else {
      video.pause();
      video.currentTime = 0;
    }
  }, [isActive]);

  return (
    <div 
      className="w-screen h-screen flex flex-col justify-center items-center relative group shrink-0 border-r border-[var(--color-border)] bg-[var(--bg-primary)]"
      onMouseEnter={() => onHover(project.id)}
      onMouseLeave={onLeave}
    >
      
      {/* Media Container - Responsive Aspect Ratio */}
      <a href={project.link} target="_blank" className="block relative z-10 cursor-pointer">
        {/* Biophilic sprout peeking over project card frame */}
        <PixelPlant 
          type={PROJECT_PLANTS[project.id % PROJECT_PLANTS.length]} 
          flip={project.id % 2 === 1}
          className="absolute -top-3.5 left-8 text-base opacity-80 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-500 pointer-events-none z-50 drop-shadow-sm" 
        />
        <TiltCard
          className="relative w-[85vw] md:w-[800px] aspect-[4/3] md:aspect-video overflow-hidden bg-[var(--color-border)] border border-[var(--color-border)] shadow-sm group-hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] dark:group-hover:shadow-[0_10px_40px_-10px_rgba(0,0,0,0.4)] transition-shadow duration-700"
          intensity={5}
        >
          {/* Elegant soft border on hover instead of neon */}
          <div className="absolute inset-0 border border-transparent group-hover:border-[var(--color-accent)]/30 pointer-events-none z-50 transition-colors duration-700" />

          {/* Subtle overlay to help title pop, but keeping video clear */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity duration-500 z-30 pointer-events-none" />
          
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
        </a>
  
        {/* Title overlay */}
        <div className="absolute z-40 pointer-events-none top-[35%] md:top-[40%] left-1/2 -translate-x-1/2 -translate-y-1/2 text-center w-full px-4 drop-shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
          <Magnetic>
              <h2 className="font-display font-medium text-[8vw] md:text-[5vw] leading-none tracking-tight text-[var(--color-text)] mix-blend-difference transition-colors duration-500 group-hover:text-[var(--color-accent)] break-words">
                {project.title}
              </h2>
          </Magnetic>
        </div>

        {/* Project Info Banner — Editorial Calm Glassmorphism */}
        <div className="absolute bottom-8 left-5 right-5 md:left-6 md:right-auto z-50 w-auto md:w-[380px] opacity-0 group-hover:opacity-100 translate-y-6 group-hover:translate-y-0 transition-all duration-700 delay-150 pointer-events-none">
          <div className="bg-[var(--bg-primary)] dark:bg-[#1a1a18]/95 backdrop-blur-lg border border-[var(--color-border)] rounded-sm p-5 md:p-6 shadow-md">
            <div className="flex justify-between items-center mb-4">
              <span className="font-sans font-medium text-[10px] text-[var(--color-accent)] tracking-[0.2em] uppercase">Project</span>
              <span className="font-sans text-[var(--color-muted)] text-xs font-medium">{project.year}</span>
            </div>
            
            <p className="font-body text-sm text-[var(--color-text)] leading-relaxed mb-5 line-clamp-3 md:line-clamp-none">
              {project.description}
            </p>

            <div className="flex gap-1.5 flex-wrap">
              {project.tech.map(t => (
                <span key={t} className="font-sans text-[10px] text-[var(--color-muted)] px-2 py-1 border border-[var(--color-border)] rounded-sm">
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
  });
  
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
        force3D: true,
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
      <section ref={containerRef} id="work" className="relative h-[250vh] md:h-[500vh] bg-[var(--bg-primary)] z-20">
        
        {/* STICKY VIEWPORT: Stays fixed while scrolling the parent */}
        <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden">
          
          {/* SLIDER: The actual horizontal content */}
          <div ref={sliderRef} className="flex h-full w-max will-change-transform">
            
                      {/* SLIDE 0: INTRO */}
                      <div className="w-screen h-screen flex flex-col justify-center items-center shrink-0 border-r border-[var(--color-border)] bg-[var(--bg-primary)] text-[var(--color-text)]">
                        <div className="text-center max-w-lg relative">
                          <PixelPlant type="frog" className="absolute -top-6 right-4 text-base opacity-80 pointer-events-none" />
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