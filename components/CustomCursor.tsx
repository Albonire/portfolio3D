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
  // Crisp white for dark mode, sleek dark slate for light mode
  const trailColor = isDark ? '#ffffff' : '#18181b';

  return (
    <div className="fixed inset-0 pointer-events-none z-[9999] overflow-hidden">
      <PixelTrail
        gridSize={95}
        trailSize={0.035}
        maxAge={180}
        interpolate={3}
        color={trailColor}
      />
    </div>
  );
}
