"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsapSetup";
import GraphBackdrop from "./GraphBackdrop";
import CopyCommand from "./CopyCommand";

const HEADLINE = ["Give", "your", "AI", "a", "memory", "of", "your", "codebase."];
const GRADIENT_WORDS = new Set(["memory"]);

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.from(".hero-eyebrow", { y: 16, opacity: 0, duration: 0.6 })
        .from(
          ".hero-word",
          { yPercent: 118, opacity: 0, rotateX: -55, stagger: 0.06, duration: 0.85 },
          "-=0.25"
        )
        .from(".hero-sub", { y: 20, opacity: 0, duration: 0.7 }, "-=0.4")
        .from(".hero-term", { y: 22, opacity: 0, duration: 0.6 }, "-=0.35")
        .from(".hero-cta", { y: 18, opacity: 0, stagger: 0.1, duration: 0.5 }, "-=0.3")
        .from(".hero-stat", { y: 14, opacity: 0, stagger: 0.08, duration: 0.5 }, "-=0.25")
        .from(".hero-badge-float", { opacity: 0, scale: 0.8, duration: 0.6 }, "-=0.6");

      // idle float on the floating chips
      gsap.to(".float-a", { y: -12, duration: 3.2, ease: "sine.inOut", yoyo: true, repeat: -1 });
      gsap.to(".float-b", { y: 14, duration: 3.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
    },
    { scope: root }
  );

  return (
    <section id="top" ref={root} className="relative overflow-hidden pt-[132px] pb-24 md:pt-[168px] md:pb-32">
      <div className="absolute inset-0 -z-10">
        <GraphBackdrop />
        <div className="grid-overlay" />
      </div>

      {/* floating context chips — kept in the corners, clear of the headline */}
      <div className="pointer-events-none absolute inset-0 -z-10 hidden xl:block">
        <div className="float-a hero-badge-float absolute left-[2.5%] top-[17%] glass px-3.5 py-2 text-[12.5px] mono text-[var(--muted)]">
          <span className="text-[var(--cyan)]">POST</span> /orders → OrderController
        </div>
        <div className="float-b hero-badge-float absolute right-[2.5%] top-[13%] glass px-3.5 py-2 text-[12.5px] mono text-[var(--muted)]">
          impact: <span className="text-[var(--amber)]">3 routes</span> · risk <span style={{ color: "var(--green)" }}>low</span>
        </div>
        <div className="float-b hero-badge-float absolute left-[4%] bottom-[9%] glass px-3.5 py-2 text-[12.5px] mono text-[var(--muted)]">
          re-index <span style={{ color: "var(--green)" }}>17ms</span> · byte-identical
        </div>
        <div className="float-a hero-badge-float absolute right-[4%] bottom-[12%] glass px-3.5 py-2 text-[12.5px] mono text-[var(--muted)]">
          <span className="text-[var(--violet)]">what_if</span> split ProductCard → safe
        </div>
      </div>

      <div className="container-x relative flex flex-col items-center text-center">
        <div className="hero-eyebrow eyebrow mb-7">
          <span className="dot" />
          Persistent context engine · MCP
        </div>

        <h1
          className="max-w-[16ch] text-[clamp(40px,7.2vw,80px)] font-bold leading-[0.98] tracking-[-0.04em]"
          style={{ perspective: 800 }}
        >
          {HEADLINE.map((w, i) => (
            <span key={i} className="mr-[0.24em] inline-block overflow-hidden pb-[0.06em] align-bottom">
              <span className={`hero-word inline-block ${GRADIENT_WORDS.has(w) ? "gradient-text" : ""}`}>
                {w}
              </span>
            </span>
          ))}
        </h1>

        <p className="hero-sub mt-7 max-w-[62ch] text-[clamp(16px,2vw,20px)] leading-relaxed text-[var(--muted)]">
          Contextifly compiles your React, NestJS &amp; Flutter code into a{" "}
          <span className="text-[var(--text)]">deterministic, full-stack knowledge graph</span> —{" "}
          <span className="text-[var(--text)]">100% on your machine</span>. Your assistant queries it
          instead of re-reading 40 files every single conversation.
        </p>

        <div className="hero-term mt-9 w-full max-w-[520px]">
          <CopyCommand command="claude plugin install contextifly@contextifly" prompt="$" />
        </div>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-3">
          <a href="#compare" className="hero-cta btn btn-primary">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M8 5v14l11-7z" />
            </svg>
            Watch it build — live
          </a>
          <a href="#pipeline" className="hero-cta btn btn-ghost">
            How it works
          </a>
        </div>

        <div className="mt-14 flex flex-wrap items-center justify-center gap-x-9 gap-y-4 text-[13px] text-[var(--faint)]">
          {[
            ["14", "MCP tools"],
            ["100%", "local for code"],
            ["~17ms", "incremental"],
            ["MIT", "open source"],
          ].map(([v, l]) => (
            <div key={l} className="hero-stat flex items-center gap-2">
              <span className="text-[15px] font-semibold text-[var(--text)]">{v}</span>
              <span>{l}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
