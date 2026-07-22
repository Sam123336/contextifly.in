import Reveal from "./Reveal";
import CopyCommand from "./CopyCommand";
import { GITHUB_URL } from "@/lib/content";

const QUERIES = [
  "show me the project map",
  "what breaks if I change ProductCard?",
  "trace the flow from /cart to /orders",
  "analyze this screenshot with contextifly: ./home.png",
];

export default function Install() {
  return (
    <section id="install" className="relative border-t border-[var(--border)] py-20 md:py-28">
      <div className="container-x">
        <Reveal className="max-w-[720px]">
          <h2 data-r className="section-title">
            Install it. Then just ask.
          </h2>
          <p data-r className="mt-4 max-w-[54ch] text-[16.5px] leading-relaxed text-[var(--muted)]">
            No account, no API key. The 14 tools and 3 skills are available the moment a new
            session starts.
          </p>
        </Reveal>

        <Reveal className="mt-12 grid max-w-[980px] gap-4 lg:grid-cols-3" stagger={0.1}>
          {/* step 1 */}
          <div data-r className="panel p-6 lg:col-span-2">
            <StepBadge n={1} label="Install the plugin" />
            <div className="mt-4 space-y-2.5">
              <CopyCommand command="claude plugin marketplace add Sam123336/Contextifly" prompt="$" />
              <CopyCommand command="claude plugin install contextifly@contextifly" prompt="$" />
            </div>
          </div>

          {/* step 2 */}
          <div data-r className="panel flex flex-col justify-center p-6">
            <StepBadge n={2} label="Index your project" />
            <div className="mt-4 rounded-[8px] border border-[var(--border)] bg-[var(--bg-inset)] p-4">
              <p className="text-[13px] text-[var(--faint)]">In a new session, say:</p>
              <p className="mono mt-2 text-[15px] text-[var(--accent)]">“index this project with contextifly”</p>
            </div>
            <p className="mt-3 text-[12.5px] text-[var(--faint)]">
              Runs 100% locally · incremental after the first pass.
            </p>
          </div>

          {/* step 3 */}
          <div data-r className="panel p-6 lg:col-span-3">
            <StepBadge n={3} label="Ask anything" />
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {QUERIES.map((q) => (
                <div key={q} className="mono flex items-center gap-2.5 rounded-[8px] border border-[var(--border)] bg-[var(--bg-inset)] px-4 py-3 text-[13px] text-[var(--muted)]">
                  <span className="text-[var(--accent)]">›</span>
                  {q}
                </div>
              ))}
            </div>
            <p className="mt-4 text-[13px] text-[var(--faint)]">
              Bonus: open{" "}
              <code className="mono text-[var(--muted)]">.pixelcontextifly/graph.html</code> in any
              browser for the interactive map.
            </p>
          </div>
        </Reveal>

        {/* final CTA */}
        <Reveal className="mt-8 max-w-[980px]">
          <div data-r className="panel flex flex-col items-start gap-6 border-[var(--border-strong)] px-8 py-10 md:flex-row md:items-center md:justify-between">
            <div>
              <h3 className="text-[clamp(22px,3vw,28px)] font-bold tracking-tight">
                Give your AI a memory today.
              </h3>
              <p className="mt-2 text-[15px] text-[var(--muted)]">
                Open source, MIT. Works with Claude Code, Cursor &amp; any MCP client.
              </p>
            </div>
            <a href={GITHUB_URL} target="_blank" rel="noreferrer" className="btn btn-primary shrink-0">
              <svg width="17" height="17" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 .5A11.5 11.5 0 0 0 .5 12a11.5 11.5 0 0 0 7.86 10.92c.58.1.79-.25.79-.56v-2c-3.2.7-3.88-1.36-3.88-1.36-.53-1.33-1.3-1.69-1.3-1.69-1.06-.72.08-.71.08-.71 1.17.08 1.79 1.2 1.79 1.2 1.04 1.79 2.73 1.27 3.4.97.1-.76.41-1.27.74-1.56-2.55-.29-5.23-1.28-5.23-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.05 0 0 .97-.31 3.18 1.18a11 11 0 0 1 5.8 0c2.2-1.49 3.17-1.18 3.17-1.18.63 1.59.23 2.76.11 3.05.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.38-5.25 5.67.42.36.79 1.08.79 2.18v3.24c0 .31.21.67.8.56A11.5 11.5 0 0 0 23.5 12 11.5 11.5 0 0 0 12 .5Z" />
              </svg>
              View on GitHub
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function StepBadge({ n, label }: { n: number; label: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="mono grid h-8 w-8 place-items-center rounded-[8px] border border-[var(--border-strong)] text-[13px] font-semibold text-[var(--accent)]">
        {n}
      </span>
      <span className="text-[16px] font-semibold">{label}</span>
    </div>
  );
}
