"use client";

import { useEffect, useRef, useMemo, ReactNode, RefObject } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

import './ScrollReveal.css';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

interface ScrollRevealProps {
  children: ReactNode;
  scrollContainerRef?: RefObject<HTMLElement | null>;
  enableBlur?: boolean;
  baseOpacity?: number;
  baseRotation?: number;
  blurStrength?: number;
  containerClassName?: string;
  textClassName?: string;
  rotationEnd?: string;
  wordAnimationEnd?: string;
}

export default function ScrollReveal({
  children,
  scrollContainerRef,
  enableBlur = true,
  baseOpacity = 0.05,
  baseRotation = 4,
  blurStrength = 12,
  containerClassName = '',
  textClassName = '',
  rotationEnd = 'bottom 20%',
  wordAnimationEnd = 'bottom 15%'
}: ScrollRevealProps) {
  const containerRef = useRef<HTMLHeadingElement>(null);

  const splitText = useMemo(() => {
    const text = typeof children === 'string' ? children : '';
    return text.split(/(\s+)/).map((word, index) => {
      if (word.match(/^\s+$/)) return word;
      return (
        <span className="word" key={index}>
          {word}
        </span>
      );
    });
  }, [children]);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const scroller =
      scrollContainerRef && scrollContainerRef.current
        ? scrollContainerRef.current
        : window;

    const ctx = gsap.context(() => {
      const wordElements = el.querySelectorAll('.word');

      // Single timeline with unified ScrollTrigger to eliminate duplicate scroll listeners & recalculations
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          scroller,
          start: 'top 85%',
          end: wordAnimationEnd,
          scrub: 0.8
        }
      });

      // Animate rotation on container
      tl.fromTo(
        el,
        { transformOrigin: '0% 50%', rotate: baseRotation },
        { rotate: 0, ease: 'none', duration: 1 },
        0
      );

      // Unified animation for word elements
      const wordVarsFrom: gsap.TweenVars = {
        opacity: baseOpacity,
        transform: 'translate3d(0, 10px, 0)',
        willChange: 'opacity, filter, transform',
        force3D: true
      };

      const wordVarsTo: gsap.TweenVars = {
        opacity: 1,
        transform: 'translate3d(0, 0px, 0)',
        stagger: 0.05,
        ease: 'none',
        duration: 1
      };

      if (enableBlur) {
        // Cap max blur at 8px to prevent GPU filter rasterization bottlenecks on large fonts
        const optimizedBlur = Math.min(blurStrength, 8);
        wordVarsFrom.filter = `blur(${optimizedBlur}px)`;
        wordVarsTo.filter = 'blur(0px)';
      }

      tl.fromTo(wordElements, wordVarsFrom, wordVarsTo, 0);
    }, containerRef);

    return () => {
      ctx.revert();
    };
  }, [
    scrollContainerRef,
    enableBlur,
    baseRotation,
    baseOpacity,
    rotationEnd,
    wordAnimationEnd,
    blurStrength
  ]);

  return (
    <h2 ref={containerRef} className={`scroll-reveal ${containerClassName}`}>
      <p className={`scroll-reveal-text ${textClassName}`}>{splitText}</p>
    </h2>
  );
}
