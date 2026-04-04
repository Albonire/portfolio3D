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
      <ul className="flex items-center gap-2 p-2 bg-[var(--bg-primary)]/80 backdrop-blur-md border border-[var(--color-border)] rounded-full shadow-sm">
        {navItems.map((item) => (
          <li key={item.label}>
            <Magnetic>
              <a 
                href={item.href}
                className="block px-6 py-2 rounded-full text-xs font-body tracking-widest uppercase transition-colors duration-200
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
              className="px-4 py-2 ml-2 transition-colors duration-200 border-l border-[var(--color-border)] text-[var(--color-muted)] hover:text-[var(--color-accent)]"
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
