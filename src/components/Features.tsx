import { FEATURES } from "@/lib/content";
import FeatureIcon from "./FeatureIcon";
import Reveal from "./Reveal";

export default function Features() {
  return (
    <section id="tools" className="relative py-24 md:py-32">
      <div className="absolute inset-0 -z-10">
        <div className="grid-overlay" />
      </div>
      <div className="container-x">
        <Reveal className="mx-auto max-w-[760px] text-center">
          <div data-r className="eyebrow mb-5">
            <span className="dot" />
            14 tools · 3 skills
          </div>
          <h2 data-r className="section-title">
            Think in <span className="gradient-text">features</span>, not files.
          </h2>
          <p data-r className="mx-auto mt-5 max-w-[60ch] text-[17px] leading-relaxed text-[var(--muted)]">
            The moment the plugin is installed, your assistant can trace flows, measure blast radius, and
            simulate refactors — every answer backed by the graph.
          </p>
        </Reveal>

        <Reveal className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3" stagger={0.08}>
          {FEATURES.map((f) => (
            <article key={f.title} data-r className="glass card-hover group relative overflow-hidden p-6">
              <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: "radial-gradient(circle, rgba(77,124,255,0.16), transparent 70%)" }} />
              <div className="mb-4 flex items-center justify-between">
                <div className="grid h-11 w-11 place-items-center rounded-xl border border-[var(--border-strong)] bg-white/5 text-[var(--blue)] transition-colors group-hover:text-[var(--cyan)]">
                  <FeatureIcon name={f.icon} />
                </div>
                <code className="mono rounded-md bg-white/5 px-2 py-1 text-[11px] text-[var(--faint)]">
                  {f.tag}
                </code>
              </div>
              <h3 className="text-[17px] font-semibold">{f.title}</h3>
              <p className="mt-2 text-[14px] leading-relaxed text-[var(--muted)]">{f.desc}</p>
            </article>
          ))}
        </Reveal>

        <Reveal className="mt-8 text-center">
          <p data-r className="text-[14px] text-[var(--faint)]">
            …plus <span className="text-[var(--muted)]">get_project_map</span>,{" "}
            <span className="text-[var(--muted)]">explain_visually</span>,{" "}
            <span className="text-[var(--muted)]">graph_diff</span>,{" "}
            <span className="text-[var(--muted)]">graph_timeline</span>,{" "}
            <span className="text-[var(--muted)]">match_screenshot</span> and more.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
