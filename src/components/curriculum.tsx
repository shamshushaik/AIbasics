import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { MODULES } from "../data";
import { FLAT, moduleProgress, navigate, type Progress } from "../lib/store";

const NUM: Record<string, number> = Object.fromEntries(FLAT.map((f) => [f.id, f.number]));
import { Badge, Icon, Kicker, Reveal, Bar } from "./ui";

export function CurriculumPage({ progress, initialModule }: { progress: Progress; initialModule?: string }) {
  const [query, setQuery] = useState("");
  const [modFilter, setModFilter] = useState<number | null>(initialModule ? Number(initialModule) : null);
  const [open, setOpen] = useState<Record<string, boolean>>({});
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialModule) setModFilter(Number(initialModule));
  }, [initialModule]);

  // "/" focuses search
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "/" && document.activeElement?.tagName !== "INPUT") {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const q = query.trim().toLowerCase();
  const searching = q.length > 0;

  const results = useMemo(() => {
    const out: { mod: (typeof MODULES)[number]; section: string; lesson: (typeof MODULES)[number]["sections"][number]["lessons"][number]; number: number }[] = [];
    let n = 0;
    for (const m of MODULES) {
      for (const s of m.sections) {
        for (const l of s.lessons) {
          n += 1;
          if (modFilter && m.num !== modFilter) continue;
          if (!searching) continue;
          const hay = `${l.title} ${l.summary} ${s.title} ${m.title}`.toLowerCase();
          if (hay.includes(q)) out.push({ mod: m, section: s.title, lesson: l, number: n });
        }
      }
    }
    return out;
  }, [q, modFilter, searching]);

  const isOpen = (key: string, fallback: boolean) => (open[key] ?? fallback) && !searching;

  return (
    <main className="relative">
      <div className="grid-paper noise absolute inset-x-0 top-0 h-[340px] border-b-2 border-ink" />
      <div className="relative mx-auto max-w-7xl px-5 pb-10 pt-12 lg:px-8">
        <Reveal>
          <Kicker color="var(--color-m2)">[ full syllabus · doc AI-CUR-078 ]</Kicker>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <h1 className="font-display text-5xl font-extrabold tracking-tight sm:text-6xl">
              The Curriculum<span className="text-m2">.</span>
            </h1>
            <p className="max-w-md text-[15px] leading-relaxed text-ink-2">
              78 specs across 22 sections. Filter by module, search any term — try <em className="font-mono text-[13px] text-ink">drift</em>, <em className="font-mono text-[13px] text-ink">few-shot</em> or <em className="font-mono text-[13px] text-ink">drift</em>'s cousin <em className="font-mono text-[13px] text-ink">bias</em>. Press <kbd className="border border-ink/25 bg-card px-1.5 py-0.5 font-mono text-[11px]">/</kbd> to search.
            </p>
          </div>
        </Reveal>

        {/* controls */}
        <Reveal delay={0.08}>
          <div className="mt-8 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-md">
              <span className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-3"><Icon name="search" size={16} /></span>
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search 78 lessons…"
                className="w-full border-2 border-ink bg-card py-2.5 pl-10 pr-9 font-mono text-[14px] outline-none transition-shadow placeholder:text-ink-3/70 focus:shadow-press-sm"
                style={{ borderRadius: 8 }}
              />
              {query && (
                <button onClick={() => setQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-3 hover:text-fail" aria-label="clear">
                  <Icon name="x" size={15} />
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setModFilter(null)}
                className={`border-2 px-3.5 py-1.5 font-mono text-[12px] font-semibold uppercase tracking-[0.1em] transition-all ${modFilter === null ? "border-ink bg-ink text-paper" : "border-ink/25 bg-card text-ink-2 hover:border-ink"}`}
                style={{ borderRadius: 7 }}
              >
                all
              </button>
              {MODULES.map((m) => (
                <button
                  key={m.code}
                  onClick={() => setModFilter(modFilter === m.num ? null : m.num)}
                  className={`border-2 px-3.5 py-1.5 font-mono text-[12px] font-semibold uppercase tracking-[0.1em] transition-all ${modFilter === m.num ? "text-paper" : "bg-card text-ink-2 hover:border-ink"}`}
                  style={{ borderRadius: 7, borderColor: m.accent, ...(modFilter === m.num ? { background: m.accent } : {}) }}
                >
                  {m.code}
                </button>
              ))}
            </div>
          </div>
        </Reveal>

        {/* search results */}
        {searching ? (
          <div className="mt-10">
            <p className="mb-4 font-mono text-[12px] uppercase tracking-[0.18em] text-ink-3">
              {results.length} match{results.length === 1 ? "" : "es"} for “{query}”
            </p>
            <div className="space-y-2.5">
              {results.map((r) => (
                <LessonRow
                  key={r.lesson.id}
                  number={r.number}
                  accent={r.mod.accent}
                  title={r.lesson.title}
                  minutes={r.lesson.minutes}
                  section={r.section}
                  code={r.mod.code}
                  done={progress.completed.includes(r.lesson.id)}
                  quiz={progress.quiz[r.lesson.id]}
                  onClick={() => navigate(`/lesson/${r.lesson.id}`)}
                />
              ))}
              {results.length === 0 && (
                <div className="border-2 border-dashed border-ink/25 bg-card/70 p-10 text-center" style={{ borderRadius: 10 }}>
                  <p className="font-display text-2xl font-bold">0 results. Even the oracle can't help here.</p>
                  <p className="mt-2 font-mono text-[13px] text-ink-3">try “hallucination”, “drift”, “prompt” or clear the module filter.</p>
                </div>
              )}
            </div>
          </div>
        ) : (
          /* module tree */
          <div className="mt-10 space-y-8">
            {MODULES.filter((m) => !modFilter || m.num === modFilter).map((m, mi) => {
              const p = moduleProgress(m, progress);
              const lessons = m.sections.reduce((a, s) => a + s.lessons.length, 0);
              const mKey = `m${m.num}`;
              const mOpen = isOpen(mKey, true);
              return (
                <Reveal key={m.code} delay={mi * 0.05}>
                  <div className="overflow-hidden border-2 border-ink bg-card/80" style={{ borderRadius: 12 }}>
                    <button
                      onClick={() => setOpen((o) => ({ ...o, [mKey]: !mOpen }))}
                      className="grid w-full grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-5 text-left transition-colors hover:bg-card sm:gap-6 sm:px-7"
                    >
                      <span className="font-display text-4xl font-extrabold leading-none sm:text-5xl" style={{ color: m.accent }}>
                        {m.code}
                      </span>
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-3">
                          <span className="font-display text-[21px] font-bold tracking-tight sm:text-2xl">{m.title}</span>
                          <Badge color={m.accent} soft={m.accentSoft}>{lessons} lessons</Badge>
                          {p.pct === 100 && <Badge color="var(--color-pass)" soft="rgba(47,158,68,0.12)">✓ complete</Badge>}
                        </span>
                        <span className="mt-2.5 flex max-w-md items-center gap-3">
                          <span className="w-full"><Bar pct={p.pct} color={m.accent} h={5} /></span>
                          <span className="whitespace-nowrap font-mono text-[12px] font-semibold tabular-nums" style={{ color: m.accent }}>{p.pct}%</span>
                        </span>
                      </span>
                      <motion.span animate={{ rotate: mOpen ? 90 : 0 }} className="text-ink-3" style={{ color: m.accent }}>
                        <Icon name="arrow" size={22} />
                      </motion.span>
                    </button>
                    <AnimatePresence initial={false}>
                      {mOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                          className="overflow-hidden"
                        >
                          <div className="border-t border-ink/12 px-5 py-2 sm:px-7">
                            {m.sections.map((s, si) => {
                              const sKey = `${mKey}s${si}`;
                              const sOpen = isOpen(sKey, modFilter !== null || (mi === 0 && si < 2));
                              return (
                                <div key={s.title} className="border-b border-ink/8 last:border-0">
                                  <button
                                    onClick={() => setOpen((o) => ({ ...o, [sKey]: !sOpen }))}
                                    className="flex w-full items-center justify-between gap-4 py-3.5 text-left group"
                                  >
                                    <span className="flex items-baseline gap-3">
                                      <span className="font-mono text-[11.5px] font-bold tracking-[0.14em]" style={{ color: m.accent }}>
                                        §{m.num}.{si + 1}
                                      </span>
                                      <span className="font-display text-[16.5px] font-bold text-ink group-hover:translate-x-0.5 transition-transform inline-block">
                                        {s.title}
                                      </span>
                                      <span className="font-mono text-[11px] text-ink-3">{s.lessons.length} lessons</span>
                                    </span>
                                    <motion.span animate={{ rotate: sOpen ? 90 : 0 }} style={{ color: m.accent }}>
                                      <Icon name="arrow" size={15} />
                                    </motion.span>
                                  </button>
                                  <AnimatePresence initial={false}>
                                    {sOpen && (
                                      <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                                        className="overflow-hidden"
                                      >
                                        <div className="space-y-1.5 pb-4">
                                          {s.lessons.map((l) => (
                                            <LessonRow
                                              key={l.id}
                                              number={NUM[l.id]}
                                              accent={m.accent}
                                              title={l.title}
                                              minutes={l.minutes}
                                              section={s.title}
                                              code={m.code}
                                              done={progress.completed.includes(l.id)}
                                              quiz={progress.quiz[l.id]}
                                              onClick={() => navigate(`/lesson/${l.id}`)}
                                            />
                                          ))}
                                        </div>
                                      </motion.div>
                                    )}
                                  </AnimatePresence>
                                </div>
                              );
                            })}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}

function LessonRow({
  number, accent, title, minutes, section, code, done, quiz, onClick,
}: {
  number: number; accent: string; title: string; minutes: number; section: string; code: string;
  done: boolean; quiz?: { score: number; total: number }; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="group flex w-full items-center gap-4 border border-transparent bg-card px-4 py-3 text-left transition-all duration-200 hover:border-ink hover:shadow-press-sm"
      style={{ borderRadius: 8 }}
    >
      <span className={`grid h-8 w-11 shrink-0 place-items-center font-mono text-[12px] font-bold tabular-nums ${done ? "bg-ink text-glow" : "text-ink-2"}`} style={{ borderRadius: 6, border: done ? "none" : `1.5px solid ${accent}66` }}>
        {done ? <Icon name="check" size={14} /> : String(number).padStart(3, "0")}
      </span>
      <span className="min-w-0 flex-1">
        <span className={`block truncate text-[15px] font-semibold ${done ? "text-ink-3 line-through decoration-ink/30" : "text-ink group-hover:translate-x-0.5 transition-transform inline-block max-w-full"}`}>
          {title}
        </span>
        <span className="font-mono text-[11px] uppercase tracking-[0.12em] text-ink-3">{code} · {section}</span>
      </span>
      {quiz && (
        <span className="hidden shrink-0 items-center gap-1 font-mono text-[11.5px] font-bold sm:flex" style={{ color: quiz.score === quiz.total ? "var(--color-pass)" : "var(--color-m1)" }}>
          <Icon name="target" size={13} /> {quiz.score}/{quiz.total}
        </span>
      )}
      <span className="shrink-0 font-mono text-[11.5px] text-ink-3">{minutes} min</span>
      <span className="shrink-0 text-ink-3 opacity-0 transition-opacity group-hover:opacity-100" style={{ color: accent }}>
        <Icon name="arrow" size={16} />
      </span>
    </button>
  );
}
