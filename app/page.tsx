import ProjectGallery from "@/components/ProjectGallery";
import StackBrutalist from "@/components/StackBrutalist";
import EducationBrutalist from "@/components/EducationBrutalist";
import IntroScroll from "@/components/IntroScroll";
import HeroSection from "@/components/Hero3D";
import { ABOUT } from "@/data/content";

export default function Home() {
  return (
    <>
      <HeroSection />
      <section id="about" className="min-h-[60vh] flex flex-col justify-center py-24 px-6 md:px-20 border-b border-current/10">
        <div className="max-w-7xl">
          <p className="font-mono text-xs mb-8 opacity-50 tracking-widest uppercase">
            {'//'} {ABOUT.subtitle}
          </p>
          <IntroScroll description={ABOUT.description} />
        </div>
      </section>
      <ProjectGallery />
      <StackBrutalist />
      <EducationBrutalist />
    </>
  );
}
