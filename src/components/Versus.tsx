import { COMPARE_ROWS } from "@/lib/content";
import Reveal from "./Reveal";
import Logo from "./Logo";

function Check() {
  return (
    <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2.6">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
function Cross() {
  return (
    <svg className="mt-0.5 shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--warn)" strokeWidth="2.2">
      <path d="M18 6 6 18M6 6l12 12" />
    </svg>
  );
}

export default function Versus() {
  return (
    <section id="versus" className="relative border-t border-[var(--border)] py-20 md:py-28">
      <div className="container-x">
        <Reveal className="max-w-[720px]">
          <h2 data-r className="section-title">
            A compiler you can trust, not a model you hope is right.
          </h2>
          <p data-r className="mt-4 max-w-[60ch] text-[16.5px] leading-relaxed text-[var(--muted)]">
            Other graph tools are clever, but they map calls and let a model infer the semantics.
            Contextifly is a deterministic compiler that links your whole stack and cites every
            edge.
          </p>
          <p data-r className="mt-4 max-w-[64ch] text-[13px] leading-relaxed text-[var(--faint)]">
            How to read this: <span className="text-[var(--accent)]">✓</span> the tool does this
            well · <span className="text-[var(--warn)]">✗</span> a limitation on that row, not an
            overall verdict. Each tool wins different rows.
          </p>
        </Reveal>

        <Reveal className="mt-10 max-w-[960px]">
          <div data-r className="panel overflow-hidden">
            {/* header */}
            <div className="grid grid-cols-[1.3fr_1fr_1fr] border-b border-[var(--border)] text-[13px] sm:text-[14px]">
              <div className="px-4 py-4 font-semibold text-[var(--faint)] sm:px-6">Capability</div>
              <div className="flex items-center gap-2 border-l border-[var(--border)] bg-white/[0.025] px-4 py-4 font-semibold sm:px-6">
                <Logo className="h-5 w-5" />
                <span>Contextifly</span>
              </div>
              <div className="border-l border-[var(--border)] px-4 py-4 font-semibold text-[var(--muted)] sm:px-6">
                Other graph tools
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
                <div className="flex items-start gap-2 border-l border-[var(--border)] bg-white/[0.025] px-4 py-4 text-[var(--text)] sm:px-6">
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
          <p data-r className="mt-4 text-[12.5px] text-[var(--faint)]">
            The screenshot engine does use a model (optionally your own key). The{" "}
            <span className="text-[var(--muted)]">code graph never does</span>.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
