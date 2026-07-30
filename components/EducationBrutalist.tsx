import { EDUCATION } from "@/data/content";
import { PixelPlant, PlantType } from "./PixelDivider";

const EDU_PLANTS: PlantType[] = ["clover", "clover", "clover"];

export default function EducationBrutalist() {
  return (
    <section className="py-16 md:py-32 px-6 md:px-20 bg-[var(--bg-primary)] text-[var(--color-text)] transition-colors duration-500">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row gap-12 md:gap-20">
        <div className="md:w-1/3">
          <h3 className="font-display font-medium text-4xl md:text-5xl tracking-tight leading-[1] relative md:sticky md:top-32 mb-8 md:mb-0">
            Academic<br/>Background<span className="text-[var(--color-accent)] italic">.</span>
          </h3>
        </div>
        
        <div className="md:w-2/3 flex flex-col gap-12">
          {EDUCATION.map((edu, i) => (
            <div key={edu.id} className="group relative pl-8 border-l border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors duration-300">
              <span className="absolute left-0 -top-3 -translate-x-1/2 flex items-center justify-center pointer-events-none z-10">
                <PixelPlant 
                  type={EDU_PLANTS[i % EDU_PLANTS.length]} 
                  flip={i % 2 === 1}
                  className="text-sm opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all duration-300" 
                />
              </span>
              
              <div className="flex justify-between items-baseline mb-2 flex-wrap gap-2">
                <h4 className="font-display font-medium text-2xl md:text-3xl">{edu.title}</h4>
                <span className="font-sans text-[var(--color-accent)] text-sm font-medium">{edu.year}</span>
              </div>
              
              <p className="font-sans text-[var(--color-muted)] text-sm mb-4 uppercase tracking-widest">{edu.institution}</p>
              <p className="font-body text-base text-[var(--color-text)]/90 leading-relaxed max-w-xl">{edu.description}</p>
              
              {edu.link && (
                edu.disabled || edu.link === "#" ? (
                  <span className="inline-flex items-center gap-2 mt-6 font-sans tracking-widest uppercase text-[10px] border border-[var(--color-border)] px-4 py-2 text-[var(--color-muted)]/50 opacity-50 cursor-not-allowed select-none">
                    <span>View Certificate &rarr;</span>
                  </span>
                ) : (
                  <a href={edu.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 mt-6 font-sans tracking-widest uppercase text-[10px] border border-[var(--color-border)] px-4 py-2 text-[var(--color-muted)] hover:bg-[var(--color-accent)] hover:text-white hover:border-[var(--color-accent)] transition-all">
                    <span>View Certificate &rarr;</span>
                  </a>
                )
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
