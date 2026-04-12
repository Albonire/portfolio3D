"use client";
import Magnetic from './Magnetic';
import { useRef } from 'react';

export default function FloatingCV() {
  const enView = "https://drive.google.com/file/d/11lMDnIpVyGw1Wb7N24kRNlKkNPLeBXbD/view";
  const enDl = "https://drive.google.com/uc?export=download&id=11lMDnIpVyGw1Wb7N24kRNlKkNPLeBXbD";
  const esView = "https://drive.google.com/file/d/1xlWsQT0kjjQAHjjJEHAtgDd-TgMLMLnY/view";
  const esDl = "https://drive.google.com/uc?export=download&id=1xlWsQT0kjjQAHjjJEHAtgDd-TgMLMLnY";

  return (
    <div className="fixed bottom-6 left-6 md:bottom-10 md:left-10 z-[100] group pointer-events-auto">
      <div className="relative">
        <Magnetic>
          <div className="relative w-20 h-20 rounded-full border border-[var(--color-border)] flex items-center justify-center bg-[var(--bg-primary)]/80 backdrop-blur-md cursor-default transition-colors duration-500 hover:border-[var(--color-text)]">
            
            {/* Anillo de Texto SVG Giratorio */}
            <svg 
              className="absolute inset-0 w-full h-full animate-[spin_10s_linear_infinite] group-hover:[animation-play-state:paused] group-hover:opacity-20 transition-opacity duration-300 pointer-events-none" 
              viewBox="0 0 100 100"
            >
              <path 
                id="textPath" 
                d="M 50, 50 m -35, 0 a 35,35 0 1,1 70,0 a 35,35 0 1,1 -70,0" 
                fill="none" 
              />
              <text className="font-sans text-[10px] uppercase tracking-[0.25em] fill-[var(--color-text)]">
                <textPath href="#textPath" startOffset="0%">
                  • DOWNLOAD RESUME • CURRICULUM VITAE 
                </textPath>
              </text>
            </svg>

            {/* Centro Estático */}
            <span className="font-display italic text-lg text-[var(--color-text)] drop-shadow-sm transition-opacity duration-300 group-hover:opacity-0 pointer-events-none">
              CV
            </span>
            <div className="absolute w-1.5 h-1.5 bg-[var(--color-accent)] rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
          </div>
        </Magnetic>

        {/* Invisible bridge to maintain hover state between vinyl and menu */}
        <div className="absolute top-0 left-full w-8 h-full bg-transparent pointer-events-auto z-0" />

        {/* Menú Desplegable (Pop-out Table) */}
        <div className="absolute left-full top-1/2 -translate-y-1/2 translate-x-4 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:translate-x-2 group-hover:pointer-events-auto transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] flex flex-col bg-[var(--bg-primary)]/90 backdrop-blur-xl shadow-2xl overflow-hidden min-w-[220px] z-10">
          
          <div className="flex border border-[var(--color-border)]">
            <div className="px-3 py-3 border-r border-[var(--color-border)] font-sans text-[10px] tracking-widest uppercase font-semibold text-[var(--color-text)] flex items-center justify-center w-14 bg-[var(--color-text)]/5">
              EN
            </div>
            <a 
              href={enView} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 px-4 py-3 hover:bg-[var(--color-accent)] hover:text-white dark:hover:text-[#1A1A18] text-xs font-display italic text-center transition-colors duration-300"
            >
              View
            </a>
            <a 
              href={enDl} 
              className="flex-1 px-4 py-3 border-l border-[var(--color-border)] hover:bg-[var(--color-accent)] hover:text-white dark:hover:text-[#1A1A18] text-xs font-display italic text-center transition-colors duration-300"
            >
              Save
            </a>
          </div>

          <div className="flex border-x border-b border-[var(--color-border)]">
            <div className="px-3 py-3 border-r border-[var(--color-border)] font-sans text-[10px] tracking-widest uppercase font-semibold text-[var(--color-text)] flex items-center justify-center w-14 bg-[var(--color-text)]/5">
              ES
            </div>
            <a 
              href={esView} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 px-4 py-3 hover:bg-[var(--color-accent)] hover:text-white dark:hover:text-[#1A1A18] text-xs font-display italic text-center transition-colors duration-300"
            >
              Ver
            </a>
            <a 
              href={esDl} 
              className="flex-1 px-4 py-3 border-l border-[var(--color-border)] hover:bg-[var(--color-accent)] hover:text-white dark:hover:text-[#1A1A18] text-xs font-display italic text-center transition-colors duration-300"
            >
              Desc
            </a>
          </div>

        </div>

      </div>
    </div>
  );
}
