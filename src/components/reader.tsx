import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import confetti from "canvas-confetti";
import { getLesson, neighbors, navigate, usePrefersReducedMotion, type Progress } from "../lib/store";
import { DEEP } from "../data";
import { RenderBlock, Icon } from "./ui";
import { Diagram } from "./diagrams";

const ease = [0.22, 1, 0.36, 1] as const;

/* ---------------- section heading ---------------- */

function SecHead({ id, icon, kicker, title, accent }: { id: string; icon: string; kicker: string; title: string; accent: string }) {
  return (
    <div id={id} className="mt-14 mb-5 flex scroll-mt-36 items-center gap-3.5 border-b border-line pb-3">
      <span className="grid h-9 w-9 place-items-center border" style={{ borderColor: `${accent}66`, color: accent, borderRadius: 7 }}>
        <Icon name={icon} size={17} />
      </span>
      <div>
        <p className="font-mono text-[10px] uppercase tracking-[0.26em]" style={{ color: accent }}>{kicker}</p>
        <h2 className="font-display text-[22px] font-bold leading-tight text-ink sm:text-2xl">{title}</h2>
      </div>
    </div>
  );
}

/* ---------------- worked example stepper ---------------- */

function WorkedStepper({ title, steps, accent }: { title: string; steps: { head: string; body: string }[]; accent: string }) {
  const [cur, setCur] = useState(0);
  return (
    <div className="overflow-hidden border border-line-2 bg-card" style={{ borderRadius: 10 }}>
      <div className="flex items-center justify-between border-b border-line-2 bg-panel-2/70 px-5 py-3">
        <p className="font-display text-[16px] font-bold text-ink">{title}</p>
        <span className="font-mono text-[11px] tabular-nums text-ink-3">step {cur + 1} / {steps.length}</span>
      </div>
      {/* step rail */}
      <div className="flex gap-1.5 overflow-x-auto px-5 pt-4">
        {steps.map((s, i) => (
          <button key={i} onClick={() => setCur(i)}
            className="group flex min-w-0 shrink-0 items-center gap-2 border px-3 py-1.5 transition-all"
            style={{
              borderRadius: 6,
              borderColor: i === cur ? accent : "var(--color-line-2)",
              background: i === cur ? `${accent}1a` : "transparent",
            }}>
            <span className="font-mono text-[11px] font-bold" style={{ color: i <= cur ? accent : "var(--color-ink-3)" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className={`max-w-36 truncate font-mono text-[11px] ${i === cur ? "text-ink" : "text-ink-3"}`}>{s.head}</span>
          </button>
        ))}
      </div>
      <div className="relative min-h-[150px] px-5 py-5 sm:min-h-[120px]">
        <AnimatePresence mode="wait">
          <motion.div key={cur} initial={{ opacity: 0, x: 26 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -26 }}
            transition={{ duration: 0.32, ease }}>
            <h4 className="font-display text-[17px] font-bold text-ink">
              <span className="mr-2 font-mono text-[13px]" style={{ color: accent }}>{String(cur + 1).padStart(2, "0")} ▸</span>
              {steps[cur].head}
            </h4>
            <p className="mt-2.5 max-w-2xl text-[15px] leading-relaxed text-ink-2">{steps[cur].body}</p>
          </motion.div>
        </AnimatePresence>
      </div>
      <div className="flex items-center justify-between border-t border-line-2 px-5 py-3.5">
        <button onClick={() => setCur((c) => Math.max(0, c - 1))} disabled={cur === 0}
          className="flex items-center gap-2 font-mono text-[12px] text-ink-3 transition-colors enabled:hover:text-ink disabled:opacity-30">
          <Icon name="arrow" size={14} className="rotate-180" /> back
        </button>
        <div className="flex gap-1.5">
          {steps.map((_, i) => (
            <button key={i} onClick={() => setCur(i)} aria-label={`step ${i + 1}`}
              className="h-1.5 rounded-full transition-all duration-300"
              style={{ width: i === cur ? 22 : 8, background: i <= cur ? accent : "var(--color-line-2)" }} />
          ))}
        </div>
        <button onClick={() => setCur((c) => Math.min(steps.length - 1, c + 1))} disabled={cur === steps.length - 1}
          className="flex items-center gap-2 font-mono text-[12px] font-semibold transition-colors enabled:hover:opacity-80 disabled:opacity-30"
          style={{ color: accent }}>
          next step <Icon name="arrow" size={14} />
        </button>
      </div>
    </div>
  );
}

/* ---------------- mistakes ---------------- */

function Mistakes({ items, accent }: { items: { wrong: string; right: string; why: string }[]; accent: string }) {
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {items.map((m, i) => (
        <motion.div key={i} initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-40px" }} transition={{ duration: 0.5, delay: i * 0.08, ease }}
          className="border border-line-2 bg-card p-5" style={{ borderRadius: 10 }}>
          <div className="flex gap-3">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-fail/15 text-fail"><Icon name="x" size={13} /></span>
            <p className="text-[14.5px] leading-relaxed text-ink-2"><strong className="font-semibold text-fail">Wrong move:</strong> {m.wrong}</p>
          </div>
          <div className="mt-3 flex gap-3">
            <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-pass/15 text-pass"><Icon name="check" size={13} /></span>
            <p className="text-[14.5px] leading-relaxed text-ink-2"><strong className="font-semibold text-pass">Right move:</strong> {m.right}</p>
          </div>
          <p className="mt-3.5 border-t border-line pt-3 font-mono text-[12px] leading-relaxed" style={{ color: accent }}>
            ▸ why it matters — {m.why}
          </p>
        </motion.div>
      ))}
    </div>
  );
}

/* ---------------- FAQ accordion ---------------- */

function Faq({ items }: { items: { q: string; a: string }[] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="overflow-hidden border border-line-2" style={{ borderRadius: 10 }}>
      {items.map((f, i) => (
        <div key={i} className={i ? "border-t border-line-2" : ""}>
          <button onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 bg-card px-5 py-4 text-left transition-colors hover:bg-card-2">
            <span className="font-display text-[15.5px] font-semibold text-ink">{f.q}</span>
            <motion.span animate={{ rotate: open === i ? 45 : 0 }} transition={{ duration: 0.25 }} className="shrink-0 text-glow">
              <svg width="16" height="16" viewBox="0 0 16 16"><path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" /></svg>
            </motion.span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease }}>
                <p className="border-t border-line bg-panel-2/50 px-5 py-4 text-[14.5px] leading-relaxed text-ink-2">{f.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/* ---------------- quiz ---------------- */

function Quiz({ id, questions, accent, progress }: { id: string; questions: { q: string; options: string[]; answer: number; explain: string }[]; accent: string; progress: Progress }) {
  const [picked, setPicked] = useState<(number | null)[]>(() => questions.map(() => null));
  const [submitted, setSubmitted] = useState(false);
  const reduced = usePrefersReducedMotion();
  const best = progress.quiz[id];

  useEffect(() => {
    setPicked(questions.map(() => null));
    setSubmitted(false);
  }, [id, questions]);

  const score = picked.filter((p, i) => p === questions[i].answer).length;

  const submit = () => {
    setSubmitted(true);
    progress.setQuiz(id, score, questions.length);
    if (score === questions.length && !reduced) {
      confetti({ particleCount: 130, spread: 75, origin: { y: 0.7 }, colors: ["#7ee2a8", "#22d3ee", "#f472b6", "#ff7a29"] });
    }
  };

  return (
    <div className="space-y-5">
      {best && (
        <p className="font-mono text-[11.5px] text-ink-3">
          personal best: <span className="text-glow">{best.score}/{best.total}</span> — beat it below.
        </p>
      )}
      {questions.map((qq, qi) => (
        <div key={qi} className="border border-line-2 bg-card p-5" style={{ borderRadius: 10 }}>
          <p className="font-display text-[16px] font-bold leading-snug text-ink">
            <span className="mr-2 font-mono text-[12px]" style={{ color: accent }}>Q{qi + 1}</span>
            {qq.q}
          </p>
          <div className="mt-4 grid gap-2.5">
            {qq.options.map((op, oi) => {
              const isPick = picked[qi] === oi;
              const isRight = oi === qq.answer;
              let cls = "border-line-2 bg-panel-2/40 text-ink-2 hover:border-ink-3 hover:text-ink";
              if (submitted) {
                if (isRight) cls = "border-pass/70 bg-pass/10 text-pass";
                else if (isPick) cls = "border-fail/70 bg-fail/10 text-fail";
                else cls = "border-line-2 bg-panel-2/30 text-ink-3 opacity-60";
              } else if (isPick) cls = "border-glow/70 bg-glow/10 text-glow";
              return (
                <button key={oi} disabled={submitted} onClick={() => setPicked((p) => p.map((v, i) => (i === qi ? oi : v)))}
                  className={`flex items-center gap-3 border px-4 py-2.5 text-left text-[14px] transition-all ${cls}`}
                  style={{ borderRadius: 7 }}>
                  <span className="font-mono text-[11px] opacity-60">{String.fromCharCode(65 + oi)}</span>
                  <span className="flex-1">{op}</span>
                  {submitted && isRight && <Icon name="check" size={15} />}
                  {submitted && isPick && !isRight && <Icon name="x" size={15} />}
                </button>
              );
            })}
          </div>
          <AnimatePresence>
            {submitted && (
              <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden font-mono text-[12px] leading-relaxed text-ink-3">
                <span className="mt-3 block border-t border-line pt-3">
                  <span className="text-glow">explain ▸</span> {qq.explain}
                </span>
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      ))}
      <div className="flex flex-wrap items-center gap-4">
        {!submitted ? (
          <button onClick={submit} disabled={picked.some((p) => p === null)}
            className="border border-glow bg-glow px-6 py-3 font-mono text-[12.5px] font-bold uppercase tracking-[0.14em] text-[#071008] transition-all enabled:hover:shadow-[0_0_30px_-6px_rgba(126,226,168,0.5)] disabled:cursor-not-allowed disabled:opacity-35"
            style={{ borderRadius: 7 }}>
            run assertions ▸
          </button>
        ) : (
          <>
            <div className={`border px-5 py-2.5 font-mono text-[13px] font-bold tabular-nums ${score === questions.length ? "border-pass/60 bg-pass/10 text-pass" : score >= questions.length / 2 ? "border-[#e8b93d]/60 bg-[#e8b93d]/10 text-[#e8b93d]" : "border-fail/60 bg-fail/10 text-fail"}`} style={{ borderRadius: 7 }}>
              {score === questions.length ? "PASS" : score >= questions.length / 2 ? "PARTIAL" : "FAIL"} · {score}/{questions.length}
            </div>
            <button onClick={() => { setPicked(questions.map(() => null)); setSubmitted(false); }}
              className="link-slide font-mono text-[12.5px] text-ink-2 hover:text-ink">
              retry suite ↺
            </button>
          </>
        )}
        <span className="font-mono text-[11px] text-ink-3">every question ships with an explanation — read them even when you pass.</span>
      </div>
    </div>
  );
}

/* ---------------- TOC rail ---------------- */

function Toc({ active, accent }: { active: string; accent: string }) {
  const items = [
    ["hook", "in plain words", "book"],
    ["core", "the lesson", "chip"],
    ["worked", "worked example", "terminal"],
    ["mistakes", "mistakes to avoid", "bug"],
    ["takeaways", "key takeaways", "check"],
    ["faq", "beginner faq", "search"],
    ["quiz", "checkpoint quiz", "gauge"],
    ["labs", "lab bench", "flask"],
  ];
  return (
    <nav className="sticky top-28 hidden lg:block">
      <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.26em] text-ink-3">on this page</p>
      <ul className="space-y-1 border-l border-line-2">
        {items.map(([id, label, icon]) => (
          <li key={id}>
            <a href={`#${id}`}
              className={`flex items-center gap-2.5 py-1.5 pl-4 font-mono text-[12px] transition-all ${
                active === id ? "font-semibold" : "text-ink-3 hover:text-ink-2"
              }`}
              style={active === id ? { color: accent, borderLeft: `2px solid ${accent}`, marginLeft: -1 } : { marginLeft: -1, borderLeft: "2px solid transparent" }}>
              <Icon name={icon} size={13} />
              {label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

/* ---------------- page ---------------- */

export function LessonPage({ id, progress }: { id: string; progress: Progress }) {
  const lesson = getLesson(id);
  const deep = DEEP[id];
  const { prev, next } = neighbors(id);
  const artRef = useRef<HTMLDivElement>(null);
  const [readPct, setReadPct] = useState(0);
  const [active, setActive] = useState("hook");
  const done = lesson ? progress.completed.includes(lesson.id) : false;
  const labDone = useMemo(() => (lesson ? (progress.practice[lesson.id] ?? []) : []), [progress, lesson]);

  useEffect(() => {
    const onScroll = () => {
      const el = artRef.current;
      if (!el) return;
      const top = el.offsetTop;
      const h = el.offsetHeight;
      const p = (window.scrollY + window.innerHeight * 0.35 - top) / h;
      setReadPct(Math.max(0, Math.min(1, p)));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [id]);

  useEffect(() => {
    const ids = ["hook", "core", "worked", "mistakes", "takeaways", "faq", "quiz", "labs"];
    const obs = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) setActive(e.target.id);
      },
      { rootMargin: "-30% 0px -60% 0px" }
    );
    ids.forEach((s) => { const el = document.getElementById(s); if (el) obs.observe(el); });
    return () => obs.disconnect();
  }, [id]);

  if (!lesson) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-32 text-center">
        <p className="font-display text-3xl font-bold text-ink">Lesson not found.</p>
        <button onClick={() => navigate("/curriculum")} className="link-slide mt-4 font-mono text-sm text-glow">back to curriculum →</button>
      </main>
    );
  }

  const accent = lesson.accent;

  return (
    <main className="relative">
      <div className="absolute inset-x-0 top-0 h-96 aurora" />
      {/* reading progress */}
      <div className="sticky top-[67px] z-40 h-[3px] w-full bg-line">
        <div className="h-full transition-[width] duration-150" style={{ width: `${readPct * 100}%`, background: `linear-gradient(90deg, ${accent}, var(--color-glow))` }} />
      </div>

      <div className="noise relative mx-auto max-w-7xl px-5 py-12 lg:px-8">
        {/* header */}
        <div className="mb-10">
          <p className="flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[11.5px] uppercase tracking-[0.18em] text-ink-3">
            <button onClick={() => navigate("/curriculum")} className="link-slide hover:text-ink">{lesson.moduleCode} · {lesson.moduleTitle}</button>
            <span className="text-line-2">/</span>
            <span>{lesson.sectionTitle}</span>
          </p>
          <div className="mt-5 flex flex-wrap items-end gap-x-8 gap-y-4">
            <span className="text-outline font-display text-[92px] font-extrabold leading-none sm:text-[120px]" style={{ WebkitTextStrokeColor: `${accent}44` }}>
              {String(lesson.number).padStart(2, "0")}
            </span>
            <div className="max-w-2xl pb-2">
              <h1 className="font-display text-4xl font-extrabold leading-[1.04] tracking-tight text-ink sm:text-5xl">{lesson.title}</h1>
              <p className="mt-4 text-[16.5px] leading-relaxed text-ink-2">{lesson.summary}</p>
              <div className="mt-5 flex flex-wrap gap-2.5">
                {[
                  [`${lesson.minutes} min read`, "gauge"],
                  [`${lesson.quiz.length}-question checkpoint`, "check"],
                  [`${lesson.practice.length} lab tasks`, "flask"],
                  ...(deep?.diagram ? [["interactive diagram", "chip"] as [string, string]] : []),
                ].map(([t, ic]) => (
                  <span key={t} className="flex items-center gap-2 border border-line-2 bg-card px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] text-ink-2" style={{ borderRadius: 6 }}>
                    <Icon name={ic} size={13} /> {t}
                  </span>
                ))}
              </div>
            </div>
            <button onClick={() => progress.toggleComplete(lesson.id)}
              className={`ml-auto flex items-center gap-2.5 border px-5 py-3 font-mono text-[12px] font-bold uppercase tracking-[0.14em] transition-all ${
                done ? "border-pass bg-pass/15 text-pass" : "border-line-2 text-ink-2 hover:border-glow hover:text-glow"
              }`} style={{ borderRadius: 8 }}>
              <Icon name="check" size={15} /> {done ? "completed" : "mark complete"}
            </button>
          </div>
        </div>

        <div className="grid gap-10 lg:grid-cols-12">
          <aside className="lg:col-span-3"><Toc active={active} accent={accent} /></aside>

          <article ref={artRef} className="lg:col-span-9">
            {/* hook */}
            {deep && (
              <section>
                <SecHead id="hook" icon="book" kicker="before the theory" title="In plain words" accent={accent} />
                <motion.blockquote initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6, ease }}
                  className="relative border border-line-2 bg-card p-6 pl-7 sm:p-7 sm:pl-8" style={{ borderRadius: 10, borderLeft: `4px solid ${accent}` }}>
                  <span className="absolute -top-4 left-6 border border-line-2 bg-panel px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.24em]" style={{ color: accent, borderRadius: 5 }}>
                    the 30-second version
                  </span>
                  <p className="text-[17px] leading-[1.75] text-ink">{deep.hook}</p>
                </motion.blockquote>
              </section>
            )}

            {/* core */}
            <section>
              <SecHead id="core" icon="chip" kicker="the full picture" title="The lesson" accent={accent} />
              {deep?.diagram && <Diagram name={deep.diagram} />}
              <div className="prose-lesson">
                {lesson.blocks.map((b, i) => <RenderBlock key={i} block={b} accent={accent} />)}
              </div>
            </section>

            {/* worked */}
            {deep && (
              <section>
                <SecHead id="worked" icon="terminal" kicker="follow along" title="Worked example" accent={accent} />
                <WorkedStepper title={deep.worked.title} steps={deep.worked.steps} accent={accent} />
              </section>
            )}

            {/* mistakes */}
            {deep && (
              <section>
                <SecHead id="mistakes" icon="bug" kicker="save yourself a week" title="Classic beginner mistakes" accent={accent} />
                <Mistakes items={deep.mistakes} accent={accent} />
              </section>
            )}

            {/* takeaways */}
            <section>
              <SecHead id="takeaways" icon="check" kicker="if you remember nothing else" title="Key takeaways" accent={accent} />
              <div className="grid gap-3 sm:grid-cols-2">
                {lesson.takeaways.map((t, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -14 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.45, delay: i * 0.07, ease }}
                    className="flex items-start gap-3 border border-line-2 bg-card px-4 py-3.5" style={{ borderRadius: 8 }}>
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center font-mono text-[11px] font-bold" style={{ background: `${accent}1f`, color: accent, borderRadius: 6 }}>
                      {i + 1}
                    </span>
                    <p className="text-[14px] leading-relaxed text-ink-2">{t}</p>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* faq */}
            {deep && (
              <section>
                <SecHead id="faq" icon="search" kicker="every beginner asks" title="FAQ" accent={accent} />
                <Faq items={deep.faq} />
              </section>
            )}

            {/* quiz */}
            <section>
              <SecHead id="quiz" icon="gauge" kicker="prove it stuck" title="Checkpoint quiz" accent={accent} />
              <Quiz id={lesson.id} questions={lesson.quiz} accent={accent} progress={progress} />
            </section>

            {/* labs */}
            <section>
              <SecHead id="labs" icon="flask" kicker="hands on keyboard" title="Lab bench" accent={accent} />
              <div className="space-y-3">
                {lesson.practice.map((p, i) => {
                  const ticked = labDone.includes(i);
                  return (
                    <button key={i} onClick={() => progress.togglePractice(lesson.id, i)}
                      className={`flex w-full items-start gap-4 border p-4 text-left transition-all ${ticked ? "border-pass/50 bg-pass/[0.07]" : "border-line-2 bg-card hover:border-ink-3"}`}
                      style={{ borderRadius: 9 }}>
                      <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center border transition-all ${ticked ? "border-pass bg-pass text-[#071008]" : "border-line-2 text-transparent"}`} style={{ borderRadius: 6 }}>
                        <Icon name="check" size={14} />
                      </span>
                      <span>
                        <span className="block font-mono text-[10.5px] uppercase tracking-[0.2em]" style={{ color: ticked ? "var(--color-pass)" : "var(--color-ink-3)" }}>
                          task {i + 1} {ticked && "· verified"}
                        </span>
                        <span className={`mt-1 block text-[14.5px] leading-relaxed ${ticked ? "text-ink-3 line-through decoration-pass/50" : "text-ink-2"}`}>{p}</span>
                      </span>
                    </button>
                  );
                })}
              </div>
              <p className="mt-4 font-mono text-[11.5px] text-ink-3">
                ▸ ticks persist in your browser — run these against a real model for maximum retention.
                <span className="ml-1 inline-block h-2 w-2 align-middle" style={{ background: accent }} />
              </p>
            </section>

            {/* prev / next */}
            <nav className="mt-16 grid gap-4 border-t border-line pt-8 sm:grid-cols-2">
              {prev ? (
                <button onClick={() => navigate(`/lesson/${prev.id}`)} className="group border border-line-2 bg-card p-5 text-left transition-all hover:-translate-y-0.5 hover:border-ink-3" style={{ borderRadius: 9 }}>
                  <span className="flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-3">
                    <Icon name="arrow" size={13} className="rotate-180" /> previous · lesson {String(prev.number).padStart(2, "0")}
                  </span>
                  <span className="mt-2 block font-display text-[16px] font-bold text-ink group-hover:text-glow">{prev.title}</span>
                </button>
              ) : <span />}
              {next && (
                <button onClick={() => navigate(`/lesson/${next.id}`)} className="group border p-5 text-right transition-all hover:-translate-y-0.5" style={{ borderRadius: 9, borderColor: `${next.accent}55`, background: next.accentSoft }}>
                  <span className="flex items-center justify-end gap-2 font-mono text-[10.5px] uppercase tracking-[0.2em] text-ink-3">
                    next · lesson {String(next.number).padStart(2, "0")} <Icon name="arrow" size={13} />
                  </span>
                  <span className="mt-2 block font-display text-[16px] font-bold text-ink group-hover:text-glow">{next.title}</span>
                </button>
              )}
            </nav>
          </article>
        </div>
      </div>
    </main>
  );
}
