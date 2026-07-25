"use client";
import { useEffect, useState } from 'react';
import { useTheme } from 'next-themes';
import PixelTrail from './PixelTrail';

export default function CustomCursor() {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isFinePointer, setIsFinePointer] = useState(false);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      setMounted(true);
      if (window.matchMedia('(pointer: fine)').matches) {
        setIsFinePointer(true);
      }
    });
    return () => cancelAnimationFrame(handle);
  }, []);

  if (!mounted || !isFinePointer) return null;

  const isDark = resolvedTheme === 'dark';
  // White/off-white for dark mode, dark stone for light mode
  const trailColor = isDark ? '#ffffff' : '#1a1a18';

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <PixelTrail
        gridSize={50}
        trailSize={0.12}
        maxAge={250}
        interpolate={5}
        color={trailColor}
        gooeyFilter={{ id: "custom-goo-filter", strength: 3 }}
      />
    </div>
  );
}
