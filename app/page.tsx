import ProjectGallery from "@/components/ProjectGallery";
import StackBrutalist from "@/components/StackBrutalist";
import EducationBrutalist from "@/components/EducationBrutalist";
import ScrollReveal from "@/components/ScrollReveal";
import HeroSection from "@/components/Hero3D";
import Contact from "@/components/Contact";
import FloatingCV from "@/components/FloatingCV";
import PixelDivider, { PixelPlant } from "@/components/PixelDivider";
import { ABOUT } from "@/data/content";

export default function Home() {
  return (
    <>
      <HeroSection />
      <PixelDivider variant="horizonte" />
      <section id="about" className="min-h-[85vh] flex flex-col justify-center py-32 md:py-48 px-6 md:px-20">
        <div className="max-w-7xl mx-auto w-full">
          <p className="font-mono text-xs md:text-sm mb-12 opacity-60 tracking-widest uppercase flex items-center gap-2">
            <PixelPlant type="clover" className="text-base opacity-75" />
            {'//'} {ABOUT.subtitle}
          </p>
          <ScrollReveal
            baseOpacity={0.1}
            enableBlur={true}
            baseRotation={3}
            blurStrength={5}
            wordAnimationEnd="bottom 38%"
            rotationEnd="bottom 38%"
            textClassName="font-display text-4xl sm:text-6xl md:text-8xl lg:text-[7rem] xl:text-[8rem] leading-[0.95] text-[var(--color-text)] uppercase font-bold tracking-tight"
          >
            {ABOUT.description}
          </ScrollReveal>
        </div>
      </section>
      <PixelDivider variant="sendero" />
      <ProjectGallery />
      <PixelDivider variant="horizonte" />
      <StackBrutalist />
      <PixelDivider variant="sendero" />
      <EducationBrutalist />
      <PixelDivider variant="horizonte" />
      <Contact />
      <PixelDivider variant="pradera" />
      <FloatingCV />
    </>
  );
}
