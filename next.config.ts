import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // GSAP `.from()` tweens are one-shot: React 19 Strict Mode's dev-only
  // double-invoke re-runs them against an already-hidden DOM and leaves
  // elements stuck at their start state. Production renders once, so we
  // turn the double-render off to make dev match production behaviour.
  reactStrictMode: false,
};

export default nextConfig;
