"use client";
import { Canvas, useFrame, useThree, type ThreeEvent } from '@react-three/fiber';
import { useRef, useState, useCallback, Suspense, useMemo } from 'react';
import * as THREE from 'three';
import { useTheme } from 'next-themes';
import { useGLTF, Float, Center, Environment, Edges, ContactShadows } from '@react-three/drei';

type MeshData = {
  geometry: THREE.BufferGeometry;
  material: THREE.Material;
  position: THREE.Vector3;
  rotation: THREE.Euler;
  scale: THREE.Vector3;
};

// ============================================================
// VOXEL FLOWER MODEL — Definitive Fix: Vertical & Edges
// ============================================================

function VoxelFlowerModel() {
  const { scene } = useGLTF('/models/voxel_style_flower.glb');
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'system';
  const isMobile = viewport.width < 6;

  // Interaction state
  const rotationRef = useRef({ x: 0, y: 0 });

  // Theme-aware colors
  const edgeColor = isDark ? "#B8C9B2" : "#1A1A18";

  // Refined materials (Deep Matte for Dark Mode)
  const meshes = useMemo(() => {
    const result: MeshData[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const originalColor = (mesh.material as THREE.MeshStandardMaterial).color.clone();
        
        // RICH EDITORIAL across ALL colors
        if (isDark) {
          originalColor.multiplyScalar(0.6); // Muted for character in dark mode
        } else {
          originalColor.multiplyScalar(0.85); // Slightly deeper for contrast in light mode
        }

        const mat = new THREE.MeshPhysicalMaterial({
          color: originalColor,
          roughness: isDark ? 0.45 : 0.7, // Matte finish to avoid white glare in light mode
          metalness: isDark ? 0.1 : 0.05, 
          transmission: 0.0, 
          opacity: 1,
          transparent: false,
          side: THREE.DoubleSide,
          envMapIntensity: isDark ? 0.5 : 0.22, // Reduced reflections in light mode
          clearcoat: 0.1, 
          sheen: isDark ? 0.3 : 0.1, 
          sheenColor: isDark ? new THREE.Color("#445640") : new THREE.Color("#FFFFFF"),
        });
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        result.push({
          geometry: mesh.geometry,
          material: mat,
          position: mesh.position,
          rotation: mesh.rotation,
          scale: mesh.scale
        });
      }
    });
    return result;
  }, [scene, isDark]);

  useFrame((state, delta) => {
    if (!groupRef.current) return;
    
    // Auto-rotation combined with Parallax from mouse pointer
    rotationRef.current.y += delta * 0.15; // smooth constant rotation
    
    // Subtle reaction to mouse pointer (Parallax)
    const targetX = state.pointer.y * 0.5; // Up/down affects X rotation slightly
    const targetY = rotationRef.current.y + (state.pointer.x * 0.5); 
    
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetX, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetY, 0.05);
  });

  return (
    <Float speed={1.0} rotationIntensity={0.1} floatIntensity={0.15}>
      <group
        ref={groupRef}
        position={[isMobile ? 0 : 1.5, isMobile ? 0.8 : 0, 0]}
      >
        <Center>
          <group rotation={[-Math.PI / 2, 0, 0]} scale={isMobile ? 0.09 : 0.22}>
            {meshes.map((m, i) => (
              <mesh 
                key={i} 
                geometry={m.geometry} 
                material={m.material} 
                position={m.position} 
                rotation={m.rotation} 
                scale={m.scale}
              >
                <Edges threshold={15} color={edgeColor} opacity={isDark ? 0.04 : 0.18} transparent />
              </mesh>
            ))}
          </group>
        </Center>
      </group>
    </Float>
  );
}

export default function HeroCanvas() {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'system';

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 35 }}
      dpr={[1, 2]}
      shadows
      gl={{ 
        antialias: true, 
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.7 // Balanced exposure for editorial feel
      }}
      style={{ cursor: 'grab' }}
    >
      <Suspense fallback={null}>
        <Environment preset="apartment" blur={1.0} />
        
        <hemisphereLight args={isDark ? ["#445640", "#1A1A18", 0.08] : ["#ffffff", "#6f6f6f", 0.1]} />
        <ambientLight intensity={isDark ? 0.15 : 0.2} />
        
        <ContactShadows 
          position={[1.8, -2.5, 0]} 
          opacity={isDark ? 0.12 : 0.06} 
          scale={10} 
          blur={4} 
          far={5} 
        />

        {isDark && <spotLight position={[5, 10, 5]} angle={0.25} penumbra={1} intensity={1.5} color="#B8C9B2" />}
        {!isDark && <pointLight position={[5, 10, 5]} intensity={0.4} color="#FFFFFF" />}
        
        <directionalLight position={[0, 5, 10]} intensity={isDark ? 0.25 : 0.3} />
        
        <VoxelFlowerModel />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload('/models/voxel_style_flower.glb');
