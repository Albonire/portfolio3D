import { EDUCATION } from "@/data/content";

export default function EducationBrutalist() {
  return (
    <section className="py-32 px-6 md:px-20 border-b border-current/10 bg-[var(--color-dark)] text-[var(--color-text)] transition-colors duration-500">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-10 md:gap-20">
        <div className="md:w-1/3">
          <h3 className="font-display text-4xl md:text-6xl uppercase leading-[0.8] sticky top-32">
            ACADEMIC<br/>DATA<span className="text-neon-readable">.LOG</span>
          </h3>
        </div>
        
        <div className="md:w-2/3 flex flex-col gap-12">
          {EDUCATION.map((edu) => (
            <div key={edu.id} className="group relative pl-8 border-l border-current/20 hover:border-neon transition-colors duration-300">
              <span className="absolute -left-[5px] top-0 w-2 h-2 bg-neon opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <div className="flex justify-between items-baseline mb-2">
                <h4 className="font-display text-3xl uppercase">{edu.title}</h4>
                <span className="font-mono text-neon-readable text-sm">{edu.year}</span>
              </div>
              
              <p className="font-mono text-sm opacity-60 mb-4 uppercase tracking-widest">{edu.institution}</p>
              <p className="font-sans text-lg opacity-80 max-w-xl">{edu.description}</p>
              
              {edu.link && (
                <a href={edu.link} target="_blank" className="inline-block mt-6 font-mono text-xs border border-current/20 px-4 py-2 hover:bg-neon hover:text-black transition-all">
                  [VIEW CERTIFICATE]
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
