"use client";
import Magnetic from './Magnetic';
import { PixelPlant } from './PixelDivider';

export default function FloatingCV() {
  const enView = "https://drive.google.com/file/d/11lMDnIpVyGw1Wb7N24kRNlKkNPLeBXbD/view";
  const enDl = "https://drive.google.com/uc?export=download&id=11lMDnIpVyGw1Wb7N24kRNlKkNPLeBXbD";
  const esView = "https://drive.google.com/file/d/1xlWsQT0kjjQAHjjJEHAtgDd-TgMLMLnY/view";
  const esDl = "https://drive.google.com/uc?export=download&id=1xlWsQT0kjjQAHjjJEHAtgDd-TgMLMLnY";

  return (
    <div className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-[100] group pointer-events-auto">
      <div className="relative flex items-center">
        <Magnetic>
          {/* Floating Minimalist Capsule Dock */}
          <div className="relative flex items-center gap-2 px-4 py-2.5 rounded-full border border-[var(--color-border)] bg-[var(--bg-primary)]/85 backdrop-blur-xl shadow-lg cursor-pointer transition-all duration-300 group-hover:border-[var(--color-accent)] group-hover:shadow-xl">
            <PixelPlant type="clover" className="absolute -top-2.5 left-4 text-xs opacity-75 group-hover:opacity-100 group-hover:-translate-y-0.5 transition-all duration-300" />
            <span className="font-mono text-xs tracking-[0.2em] uppercase font-medium text-[var(--color-text)]">
              CV
            </span>
            <span className="font-sans text-[10px] text-[var(--color-muted)] tracking-wider uppercase border-l border-[var(--color-border)] pl-2">
              PDF
            </span>
          </div>
        </Magnetic>

        {/* Bridge area for smooth hover state */}
        <div className="absolute top-0 left-full w-4 h-full bg-transparent pointer-events-auto z-0" />

        {/* Sharp Rectangular Pop-out Menu */}
        <div className="absolute left-full top-1/2 -translate-y-1/2 translate-x-3 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-1 group-hover:pointer-events-auto transition-all duration-300 ease-out flex flex-col rounded-none border border-[var(--color-border)] bg-[var(--bg-primary)]/95 backdrop-blur-2xl shadow-2xl overflow-hidden min-w-[210px] z-10">
          
          {/* English CV Row */}
          <div className="flex items-center border-b border-[var(--color-border)]">
            <div className="px-3 py-2.5 font-mono text-[10px] tracking-widest uppercase font-semibold text-[var(--color-muted)] border-r border-[var(--color-border)] w-12 text-center bg-[var(--color-border)]/20">
              EN
            </div>
            <a 
              href={enView} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 px-3 py-2.5 text-xs font-sans text-center text-[var(--color-text)] hover:bg-[var(--color-accent)] hover:text-white dark:hover:text-[#1A1A18] transition-colors duration-200"
            >
              View
            </a>
            <a 
              href={enDl} 
              className="flex-1 px-3 py-2.5 text-xs font-sans text-center text-[var(--color-text)] border-l border-[var(--color-border)] hover:bg-[var(--color-accent)] hover:text-white dark:hover:text-[#1A1A18] transition-colors duration-200"
            >
              Save
            </a>
          </div>

          {/* Spanish CV Row */}
          <div className="flex items-center">
            <div className="px-3 py-2.5 font-mono text-[10px] tracking-widest uppercase font-semibold text-[var(--color-muted)] border-r border-[var(--color-border)] w-12 text-center bg-[var(--color-border)]/20">
              ES
            </div>
            <a 
              href={esView} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 px-3 py-2.5 text-xs font-sans text-center text-[var(--color-text)] hover:bg-[var(--color-accent)] hover:text-white dark:hover:text-[#1A1A18] transition-colors duration-200"
            >
              Ver
            </a>
            <a 
              href={esDl} 
              className="flex-1 px-3 py-2.5 text-xs font-sans text-center text-[var(--color-text)] border-l border-[var(--color-border)] hover:bg-[var(--color-accent)] hover:text-white dark:hover:text-[#1A1A18] transition-colors duration-200"
            >
              Guardar
            </a>
          </div>

        </div>
      </div>
    </div>
  );
}
