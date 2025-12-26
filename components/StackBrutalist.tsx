import { SKILLS } from "@/data/content";

export default function StackBrutalist() {
  return (
    <section className="relative z-30 py-32 px-6 md:px-20 border-b border-current/10 bg-[var(--color-dark)] text-[var(--color-text)] transition-colors duration-500">
      <div className="max-w-7xl mx-auto">
        <h3 className="font-mono text-neon-readable text-sm mb-10 tracking-widest uppercase">[ SYSTEM ARCHITECTURE ]</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-px bg-current/20 border border-current/20">
          {SKILLS.map((skill) => (
            <div key={skill.name} className="bg-[var(--color-dark)] p-8 hover:bg-neon hover:text-black transition-colors duration-300 group">
              <span className="font-mono text-xs opacity-50 block mb-2">// {skill.category}</span>
              <h4 className="font-display text-xl md:text-2xl font-bold uppercase">{skill.name}</h4>
              <div className="w-full h-1 bg-current/10 mt-4 overflow-hidden">
                <div 
                  className="h-full bg-current group-hover:bg-black transition-all duration-1000 w-0 group-hover:w-full" 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}