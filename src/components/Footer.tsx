import Logo from "./Logo";
import { GITHUB_URL, NAV_LINKS } from "@/lib/content";

export default function Footer() {
  return (
    <footer className="relative mt-auto border-t border-[var(--border)] py-14">
      <div className="container-x">
        <div className="flex flex-col justify-between gap-10 md:flex-row">
          <div className="max-w-[320px]">
            <a href="#top" className="flex items-center gap-2.5 font-semibold">
              <Logo className="h-7 w-7" />
              <span className="text-[16px]">Contextifly</span>
            </a>
            <p className="mt-4 text-[14px] leading-relaxed text-[var(--muted)]">
              A persistent context engine for AI coding assistants. See it. Understand it. Build
              better.
            </p>
            <p className="mono mt-5 text-[12px] text-[var(--faint)]">
              React / Next.js · NestJS · Flutter
            </p>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3">
            <div>
              <h4 className="mono text-[12px] uppercase tracking-[0.08em] text-[var(--faint)]">Explore</h4>
              <ul className="mt-4 space-y-2.5">
                {NAV_LINKS.map((l) => (
                  <li key={l.href}>
                    <a href={l.href} className="text-[14px] text-[var(--muted)] transition-colors hover:text-[var(--text)]">
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h4 className="mono text-[12px] uppercase tracking-[0.08em] text-[var(--faint)]">Project</h4>
              <ul className="mt-4 space-y-2.5">
                <li><a href={GITHUB_URL} target="_blank" rel="noreferrer" className="text-[14px] text-[var(--muted)] hover:text-[var(--text)]">GitHub</a></li>
                <li><a href={`${GITHUB_URL}/blob/master/ARCHITECTURE.md`} target="_blank" rel="noreferrer" className="text-[14px] text-[var(--muted)] hover:text-[var(--text)]">Architecture</a></li>
                <li><a href={`${GITHUB_URL}#-tools`} target="_blank" rel="noreferrer" className="text-[14px] text-[var(--muted)] hover:text-[var(--text)]">Tools &amp; skills</a></li>
              </ul>
            </div>
            <div>
              <h4 className="mono text-[12px] uppercase tracking-[0.08em] text-[var(--faint)]">Works with</h4>
              <ul className="mt-4 space-y-2.5 text-[14px] text-[var(--muted)]">
                <li>Claude Code</li>
                <li>Cursor</li>
                <li>Any MCP client</li>
              </ul>
            </div>
          </div>
        </div>

        <div className="my-9 h-px bg-[var(--border)]" />

        <div className="flex flex-col items-start justify-between gap-4 text-[13px] text-[var(--faint)] sm:flex-row sm:items-center">
          <p>© {new Date().getFullYear()} Contextifly · MIT License</p>
          <p className="mono">Your code never leaves your machine.</p>
        </div>
      </div>
    </footer>
  );
}
