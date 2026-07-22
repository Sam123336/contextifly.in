import Reveal from "./Reveal";

const WITHOUT = [
  "Searches 40+ files from scratch",
  "Re-reads 15-20 of them",
  "Guesses the dependencies it can't see",
  "Re-analyzes the same screenshots",
];
const WITH = [
  "Asks the graph one question",
  "Gets the traced flow + exact file paths",
  "Reads only 2-3 files for detail",
  "Cites file:line, no guessing",
];

export default function Problem() {
  return (
    <section className="relative border-t border-[var(--border)] py-20 md:py-24">
      <div className="container-x">
        <Reveal className="max-w-[680px]">
          <h2 data-r className="section-title">
            Your AI re-discovers your project every conversation.
          </h2>
          <p data-r className="mt-4 max-w-[58ch] text-[16.5px] leading-relaxed text-[var(--muted)]">
            Every new chat, it pays again: in time, tokens and wrong answers. Contextifly gives it a
            memory that persists and stays in sync with your code.
          </p>
        </Reveal>

        <Reveal className="mt-12 grid items-stretch gap-4 md:grid-cols-2" stagger={0.12}>
          {/* Without */}
          <div data-r className="panel card-hover flex flex-col p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="mono text-[12px] uppercase tracking-[0.08em] text-[var(--warn)]">
                Without Contextifly
              </span>
              <span className="mono rounded-[6px] bg-white/[0.04] px-2 py-1 text-[11px] text-[var(--muted)]">
                “How does checkout work?”
              </span>
            </div>
            <ul className="flex-1 space-y-3">
              {WITHOUT.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[14.5px] text-[var(--muted)]">
                  <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--warn)" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v5M12 16h.01" />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mono mt-5 flex gap-4 border-t border-[var(--border)] pt-4 text-[13px]">
              <span className="text-[var(--warn)]">~45s</span>
              <span className="text-[var(--warn)]">~60,000 tokens</span>
              <span className="text-[var(--faint)]">guesses</span>
            </div>
          </div>

          {/* With */}
          <div data-r className="panel card-hover flex flex-col border-[var(--border-strong)] p-6">
            <div className="mb-4 flex items-center justify-between gap-3">
              <span className="mono text-[12px] uppercase tracking-[0.08em] text-[var(--accent)]">
                With Contextifly
              </span>
              <span className="mono rounded-[6px] bg-[var(--accent-dim)] px-2 py-1 text-[11px] text-[var(--accent)]">
                trace_flow /cart → /orders
              </span>
            </div>
            <ul className="flex-1 space-y-3">
              {WITH.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[14.5px] text-[var(--text)]">
                  <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.4">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mono mt-5 flex gap-4 border-t border-[var(--border)] pt-4 text-[13px]">
              <span className="text-[var(--accent)]">~2s</span>
              <span className="text-[var(--accent)]">a few hundred tokens</span>
              <span className="text-[var(--muted)]">verified</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
