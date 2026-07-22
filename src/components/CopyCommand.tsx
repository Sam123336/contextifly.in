"use client";

import { useState } from "react";

export default function CopyCommand({
  command,
  prompt = "$",
  className = "",
}: {
  command: string;
  prompt?: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable — no-op */
    }
  };

  return (
    <div
      className={`group flex items-center gap-3 rounded-[8px] border border-[var(--border-strong)] bg-[var(--bg-inset)] px-4 py-3 ${className}`}
    >
      <span className="mono select-none text-[var(--accent)]">{prompt}</span>
      <code className="mono flex-1 overflow-x-auto whitespace-nowrap text-[13.5px] text-[var(--text)]">
        {command}
      </code>
      <button
        onClick={copy}
        aria-label="Copy command"
        className="mono flex shrink-0 items-center gap-1.5 rounded-[6px] border border-[var(--border-strong)] bg-white/5 px-2.5 py-1 text-[12px] text-[var(--muted)] transition-colors hover:text-[var(--text)]"
      >
        {copied ? (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.5">
              <path d="M20 6 9 17l-5-5" />
            </svg>
            <span style={{ color: "var(--accent)" }}>copied</span>
          </>
        ) : (
          <>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="12" height="12" rx="2" />
              <path d="M5 15V5a2 2 0 0 1 2-2h10" />
            </svg>
            copy
          </>
        )}
      </button>
    </div>
  );
}
