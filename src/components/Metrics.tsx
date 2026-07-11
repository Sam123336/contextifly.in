"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsapSetup";
import { METRICS } from "@/lib/content";

export default function Metrics() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const nums = gsap.utils.toArray<HTMLElement>(".metric-num");

      gsap.from(".metric-card", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 78%" },
      });

      nums.forEach((el) => {
        const target = Number(el.dataset.value);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.6,
          ease: "power2.out",
          scrollTrigger: { trigger: root.current, start: "top 75%", once: true },
          onUpdate() {
            el.textContent = Math.round(obj.v).toString();
          },
        });
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative py-16 md:py-20">
      <div className="container-x">
        <div className="glass-strong grid gap-px overflow-hidden rounded-3xl border border-[var(--border-strong)] sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((m) => (
            <div key={m.label} className="metric-card bg-[#0a0d17]/40 p-7 text-center">
              <div className="flex items-baseline justify-center gap-0.5">
                <span className="metric-num text-[46px] font-bold leading-none gradient-text-static" data-value={m.value}>
                  0
                </span>
                <span className="text-[26px] font-bold gradient-text-static">{m.suffix}</span>
              </div>
              <p className="mx-auto mt-3 max-w-[24ch] text-[13.5px] leading-snug text-[var(--muted)]">{m.label}</p>
              <span className="mono mt-2 inline-block text-[11px] text-[var(--faint)]">{m.note}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
