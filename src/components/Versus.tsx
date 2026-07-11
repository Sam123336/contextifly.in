import { COMPARE_ROWS } from "@/lib/content";
import Reveal from "./Reveal";
import Logo from "./Logo";

function Check() {
  return (
    <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2.6">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function Cross() {
  return (
    <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--amber)" strokeWidth="2.2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export default function Versus() {
  return (
    <section id="versus" className="relative py-24 md:py-32">
      <div className="container-x">
        <Reveal className="mx-auto max-w-[760px] text-center">
          <div data-r className="eyebrow mb-5">
            <span className="dot" />
            Why it&apos;s different
          </div>
          <h2 data-r className="section-title">
            A compiler you can <span className="gradient-text">trust</span> — not a model you hope is right.
          </h2>
          <p data-r className="mx-auto mt-5 max-w-[60ch] text-[17px] leading-relaxed text-[var(--muted)]">
            LLM-extracted graph tools are clever, but they&apos;re probabilistic and they read your code in
            the cloud. Contextifly is deterministic, local, and cites its evidence.
          </p>
        </Reveal>

        <Reveal className="mx-auto mt-14 max-w-[920px]">
          <div data-r className="glass-strong overflow-hidden">
            {/* header */}
            <div className="grid grid-cols-[1.3fr_1fr_1fr] border-b border-[var(--border)] text-[13px] sm:text-[14px]">
              <div className="px-4 py-4 font-semibold text-[var(--faint)] sm:px-6">Capability</div>
              <div className="flex items-center gap-2 border-l border-[var(--border)] bg-white/[0.03] px-4 py-4 font-semibold sm:px-6">
                <Logo className="h-5 w-5" />
                <span>Contextifly</span>
              </div>
              <div className="border-l border-[var(--border)] px-4 py-4 font-semibold text-[var(--muted)] sm:px-6">
                LLM-extracted tools
              </div>
            </div>

            {/* rows */}
            {COMPARE_ROWS.map((r, i) => (
              <div
                key={r.label}
                className="grid grid-cols-[1.3fr_1fr_1fr] text-[13px] sm:text-[14px]"
                style={{ background: i % 2 ? "rgba(255,255,255,0.012)" : "transparent" }}
              >
                <div className="px-4 py-4 text-[var(--muted)] sm:px-6">{r.label}</div>
                <div className="flex items-start gap-2 border-l border-[var(--border)] bg-[var(--blue)]/[0.05] px-4 py-4 text-[var(--text)] sm:px-6">
                  {r.ctxGood ? <Check /> : <Cross />}
                  <span>{r.contextifly}</span>
                </div>
                <div className="flex items-start gap-2 border-l border-[var(--border)] px-4 py-4 text-[var(--muted)] sm:px-6">
                  {r.llmGood ? <Check /> : <Cross />}
                  <span>{r.llmTools}</span>
                </div>
              </div>
            ))}
          </div>
          <p data-r className="mt-4 text-center text-[12.5px] text-[var(--faint)]">
            The screenshot engine does use a model (optionally your own key) — the{" "}
            <span className="text-[var(--muted)]">code graph never does</span>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
