"use client";

export default function Navbar() {
  return (
    <nav className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 mix-blend-exclusion">
      <ul className="flex gap-2 p-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
        {['Work', 'About', 'Contact'].map((item) => (
          <li key={item}>
            <button className="px-6 py-2 rounded-full bg-transparent hover:bg-white hover:text-black text-white font-mono uppercase text-sm transition-all duration-300 font-bold">
              {item}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
}
