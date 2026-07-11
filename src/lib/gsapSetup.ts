"use client";

import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register plugins exactly once, on the client. (gsap-skills canonical pattern)
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger, useGSAP);

  // Robustness: GSAP animates via requestAnimationFrame. In a renderer that
  // never advances rAF (an offscreen/headless/paused tab that stays paused),
  // one-shot `.from()` reveals would leave content stuck hidden. If the ticker
  // hasn't fired shortly after load, fall back to showing everything. Uses
  // setTimeout (not rAF) on purpose so it fires even when the ticker is dead.
  let ticked = false;
  gsap.ticker.add(() => {
    ticked = true;
  }, true);
  window.setTimeout(() => {
    if (!ticked) document.documentElement.classList.add("gsap-stalled");
  }, 1400);

  // Dev-only: expose for debugging in the browser console. Stripped in prod.
  if (process.env.NODE_ENV !== "production") {
    (window as unknown as { gsap: typeof gsap }).gsap = gsap;
    (window as unknown as { ScrollTrigger: typeof ScrollTrigger }).ScrollTrigger = ScrollTrigger;
  }
}

export { gsap, ScrollTrigger, useGSAP };
