"use client";

import { SmoothCursor } from "@/registry/magicui/smooth-cursor";

export function SmoothCursorDemo() {
  return (
    <>
      <span className="hidden md:block">Move your mouse around</span>
      <span className="block md:hidden">
        SmoothCursor is disabled on touch devices
      </span>
      <SmoothCursor />
    </>
  );
}

export default function CustomCursor() {
  return <SmoothCursor />;
}
