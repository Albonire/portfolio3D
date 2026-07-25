"use client";

import React, { useRef, useEffect, useState } from "react";

type Mark = {
  x: number;
  y: number;
  radius: number;
  age: number;
  life: number;
  hold: number;
  alpha: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
  sprite: { mask: HTMLCanvasElement; dry: HTMLCanvasElement };
  ripple: boolean;
  seed: number;
};

type SteamParticle = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  age: number;
  life: number;
  alpha: number;
};

export default function WetCanvasProfile() {
  const [isLoading, setIsLoading] = useState(true);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  // Keep image elements in refs to avoid stale closures in the loop
  const imgNormalRef = useRef<HTMLImageElement | null>(null);
  const imgMarmolRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let isMounted = true;
    let frameId = 0;

    // Simulation configuration matching efect.html
    const config = {
      maxSide: 1650, // Match original side scale
      dropScale: 0.08,
      maxMarks: 520,
      maxSteam: 120,
      lifeMin: 2.8,
      lifeMax: 6.1,
    };

    const tau = Math.PI * 2;
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) return;

    // Offscreen canvases for masking & compositing
    const maskCanvas = document.createElement("canvas");
    const maskCtx = maskCanvas.getContext("2d");

    const silverCanvas = document.createElement("canvas");
    const silverCtx = silverCanvas.getContext("2d");

    if (!maskCtx || !silverCtx) return;

    // Simulation states
    let width = 0;
    let height = 0;
    let baseRadius = 50;
    let porosityPattern: CanvasPattern | null = null;
    let sprites: { mask: HTMLCanvasElement; dry: HTMLCanvasElement }[] = [];

    const marks: Mark[] = [];
    const steam: SteamParticle[] = [];

    const pointer = {
      inside: false,
      x: 0,
      y: 0,
    };

    const dropper = {
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      carry: 0,
      gap: 20,
      idle: 0,
      nextIdle: 0.2,
    };

    // Helper functions
    const random = (a = 1, b?: number) => {
      if (b === undefined) {
        b = a;
        a = 0;
      }
      return a + Math.random() * (b - a);
    };

    const clamp = (value: number, min: number, max: number) =>
      Math.max(min, Math.min(max, value));

    const smoothstep = (edge0: number, edge1: number, x: number) => {
      const t = clamp((x - edge0) / (edge1 - edge0), 0, 1);
      return t * t * (3 - 2 * t);
    };

    const easeOutCubic = (t: number) => 1 - Math.pow(1 - clamp(t, 0, 1), 3);
    const easeOutSine = (t: number) => Math.sin(clamp(t, 0, 1) * Math.PI * 0.5);

    function mulberry32(seed: number) {
      return function () {
        let t = (seed += 0x6d2b79f5);
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }

    function loadImage(src: string): Promise<HTMLImageElement> {
      return new Promise((resolve, reject) => {
        const img = new Image();
        img.decoding = "async";
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = src;
      });
    }

    function drawImageAligned(context: CanvasRenderingContext2D, img: HTMLImageElement) {
      if (!width || !height) return;
      context.drawImage(img, 0, 0, width, height);
    }

    function canvasPoint(event: PointerEvent) {
      if (!width || !height || !canvas) return null;
      const rect = canvas.getBoundingClientRect();
      return {
        x: clamp((event.clientX - rect.left) * (width / rect.width), 0, width),
        y: clamp((event.clientY - rect.top) * (height / rect.height), 0, height),
      };
    }

    function setPointer(event: PointerEvent) {
      const point = canvasPoint(event);
      if (!point) return null;

      pointer.inside = true;
      pointer.x = point.x;
      pointer.y = point.y;

      return point;
    }

    function activatePointer(event: PointerEvent) {
      const point = setPointer(event);
      if (!point) return;

      if (!dropper.active) {
        dropper.active = true;
        dropper.x = point.x;
        dropper.y = point.y;
        dropper.vx = 0;
        dropper.vy = 0;
        dropper.carry = 0;
        dropper.gap = baseRadius * random(0.18, 0.35);
        dropper.idle = 0;
        dropper.nextIdle = random(0.08, 0.18);

        addWetMark(point.x, point.y, baseRadius * random(0.85, 1.15), {
          speedNorm: 0.45,
          angle: random(tau),
          alpha: 0.96,
          ripple: true,
          lifeScale: 1.08,
        });

        emitSteam(point.x, point.y, baseRadius, 0.45);
      }
    }

    function makePorosityPattern() {
      const size = 280;
      const patternCanvas = document.createElement("canvas");
      const graphics = patternCanvas.getContext("2d");
      if (!graphics) return patternCanvas;

      patternCanvas.width = size;
      patternCanvas.height = size;

      const imageData = graphics.createImageData(size, size);
      const data = imageData.data;

      for (let i = 0; i < data.length; i += 4) {
        const noise = Math.random();
        data[i] = 255;
        data[i + 1] = 255;
        data[i + 2] = 255;
        data[i + 3] =
          noise > 0.58
            ? Math.random() * 74
            : noise > 0.965
            ? Math.random() * 135
            : 0;
      }

      graphics.putImageData(imageData, 0, 0);
      graphics.lineCap = "round";
      graphics.lineJoin = "round";

      for (let i = 0; i < 22; i++) {
        graphics.strokeStyle = `rgba(255,255,255,${random(0.04, 0.16)})`;
        graphics.lineWidth = random(0.35, 1.15);

        let x = random(size);
        let y = random(size);

        graphics.beginPath();
        graphics.moveTo(x, y);

        const steps = 2 + Math.floor(random(4));
        for (let j = 0; j < steps; j++) {
          x += random(-38, 38);
          y += random(-38, 38);
          graphics.lineTo(x, y);
        }
        graphics.stroke();
      }

      return patternCanvas;
    }

    function softEllipse(
      context: CanvasRenderingContext2D,
      x: number,
      y: number,
      radiusX: number,
      radiusY: number,
      rotation: number,
      alpha: number
    ) {
      context.save();
      context.translate(x, y);
      context.rotate(rotation);
      context.scale(1, radiusY / radiusX);

      const gradient = context.createRadialGradient(0, 0, 0, 0, 0, radiusX);
      gradient.addColorStop(0.0, `rgba(255,255,255,${alpha})`);
      gradient.addColorStop(0.48, `rgba(255,255,255,${alpha * 0.55})`);
      gradient.addColorStop(1.0, "rgba(255,255,255,0)");

      context.fillStyle = gradient;
      context.beginPath();
      context.arc(0, 0, radiusX, 0, tau);
      context.fill();

      context.restore();
    }

    function makeWetSprite(size: number, seed: number) {
      const randomGenerator = mulberry32(seed);
      const mask = document.createElement("canvas");
      const dry = document.createElement("canvas");

      mask.width = mask.height = size;
      dry.width = dry.height = size;

      const maskContext = mask.getContext("2d");
      const dryContext = dry.getContext("2d");

      if (!maskContext || !dryContext) return { mask, dry };

      const centerX = size * 0.5;
      const centerY = size * 0.5;
      const baseSize = size * 0.39;

      const phase1 = randomGenerator() * tau;
      const phase2 = randomGenerator() * tau;
      const phase3 = randomGenerator() * tau;

      const points: { x: number; y: number }[] = [];
      const totalPoints = 104;

      for (let i = 0; i < totalPoints; i++) {
        const angle = (i / totalPoints) * tau;
        const noise =
          1 +
          Math.sin(angle * 2 + phase1) * 0.055 +
          Math.sin(angle * 5 + phase2) * 0.09 +
          Math.sin(angle * 11 + phase3) * 0.043 +
          (randomGenerator() - 0.5) * 0.055;

        points.push({
          x: Math.cos(angle) * baseSize * noise,
          y: Math.sin(angle) * baseSize * noise,
        });
      }

      function blobPath(context: CanvasRenderingContext2D) {
        context.beginPath();
        const first = points[0];
        const last = points[points.length - 1];

        context.moveTo(
          centerX + (first.x + last.x) * 0.5,
          centerY + (first.y + last.y) * 0.5
        );

        for (let i = 0; i < points.length; i++) {
          const current = points[i];
          const next = points[(i + 1) % points.length];

          context.quadraticCurveTo(
            centerX + current.x,
            centerY + current.y,
            centerX + (current.x + next.x) * 0.5,
            centerY + (current.y + next.y) * 0.5
          );
        }
        context.closePath();
      }

      maskContext.save();
      blobPath(maskContext);
      maskContext.clip();

      const offsetX = (randomGenerator() - 0.5) * size * 0.09;
      const offsetY = (randomGenerator() - 0.5) * size * 0.09;

      const gradient = maskContext.createRadialGradient(
        centerX + offsetX,
        centerY + offsetY,
        size * 0.025,
        centerX + offsetX,
        centerY + offsetY,
        baseSize * 1.35
      );

      gradient.addColorStop(0.0, "rgba(255,255,255,0.98)");
      gradient.addColorStop(0.24, "rgba(255,255,255,0.86)");
      gradient.addColorStop(0.58, "rgba(255,255,255,0.42)");
      gradient.addColorStop(0.84, "rgba(255,255,255,0.14)");
      gradient.addColorStop(1.0, "rgba(255,255,255,0)");

      maskContext.fillStyle = gradient;
      maskContext.fillRect(0, 0, size, size);

      for (let i = 0; i < 6; i++) {
        softEllipse(
          maskContext,
          centerX + (randomGenerator() - 0.5) * baseSize * 0.45,
          centerY + (randomGenerator() - 0.5) * baseSize * 0.45,
          baseSize * random(0.12, 0.32),
          baseSize * random(0.05, 0.17),
          randomGenerator() * tau,
          random(0.045, 0.105)
        );
      }
      maskContext.restore();

      const lobes = 9 + Math.floor(randomGenerator() * 8);
      for (let i = 0; i < lobes; i++) {
        const angle = randomGenerator() * tau;
        const distance = baseSize * random(0.63, 1.08);
        const lobeX = centerX + Math.cos(angle) * distance;
        const lobeY = centerY + Math.sin(angle) * distance;
        const lobeRadius = baseSize * random(0.08, 0.24);

        softEllipse(
          maskContext,
          lobeX,
          lobeY,
          lobeRadius,
          lobeRadius * random(0.38, 0.82),
          angle + randomGenerator() * 1.2,
          random(0.105, 0.28)
        );
      }

      maskContext.save();
      maskContext.globalCompositeOperation = "destination-out";
      maskContext.fillStyle = "#fff";
      maskContext.strokeStyle = "#fff";

      for (let i = 0; i < 150; i++) {
        const angle = randomGenerator() * tau;
        const radiusRange =
          baseSize * Math.sqrt(randomGenerator()) * random(0.12, 1.08);
        const pixelX = centerX + Math.cos(angle) * radiusRange;
        const pixelY = centerY + Math.sin(angle) * radiusRange;
        const pixelRadius = size * random(0.0025, 0.011);

        maskContext.globalAlpha = random(0.025, 0.14);

        maskContext.beginPath();
        maskContext.ellipse(
          pixelX,
          pixelY,
          pixelRadius * random(0.8, 1.9),
          pixelRadius * random(0.45, 1.15),
          randomGenerator() * tau,
          0,
          tau
        );
        maskContext.fill();
      }

      maskContext.lineCap = "round";
      maskContext.lineJoin = "round";

      for (let i = 0; i < 10; i++) {
        const angle = randomGenerator() * tau;
        const startX = centerX + Math.cos(angle) * baseSize * random(0.05, 0.46);
        const startY = centerY + Math.sin(angle) * baseSize * random(0.05, 0.46);

        maskContext.globalAlpha = random(0.025, 0.075);
        maskContext.lineWidth = size * random(0.0018, 0.0046);

        maskContext.beginPath();
        maskContext.moveTo(startX, startY);
        maskContext.bezierCurveTo(
          startX + random(-baseSize * 0.35, baseSize * 0.35),
          startY + random(-baseSize * 0.35, baseSize * 0.35),
          startX + random(-baseSize * 0.68, baseSize * 0.68),
          startY + random(-baseSize * 0.68, baseSize * 0.68),
          startX + random(-baseSize * 0.95, baseSize * 0.95),
          startY + random(-baseSize * 0.95, baseSize * 0.95)
        );
        maskContext.stroke();
      }
      maskContext.restore();

      // Dry texture
      dryContext.save();
      blobPath(dryContext);
      dryContext.clip();

      dryContext.fillStyle = "#fff";
      dryContext.strokeStyle = "#fff";
      dryContext.lineCap = "round";
      dryContext.lineJoin = "round";

      for (let i = 0; i < 210; i++) {
        const angle = randomGenerator() * tau;
        const radiusRange = baseSize * Math.sqrt(randomGenerator()) * 0.98;
        const pixelX = centerX + Math.cos(angle) * radiusRange;
        const pixelY = centerY + Math.sin(angle) * radiusRange;
        const pixelRadius = size * random(0.0025, 0.014);

        dryContext.globalAlpha = random(0.045, 0.18);

        dryContext.beginPath();
        dryContext.ellipse(
          pixelX,
          pixelY,
          pixelRadius * random(0.7, 2.6),
          pixelRadius * random(0.35, 1.15),
          randomGenerator() * tau,
          0,
          tau
        );
        dryContext.fill();
      }

      for (let i = 0; i < 16; i++) {
        const angle = randomGenerator() * tau;
        const startX = centerX + Math.cos(angle) * baseSize * random(0.05, 0.38);
        const startY = centerY + Math.sin(angle) * baseSize * random(0.05, 0.38);

        dryContext.globalAlpha = random(0.07, 0.22);
        dryContext.lineWidth = size * random(0.002, 0.0065);

        dryContext.beginPath();
        dryContext.moveTo(startX, startY);
        dryContext.bezierCurveTo(
          startX + random(-baseSize * 0.22, baseSize * 0.22),
          startY + random(-baseSize * 0.22, baseSize * 0.22),
          startX + random(-baseSize * 0.55, baseSize * 0.55),
          startY + random(-baseSize * 0.55, baseSize * 0.55),
          startX + random(-baseSize * 0.95, baseSize * 0.95),
          startY + random(-baseSize * 0.95, baseSize * 0.95)
        );
        dryContext.stroke();
      }
      dryContext.restore();

      return { mask, dry };
    }

    function addWetMark(
      x: number,
      y: number,
      radius: number,
      options: {
        speedNorm?: number;
        idle?: boolean;
        alpha?: number;
        angle?: number;
        lifeScale?: number;
        sx?: number;
        sy?: number;
        ripple?: boolean;
      } = {}
    ) {
      if (
        x < -radius * 2 ||
        y < -radius * 2 ||
        x > width + radius * 2 ||
        y > height + radius * 2
      ) {
        return;
      }

      const speedNorm = options.speedNorm || 0;
      const stretch = options.idle
        ? random(0.9, 1.16)
        : 1 + speedNorm * random(0.25, 0.68) + random(0, 0.12);

      const lifeSize = clamp(radius / baseRadius, 0.35, 1.65);

      marks.push({
        x,
        y,
        radius,
        age: 0,
        life:
          random(config.lifeMin, config.lifeMax) *
          (0.82 + lifeSize * 0.23) *
          (options.lifeScale || 1),
        hold: random(0.36, 0.58),
        alpha: options.alpha ?? random(0.72, 0.94),
        rotation: (options.angle ?? random(tau)) + random(-0.55, 0.55),
        scaleX: options.sx || stretch,
        scaleY: options.sy || (1 / Math.sqrt(stretch)) * random(0.92, 1.08),
        sprite: sprites[(Math.random() * sprites.length) | 0],
        ripple: options.ripple ?? true,
        seed: random(1000),
      });

      if (marks.length > config.maxMarks) {
        marks.splice(0, marks.length - config.maxMarks);
      }
    }

    function spawnWater(
      x: number,
      y: number,
      speed: number,
      angle: number,
      idle = false
    ) {
      const speedNorm = clamp(speed / (baseRadius * 32), 0, 1);
      const perpendicular = angle + Math.PI * 0.5;

      const jitter = baseRadius * (idle ? 0.18 : 0.04 + speedNorm * 0.08);
      const posX = x + Math.cos(perpendicular) * random(-jitter, jitter);
      const posY = y + Math.sin(perpendicular) * random(-jitter, jitter);

      const radius = idle
        ? baseRadius * random(0.22, 0.46)
        : baseRadius * random(0.42, 0.84) * (1 + speedNorm * 0.35);

      addWetMark(posX, posY, radius, {
        speedNorm,
        angle,
        idle,
        alpha: idle ? random(0.6, 0.84) : random(0.78, 0.97),
        ripple: !idle || Math.random() < 0.42,
        lifeScale: idle ? random(0.72, 0.95) : random(0.92, 1.16),
      });

      const satelliteCount = idle
        ? Math.random() < 0.18
          ? 1
          : 0
        : Math.floor(random(0, 2) + speedNorm * 5);

      for (let i = 0; i < satelliteCount; i++) {
        const direction =
          angle + random(-1.25, 1.25) + (Math.random() < 0.22 ? Math.PI : 0);

        const distance = radius * random(0.38, 1.55) * (1 + speedNorm * 0.65);
        const satelliteRadius = radius * random(0.055, 0.22);

        addWetMark(
          posX + Math.cos(direction) * distance + random(-baseRadius * 0.04, baseRadius * 0.04),
          posY + Math.sin(direction) * distance + random(-baseRadius * 0.04, baseRadius * 0.04),
          satelliteRadius,
          {
            speedNorm: speedNorm * 0.55,
            angle: direction,
            alpha: random(0.42, 0.72),
            ripple: false,
            lifeScale: random(0.5, 0.9),
          }
        );
      }

      if (Math.random() < (idle ? 0.08 : 0.22 + speedNorm * 0.28)) {
        emitSteam(posX, posY, radius, speedNorm);
      }
    }

    function emitSteam(x: number, y: number, radius: number, strength: number) {
      const count = Math.min(
        config.maxSteam - steam.length,
        1 + Math.floor(random(0, 2) + strength * 3)
      );

      if (count <= 0) return;

      for (let i = 0; i < count; i++) {
        steam.push({
          x: x + random(-radius * 0.34, radius * 0.34),
          y: y + random(-radius * 0.25, radius * 0.18),
          vx: random(-12, 12),
          vy: -random(16, 44) * (0.65 + strength * 0.55),
          size: radius * random(0.035, 0.075),
          age: 0,
          life: random(0.55, 1.35),
          alpha: random(0.025, 0.075),
        });
      }

      if (steam.length > config.maxSteam) {
        steam.splice(0, steam.length - config.maxSteam);
      }
    }

    function updateDropper(deltaTime: number) {
      if (!pointer.inside || !dropper.active) return;

      const oldX = dropper.x;
      const oldY = dropper.y;

      const stiffness = 45;
      const damping = 8.5;

      dropper.vx += (pointer.x - dropper.x) * stiffness * deltaTime;
      dropper.vy += (pointer.y - dropper.y) * stiffness * deltaTime;

      const dampFactor = Math.exp(-damping * deltaTime);
      dropper.vx *= dampFactor;
      dropper.vy *= dampFactor;

      dropper.x += dropper.vx * deltaTime;
      dropper.y += dropper.vy * deltaTime;

      dropper.x = clamp(dropper.x, -baseRadius, width + baseRadius);
      dropper.y = clamp(dropper.y, -baseRadius, height + baseRadius);

      const dx = dropper.x - oldX;
      const dy = dropper.y - oldY;
      const distance = Math.hypot(dx, dy);

      if (distance > 0.08) {
        const speed = distance / Math.max(deltaTime, 0.001);
        emitTrail(oldX, oldY, dropper.x, dropper.y, speed);
        dropper.idle = 0;
      } else {
        dropper.idle += deltaTime;

        if (dropper.idle >= dropper.nextIdle) {
          const angle = random(tau);
          const dist = baseRadius * random(0, 0.26);

          spawnWater(
            pointer.x + Math.cos(angle) * dist,
            pointer.y + Math.sin(angle) * dist,
            0,
            angle,
            true
          );

          dropper.idle = 0;
          dropper.nextIdle = random(0.08, 0.22);
        }
      }
    }

    function emitTrail(x1: number, y1: number, x2: number, y2: number, speed: number) {
      const dx = x2 - x1;
      const dy = y2 - y1;
      const distance = Math.hypot(dx, dy);

      if (distance <= 0.001) return;

      const angle = Math.atan2(dy, dx);
      const speedNorm = clamp(speed / (baseRadius * 32), 0, 1);
      const baseGap = baseRadius * (0.28 - speedNorm * 0.08);

      dropper.carry += distance;
      let guard = 0;

      while (dropper.carry >= dropper.gap && guard++ < 18) {
        const overshoot = dropper.carry - dropper.gap;
        const t = clamp(1 - overshoot / distance, 0, 1);

        spawnWater(x1 + dx * t, y1 + dy * t, speed, angle, false);

        dropper.carry = overshoot;
        dropper.gap = baseGap * random(0.55, 1.1);
      }
    }

    function updateMarks(deltaTime: number) {
      for (let i = marks.length - 1; i >= 0; i--) {
        const mark = marks[i];
        mark.age += deltaTime;

        if (mark.age >= mark.life) {
          marks.splice(i, 1);
        }
      }
    }

    function updateSteam(deltaTime: number) {
      for (let i = steam.length - 1; i >= 0; i--) {
        const particle = steam[i];
        particle.age += deltaTime;

        if (particle.age >= particle.life) {
          steam.splice(i, 1);
          continue;
        }

        const wobble = Math.sin((particle.age * 5.5 + particle.size) * 2.0);
        particle.x += (particle.vx + wobble * 3.2) * deltaTime;
        particle.y += particle.vy * deltaTime;

        particle.vy -= 5.8 * deltaTime;
        particle.vx *= Math.exp(-1.4 * deltaTime);
        particle.size += baseRadius * 0.009 * deltaTime;
      }
    }

    function wetAlpha(t: number, hold: number) {
      const appear = smoothstep(0, 0.055, t);
      const fade = 1 - smoothstep(hold, 1, t);
      return appear * Math.pow(clamp(fade, 0, 1), 1.12);
    }

    function drawTransformed(
      context: CanvasRenderingContext2D,
      image: HTMLCanvasElement | HTMLImageElement,
      x: number,
      y: number,
      radius: number,
      rotation: number,
      scaleX: number,
      scaleY: number,
      alpha: number,
      mode: GlobalCompositeOperation
    ) {
      context.save();
      context.globalCompositeOperation = mode;
      context.globalAlpha = alpha;
      context.translate(x, y);
      context.rotate(rotation);
      context.scale(scaleX, scaleY);
      context.drawImage(image, -radius, -radius, radius * 2, radius * 2);
      context.restore();
    }

    function drawRipple(mark: Mark, radius: number, alpha: number) {
      const duration = 0.43;
      const progress = clamp(mark.age / duration, 0, 1);

      if (progress >= 1 || !maskCtx) return;

      maskCtx.save();
      maskCtx.globalCompositeOperation = "source-over";
      maskCtx.globalAlpha = alpha * Math.pow(1 - progress, 1.8) * 0.2;
      maskCtx.translate(mark.x, mark.y);
      maskCtx.rotate(mark.rotation);
      maskCtx.scale(mark.scaleX, mark.scaleY);
      maskCtx.strokeStyle = "#fff";
      maskCtx.lineWidth = Math.max(1, radius * (0.018 + progress * 0.014));

      maskCtx.beginPath();
      maskCtx.ellipse(
        0,
        0,
        radius * (0.68 + progress * 0.48),
        radius * (0.6 + progress * 0.42),
        0,
        0,
        tau
      );
      maskCtx.stroke();
      maskCtx.restore();
    }

    function renderWetMark(mark: Mark) {
      if (!maskCtx) return;
      const t = clamp(mark.age / mark.life, 0, 1);
      const alpha = wetAlpha(t, mark.hold) * mark.alpha;

      if (alpha <= 0.003) return;

      const appear = easeOutCubic(clamp(mark.age / 0.22, 0, 1));
      const spread = 0.42 + appear * 0.58 + easeOutSine(t) * 0.145;
      const pulse =
        1 + Math.sin((mark.age * 7.2 + mark.seed) * 2.13) * 0.014 * (1 - t);
      const radius = mark.radius * spread * pulse;

      drawTransformed(
        maskCtx,
        mark.sprite.mask,
        mark.x,
        mark.y,
        radius,
        mark.rotation,
        mark.scaleX,
        mark.scaleY,
        alpha,
        "source-over"
      );

      if (mark.ripple && mark.age < 0.43) {
        drawRipple(mark, radius, alpha);
      }

      if (t > 0.42) {
        const dryAlpha =
          smoothstep(0.42, 0.98, t) *
          (0.48 + smoothstep(0.72, 1, t) * 0.28) *
          mark.alpha;

        drawTransformed(
          maskCtx,
          mark.sprite.dry,
          mark.x,
          mark.y,
          radius * 1.035,
          mark.rotation,
          mark.scaleX,
          mark.scaleY,
          dryAlpha,
          "destination-out"
        );
      }
    }

    function renderMask() {
      if (!maskCtx || !porosityPattern) return;
      maskCtx.setTransform(1, 0, 0, 1, 0, 0);
      maskCtx.clearRect(0, 0, width, height);
      maskCtx.globalCompositeOperation = "source-over";
      maskCtx.globalAlpha = 1;
      maskCtx.imageSmoothingEnabled = true;

      for (const mark of marks) {
        renderWetMark(mark);
      }

      maskCtx.save();
      maskCtx.globalCompositeOperation = "destination-out";
      maskCtx.globalAlpha = 0.04;
      maskCtx.fillStyle = porosityPattern;
      maskCtx.fillRect(0, 0, width, height);
      maskCtx.restore();
    }

    function drawSteam() {
      if (!steam.length || !ctx) return;
      ctx.save();
      ctx.globalCompositeOperation = "screen";

      for (const particle of steam) {
        const t = clamp(particle.age / particle.life, 0, 1);
        const a = Math.pow(1 - t, 2.2) * particle.alpha;
        const radius = particle.size * (1 + t * 3.2);

        const gradient = ctx.createRadialGradient(
          particle.x,
          particle.y,
          0,
          particle.x,
          particle.y,
          radius
        );
        gradient.addColorStop(0, `rgba(210,225,255,${a})`);
        gradient.addColorStop(0.45, `rgba(210,225,255,${a * 0.38})`);
        gradient.addColorStop(1, "rgba(210,225,255,0)");

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, radius, 0, tau);
        ctx.fill();
      }

      ctx.restore();
      ctx.globalCompositeOperation = "source-over";
    }

    function renderFrame() {
      if (!ctx || !maskCanvas || !silverCanvas || !silverCtx || !isMounted) return;

      const originalImg = imgNormalRef.current;
      const silverImg = imgMarmolRef.current;

      if (!originalImg || !silverImg) return;

      renderMask();

      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.globalCompositeOperation = "source-over";
      ctx.globalAlpha = 1;
      ctx.clearRect(0, 0, width, height);

      // 1. Draw Normal Image in full color as base
      drawImageAligned(ctx, originalImg);

      // 2. Prepare reveal canvas
      silverCtx.setTransform(1, 0, 0, 1, 0, 0);
      silverCtx.clearRect(0, 0, width, height);

      silverCtx.save();
      silverCtx.filter = "contrast(1.06) brightness(1.025)";
      drawImageAligned(silverCtx, silverImg);
      silverCtx.restore();

      // 3. Mask reveal canvas with wet droplet mask
      silverCtx.globalCompositeOperation = "destination-in";
      silverCtx.drawImage(maskCanvas, 0, 0);
      silverCtx.globalCompositeOperation = "source-over";

      // 4. Overlay masked reveal canvas on top of original color image
      ctx.drawImage(silverCanvas, 0, 0);

      // 5. Draw steam particles
      drawSteam();
    }

    function updateSimulation(deltaTime: number) {
      updateDropper(deltaTime);
      updateMarks(deltaTime);
      updateSteam(deltaTime);
    }

    let lastTime = performance.now();

    function loop(now: number) {
      if (!isMounted) return;
      const deltaTime = Math.min(
        0.045,
        Math.max(0.001, (now - lastTime) / 1000 || 0.016)
      );
      lastTime = now;

      updateSimulation(deltaTime);
      renderFrame();

      frameId = requestAnimationFrame(loop);
    }

    // Pointer Event Listeners
    const onPointerEnter = (e: PointerEvent) => activatePointer(e);
    const onPointerMove = (e: PointerEvent) => setPointer(e);
    const onPointerDown = (e: PointerEvent) => {
      if (canvas.setPointerCapture) {
        canvas.setPointerCapture(e.pointerId);
      }
      activatePointer(e);
    };
    const onPointerLeave = () => {
      pointer.inside = false;
      dropper.active = false;
    };
    const onPointerUp = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") {
        pointer.inside = false;
        dropper.active = false;
      }
    };
    const onPointerCancel = () => {
      pointer.inside = false;
      dropper.active = false;
    };
    const onWindowBlur = () => {
      pointer.inside = false;
      dropper.active = false;
    };

    let handleResize: (() => void) | null = null;

    // Load original PNG images matching efect.html
    const original_image_path = "/images/yo-normal.png";
    const marmol_image_path = "/images/yo-marmol.png";

    Promise.all([
      loadImage(original_image_path),
      loadImage(marmol_image_path),
    ])
      .then(([imgNormal, imgMarmol]) => {
        if (!isMounted) return;

        imgNormalRef.current = imgNormal;
        imgMarmolRef.current = imgMarmol;

        const updateSize = () => {
          width = window.innerWidth;
          height = window.innerHeight;

          canvas.width = width;
          canvas.height = height;

          maskCanvas.width = width;
          maskCanvas.height = height;

          silverCanvas.width = width;
          silverCanvas.height = height;

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = "high";
          silverCtx.imageSmoothingEnabled = true;
          silverCtx.imageSmoothingQuality = "high";
          maskCtx.imageSmoothingEnabled = true;
          maskCtx.imageSmoothingQuality = "high";

          baseRadius = Math.max(18, Math.hypot(width, height) * config.dropScale);
          renderFrame();
        };

        handleResize = updateSize;
        handleResize();
        window.addEventListener("resize", handleResize);

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = "high";

        silverCtx.imageSmoothingEnabled = true;
        silverCtx.imageSmoothingQuality = "high";

        maskCtx.imageSmoothingEnabled = true;
        maskCtx.imageSmoothingQuality = "high";

        baseRadius = Math.max(18, Math.hypot(width, height) * config.dropScale);
        porosityPattern = maskCtx.createPattern(makePorosityPattern(), "repeat");

        // Generate drop shape sprites
        sprites = Array.from({ length: 24 }, (_, i) =>
          makeWetSprite(320, 1000 + i * 97)
        );

        // Bind events
        canvas.addEventListener("pointerenter", onPointerEnter);
        canvas.addEventListener("pointermove", onPointerMove);
        canvas.addEventListener("pointerdown", onPointerDown);
        canvas.addEventListener("pointerleave", onPointerLeave);
        canvas.addEventListener("pointerup", onPointerUp);
        canvas.addEventListener("pointercancel", onPointerCancel);
        window.addEventListener("blur", onWindowBlur);

        setIsLoading(false);
        renderFrame();

        lastTime = performance.now();
        frameId = requestAnimationFrame(loop);
      })
      .catch((err) => {
        console.error("Failed to load original PNG images", err);
      });

    return () => {
      isMounted = false;
      cancelAnimationFrame(frameId);

      canvas.removeEventListener("pointerenter", onPointerEnter);
      canvas.removeEventListener("pointermove", onPointerMove);
      canvas.removeEventListener("pointerdown", onPointerDown);
      canvas.removeEventListener("pointerleave", onPointerLeave);
      canvas.removeEventListener("pointerup", onPointerUp);
      canvas.removeEventListener("pointercancel", onPointerCancel);
      window.removeEventListener("blur", onWindowBlur);
      if (handleResize) window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex flex-col items-center w-full relative group">
      <div 
        className="relative w-full max-w-xs sm:max-w-sm lg:max-w-md aspect-[864/1184] rounded-2xl md:rounded-[2rem] overflow-hidden shadow-2xl shadow-black/20 dark:shadow-none"
      >
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center z-20 bg-[#1A1D1B]">
            <div className="font-mono text-[10px] text-[var(--color-muted)] tracking-wider animate-pulse text-white/50">
              LOADING CANVAS...
            </div>
          </div>
        )}
        
        <canvas
          ref={canvasRef}
          className="w-full h-full block cursor-crosshair touch-none select-none"
        />
      </div>
    </div>
  );
}
