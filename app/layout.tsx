import "./globals.css";
import type { Metadata } from "next";
import { Syne, Inter } from "next/font/google";
import Navbar from "@/components/Navbar";
import CustomCursor from "@/components/CustomCursor";
import SmoothScroll from "@/components/SmoothScroll";
import { ThemeProvider } from "@/components/ThemeProvider";
import ThemeToggle from "@/components/ThemeToggle";
import Preloader from "@/components/Preloader";
import CommandPalette from "@/components/CommandPalette";

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL('https://portfolio-3d-umber.vercel.app'),
  title: {
    default: "Fabian González | Creative Developer",
    template: "%s | Fabian González"
  },
  description: "Full Stack Developer & Creative Engineer specialized in high-performance web systems, 3D interactions, and AI integration.",
  keywords: ["Creative Developer", "Full Stack", "Three.js", "Next.js", "React", "Fabian González", "Portfolio"],
  authors: [{ name: "Fabian González" }],
  creator: "Fabian González",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://portfolio-3d-umber.vercel.app",
    title: "Fabian González | Creative Developer",
    description: "Full Stack Developer & Creative Engineer specialized in high-performance web systems, 3D interactions, and AI integration.",
    siteName: "Fabian González Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Fabian González Portfolio",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fabian González | Creative Developer",
    description: "Full Stack Developer & Creative Engineer specialized in high-performance web systems, 3D interactions, and AI integration.",
    creator: "@fabianalbonire",
    images: ["/og-image.jpg"],
  },
  icons: {
    icon: "/favicon.png",
    shortcut: "/favicon.png",
    apple: "/favicon.png",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      {/* Forced dark mode preference in class */}
      <body className={`antialiased bg-[var(--color-dark)] text-[var(--color-text)] overflow-x-hidden selection:bg-neon selection:text-black transition-colors duration-500 ${syne.variable} ${inter.variable}`} suppressHydrationWarning>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <SmoothScroll>
            <Preloader />
            <div className="bg-noise fixed -top-1/2 -left-1/2 w-[200%] h-[200%] z-[1] opacity-[0.03] mix-blend-overlay pointer-events-none" />
            <CustomCursor />
            <ThemeToggle />
            <CommandPalette />
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
