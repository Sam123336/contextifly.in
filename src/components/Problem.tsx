import Reveal from "./Reveal";

const WITHOUT = [
  "Searches 40+ files from scratch",
  "Re-reads 15–20 of them",
  "Guesses the dependencies it can’t see",
  "Re-analyzes the same screenshots",
];
const WITH = [
  "Asks the graph one question",
  "Gets the traced flow + exact file paths",
  "Reads only 2–3 files for detail",
  "Cites file:line — no guessing",
];

export default function Problem() {
  return (
    <section className="relative py-24 md:py-28">
      <div className="container-x">
        <Reveal className="mx-auto max-w-[720px] text-center">
          <div data-r className="eyebrow mb-5">
            <span className="dot" />
            The problem
          </div>
          <h2 data-r className="section-title">
            Your AI re-discovers your project{" "}
            <span className="gradient-text">every conversation.</span>
          </h2>
          <p data-r className="mx-auto mt-5 max-w-[58ch] text-[17px] leading-relaxed text-[var(--muted)]">
            Every new chat, it pays again — in time, tokens and wrong answers. Contextifly gives it a
            memory that persists and stays in sync with your code.
          </p>
        </Reveal>

        <Reveal className="mt-14 grid items-stretch gap-5 md:grid-cols-[1fr_auto_1fr]" stagger={0.12}>
          {/* Without */}
          <div data-r className="glass card-hover flex flex-col p-6">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[13px] font-semibold uppercase tracking-wider text-[var(--amber)]">
                Without Contextifly
              </span>
              <span className="mono rounded-md bg-[var(--amber)]/10 px-2 py-1 text-[11px] text-[var(--amber)]">
                “How does checkout work?”
              </span>
            </div>
            <ul className="flex-1 space-y-3">
              {WITHOUT.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[14.5px] text-[var(--muted)]">
                  <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M12 8v5M12 16h.01" />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mono mt-5 flex gap-4 border-t border-[var(--border)] pt-4 text-[13px]">
              <span className="text-[var(--amber)]">~45s</span>
              <span className="text-[var(--amber)]">~60,000 tokens</span>
              <span className="text-[var(--faint)]">guesses</span>
            </div>
          </div>

          {/* arrow */}
          <div data-r className="hidden items-center justify-center md:flex">
            <div className="grid h-11 w-11 place-items-center rounded-full border border-[var(--border-strong)] bg-white/5">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="url(#ar)" strokeWidth="2.4">
                <defs>
                  <linearGradient id="ar" x1="0" y1="0" x2="24" y2="0">
                    <stop stopColor="#4d7cff" />
                    <stop offset="1" stopColor="#29e0d4" />
                  </linearGradient>
                </defs>
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </div>
          </div>

          {/* With */}
          <div data-r className="glass-strong card-hover relative flex flex-col overflow-hidden p-6">
            <div className="pointer-events-none absolute -right-16 -top-16 h-40 w-40 rounded-full" style={{ background: "radial-gradient(circle, rgba(41,224,212,0.18), transparent 70%)" }} />
            <div className="mb-4 flex items-center justify-between">
              <span className="text-[13px] font-semibold uppercase tracking-wider gradient-text-static">
                With Contextifly
              </span>
              <span className="mono rounded-md bg-[var(--cyan)]/10 px-2 py-1 text-[11px] text-[var(--cyan)]">
                trace_flow /cart → /orders
              </span>
            </div>
            <ul className="flex-1 space-y-3">
              {WITH.map((t) => (
                <li key={t} className="flex items-start gap-2.5 text-[14.5px] text-[var(--text)]">
                  <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.4">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  {t}
                </li>
              ))}
            </ul>
            <div className="mono mt-5 flex gap-4 border-t border-[var(--border)] pt-4 text-[13px]">
              <span style={{ color: "var(--green)" }}>~2s</span>
              <span style={{ color: "var(--green)" }}>a few hundred tokens</span>
              <span className="text-[var(--cyan)]">verified</span>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
