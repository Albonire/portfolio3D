"use client";
import React, { useEffect, useRef } from 'react'
import gsap from 'gsap';

export default function Magnetic({ children }: { children: React.ReactNode }) {
    const magnetic = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const xTo = gsap.quickTo(magnetic.current, "x", { duration: 1, ease: "elastic.out(1, 0.3)" })
        const yTo = gsap.quickTo(magnetic.current, "y", { duration: 1, ease: "elastic.out(1, 0.3)" })

        const handleMouseMove = (e: MouseEvent) => {
            if (!magnetic.current) return;
            const { clientX, clientY } = e;
            const { height, width, left, top } = magnetic.current.getBoundingClientRect();
            const x = clientX - (left + width / 2)
            const y = clientY - (top + height / 2)
            xTo(x * 0.35);
            yTo(y * 0.35);
        }

        const handleMouseLeave = () => {
            xTo(0);
            yTo(0);
        }

        const currentRef = magnetic.current;
        currentRef?.addEventListener("mousemove", handleMouseMove)
        currentRef?.addEventListener("mouseleave", handleMouseLeave)

        return () => {
            currentRef?.removeEventListener("mousemove", handleMouseMove)
            currentRef?.removeEventListener("mouseleave", handleMouseLeave)
        }
    }, [])

    return (
        React.cloneElement(children as React.ReactElement, { ref: magnetic })
    )
}
