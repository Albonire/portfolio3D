"use client";
import React, { useMemo, useEffect } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { shaderMaterial, useTrailTexture } from '@react-three/drei';
import * as THREE from 'three';

import './PixelTrail.css';

export interface GooeyFilterProps {
  id?: string;
  strength?: number;
}

export interface PixelTrailProps {
  gridSize?: number;
  trailSize?: number;
  maxAge?: number;
  interpolate?: number;
  easingFunction?: (x: number) => number;
  canvasProps?: React.ComponentProps<typeof Canvas>;
  glProps?: THREE.WebGLRendererParameters;
  gooeyFilter?: GooeyFilterProps;
  color?: string;
  className?: string;
}

const GooeyFilter = ({ id = 'goo-filter', strength = 10 }: GooeyFilterProps) => {
  return (
    <svg className="goo-filter-container" aria-hidden="true">
      <defs>
        <filter id={id}>
          <feGaussianBlur in="SourceGraphic" stdDeviation={strength} result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
      </defs>
    </svg>
  );
};

const DotMaterial = shaderMaterial(
  {
    resolution: new THREE.Vector2(),
    mouseTrail: null,
    gridSize: 100,
    pixelColor: new THREE.Color('#ffffff')
  },
  /* glsl */ `
    varying vec2 vUv;
    void main() {
      gl_Position = vec4(position.xy, 0.0, 1.0);
    }
  `,
  /* glsl */ `
    uniform vec2 resolution;
    uniform sampler2D mouseTrail;
    uniform float gridSize;
    uniform vec3 pixelColor;

    vec2 coverUv(vec2 uv) {
      vec2 s = resolution.xy / max(resolution.x, resolution.y);
      vec2 newUv = (uv - 0.5) * s + 0.5;
      return clamp(newUv, 0.0, 1.0);
    }

    void main() {
      vec2 screenUv = gl_FragCoord.xy / resolution;
      vec2 uv = coverUv(screenUv);

      vec2 gridUvCenter = (floor(uv * gridSize) + 0.5) / gridSize;

      float trail = texture2D(mouseTrail, gridUvCenter).r;

      gl_FragColor = vec4(pixelColor, trail);
    }
  `
);

interface SceneProps {
  gridSize: number;
  trailSize: number;
  maxAge: number;
  interpolate: number;
  easingFunction: (x: number) => number;
  pixelColor: string;
}

function Scene({
  gridSize,
  trailSize,
  maxAge,
  interpolate,
  easingFunction,
  pixelColor
}: SceneProps) {
  const size = useThree(s => s.size);
  const viewport = useThree(s => s.viewport);

  const dotMaterial = useMemo(() => new DotMaterial(), []);

  useEffect(() => {
    if (dotMaterial && dotMaterial.uniforms.pixelColor) {
      dotMaterial.uniforms.pixelColor.value.set(pixelColor);
    }
  }, [dotMaterial, pixelColor]);

  const [trail, onMove] = useTrailTexture({
    size: 256,
    radius: trailSize,
    maxAge: maxAge,
    interpolate: interpolate || 0.1,
    ease: easingFunction || ((x: number) => x)
  });

  useEffect(() => {
    if (trail) {
      // eslint-disable-next-line react-hooks/immutability
      trail.minFilter = THREE.NearestFilter;
      trail.magFilter = THREE.NearestFilter;
      trail.wrapS = THREE.ClampToEdgeWrapping;
      trail.wrapT = THREE.ClampToEdgeWrapping;
    }
  }, [trail]);

  useEffect(() => {
    const handlePointerMove = (e: PointerEvent) => {
      if (!onMove) return;
      const x = e.clientX / window.innerWidth;
      const y = 1 - e.clientY / window.innerHeight;

      onMove({
        uv: new THREE.Vector2(x, y),
        x: e.clientX,
        y: e.clientY
      } as unknown as Parameters<typeof onMove>[0]);
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });
    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [onMove]);

  const scale = Math.max(viewport.width, viewport.height) / 2;

  return (
    <mesh scale={[scale, scale, 1]}>
      <planeGeometry args={[2, 2]} />
      <primitive
        object={dotMaterial}
        gridSize={gridSize}
        resolution={[size.width * viewport.dpr, size.height * viewport.dpr]}
        mouseTrail={trail}
      />
    </mesh>
  );
}

export default function PixelTrail({
  gridSize = 80,
  trailSize = 0.04,
  maxAge = 200,
  interpolate = 3,
  easingFunction = (x: number) => x,
  canvasProps = {},
  glProps = {
    antialias: false,
    powerPreference: 'high-performance',
    alpha: true,
    depth: false,
    stencil: false
  },
  gooeyFilter,
  color = '#ffffff',
  className = ''
}: PixelTrailProps) {
  return (
    <>
      {gooeyFilter && <GooeyFilter id={gooeyFilter.id} strength={gooeyFilter.strength} />}
      <Canvas
        dpr={[1, 1.25]}
        {...canvasProps}
        gl={glProps}
        className={`pixel-canvas ${className}`}
        style={gooeyFilter ? { filter: `url(#${gooeyFilter.id})` } : undefined}
      >
        <Scene
          gridSize={gridSize}
          trailSize={trailSize}
          maxAge={maxAge}
          interpolate={interpolate}
          easingFunction={easingFunction}
          pixelColor={color}
        />
      </Canvas>
    </>
  );
}
