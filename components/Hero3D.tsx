"use client";
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

function LiquidShape() {
  const meshRef = useRef<any>(null);
  const materialRef = useRef<any>(null);
  const { theme } = useTheme();
  const { viewport } = useThree();
  
  // Responsive scale: Smaller on mobile to prevent overflow
  // Viewport width < 6 is roughly mobile/vertical tablet
  const isMobile = viewport.width < 6;
  const responsiveScale = isMobile ? 0.9 : 1.8;
  
  useFrame((state) => {
    if (!materialRef.current) return;
    
    const mouseX = state.pointer.x;
    const mouseY = state.pointer.y;
    const dist = Math.sqrt(mouseX * mouseX + mouseY * mouseY);
    
    // Calm when far, moderate when close
    const intensity = Math.max(0, 1 - dist);
    const targetDistort = 0.15 + (intensity * 0.35);
    const targetSpeed = 1.0 + (intensity * 2.5);
    
    materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, targetDistort, 0.04);
    materialRef.current.speed = THREE.MathUtils.lerp(materialRef.current.speed, targetSpeed, 0.04);
    
    // Enhanced parallax for liquid feel
    if (state.camera) {
        state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, mouseX * 0.5, 0.08);
        state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, mouseY * 0.5, 0.08);
        state.camera.lookAt(0,0,0);
    }
    
    // Subtle rotation for liquid mercury effect
    if (meshRef.current) {
      meshRef.current.rotation.y += 0.002;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });
  
  // Optimized colors for each theme - RESTORED CORRECT VALUES
  // Dark Mode: Light gray (#C8C8C8) for visibility and proper light reflection
  // Light Mode: Medium-dark gray (#8A8A8A) for contrast against light background
  const isDark = theme === 'dark' || theme === 'system';
  const sphereColor = isDark ? "#C8C8C8" : "#8A8A8A";
  
  return (
    <Float speed={2.5} rotationIntensity={0.8} floatIntensity={1.5}>
      <Sphere ref={meshRef} args={[1, 128, 256]} scale={responsiveScale}>
        <MeshDistortMaterial
          ref={materialRef}
          color={sphereColor}
          attach="material"
          distort={0.2} 
          speed={1.5}
          roughness={0.05}
          metalness={0.85}
          clearcoat={1}
          clearcoatRoughness={0}
        />
      </Sphere>
    </Float>
  );
}

export default function HeroSection() {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'system';
  
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
        <Canvas 
          camera={{ position: [0, 0, 5], fov: 50 }} 
          dpr={[1, 2]}
        >
          {/* Hemisphere light simulates sky and ground - creates base metallic look */}
          <hemisphereLight
            intensity={isDark ? 2.5 : 2}
            color="#FFFFFF"
            groundColor={isDark ? "#888888" : "#666666"}
          />
          
          {/* Strong ambient for visibility */}
          <ambientLight intensity={isDark ? 1.2 : 0.8} />
          
          {/* Main spotlight - creates primary metallic highlight */}
          <spotLight 
            position={[12, 12, 8]} 
            angle={0.4} 
            penumbra={1} 
            intensity={isDark ? 20 : 10} 
            color="#FFFFFF" 
          />
          
          {/* Directional lights for broad metallic sheen */}
          <directionalLight
            position={[10, 5, 5]}
            intensity={isDark ? 8 : 3}
            color="#FFFFFF"
          />
          <directionalLight
            position={[-10, 5, 5]}
            intensity={isDark ? 8 : 3}
            color="#FFFFFF"
          />
          
          {/* Point lights for specular highlights */}
          <pointLight 
            position={[8, 8, 6]} 
            intensity={isDark ? 15 : 7}
            color="#FFFFFF" 
            decay={2}
          />
          <pointLight 
            position={[-8, 8, 6]} 
            intensity={isDark ? 15 : 7}
            color="#FFFFFF" 
            decay={2}
          />
          <pointLight 
            position={[0, -8, 8]} 
            intensity={isDark ? 12 : 5}
            color="#FFFFFF" 
            decay={2}
          />
          
          {/* Colored accent lights - add depth */}
          <pointLight 
            position={[-6, -6, -6]} 
            intensity={isDark ? 6 : 3}
            color={isDark ? "#00CCFF" : "#0088DD"}
            decay={2}
          />
          <pointLight 
            position={[6, 0, -8]} 
            intensity={isDark ? 5 : 2}
            color={isDark ? "#FF0088" : "#DD0077"}
            decay={2}
          />
          
          {/* Back fill for dimension */}
          <pointLight 
            position={[0, 0, -12]} 
            intensity={isDark ? 10 : 4}
            color="#FFFFFF" 
            decay={2}
          />
          
          <LiquidShape />
        </Canvas>
      </div>
      
      {/* Scroll indicator */}
      <div className="absolute bottom-10 left-10 font-mono text-current text-sm animate-pulse z-20 font-bold mix-blend-difference">
        [SCROLL TO EXPLORE]
      </div>
    </section>
  );
}