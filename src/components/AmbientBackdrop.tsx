"use client";

import dynamic from "next/dynamic";

// three.js stays out of the initial bundle; the field fades in after hydration
const SynapseField = dynamic(() => import("./SynapseField"), { ssr: false });

export default function AmbientBackdrop() {
  return <SynapseField />;
}
