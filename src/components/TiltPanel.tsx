"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsapSetup";

/** Resting 3D pose, visible without any interaction. */
const BASE_X = 6; // deg, tips the top edge away
const BASE_Y = -12; // deg, angles the panel toward the hero copy

/**
 * Pointer-reactive 3D tilt wrapper for the hero graph panel.
 * Technique adapted from 21st.dev "3D tilt card" (avanishverma4), rebuilt on
 * GSAP quickTo so pointer motion never touches React state. The panel sits in
 * an angled resting pose and swings toward the cursor on hover; children with
 * their own translateZ float on separate z-planes.
 */
export default function TiltPanel({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const glare = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = card.current;
      const w = wrap.current;
      if (!el || !w) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

      gsap.set(el, {
        transformPerspective: 1100,
        transformStyle: "preserve-3d",
        rotationX: BASE_X,
        rotationY: BASE_Y,
      });
      const rx = gsap.quickTo(el, "rotationX", { duration: 0.6, ease: "power3" });
      const ry = gsap.quickTo(el, "rotationY", { duration: 0.6, ease: "power3" });
      const gx = gsap.quickTo(glare.current, "xPercent", { duration: 0.6, ease: "power3" });
      const gy = gsap.quickTo(glare.current, "yPercent", { duration: 0.6, ease: "power3" });
      const go = gsap.quickTo(glare.current, "opacity", { duration: 0.4, ease: "power2" });

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const px = (e.clientX - r.left) / r.width - 0.5; // -0.5 .. 0.5
        const py = (e.clientY - r.top) / r.height - 0.5;
        // swing from the resting pose toward the cursor
        rx(py * -14);
        ry(px * 16);
        gx(px * 100);
        gy(py * 100);
        go(1);
      };
      const leave = () => {
        rx(BASE_X);
        ry(BASE_Y);
        go(0);
      };

      w.addEventListener("pointermove", move);
      w.addEventListener("pointerleave", leave);
      return () => {
        w.removeEventListener("pointermove", move);
        w.removeEventListener("pointerleave", leave);
      };
    },
    { scope: wrap }
  );

  return (
    <div ref={wrap} style={{ perspective: 1100 }}>
      <div
        ref={card}
        className={`relative ${className}`}
        style={{ boxShadow: "0 40px 80px -32px rgba(0,0,0,0.65)" }}
      >
        {children}
        {/* cursor-following glare, clipped to the panel radius */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-[12px]">
          <div
            ref={glare}
            className="absolute inset-0 opacity-0"
            style={{
              background:
                "radial-gradient(420px 320px at 50% 50%, rgba(116,230,210,0.09), transparent 65%)",
            }}
          />
        </div>
      </div>
    </div>
  );
}
