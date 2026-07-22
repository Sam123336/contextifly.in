# Contextifly — marketing site

A dark, GSAP-animated landing page for **Contextifly**, the persistent context
engine for AI coding assistants. Built to be visibly *different* from the
light-themed LLM knowledge-graph tools it competes with — the hero feature is a
**live, side-by-side graph comparison** that dramatizes Contextifly's real
differentiators (compiler vs. LLM, local vs. cloud, deterministic + cited).

## Stack

- **Next.js 16** (App Router, TypeScript)
- **Tailwind CSS v4**
- **GSAP 3** + `@gsap/react` (`useGSAP`) — ScrollTrigger, timelines, count-ups
- Zero external UI libraries; all graphics are hand-built SVG / canvas

## Run it

```bash
npm install       # already done
npm run dev       # http://localhost:3000
npm run build     # production build
npm start         # serve the production build
```

## The centerpiece — “Same repo. Two engines.”

`src/components/LiveGraphComparison.tsx` renders the same small full-stack
e-commerce app twice and races two engines against each other with GSAP:

| | LLM-extracted (Graphify-style) | Contextifly (compiler) |
|---|---|---|
| Build | streams in slowly, ~42s | snaps in, ~1.9s |
| Cost | ~60k tokens | ~380 tokens |
| Edges | dashed `~?` uncertain links, a “god node” | solid, exact |
| Graph | call-graph + concept clusters | framework-aware full-stack |
| Trace | — | glowing full-stack path with `file:line` |

It auto-plays when scrolled into view (ScrollTrigger) and can be replayed.

## Notes on the animation setup

- Plugins are registered once in `src/lib/gsapSetup.ts` (the gsap-skills
  canonical pattern), which also exposes `window.gsap` in dev for debugging.
- `reactStrictMode` is off (`next.config.ts`) so dev matches production —
  Strict Mode's dev-only double-invoke re-fires one-shot `.from()` tweens.
- A ticker-stall safety net (`.gsap-stalled` class + CSS) guarantees content is
  never left hidden if `requestAnimationFrame` never advances (headless/paused
  renderers). Real browsers never hit it.

## Structure

```
src/
  app/            layout, page (section composition), globals (design system)
  components/     Nav, Hero, Problem, LiveGraphComparison, Metrics,
                  Pipeline, TraceFlow, Features, Versus, Install, Footer …
  lib/            content.ts (copy + graph data), gsapSetup.ts
```

