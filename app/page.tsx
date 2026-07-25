import ProjectGallery from "@/components/ProjectGallery";
import StackBrutalist from "@/components/StackBrutalist";
import EducationBrutalist from "@/components/EducationBrutalist";
import ScrollReveal from "@/components/ScrollReveal";
import HeroSection from "@/components/Hero3D";
import Contact from "@/components/Contact";
import FloatingCV from "@/components/FloatingCV";
import { ABOUT } from "@/data/content";

export default function Home() {
  return (
    <>
      <HeroSection />
      <section id="about" className="min-h-[85vh] flex flex-col justify-center py-32 md:py-48 px-6 md:px-20 border-b border-current/10">
        <div className="max-w-7xl mx-auto w-full">
          <p className="font-mono text-xs md:text-sm mb-12 opacity-60 tracking-widest uppercase">
            {'//'} {ABOUT.subtitle}
          </p>
          <ScrollReveal
            baseOpacity={0.05}
            enableBlur={true}
            baseRotation={3}
            blurStrength={6}
            wordAnimationEnd="top 25%"
            textClassName="font-display text-4xl sm:text-6xl md:text-8xl lg:text-[7rem] xl:text-[8rem] leading-[0.95] text-[var(--color-text)] uppercase font-bold tracking-tight"
          >
            {ABOUT.description}
          </ScrollReveal>
        </div>
      </section>
      <ProjectGallery />
      <StackBrutalist />
      <EducationBrutalist />
      <Contact />
      <FloatingCV />
    </>
  );
}
