"use client";

import { ABOUT } from "@/data/content";
import Magnetic from "./Magnetic";

export default function Contact() {
  const email = ABOUT.social.find(s => s.label === "EMAIL")?.url.replace('mailto:', '');

  return (
    <section id="contact" className="min-h-[80vh] flex flex-col justify-center py-24 px-6 md:px-20 border-t border-[var(--color-border)] bg-[var(--bg-primary)]">
      <div className="max-w-7xl mx-auto w-full flex flex-col md:flex-row justify-between gap-16 md:gap-24">
        
        {/* Left Column - Big Typography */}
        <div className="flex-1 flex flex-col justify-between">
          <div>
            <p className="font-mono text-xs mb-8 text-[var(--color-muted)] tracking-widest uppercase">
              {'//'} Let&apos;s talk
            </p>
            <h2 className="font-display text-5xl md:text-7xl lg:text-[8rem] leading-none tracking-tight text-[var(--color-text)] mb-6">
              Get in<br />
              <span className="text-[var(--color-muted)] italic">Touch.</span>
            </h2>
          </div>
          
          <div className="mt-12 md:mt-24 space-y-6 max-w-md">
            <p className="font-body text-lg md:text-xl text-[var(--color-muted)] leading-relaxed">
              I am always looking forward to exploring new opportunities and collaborating on high-performance projects.
            </p>
            <Magnetic>
              <a 
                href={`mailto:${email}`}
                className="inline-flex items-center gap-3 font-sans text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors duration-300 group"
              >
                <span className="text-xl md:text-2xl border-b border-[var(--color-border)] group-hover:border-[var(--color-accent)] transition-colors duration-300 pb-1">{email}</span>
                <span className="text-sm opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">↗</span>
              </a>
            </Magnetic>
          </div>
        </div>

        {/* Right Column - Social Links */}
        <div className="md:w-1/3 flex flex-col justify-between md:justify-end">
          <div className="flex flex-col gap-6">
            <h3 className="font-sans text-xs font-medium tracking-[0.2em] text-[var(--color-muted)] uppercase mb-4">
              Connect
            </h3>
            <ul className="flex flex-col gap-4">
              {ABOUT.social.map((social) => (
                <li key={social.label}>
                  <Magnetic>
                    <a 
                      href={social.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="group flex items-center justify-between font-display text-2xl md:text-3xl text-[var(--color-text)] hover:text-[var(--color-accent)] transition-colors duration-300"
                    >
                      <span>{social.label}</span>
                      <span className="font-sans text-sm opacity-0 -translate-x-4 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300">
                        ↗
                      </span>
                    </a>
                  </Magnetic>
                </li>
              ))}
            </ul>
          </div>
          
          <div className="hidden md:block mt-24 pt-8 border-t border-[var(--color-border)]">
            <div className="flex justify-between items-center w-full">
              <p className="font-body text-sm text-[var(--color-muted)]">
                © {new Date().getFullYear()} Fabian González
              </p>
              <span className="font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-widest">
                All rights reserved
              </span>
            </div>
          </div>
        </div>
        
        {/* Mobile signature */}
        <div className="block md:hidden pt-8 border-t border-[var(--color-border)]">
          <div className="flex flex-col gap-2 w-full">
            <p className="font-body text-sm text-[var(--color-muted)]">
              © {new Date().getFullYear()} Fabian González
            </p>
            <span className="font-mono text-[10px] text-[var(--color-muted)] uppercase tracking-widest">
              All rights reserved
            </span>
          </div>
        </div>

      </div>
    </section>
  );
}
