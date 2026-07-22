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
        y: 24,
        opacity: 0,
        stagger: 0.08,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 78%" },
      });

      nums.forEach((el) => {
        const target = Number(el.dataset.value);
        const obj = { v: 0 };
        gsap.to(obj, {
          v: target,
          duration: 1.4,
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
    <section ref={root} className="relative border-t border-[var(--border)] py-14 md:py-16">
      <div className="container-x">
        <div className="grid gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          {METRICS.map((m) => (
            <div key={m.label} className="metric-card border-l border-[var(--border)] pl-6 first:border-l-0 first:pl-0 sm:[&:nth-child(3)]:border-l-0 sm:[&:nth-child(3)]:pl-0 lg:[&:nth-child(3)]:border-l lg:[&:nth-child(3)]:pl-6">
              <div className="mono flex items-baseline gap-0.5 text-[38px] font-semibold leading-none tracking-tight">
                <span className="metric-num" data-value={m.value}>0</span>
                <span className="text-[22px]">{m.suffix}</span>
              </div>
              <p className="mt-3 max-w-[24ch] text-[13.5px] leading-snug text-[var(--muted)]">{m.label}</p>
              <span className="mono mt-1.5 inline-block text-[11px] text-[var(--faint)]">{m.note}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
