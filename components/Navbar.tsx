"use client";
import Magnetic from './Magnetic';

export default function Navbar() {
  const navItems = [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <ul className="flex gap-1 p-1.5 bg-white/20 dark:bg-black/30 backdrop-blur-[7px] border border-white/40 dark:border-white/10 rounded-full shadow-[0_4px_24px_-1px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_24px_-1px_rgba(0,0,0,0.5)]">
        {navItems.map((item) => (
          <li key={item.label}>
            <Magnetic>
              <a 
                href={item.href}
                className="block px-6 py-2.5 rounded-full text-sm font-mono font-bold uppercase transition-all duration-300
                  text-black dark:text-white
                  hover:bg-neon-readable hover:text-white dark:hover:text-black"
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
              className="px-4 py-2.5 ml-1 transition-all duration-300 border-l border-current/10"
              aria-label="Open Command Palette"
            >
              <span className="font-mono text-xs font-bold opacity-40 group-hover:opacity-100 hover:text-neon-readable transition-all uppercase tracking-tighter">
                ⌘ K
              </span>
            </button>
          </Magnetic>
        </li>
      </ul>
    </nav>
  );
}
