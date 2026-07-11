"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsapSetup";

/**
 * A living knowledge-graph canvas for the hero. Nodes are clustered into
 * communities and wired with a stable topology, they breathe and parallax with
 * depth, and a glowing "query lens" follows the cursor — lighting up nearby
 * nodes/edges and reaching new edges toward the pointer. GSAP quickTo + ticker
 * smooth every pointer-driven value so it never jitters. Ambient + interactive.
 */
const COLORS = ["#4d7cff", "#9a5bff", "#29e0d4", "#34e39b", "#ff5d9e"];

type GNode = {
  hx: number; hy: number; // home (layout anchor)
  x: number; y: number; // rendered
  r: number; z: number; // radius, depth 0..1
  c: string; phase: number;
};

export default function GraphBackdrop({ density = 46 }: { density?: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let w = 0, h = 0, dpr = Math.min(window.devicePixelRatio || 1, 2);
    let nodes: GNode[] = [];
    let edges: [number, number][] = [];

    // pointer-driven state — GSAP animates these, the draw loop reads them
    const focus = { x: -9999, y: -9999, on: 0 };
    const par = { x: 0, y: 0 };

    const rgba = (hex: string, a: number) => {
      const n = parseInt(hex.slice(1), 16);
      return `rgba(${(n >> 16) & 255},${(n >> 8) & 255},${n & 255},${a})`;
    };

    const seed = () => {
      const count = gsap.utils.clamp(22, 72, Math.round(((w * h) / 20000) * (density / 46)));
      const clusters = Math.max(3, Math.round(count / 11));
      const centers = Array.from({ length: clusters }, () => ({
        x: gsap.utils.random(w * 0.08, w * 0.92),
        y: gsap.utils.random(h * 0.12, h * 0.9),
      }));
      nodes = Array.from({ length: count }, (_, i) => {
        const cen = centers[i % clusters];
        const ang = Math.random() * Math.PI * 2;
        const rad = Math.random() ** 1.6 * Math.min(w, h) * 0.24;
        const z = gsap.utils.random(0.35, 1);
        const hx = gsap.utils.clamp(6, w - 6, cen.x + Math.cos(ang) * rad);
        const hy = gsap.utils.clamp(6, h - 6, cen.y + Math.sin(ang) * rad);
        return {
          hx, hy, x: hx, y: hy, z,
          r: 1 + z * 2.6,
          c: COLORS[(Math.random() * COLORS.length) | 0],
          phase: Math.random() * Math.PI * 2,
        };
      });
      // stable topology: connect each node to its 2 nearest neighbours
      edges = [];
      const seen = new Set<string>();
      nodes.forEach((a, i) => {
        nodes
          .map((b, j) => ({ j, d: (a.hx - b.hx) ** 2 + (a.hy - b.hy) ** 2 }))
          .filter((o) => o.j !== i)
          .sort((p, q) => p.d - q.d)
          .slice(0, 2)
          .forEach(({ j }) => {
            const key = i < j ? `${i}.${j}` : `${j}.${i}`;
            if (!seen.has(key)) { seen.add(key); edges.push([i, j]); }
          });
      });
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      if (rect.width < 2 || rect.height < 2) return; // wait for real layout
      w = rect.width; h = rect.height;
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr; canvas.height = h * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (focus.x < -9000) { focus.x = w / 2; focus.y = h / 2; }
      seed();
    };

    const R = 175; // focus lens radius
    let t = 0;

    const draw = () => {
      t += 0.016;
      ctx.clearRect(0, 0, w, h);
      const lit = focus.on > 0.02 && focus.x > -9000;

      // advance node positions: spring toward home + breathing + depth parallax
      // + a gentle lean toward the cursor when it's near
      for (const n of nodes) {
        n.phase += 0.006;
        let tx = n.hx + Math.cos(n.phase) * 6 + par.x * n.z;
        let ty = n.hy + Math.sin(n.phase * 0.9) * 6 + par.y * n.z;
        if (lit) {
          const d = Math.hypot(n.x - focus.x, n.y - focus.y);
          const pull = focus.on * Math.max(0, 1 - d / R);
          tx += (focus.x - n.x) * 0.06 * pull;
          ty += (focus.y - n.y) * 0.06 * pull;
        }
        n.x += (tx - n.x) * 0.07;
        n.y += (ty - n.y) * 0.07;
      }

      // fixed-topology edges — brighten + gradient when near the lens
      for (const [i, j] of edges) {
        const a = nodes[i], b = nodes[j];
        const prox = lit
          ? focus.on * Math.max(0, 1 - Math.min(
              Math.hypot(a.x - focus.x, a.y - focus.y),
              Math.hypot(b.x - focus.x, b.y - focus.y)) / R)
          : 0;
        const o = 0.08 + prox * 0.55;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        if (prox > 0.03) {
          const g = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
          g.addColorStop(0, rgba("#4d7cff", o));
          g.addColorStop(1, rgba("#ff5d9e", o));
          ctx.strokeStyle = g;
          ctx.lineWidth = 0.6 + prox * 1.2;
        } else {
          ctx.strokeStyle = `rgba(128,148,214,${o})`;
          ctx.lineWidth = 0.6;
        }
        ctx.stroke();
      }

      // live "query" edges from the cursor to its nearest nodes + a focus node
      if (lit) {
        const near = nodes
          .map((n, i) => ({ i, d: Math.hypot(n.x - focus.x, n.y - focus.y) }))
          .sort((p, q) => p.d - q.d)
          .slice(0, 5);
        for (const { i, d } of near) {
          if (d > R * 1.35) continue;
          const n = nodes[i];
          const o = focus.on * Math.max(0, 1 - d / (R * 1.35)) * 0.95;
          const g = ctx.createLinearGradient(focus.x, focus.y, n.x, n.y);
          g.addColorStop(0, rgba("#5cf0e4", o));
          g.addColorStop(1, rgba("#9a5bff", o * 0.5));
          ctx.strokeStyle = g;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(focus.x, focus.y);
          ctx.lineTo(n.x, n.y);
          ctx.stroke();
        }
        ctx.beginPath();
        ctx.arc(focus.x, focus.y, 8 + Math.sin(t * 3) * 1.6, 0, Math.PI * 2);
        ctx.strokeStyle = rgba("#5cf0e4", focus.on * 0.45);
        ctx.lineWidth = 1;
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(focus.x, focus.y, 2.6, 0, Math.PI * 2);
        ctx.fillStyle = rgba("#5cf0e4", focus.on);
        ctx.fill();
      }

      // nodes — scale + glow the ones under the lens
      for (const n of nodes) {
        const prox = lit ? focus.on * Math.max(0, 1 - Math.hypot(n.x - focus.x, n.y - focus.y) / R) : 0;
        const r = n.r * (1 + prox * 0.95);
        if (prox > 0.05) {
          ctx.beginPath();
          ctx.arc(n.x, n.y, r + 7 * prox, 0, Math.PI * 2);
          ctx.fillStyle = rgba(n.c, 0.14 * prox);
          ctx.fill();
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.globalAlpha = 0.5 + n.z * 0.28 + prox * 0.22;
        ctx.fillStyle = n.c;
        ctx.fill();
        ctx.globalAlpha = 1;
      }
    };

    resize();
    const ro = new ResizeObserver(() => { resize(); if (reduced) draw(); });
    ro.observe(canvas);

    if (reduced) {
      draw();
      return () => ro.disconnect();
    }

    const qx = gsap.quickTo(focus, "x", { duration: 0.5, ease: "power3" });
    const qy = gsap.quickTo(focus, "y", { duration: 0.5, ease: "power3" });
    const qon = gsap.quickTo(focus, "on", { duration: 0.45, ease: "power2" });
    const px = gsap.quickTo(par, "x", { duration: 1.2, ease: "power2" });
    const py = gsap.quickTo(par, "y", { duration: 1.2, ease: "power2" });
    const AMP = 28;

    const onMove = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;
      if (mx < 0 || my < 0 || mx > w || my > h) { qon(0); px(0); py(0); return; }
      qx(mx); qy(my); qon(1);
      px((mx / w - 0.5) * AMP);
      py((my / h - 0.5) * AMP);
    };
    const onLeave = () => { qon(0); px(0); py(0); };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);
    gsap.ticker.add(draw);

    return () => {
      ro.disconnect();
      gsap.ticker.remove(draw);
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [density]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="absolute inset-0 h-full w-full"
      style={{ opacity: 0.68, mixBlendMode: "screen" }}
    />
  );
}
