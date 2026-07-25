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
      <section id="about" className="min-h-[60vh] flex flex-col justify-center py-24 px-6 md:px-20 border-b border-current/10">
        <div className="max-w-7xl mx-auto w-full">
          <p className="font-mono text-xs mb-8 opacity-50 tracking-widest uppercase">
            {'//'} {ABOUT.subtitle}
          </p>
          <ScrollReveal
            baseOpacity={0.1}
            enableBlur={true}
            baseRotation={3}
            blurStrength={4}
            textClassName="font-display text-4xl md:text-7xl lg:text-8xl leading-[0.9] text-[var(--color-text)] uppercase"
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
