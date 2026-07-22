"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsapSetup";
import { TRACE_STEPS, KIND_COLOR, type GNodeKind } from "@/lib/content";

export default function TraceFlow() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".trace-copy [data-r]", {
        x: -26,
        opacity: 0,
        stagger: 0.1,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 74%" },
      });

      gsap.fromTo(
        ".trace-line-fill",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: { trigger: ".trace-steps", start: "top 72%", end: "bottom 60%", scrub: 0.5 },
        }
      );

      gsap.from(".trace-step", {
        x: 26,
        opacity: 0,
        stagger: 0.14,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: ".trace-steps", start: "top 74%" },
      });
    },
    { scope: root }
  );

  return (
    <section ref={root} className="relative border-t border-[var(--border)] py-20 md:py-28">
      <div className="container-x grid items-center gap-14 lg:grid-cols-[0.9fr_1.1fr]">
        {/* copy */}
        <div className="trace-copy">
          <p data-r className="overline-label mb-4">trace_flow</p>
          <h2 data-r className="section-title">
            One tap, traced front to back.
          </h2>
          <p data-r className="mt-4 max-w-[46ch] text-[16.5px] leading-relaxed text-[var(--muted)]">
            A frontend <span className="mono text-[var(--text)]">fetch(&apos;/orders&apos;)</span> and a NestJS{" "}
            <span className="mono text-[var(--text)]">@Post()</span> handler resolve to the{" "}
            <span className="text-[var(--text)]">same endpoint node</span>, so a whole checkout
            journey becomes one path with file:line at every hop.
          </p>
          <div data-r className="mono mt-6 inline-flex items-center gap-2 rounded-[8px] border border-[var(--border-strong)] px-3.5 py-2 text-[13px] text-[var(--muted)]">
            <span className="text-[var(--accent)]">≈ 200-500 tokens</span> · not 40 files read
          </div>
        </div>

        {/* animated stepper */}
        <div className="trace-steps relative">
          {/* connector */}
          <div className="absolute left-[19px] top-3 bottom-3 w-px bg-white/8" />
          <div className="trace-line-fill absolute left-[19px] top-3 bottom-3 w-px origin-top bg-[var(--accent)]" />

          <div className="space-y-3">
            {TRACE_STEPS.map((s, i) => {
              const color = KIND_COLOR[s.kind as GNodeKind];
              return (
                <div key={s.n} className="trace-step relative flex items-start gap-4 pl-0">
                  <div className="mono relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border bg-[var(--bg)] text-[13px] font-semibold" style={{ borderColor: color, color }}>
                    {s.n}
                  </div>
                  <div className="panel card-hover flex-1 p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="mono text-[14px] font-semibold" style={{ color }}>
                        {s.node}
                      </span>
                      {i === 2 && (
                        <span className="mono rounded-[6px] border px-2 py-0.5 text-[10px]" style={{ borderColor: `${color}55`, color }}>
                          merged node
                        </span>
                      )}
                    </div>
                    <div className="mono mt-1.5 truncate text-[12px] text-[var(--faint)]">{s.meta}</div>
                    <div className="mt-1 text-[13px] text-[var(--muted)]">{s.note}</div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
