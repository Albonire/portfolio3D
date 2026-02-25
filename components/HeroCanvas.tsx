"use client";
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Sphere, Float } from '@react-three/drei';
import { useRef } from 'react';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

function LiquidShape() {
  const meshRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.Material>(null);
  const { theme } = useTheme();
  const { viewport } = useThree();
  
  const isMobile = viewport.width < 6;
  const responsiveScale = isMobile ? 0.9 : 1.8;
  const segments: [number, number, number] = isMobile ? [1, 64, 64] : [1, 128, 128];
  
  useFrame((state) => {
    if (meshRef.current) {
      const { x, y } = state.mouse;
      meshRef.current.rotation.x = THREE.MathUtils.lerp(meshRef.current.rotation.x, y * 0.5, 0.1);
      meshRef.current.rotation.y = THREE.MathUtils.lerp(meshRef.current.rotation.y, x * 0.5, 0.1);
    }
  });
  
  const isDark = theme === 'dark' || theme === 'system';
  const sphereColor = isDark ? "#C8C8C8" : "#8A8A8A";
  
  return (
    <Float speed={2.5} rotationIntensity={0.8} floatIntensity={1.5}>
      <Sphere ref={meshRef} args={segments} scale={responsiveScale}>
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

export default function HeroCanvas() {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'system';

  return (
    <Canvas 
      camera={{ position: [0, 0, 5], fov: 50 }} 
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      <hemisphereLight intensity={isDark ? 2.5 : 2} color="#FFFFFF" groundColor={isDark ? "#888888" : "#666666"} />
      <ambientLight intensity={isDark ? 1.2 : 0.8} />
      <spotLight position={[12, 12, 8]} angle={0.4} penumbra={1} intensity={isDark ? 20 : 10} />
      <directionalLight position={[10, 5, 5]} intensity={isDark ? 8 : 3} />
      <pointLight position={[8, 8, 6]} intensity={isDark ? 15 : 7} decay={2} />
      <LiquidShape />
    </Canvas>
  );
}
