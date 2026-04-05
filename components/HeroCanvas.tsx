"use client";
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useState, useCallback, Suspense, useMemo } from 'react';
import * as THREE from 'three';
import { useTheme } from 'next-themes';
import { useGLTF, Float, Center, Environment, Edges } from '@react-three/drei';

// ============================================================
// VOXEL FLOWER MODEL — Definitive Fix: Vertical & Edges
// ============================================================

function VoxelFlowerModel() {
  const { scene } = useGLTF('/models/voxel_style_flower.glb');
  const groupRef = useRef<THREE.Group>(null);
  const { viewport } = useThree();
  const isMobile = viewport.width < 6;

  // Interaction state
  const [dragging, setDragging] = useState(false);
  const rotationRef = useRef({ x: 0, y: 0 });
  const lastMouse = useRef({ x: 0, y: 0 });

  // Extract meshes and ensure materials are high-impact
  const meshes = useMemo(() => {
    const result: any[] = [];
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        
        mat.metalness = 0.4;
        mat.roughness = 0.2;
        mat.envMapIntensity = 1.5;
        
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
  }, [scene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (!dragging) {
      rotationRef.current.y += delta * 0.08;
    }
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, rotationRef.current.x, 0.1);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, rotationRef.current.y, 0.1);
  });

  const onDown = useCallback((e: any) => {
    e.stopPropagation();
    setDragging(true);
    lastMouse.current = { x: e.clientX, y: e.clientY };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  }, []);

  const onMove = useCallback((e: any) => {
    if (!dragging) return;
    const deltaX = e.clientX - lastMouse.current.x;
    const deltaY = e.clientY - lastMouse.current.y;
    rotationRef.current.y += deltaX * 0.01;
    rotationRef.current.x += deltaY * 0.008;
    lastMouse.current = { x: e.clientX, y: e.clientY };
  }, [dragging]);

  const onUp = useCallback((e: any) => {
    setDragging(false);
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  }, []);

  return (
    <Float speed={1.0} rotationIntensity={0.1} floatIntensity={0.2}>
      <group
        ref={groupRef}
        position={[isMobile ? 0 : 1.5, 0, 0]}
        onPointerDown={onDown}
        onPointerMove={onMove}
        onPointerUp={onUp}
        onPointerLeave={onUp}
      >
        <Center>
          {/* 
            COMPENSATION ROTATION:
            We rotate the inner group -90deg on X to counteract the GLB's horizontal export 
          */}
          <group rotation={[-Math.PI / 2, 0, 0]} scale={isMobile ? 0.13 : 0.24}>
            {meshes.map((m, i) => (
              <mesh 
                key={i} 
                geometry={m.geometry} 
                material={m.material} 
                position={m.position} 
                rotation={m.rotation} 
                scale={m.scale}
              >
                <Edges threshold={15} color="#000000" />
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
      gl={{ 
        antialias: true, 
        alpha: true,
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.2
      }}
      style={{ cursor: 'grab' }}
    >
      <Suspense fallback={null}>
        <Environment preset="city" />
        <ambientLight intensity={isDark ? 0.7 : 0.5} />
        <pointLight position={[5, 5, 5]} intensity={2} />
        <spotLight position={[-5, 10, 2]} angle={0.2} intensity={2.5} />
        <VoxelFlowerModel />
      </Suspense>
    </Canvas>
  );
}

useGLTF.preload('/models/voxel_style_flower.glb');
