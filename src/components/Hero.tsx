"use client";

import { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsapSetup";
import GraphFigure from "./GraphFigure";
import CopyCommand from "./CopyCommand";
import TiltPanel from "./TiltPanel";

export default function Hero() {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.from(".hero-el", {
        y: 22,
        opacity: 0,
        stagger: 0.09,
        duration: 0.7,
        ease: "power3.out",
      });
      gsap.from(".hero-figure", {
        opacity: 0,
        y: 16,
        duration: 0.9,
        delay: 0.35,
        ease: "power3.out",
      });
    },
    { scope: root }
  );

  return (
    <section id="top" ref={root} className="relative pt-28 pb-20 md:pt-36 md:pb-24">
      <div className="container-x grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
        {/* copy */}
        <div>
          <h1 className="hero-el text-[clamp(36px,4.6vw,58px)] font-bold leading-[1.04] tracking-[-0.035em]">
            Give your AI a <span className="text-[var(--accent)]">memory</span> of your codebase.
          </h1>

          <p className="hero-el mt-6 max-w-[54ch] text-[clamp(15.5px,1.6vw,17.5px)] leading-relaxed text-[var(--muted)]">
            Contextifly compiles your React, NestJS &amp; Flutter code into a{" "}
            <span className="text-[var(--text)]">deterministic, full-stack knowledge graph</span>,
            100% on your machine. Your assistant queries it instead of re-reading 40 files every
            conversation.
          </p>

          <div className="hero-el mt-8 max-w-[520px]">
            <CopyCommand command="claude plugin install contextifly@contextifly" prompt="$" />
          </div>

          <div className="hero-el mt-6 flex flex-wrap items-center gap-3">
            <a
              href="#compare"
              className="btn btn-primary"
              onClick={() => window.dispatchEvent(new CustomEvent("ctx:replay-compare"))}
            >
              Watch it build
            </a>
            <a href="#pipeline" className="btn btn-ghost">
              How it works
            </a>
          </div>
        </div>

        {/* the actual graph the compiler builds */}
        <div className="hero-figure">
          <TiltPanel className="panel overflow-visible">
            <div className="rounded-[12px]" style={{ transformStyle: "preserve-3d" }}>
              <div className="flex items-center justify-between border-b border-[var(--border)] px-4 py-3">
                <span className="mono text-[12px] text-[var(--muted)]">graph · e-commerce app</span>
                <span className="mono text-[12px] text-[var(--accent)]">12 nodes · deterministic</span>
              </div>
              <div className="px-3 py-2" style={{ transform: "translateZ(50px)" }}>
                <GraphFigure variant="ctx" still />
              </div>
              <div className="border-t border-[var(--border)] px-4 py-3">
                <p className="mono text-[12px] leading-relaxed text-[var(--faint)]">
                  routes, services, entities. Every edge cited to file:line.
                </p>
              </div>
            </div>
          </TiltPanel>
        </div>
      </div>
    </section>
  );
}
