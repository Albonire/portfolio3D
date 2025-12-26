"use client";

export default function Navbar() {
  const navItems = [
    { label: 'Work', href: '#work' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ];

  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 mix-blend-exclusion">
      <ul className="flex gap-2 p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
        {navItems.map((item) => (
          <li key={item.label}>
            <a 
              href={item.href}
              className="block px-6 py-2 rounded-full bg-transparent hover:bg-white hover:text-black text-white font-mono uppercase text-sm transition-all duration-300 font-bold"
            >
              {item.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
