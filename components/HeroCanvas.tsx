"use client";
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useRef, useMemo, useState, useCallback, useEffect } from 'react';
import * as THREE from 'three';
import { useTheme } from 'next-themes';

// ============================================================
// VOXEL FLOWER — Interactive InstancedMesh 3D Flower
// ============================================================

const V = 0.16; // voxel unit size

const PALETTE = {
  light: {
    stem:     new THREE.Color("#3a5a38"),
    leaf:     new THREE.Color("#5a8a52"),
    petalA:   new THREE.Color("#d4a872"),
    petalB:   new THREE.Color("#e8c9a0"),
    petalTip: new THREE.Color("#f2e0c8"),
    center:   new THREE.Color("#8a6d4a"),
    pistil:   new THREE.Color("#d4a04a"),
  },
  dark: {
    stem:     new THREE.Color("#7aaa72"),
    leaf:     new THREE.Color("#9aca92"),
    petalA:   new THREE.Color("#e8d0b0"),
    petalB:   new THREE.Color("#f0dcc8"),
    petalTip: new THREE.Color("#f8efe4"),
    center:   new THREE.Color("#c49a6a"),
    pistil:   new THREE.Color("#f0c878"),
  }
};

interface VoxelData {
  x: number; y: number; z: number;
  color: THREE.Color;
}

function generateFlower(isDark: boolean): VoxelData[] {
  const voxels: VoxelData[] = [];
  const P = isDark ? PALETTE.dark : PALETTE.light;
  const set = new Set<string>();

  const add = (x: number, y: number, z: number, c: THREE.Color) => {
    const key = `${x},${y},${z}`;
    if (set.has(key)) return;
    set.add(key);
    voxels.push({ x, y, z, color: c.clone() });
  };

  // ─── STEM ───
  for (let y = -10; y <= 0; y++) {
    add(0, y, 0, P.stem);
    add(1, y, 0, P.stem);
  }

  // ─── LEAVES ───
  for (let i = 1; i <= 4; i++) {
    add(-i, -6 + Math.floor(i * 0.5), 0, P.leaf);
    add(-i, -6 + Math.floor(i * 0.5) + 1, 0, P.leaf);
  }
  for (let i = 1; i <= 3; i++) {
    add(i + 1, -8 + Math.floor(i * 0.4), 0, P.leaf);
    add(i + 1, -8 + Math.floor(i * 0.4) + 1, 0, P.leaf);
  }

  // ─── CENTER DOME ───
  for (let x = -2; x <= 2; x++) {
    for (let z = -2; z <= 2; z++) {
      const d = Math.sqrt(x * x + z * z);
      if (d <= 2.5) {
        const c = d < 1.2 ? P.pistil : P.center;
        add(x, 1, z, c);
        add(x, 2, z, c);
        if (d < 1.5) add(x, 3, z, P.pistil);
      }
    }
  }

  // ─── 6 PETALS ───
  for (let p = 0; p < 6; p++) {
    const a = (p / 6) * Math.PI * 2;
    const perp = a + Math.PI / 2;

    for (let r = 3; r <= 8; r++) {
      const hw = r <= 4 ? 2 : r <= 6 ? 1.5 : 1;

      for (let w = -Math.ceil(hw); w <= Math.ceil(hw); w++) {
        if (Math.abs(w) > hw + 0.3) continue;

        const vx = Math.round(Math.cos(a) * r + Math.cos(perp) * w * 0.7);
        const vz = Math.round(Math.sin(a) * r + Math.sin(perp) * w * 0.7);

        // Petal curves: rises then droops at edge
        let vy: number;
        if (r <= 4) vy = 2;
        else if (r <= 6) vy = 3;
        else vy = 2;

        if (Math.abs(w) > hw * 0.7) vy -= 1;

        const t = (r - 3) / 5;
        const col = P.petalA.clone().lerp(P.petalTip, t);

        add(vx, vy, vz, col);
        // Second layer for thickness
        if (r <= 6 && Math.abs(w) < hw * 0.6) {
          add(vx, vy + 1, vz, P.petalB.clone().lerp(P.petalTip, t * 0.5));
        }
      }
    }
  }

  return voxels;
}

function VoxelFlower() {
  const meshRef = useRef<THREE.InstancedMesh>(null);
  const groupRef = useRef<THREE.Group>(null);
  const { theme } = useTheme();
  const { viewport } = useThree();

  const isDark = theme === 'dark' || theme === 'system';
  const isMobile = viewport.width < 6;

  // Drag state
  const [dragging, setDragging] = useState(false);
  const prev = useRef({ x: 0, y: 0 });
  const rot = useRef({ x: -0.3, y: 0 });

  const voxels = useMemo(() => generateFlower(isDark), [isDark]);

  // Populate instanced mesh — useEffect so ref is guaranteed to exist
  useEffect(() => {
    const mesh = meshRef.current;
    if (!mesh) return;

    const dummy = new THREE.Object3D();

    voxels.forEach((v, i) => {
      dummy.position.set(v.x * V, v.y * V, v.z * V);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
      mesh.setColorAt(i, v.color);
    });

    mesh.instanceMatrix.needsUpdate = true;
    if (mesh.instanceColor) mesh.instanceColor.needsUpdate = true;
  }, [voxels]);

  // Animation
  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (!dragging) rot.current.y += delta * 0.2;
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, rot.current.x, 0.06);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, rot.current.y, 0.06);
  });

  const onDown = useCallback((e: any) => {
    e.stopPropagation();
    setDragging(true);
    prev.current = { x: e.clientX ?? 0, y: e.clientY ?? 0 };
    (e.target as HTMLElement)?.setPointerCapture?.(e.pointerId);
  }, []);

  const onMove = useCallback((e: any) => {
    if (!dragging) return;
    const cx = e.clientX ?? 0;
    const cy = e.clientY ?? 0;
    rot.current.y += (cx - prev.current.x) * 0.008;
    rot.current.x += (cy - prev.current.y) * 0.006;
    prev.current = { x: cx, y: cy };
  }, [dragging]);

  const onUp = useCallback(() => setDragging(false), []);

  return (
    <group
      ref={groupRef}
      position={[isMobile ? 0 : 1.2, isMobile ? 0 : 0, 0]}
      scale={isMobile ? 0.7 : 0.75}
      onPointerDown={onDown}
      onPointerMove={onMove}
      onPointerUp={onUp}
      onPointerLeave={onUp}
    >
      <instancedMesh
        ref={meshRef}
        args={[undefined, undefined, voxels.length]}
      >
        <boxGeometry args={[V * 0.88, V * 0.88, V * 0.88]} />
        <meshStandardMaterial roughness={0.65} metalness={0.05} flatShading />
      </instancedMesh>
    </group>
  );
}

export default function HeroCanvas() {
  const { theme } = useTheme();
  const isDark = theme === 'dark' || theme === 'system';

  return (
    <Canvas
      camera={{ position: [0, 0, 5], fov: 35 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
      style={{ cursor: 'grab' }}
      onPointerDown={(e) => { (e.target as HTMLElement).style.cursor = 'grabbing'; }}
      onPointerUp={(e) => { (e.target as HTMLElement).style.cursor = 'grab'; }}
    >
      <ambientLight intensity={isDark ? 0.5 : 0.4} />
      <hemisphereLight
        intensity={isDark ? 0.8 : 0.7}
        color={isDark ? "#d0e0d0" : "#ffffff"}
        groundColor={isDark ? "#1a1a18" : "#f0ede8"}
      />
      <directionalLight position={[6, 10, 5]} intensity={isDark ? 2.5 : 2} color="#ffffff" />
      <directionalLight position={[-5, -4, -5]} intensity={isDark ? 0.6 : 0.3} color={isDark ? "#8FA389" : "#445640"} />
      <pointLight position={[-5, 5, -3]} intensity={isDark ? 1.2 : 0.4} color="#B8C9B2" />
      <VoxelFlower />
    </Canvas>
  );
}
