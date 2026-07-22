"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsapSetup";
import { PIPELINE } from "@/lib/content";

export default function Pipeline() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".pipe-head [data-r]", {
        y: 26,
        opacity: 0,
        stagger: 0.08,
        duration: 0.7,
        ease: "power3.out",
        scrollTrigger: { trigger: ".pipe-head", start: "top 82%" },
      });

      gsap.from(".pipe-step", {
        y: 30,
        opacity: 0,
        stagger: 0.1,
        duration: 0.6,
        ease: "power3.out",
        scrollTrigger: { trigger: ".pipe-grid", start: "top 78%" },
      });

      // draw the connector line as you scroll through
      gsap.fromTo(
        ".pipe-progress",
        { scaleX: 0 },
        {
          scaleX: 1,
          ease: "none",
          scrollTrigger: { trigger: ".pipe-grid", start: "top 70%", end: "bottom 65%", scrub: 0.6 },
        }
      );
    },
    { scope: root }
  );

  return (
    <section id="pipeline" ref={root} className="relative border-t border-[var(--border)] py-20 md:py-28">
      <div className="container-x">
        <div className="pipe-head max-w-[720px]">
          <h2 data-r className="section-title">
            A compiler for software architecture.
          </h2>
          <p data-r className="mt-4 max-w-[62ch] text-[16.5px] leading-relaxed text-[var(--muted)]">
            Not a chatbot guessing at structure. Real parsers compile your code into a versioned
            graph, and the AI only queries it. Every edge carries provenance and a confidence.
          </p>
        </div>

        <div className="pipe-grid relative mt-14">
          {/* base + animated connector (desktop) */}
          <div className="absolute left-0 right-0 top-[20px] hidden h-px bg-white/8 lg:block" />
          <div className="pipe-progress absolute left-0 right-0 top-[20px] hidden h-px origin-left bg-[var(--accent)] lg:block" />

          <div className="grid gap-8 lg:grid-cols-5 lg:gap-5">
            {PIPELINE.map((p, i) => (
              <div key={p.step} className="pipe-step relative">
                <div className="relative z-10 mb-4 flex items-center gap-3">
                  <div className="mono grid h-10 w-10 shrink-0 place-items-center rounded-[8px] border border-[var(--border-strong)] bg-[var(--bg)] text-[14px] font-semibold text-[var(--accent)]">
                    {i + 1}
                  </div>
                  {i < PIPELINE.length - 1 && (
                    <svg className="text-[var(--faint)] lg:hidden" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  )}
                </div>
                <h3 className="text-[15.5px] font-semibold">{p.step}</h3>
                <p className="mt-1.5 text-[13.5px] leading-relaxed text-[var(--muted)]">{p.desc}</p>
                <p className="mono mt-2.5 text-[11.5px] text-[var(--faint)]">{p.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <p className="mono mt-14 max-w-[640px] text-[13px] leading-relaxed text-[var(--faint)]">
          Providers never know each other. A frontend <span className="text-[var(--muted)]">fetch(&apos;/orders&apos;)</span> and a
          NestJS <span className="text-[var(--muted)]">@Post()</span> both emit{" "}
          <span className="text-[var(--accent)]">api:POST /orders</span> and merge into one node.
        </p>
      </div>
    </section>
  );
}
