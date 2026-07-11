"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsapSetup";

/**
 * Fades its content up on scroll. Mark descendants with `data-r` to stagger
 * them individually; otherwise the whole block reveals as one.
 */
export default function Reveal({
  children,
  className,
  y = 26,
  stagger = 0.07,
  start = "top 84%",
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  stagger?: number;
  start?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const items = el.querySelectorAll("[data-r]");
      const targets = items.length ? items : [el];
      gsap.from(targets, {
        y,
        opacity: 0,
        duration: 0.7,
        stagger,
        ease: "power3.out",
        scrollTrigger: { trigger: el, start },
      });
    },
    { scope: ref }
  );

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
