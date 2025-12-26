"use client";

export default function Navbar() {
  const navItems = [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <ul className="flex gap-1 p-1.5 bg-white/10 dark:bg-black/20 backdrop-blur-2xl border border-white/20 dark:border-white/10 rounded-full shadow-lg">
        {navItems.map((item) => (
          <li key={item.label}>
            <a 
              href={item.href}
              className="block px-6 py-2.5 rounded-full text-sm font-mono font-bold uppercase transition-all duration-300
                text-black dark:text-white
                hover:bg-neon-readable hover:text-white dark:hover:text-black"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
