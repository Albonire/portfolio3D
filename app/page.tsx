import HeroSection from "@/components/Hero3D";
import ProjectGallery from "@/components/ProjectGallery";
import StackBrutalist from "@/components/StackBrutalist";
import EducationBrutalist from "@/components/EducationBrutalist";
import { ABOUT } from "@/data/content";

export default function Home() {
  return (
    <div className="flex flex-col w-full min-h-screen bg-[var(--color-dark)]">
      <section id="hero">
        <HeroSection />
      </section>
      
      {/* Intro Section */}
      <section className="min-h-[60vh] flex flex-col justify-center py-24 px-6 md:px-20 border-b border-current/10 transition-colors duration-500 relative overflow-hidden z-10 bg-[var(--color-dark)] text-[var(--color-text)]">
        <div className="max-w-7xl w-full mx-auto z-10">
          <p className="font-mono text-xs md:text-sm text-black dark:text-neon mb-8 tracking-widest uppercase">
            // {ABOUT.subtitle}
          </p>
          <h2 className="font-display text-4xl md:text-7xl lg:text-8xl leading-[0.9] text-[var(--color-text)] uppercase mb-12">
            {ABOUT.description.split(" ").map((word, i) => (
              <span key={i} className="inline-block hover:text-neon transition-colors duration-300 mr-4 cursor-default">
                {word}
              </span>
            ))}
          </h2>
        </div>
      </section>

      {/* Projects - Sticky Horizontal Scroll */}
      <section id="work">
        <ProjectGallery />
      </section>

      {/* About/Stack/Education */}
      <section id="about">
        <StackBrutalist />
        <EducationBrutalist />
      </section>

      {/* Contact / CTA */}
      <section id="contact" className="relative z-30 min-h-screen flex flex-col items-center justify-center overflow-hidden transition-colors duration-500
        bg-neon text-black 
        dark:bg-black dark:text-neon"
      >
        <div className="absolute inset-0 bg-noise opacity-20 pointer-events-none" />
        
        <p className="font-mono text-sm md:text-xl tracking-widest mb-10 z-10">
          [ READY TO START? ]
        </p>

        <h2 className="font-display text-[15vw] leading-[0.8] text-center cursor-none z-10 group relative">
          <span className="block group-hover:scale-110 transition-transform duration-700 ease-in-out">
            LET'S
          </span>
          <span className="block group-hover:-scale-x-110 transition-transform duration-700 ease-in-out text-transparent stroke-text dark:stroke-neon stroke-black">
            TALK
          </span>
        </h2>

        <div className="mt-20 flex gap-8 md:gap-20 font-display text-xl md:text-3xl z-10">
          <a href="mailto:contact@fabian.dev" className="hover:line-through decoration-4 decoration-black dark:decoration-neon transition-all">
            CONTACT@FABIAN.DEV
          </a>
        </div>
      </section>
      
      <footer className="relative z-30 py-10 px-6 md:px-10 border-t border-current/10 flex flex-col md:flex-row justify-between items-center font-mono uppercase text-xs md:text-sm mix-blend-difference opacity-80 bg-[var(--color-dark)] text-[var(--color-text)]">
        <div className="mb-4 md:mb-0">© 2025 {ABOUT.title}</div>
        <div className="flex gap-6">
           {ABOUT.social.map((s) => (
             <a key={s.label} href={s.url} className="hover:text-black dark:hover:text-neon transition-colors" target="_blank" rel="noopener noreferrer">
               [{s.label}]
             </a>
           ))}
        </div>
      </footer>
    </div>
  );
}