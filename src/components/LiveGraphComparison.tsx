"use client";

import { useRef, useState, type RefObject } from "react";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/gsapSetup";
import { KIND_COLOR, KIND_LABEL, type GNodeKind } from "@/lib/content";
import GraphFigure from "./GraphFigure";

export default function LiveGraphComparison() {
  const root = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState<"idle" | "running" | "done">("idle");
  const active = useRef<gsap.core.Animation[]>([]);
  const runRef = useRef<() => void>(() => {});

  // live-updated text targets (refs → no React churn during animation)
  const ctxTime = useRef<HTMLSpanElement>(null);
  const ctxTok = useRef<HTMLSpanElement>(null);
  const ctxStat = useRef<HTMLSpanElement>(null);
  const ctxBar = useRef<HTMLDivElement>(null);
  const llmTime = useRef<HTMLSpanElement>(null);
  const llmTok = useRef<HTMLSpanElement>(null);
  const llmStat = useRef<HTMLSpanElement>(null);
  const llmBar = useRef<HTMLDivElement>(null);

  const fmtTime = (t: number) => (t < 10 ? t.toFixed(1) + "s" : Math.round(t) + "s");
  const fmtTok = (k: number) =>
    k >= 1000 ? (k / 1000).toFixed(k < 10000 ? 1 : 0) + "k" : Math.round(k).toString();

  useGSAP(
    () => {
      const set = (t: HTMLElement | null, v: string) => t && (t.textContent = v);

      const run = () => {
        active.current.forEach((a) => a.kill());
        active.current = [];
        setPhase("running");

        // reset visuals
        gsap.set([".ctx-scope .gnode", ".llm-scope .gnode"], {
          opacity: 0,
          scale: 0.35,
          transformOrigin: "center",
        });
        gsap.set([".ctx-scope .edge", ".llm-scope .edge"], { opacity: 0, strokeDashoffset: 1 });
        gsap.set(".ctx-scope .prov", { opacity: 0, y: 4 });
        gsap.set(".ctx-scope .trace-path", { opacity: 0, strokeDashoffset: 1 });
        gsap.set(".llm-scope .fuzzy-mark", { opacity: 0 });
        gsap.set(".llm-scope .god-ring", { opacity: 0, scale: 0.5, transformOrigin: "center" });
        gsap.set(".ctx-done-badge", { opacity: 0, y: 8, scale: 0.9 });
        gsap.set(".verdict", { opacity: 0, y: 10 });

        // ---------- Contextifly: fast, crisp, deterministic ----------
        const ctx = gsap.timeline();
        ctx.call(() => set(ctxStat.current, "parsing AST · ts-morph"), undefined, 0)
          .to(".ctx-scope .edge", { opacity: 0.55, duration: 0.01 }, 0.05)
          .to(
            ".ctx-scope .edge",
            { strokeDashoffset: 0, duration: 0.5, stagger: 0.012, ease: "power1.inOut" },
            0.08
          )
          .to(
            ".ctx-scope .gnode",
            { opacity: 1, scale: 1, duration: 0.4, stagger: 0.028, ease: "back.out(2.2)" },
            0.05
          )
          .to(".ctx-scope .prov", { opacity: 1, y: 0, duration: 0.3, stagger: 0.04 }, 0.62)
          .call(() => set(ctxStat.current, "tracing full-stack path…"), undefined, 0.95)
          .to(".ctx-scope .trace-path", { opacity: 0.9, duration: 0.01 }, 1.0)
          .to(".ctx-scope .trace-path", { strokeDashoffset: 0, duration: 0.7, ease: "power2.inOut" }, 1.0)
          .fromTo(
            ".ctx-scope .trace-node rect",
            { filter: "brightness(1)" },
            { filter: "brightness(1.9)", duration: 0.3, stagger: 0.12, yoyo: true, repeat: 1 },
            1.05
          )
          .call(
            () => set(ctxStat.current, "✓ built · framework-aware full-stack"),
            undefined,
            1.75
          )
          .to(".ctx-done-badge", { opacity: 1, y: 0, scale: 1, duration: 0.4, ease: "back.out(2)" }, 1.8);

        const co = { t: 0, k: 0 };
        const ctxCount = gsap.to(co, {
          t: 1.9,
          k: 380,
          duration: 1.8,
          ease: "power1.out",
          onUpdate: () => {
            set(ctxTime.current, fmtTime(co.t));
            set(ctxTok.current, fmtTok(co.k));
            if (ctxBar.current) ctxBar.current.style.width = (co.t / 1.9) * 100 + "%";
          },
        });

        // ---------- LLM tool: slow, fuzzy, cloud ----------
        const llm = gsap.timeline();
        llm.call(() => set(llmStat.current, "parsing AST · Tree-sitter"), undefined, 0)
          .to(
            ".llm-scope .gnode",
            { opacity: 1, scale: 1, duration: 0.5, stagger: 0.33, ease: "power2.out" },
            0.35
          )
          .call(() => set(llmStat.current, "LLM extracting concepts…"), undefined, 1.1)
          .to(
            ".llm-scope .edge",
            { opacity: 0.5, strokeDashoffset: 0, duration: 0.6, stagger: 0.26, ease: "power1.inOut" },
            0.9
          )
          .to(".llm-scope .god-ring", { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.6)" }, 3.1)
          .call(() => set(llmStat.current, "clustering communities (Leiden)…"), undefined, 3.3)
          .to(".llm-scope .fuzzy-mark", { opacity: 1, duration: 0.4, stagger: 0.25 }, 3.5)
          .call(
            () => set(llmStat.current, "✓ built · communities + concepts"),
            undefined,
            4.55
          );

        const lo = { t: 0, k: 0 };
        const llmCount = gsap.to(lo, {
          t: 42.4,
          k: 60000,
          duration: 4.6,
          ease: "power1.inOut",
          onUpdate: () => {
            set(llmTime.current, fmtTime(lo.t));
            set(llmTok.current, fmtTok(lo.k));
            if (llmBar.current) llmBar.current.style.width = (lo.t / 42.4) * 100 + "%";
          },
        });

        llm.eventCallback("onComplete", () => {
          setPhase("done");
          gsap.to(".verdict", { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" });
        });

        active.current.push(ctx, llm, ctxCount, llmCount);
      };

      runRef.current = run;

      // reveal + auto-run once when scrolled into view
      gsap.from(".compare-reveal", {
        y: 30,
        opacity: 0,
        duration: 0.7,
        stagger: 0.08,
        ease: "power3.out",
        scrollTrigger: { trigger: root.current, start: "top 72%" },
      });
      ScrollTrigger.create({
        trigger: root.current,
        start: "top 55%",
        once: true,
        onEnter: () => run(),
      });

      // the hero "Watch it build" CTA replays the animation on demand;
      // small delay lets the scroll-to-#compare settle so it plays from the top
      let replayTimer: number | undefined;
      const onReplay = () => {
        window.clearTimeout(replayTimer);
        replayTimer = window.setTimeout(run, 480);
      };
      window.addEventListener("ctx:replay-compare", onReplay);
      return () => {
        window.clearTimeout(replayTimer);
        window.removeEventListener("ctx:replay-compare", onReplay);
      };
    },
    { scope: root }
  );

  const btnLabel = phase === "idle" ? "Run comparison" : phase === "running" ? "Building…" : "Replay";

  return (
    <section id="compare" ref={root} className="relative border-t border-[var(--border)] py-20 md:py-28">
      <div className="container-x">
        <div className="max-w-[720px]">
          <p className="compare-reveal overline-label mb-4">Live comparison</p>
          <h2 className="compare-reveal section-title">
            Same repo. Two engines. Watch them build.
          </h2>
          <p className="compare-reveal mt-4 max-w-[64ch] text-[16.5px] leading-relaxed text-[var(--muted)]">
            Point both at the same e-commerce app. Both start from the AST, then split. The other
            tool clusters your code into <em>topic communities</em> + concepts. Contextifly keeps
            compiling: it links the front-end call → API route → service → entity into one{" "}
            <span className="text-[var(--text)]">full-stack</span> trace, with the file:line to
            prove it.
          </p>

          <div className="compare-reveal mt-7">
            <button onClick={() => runRef.current()} className="btn btn-primary" disabled={phase === "running"}>
              {phase === "running" ? (
                <svg className="animate-spin" width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="9" stroke="rgba(5,32,26,0.3)" strokeWidth="3" />
                  <path d="M21 12a9 9 0 0 0-9-9" stroke="#05201a" strokeWidth="3" strokeLinecap="round" />
                </svg>
              ) : (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                  {phase === "done" ? <path d="M12 5V1L7 6l5 5V7a6 6 0 1 1-6 6H4a8 8 0 1 0 8-8z" /> : <path d="M8 5v14l11-7z" />}
                </svg>
              )}
              {btnLabel}
            </button>
          </div>
        </div>

        {/* the two panels */}
        <div className="compare-reveal mt-12 grid gap-4 lg:grid-cols-2">
          {/* LLM panel */}
          <div className="llm-scope panel overflow-hidden">
            <PanelHeader
              accent="var(--warn)"
              icon="nodes"
              title="Other graph tool"
              sub="e.g. Graphify-style · Tree-sitter + LLM"
              chip="communities + concepts"
            />
            <div className="px-4 pt-1">
              <GraphFigure variant="llm" />
            </div>
            <PanelFooter
              accent="var(--warn)"
              timeRef={llmTime}
              tokRef={llmTok}
              statRef={llmStat}
              barRef={llmBar}
              defaultStat="idle, press run"
              badges={["topic communities", "no route identity"]}
            />
          </div>

          {/* Contextifly panel */}
          <div className="ctx-scope panel relative overflow-hidden border-[var(--border-strong)]">
            <div
              className="ctx-done-badge mono absolute right-4 top-16 z-10 rounded-[6px] border border-[var(--border-strong)] bg-[var(--bg-inset)] px-2.5 py-1.5 text-[12px] font-medium text-[var(--accent)]"
              style={{ opacity: 0 }}
            >
              ✓ done · full-stack linked
            </div>
            <PanelHeader
              accent="var(--accent)"
              icon="chip"
              title="Contextifly compiler"
              sub="TypeScript & AST parsers · on your machine"
              chip="wiring · deterministic"
              featured
            />
            <div className="px-4 pt-1">
              <GraphFigure variant="ctx" />
            </div>
            <PanelFooter
              accent="var(--accent)"
              timeRef={ctxTime}
              tokRef={ctxTok}
              statRef={ctxStat}
              barRef={ctxBar}
              defaultStat="idle, press run"
              badges={["routes → services → entities", "file:line provenance"]}
              featured
            />
          </div>
        </div>

        {/* legend + verdict */}
        <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-[12px] text-[var(--faint)]">
          {(Object.keys(KIND_COLOR) as GNodeKind[]).map((k) => (
            <span key={k} className="flex items-center gap-1.5">
              <span className="inline-block h-2.5 w-2.5 rounded-[3px]" style={{ background: KIND_COLOR[k] }} />
              {KIND_LABEL[k]}
            </span>
          ))}
          <span className="flex items-center gap-1.5">
            <span className="inline-block h-[3px] w-5 rounded" style={{ background: "var(--accent)" }} />
            full-stack trace
          </span>
          <span className="flex items-center gap-1.5">
            <span className="mono text-[var(--warn)]">~?</span> uncertain edge
          </span>
        </div>

        <div className="verdict panel mt-8 max-w-[760px] px-6 py-5" style={{ opacity: 0 }}>
          <p className="text-[15px] leading-relaxed text-[var(--muted)]">
            <span className="font-semibold text-[var(--text)]">Same repo, different graph.</span>{" "}
            Contextifly linked the whole stack (front-end call → API route → service → entity) into
            one <b className="text-[var(--accent)]">exact, file:line-cited</b> trace. The LLM route
            produced <b className="text-[var(--warn)]">topic communities + concepts</b>, but never
            built the route identities that join front to back, so the cross-layer links stay
            guesses (~?).
          </p>
        </div>
      </div>
    </section>
  );
}

/* ---------- panel chrome ---------- */

function PanelHeader({
  accent,
  icon,
  title,
  sub,
  chip,
  featured,
}: {
  accent: string;
  icon: "nodes" | "chip";
  title: string;
  sub: string;
  chip: string;
  featured?: boolean;
}) {
  return (
    <div className="flex items-center gap-3 border-b border-[var(--border)] px-5 py-4">
      <div
        className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] border border-[var(--border-strong)]"
        style={{ color: accent }}
      >
        {icon === "nodes" ? (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <circle cx="5" cy="6" r="2.2" />
            <circle cx="19" cy="9" r="2.2" />
            <circle cx="10" cy="18" r="2.2" />
            <path d="M7 6.8l10 1.6M17.5 10.8 11.4 16.2M8.4 16.2 6 8" />
          </svg>
        ) : (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
            <rect x="7" y="7" width="10" height="10" rx="2" />
            <path d="M9 1v4M15 1v4M9 19v4M15 19v4M1 9h4M1 15h4M19 9h4M19 15h4" />
          </svg>
        )}
      </div>
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <h3 className="truncate text-[15.5px] font-semibold">{title}</h3>
          {featured && (
            <span
              className="mono rounded-[6px] px-1.5 py-0.5 text-[10px] font-medium"
              style={{ background: "var(--accent-dim)", color: accent }}
            >
              you
            </span>
          )}
        </div>
        <p className="truncate text-[12px] text-[var(--faint)]">{sub}</p>
      </div>
      <span
        className="mono ml-auto hidden shrink-0 rounded-[6px] border border-[var(--border)] px-2 py-1 text-[11px] sm:block"
        style={{ color: accent }}
      >
        {chip}
      </span>
    </div>
  );
}

function PanelFooter({
  accent,
  timeRef,
  tokRef,
  statRef,
  barRef,
  defaultStat,
  badges,
  featured,
}: {
  accent: string;
  timeRef: RefObject<HTMLSpanElement | null>;
  tokRef: RefObject<HTMLSpanElement | null>;
  statRef: RefObject<HTMLSpanElement | null>;
  barRef: RefObject<HTMLDivElement | null>;
  defaultStat: string;
  badges: string[];
  featured?: boolean;
}) {
  return (
    <div className="border-t border-[var(--border)] px-5 py-4">
      <div className="h-[3px] w-full overflow-hidden rounded-full bg-white/5">
        <div ref={barRef} className="h-full rounded-full" style={{ width: "0%", background: accent }} />
      </div>
      <div className="mt-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-4">
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.08em] text-[var(--faint)]">time</div>
            <div className="mono text-[17px] font-semibold" style={{ color: accent }}>
              <span ref={timeRef}>0.0s</span>
            </div>
          </div>
          <div>
            <div className="mono text-[10px] uppercase tracking-[0.08em] text-[var(--faint)]">tokens</div>
            <div className="mono text-[17px] font-semibold" style={{ color: accent }}>
              <span ref={tokRef}>0</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-end gap-1.5">
          {badges.map((b) => (
            <span key={b} className="text-[11px] text-[var(--faint)]">
              {featured ? "✓ " : ""}
              {b}
            </span>
          ))}
        </div>
      </div>
      <div className="mono mt-2.5 text-[12px] text-[var(--muted)]">
        <span className="text-[var(--faint)]">status:</span> <span ref={statRef}>{defaultStat}</span>
      </div>
    </div>
  );
}
