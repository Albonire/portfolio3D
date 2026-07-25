"use client";
import Magnetic from './Magnetic';

export default function Navbar() {
  const navItems = [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
<<<<<<< HEAD
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <ul className="flex items-center gap-2 p-2 bg-[var(--bg-primary)]/80 backdrop-blur-md border border-[var(--color-border)] rounded-full shadow-sm">
=======
    <nav className="fixed bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-50 max-w-[90vw]">
      <ul className="flex items-center gap-1 sm:gap-2 p-1.5 sm:p-2 bg-[var(--bg-primary)]/85 backdrop-blur-md border border-[var(--color-border)] rounded-full shadow-sm">
>>>>>>> 3f99fab (feat: integrate SideRays component in dark mode and refine hero UI)
        {navItems.map((item) => (
          <li key={item.label}>
            <Magnetic>
              <a 
                href={item.href}
<<<<<<< HEAD
                className="block px-6 py-2 rounded-full text-xs font-body tracking-widest uppercase transition-colors duration-200
=======
                className="block px-3 sm:px-6 py-1.5 sm:py-2 rounded-full text-[10px] sm:text-xs font-body tracking-widest uppercase transition-colors duration-200
>>>>>>> 3f99fab (feat: integrate SideRays component in dark mode and refine hero UI)
                  text-[var(--color-muted)]
                  hover:bg-[var(--color-accent)] hover:text-white"
              >
                {item.label}
              </a>
            </Magnetic>
          </li>
        ))}
        <li>
          <Magnetic>
            <button
              onClick={() => window.dispatchEvent(new CustomEvent('open-cmd-palette'))}
<<<<<<< HEAD
              className="px-4 py-2 ml-2 transition-colors duration-200 border-l border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-accent)]"
=======
              className="px-2 sm:px-4 py-1.5 sm:py-2 ml-1 sm:ml-2 transition-colors duration-200 border-l border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-accent)]"
>>>>>>> 3f99fab (feat: integrate SideRays component in dark mode and refine hero UI)
              aria-label="Open Command Palette"
            >
              <span className="font-sans text-[10px] sm:text-xs font-medium uppercase tracking-tighter">
                ⌘ K
              </span>
            </button>
          </Magnetic>
        </li>
      </ul>
    </nav>
  );
}
