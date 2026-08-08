"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import PixelFrame from "./PixelFrame";

const BAYER_4X4 = [
  [0, 8, 2, 10],
  [12, 4, 14, 6],
  [3, 11, 1, 9],
  [15, 7, 13, 5],
];

interface PixelDitherAvatarProps {
  src?: string;
  className?: string;
  variant?: "vid" | "hedge" | "cane" | "garland" | "root" | "bamboo";
  tone?: "sobrio" | "vivido";
}

export default function PixelDitherAvatar({
  src = "/yo.jpg",
  className = "",
  variant = "hedge",
  tone = "vivido",
}: PixelDitherAvatarProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [errored, setErrored] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let cancelled = false;
    const img = new window.Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      if (cancelled) return;

      // Resolution of dithered pixel matrix
      const gridW = 64;
      const gridH = 80;

      canvas.width = gridW;
      canvas.height = gridH;

      // Draw original image scaled down
      ctx.drawImage(img, 0, 0, gridW, gridH);
      const imgData = ctx.getImageData(0, 0, gridW, gridH);
      const data = imgData.data;

      // Palette definition for biophilic dither (Dark bark & Moss green)
      const colorDark = [26, 26, 24]; // #1A1A18
      const colorLight = [143, 174, 134]; // #8FAE86 (Moss Green)

      for (let y = 0; y < gridH; y++) {
        for (let x = 0; x < gridW; x++) {
          const idx = (y * gridW + x) * 4;
          const r = data[idx];
          const g = data[idx + 1];
          const b = data[idx + 2];

          // Luminance 0..1
          const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

          // Bayer threshold 0..1
          const bayerValue = BAYER_4X4[y % 4][x % 4];
          const threshold = (bayerValue + 0.5) / 16;

          const chosenColor = lum > threshold ? colorLight : colorDark;

          data[idx] = chosenColor[0];
          data[idx + 1] = chosenColor[1];
          data[idx + 2] = chosenColor[2];
          data[idx + 3] = 255;
        }
      }

      ctx.putImageData(imgData, 0, 0);
      setLoaded(true);
    };

    img.onerror = () => {
      if (cancelled) return;
      setErrored(true);
    };

    return () => {
      cancelled = true;
      img.onload = null;
      img.onerror = null;
    };
  }, [src]);

  return (
    <div
      className={`relative group cursor-pointer ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <PixelFrame variant={variant} tone={tone} pixel={3} critters={true} id="pf-contact-avatar">
        <div className="relative w-40 sm:w-48 aspect-[4/5] overflow-hidden rounded-sm border border-[var(--color-border)] bg-[var(--bg-primary)] shadow-md transition-transform duration-500 group-hover:scale-105">
          {/* Canvas with Dithered Retro Pixel Art */}
          <canvas
            ref={canvasRef}
            className={`w-full h-full object-cover transition-opacity duration-700 image-rendering-pixelated ${
              loaded && !isHovered && !errored ? "opacity-100" : "opacity-0"
            }`}
            style={{ imageRendering: "pixelated" }}
          />

          {/* Full Color Photo: revealed on hover, or shown as fallback if dithering failed */}
          <Image
            src={src}
            alt="Anderson González"
            fill
            sizes="192px"
            className={`object-cover transition-opacity duration-700 ${
              isHovered ? "opacity-100 scale-105" : errored ? "opacity-100" : "opacity-0"
            }`}
          />
        </div>
      </PixelFrame>
    </div>
  );
}
