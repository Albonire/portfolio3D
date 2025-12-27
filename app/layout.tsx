import "./globals.css";
import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";

export const metadata: Metadata = {
  title: "Anderdev - Portfolio",
  description: "Brutalist Interactive Portfolio",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link 
          href="https://api.fontshare.com/v2/css?f[]=clash-display@200,400,700,600&f[]=satoshi@400,700,900&display=swap" 
          rel="stylesheet" 
        />
      </head>
      {/* Forced dark mode preference in class */}
      <body className="antialiased bg-[var(--color-dark)] text-[var(--color-text)] overflow-x-hidden selection:bg-neon selection:text-black transition-colors duration-500">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <SmoothScroll>
            <div className="bg-noise fixed -top-1/2 -left-1/2 w-[200%] h-[200%] z-[1] opacity-[0.03] mix-blend-overlay pointer-events-none" />
            <CustomCursor />
            <ThemeToggle />
            <Navbar />
            <main className="relative z-10">
              {children}
            </main>
          </SmoothScroll>
        </ThemeProvider>
      </body>
    </html>
  );
}
