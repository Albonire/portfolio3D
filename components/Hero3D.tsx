"use client";
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float, Environment } from '@react-three/drei';
import { useRef, useState } from 'react';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

function LiquidShape() {
  const materialRef = useRef<any>(null);
  const { theme } = useTheme();
  
  useFrame((state) => {
    if (!materialRef.current) return;

    // Get mouse distance from center (normalized 0 to ~1.4)
    const mouseX = state.pointer.x;
    const mouseY = state.pointer.y;
    const dist = Math.sqrt(mouseX * mouseX + mouseY * mouseY);

    // FIX: Invert logic. 
    // Closer to center (dist -> 0) = Higher Distortion.
    // Far from center (dist -> 1) = Calm.
    
    // Intensity factor: 1 at center, 0 at edges.
    const intensity = Math.max(0, 1 - dist); 

    const targetDistort = 0.3 + (intensity * 0.6); // Base 0.3, Max 0.9
    const targetSpeed = 1.5 + (intensity * 4);     // Base 1.5, Max 5.5

    // Smooth Lerp
    materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, targetDistort, 0.05);
    materialRef.current.speed = THREE.MathUtils.lerp(materialRef.current.speed, targetSpeed, 0.05);
    
    // Subtle parallax rotation
    if (state.camera) {
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mouseX * 0.3, 0.05);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, mouseY * 0.3, 0.05);
        state.camera.lookAt(0,0,0);
    }
  });

  // Theme Colors
  const isDark = theme === 'dark' || theme === 'system'; // Default logic assumption
  const sphereColor = isDark ? "#080808" : "#000000"; 
  
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <Sphere args={[1, 100, 200]} scale={2.2}>
        <MeshDistortMaterial
          ref={materialRef}
          color={sphereColor}
          attach="material"
          distort={0.3} 
          speed={1.5}
          roughness={0.2}
          metalness={0.9}
        />
      </Sphere>
    </Float>
  );
}

export default function HeroSection() {
  return (
    <section className="h-screen w-full relative flex items-center justify-center overflow-hidden bg-transparent transition-colors duration-500">
      {/* Background Text */}
      <div className="absolute inset-0 flex flex-col justify-center items-center pointer-events-none z-0 select-none">
        <h1 className="font-display text-[15vw] leading-none text-transparent bg-clip-text bg-gradient-to-b from-current to-transparent opacity-10 uppercase tracking-tighter">
          Creative
        </h1>
        <h1 className="font-display text-[15vw] leading-none text-current uppercase tracking-tighter mix-blend-overlay opacity-50">
          Developer
        </h1>
      </div>

      {/* 3D Canvas */}
      <div className="absolute inset-0 z-10 cursor-pointer">
        <Canvas camera={{ position: [0, 0, 5] }}>
          <ambientLight intensity={1.5} />
          <pointLight position={[10, 10, 10]} intensity={2} color="#FFFFFF" />
          <pointLight position={[-10, -10, -5]} intensity={2} color="#CCFF00" />
          <LiquidShape />
          <Environment preset="city" />
        </Canvas>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-10 font-mono text-current text-sm animate-pulse z-20 font-bold mix-blend-difference">
        [SCROLL TO EXPLORE]
      </div>
    </section>
  );
}