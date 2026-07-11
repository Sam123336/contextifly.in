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
        y: 34,
        opacity: 0,
        stagger: 0.12,
        duration: 0.7,
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
    <section id="pipeline" ref={root} className="relative py-24 md:py-32">
      <div className="container-x">
        <div className="pipe-head mx-auto max-w-[760px] text-center">
          <div data-r className="eyebrow mb-5">
            <span className="dot" />
            How it works
          </div>
          <h2 data-r className="section-title">
            A <span className="gradient-text">compiler</span> for software architecture.
          </h2>
          <p data-r className="mx-auto mt-5 max-w-[62ch] text-[17px] leading-relaxed text-[var(--muted)]">
            Not a chatbot guessing at structure. Real parsers compile your code into a versioned graph —
            the AI only queries it. Every edge carries provenance and a confidence.
          </p>
        </div>

        <div className="pipe-grid relative mt-16">
          {/* base + animated connector (desktop) */}
          <div className="absolute left-0 right-0 top-[38px] hidden h-[2px] bg-white/8 lg:block" />
          <div
            className="pipe-progress absolute left-0 right-0 top-[38px] hidden h-[2px] origin-left lg:block"
            style={{ background: "linear-gradient(90deg,#4d7cff,#9a5bff,#29e0d4)" }}
          />

          <div className="grid gap-4 lg:grid-cols-5">
            {PIPELINE.map((p, i) => (
              <div key={p.step} className="pipe-step relative">
                <div className="relative z-10 mb-5 flex items-center gap-3 lg:block">
                  <div className="grid h-[46px] w-[46px] shrink-0 place-items-center rounded-xl border border-[var(--border-strong)] bg-[#0a0d17] text-[15px] font-bold gradient-text-static">
                    {i + 1}
                  </div>
                  {i < PIPELINE.length - 1 && (
                    <svg className="text-[var(--faint)] lg:hidden" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M5 12h14M13 6l6 6-6 6" />
                    </svg>
                  )}
                </div>
                <div className="glass card-hover h-full p-5">
                  <h3 className="text-[16px] font-semibold">{p.step}</h3>
                  <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--muted)]">{p.desc}</p>
                  <p className="mono mt-3 text-[11.5px] text-[var(--cyan)]">{p.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <p className="mono mx-auto mt-16 max-w-[640px] text-center text-[13px] leading-relaxed text-[var(--faint)]">
          Providers never know each other — a frontend <span className="text-[var(--blue)]">fetch(&apos;/orders&apos;)</span> and a
          NestJS <span className="text-[var(--green)]">@Post()</span> both emit{" "}
          <span className="text-[var(--cyan)]">api:POST /orders</span> and merge into one node.
        </p>
      </div>
    </section>
  );
}
