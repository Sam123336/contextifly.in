import { FEATURES } from "@/lib/content";
import FeatureIcon from "./FeatureIcon";
import Reveal from "./Reveal";

export default function Features() {
  return (
    <section id="tools" className="relative border-t border-[var(--border)] py-20 md:py-28">
      <div className="container-x">
        <Reveal className="max-w-[720px]">
          <h2 data-r className="section-title">
            Think in features, not files.
          </h2>
          <p data-r className="mt-4 max-w-[60ch] text-[16.5px] leading-relaxed text-[var(--muted)]">
            The moment the plugin is installed, your assistant can trace flows, measure blast
            radius, and simulate refactors. Every answer backed by the graph.
          </p>
        </Reveal>

        <Reveal className="mt-12 grid overflow-hidden rounded-[12px] border border-[var(--border)] sm:grid-cols-2 lg:grid-cols-3" stagger={0.06}>
          {FEATURES.map((f) => (
            <article
              key={f.title}
              data-r
              className="group relative -mt-px -ml-px border-t border-l border-[var(--border)] bg-[var(--bg-raised)] p-6 transition-colors hover:bg-white/[0.025]"
            >
              <div className="mb-4 flex items-center justify-between">
                <span className="text-[var(--muted)] transition-colors group-hover:text-[var(--accent)]">
                  <FeatureIcon name={f.icon} />
                </span>
                <code className="mono text-[11px] text-[var(--faint)]">{f.tag}</code>
              </div>
              <h3 className="text-[16px] font-semibold">{f.title}</h3>
              <p className="mt-2 text-[13.5px] leading-relaxed text-[var(--muted)]">{f.desc}</p>
            </article>
          ))}
        </Reveal>

        <Reveal className="mt-6">
          <p data-r className="text-[14px] text-[var(--faint)]">
            …plus <span className="mono text-[13px] text-[var(--muted)]">analyze_screenshot</span>,{" "}
            <span className="mono text-[13px] text-[var(--muted)]">explain_visually</span>,{" "}
            <span className="mono text-[13px] text-[var(--muted)]">graph_diff</span>,{" "}
            <span className="mono text-[13px] text-[var(--muted)]">graph_timeline</span>,{" "}
            <span className="mono text-[13px] text-[var(--muted)]">match_screenshot</span> and more.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
