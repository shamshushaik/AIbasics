import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { MODULES, TOTAL_MINUTES, TOTAL_QUIZ, TOTAL_PRACTICE, TOTAL_SECTIONS, START_HERE } from "../data";
import {
  FLAT,
  TOTAL,
  getLesson,
  moduleProgress,
  navigate,
  usePrefersReducedMotion,
  useCountUp,
  type Progress,
} from "../lib/store";
import { Badge, Icon, Kicker, Bar, Reveal, Ring } from "./ui";
import { FloatingGlyphs, Ticker } from "./chrome";

/* ---------------- scramble headline (animejs) ---------------- */

const POOL = "▮▯01<>/#*≠±λ";

function ScrambleLine({ text, delay = 0 }: { text: string; delay?: number }) {
  const [out, setOut] = useState(text);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced) {
      setOut(text);
      return;
    }
    const obj = { p: 0 };
    let raf = 0;
    const t0 = performance.now() + delay;
    const tick = (t: number) => {
      const k = Math.max(0, Math.min(1, (t - t0) / 900));
      if (k > 0) {
        const settled = Math.floor(k * text.length);
        let s = text.slice(0, settled);
        for (let i = settled; i < text.length; i++) {
          s += text[i] === " " ? " " : POOL[Math.floor(Math.random() * POOL.length)];
        }
        setOut(s);
      }
      if (k < 1) raf = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf = requestAnimationFrame(tick);
    void obj;
    return () => cancelAnimationFrame(raf);
  }, [text, delay, reduced]);
  return <span className="tabular-nums">{out}</span>;
}

/* ---------------- boot terminal ---------------- */

const BOOT_LINES: { t: string; c: string }[] = [
  { t: "$ testbench run --suite ai-curriculum", c: "text-term" },
  { t: "▸ loading syllabus ……… 78 specs found", c: "text-term/70" },
  { t: "✓ module_1 · AI/ML Foundations ………… 32 lessons", c: "text-glow" },
  { t: "✓ module_2 · LLM Foundations ………… 23 lessons", c: "text-glow" },
  { t: "✓ module_3 · Advanced Prompting ……… 22 lessons", c: "text-glow" },
  { t: "✓ module_4 · LLM Benchmarks ………… 01 lesson", c: "text-glow" },
  { t: `▸ assertions: ${TOTAL_QUIZ} quiz · ${TOTAL_PRACTICE} lab tasks`, c: "text-term/70" },
  { t: "▸ oracle: you. happy testing.", c: "text-[#e8b93d]" },
  { t: "PASS (0.42s) — ready for self-study ▮", c: "text-glow font-semibold" },
];

function Terminal({ progress }: { progress: Progress }) {
  const [lines, setLines] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setLines((l) => (l >= BOOT_LINES.length ? l : l + 1)), 330);
    return () => clearInterval(id);
  }, []);
  const done = progress.completed.length;
  return (
    <div className="relative overflow-hidden border-2 border-ink bg-panel text-left shadow-press" style={{ borderRadius: 10 }}>
      <div className="scanline pointer-events-none absolute left-0 h-10 w-full bg-gradient-to-b from-transparent via-glow/8 to-transparent" />
      <div className="flex items-center justify-between border-b border-panel-2 px-4 py-2.5">
        <div className="flex gap-1.5">
          <i className="h-3 w-3 rounded-full bg-fail" />
          <i className="h-3 w-3 rounded-full bg-[#e8b93d]" />
          <i className="h-3 w-3 rounded-full bg-pass" />
        </div>
        <span className="font-mono text-[11px] tracking-[0.18em] text-term/40">qa@bench: ~/curriculum</span>
        <span className="font-mono text-[11px] text-glow">● live</span>
      </div>
      <div className="min-h-[264px] p-4 font-mono text-[12.5px] leading-[1.9] sm:text-[13px]">
        {BOOT_LINES.slice(0, lines).map((l, i) => (
          <motion.p key={i} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className={l.c}>
            {l.t}
          </motion.p>
        ))}
        {lines >= BOOT_LINES.length && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-3 border-t border-panel-2 pt-3">
            <p className="text-term/70">
              $ progress --mine{" "}
              <span className="text-glow font-semibold">
                {done}/{TOTAL} lessons · {Math.round((done / TOTAL) * 100)}%
              </span>
            </p>
            <p className="text-term/50">
              {done === 0 ? "no runs yet — lesson 01 awaits" : done === TOTAL ? "all specs passing. ship yourself. 🎉" : "keep the streak alive ▸"}
              <span className="cursor-blink text-glow">▮</span>
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

/* ---------------- module rows ---------------- */

function ModuleRow({ m, i, progress }: { m: (typeof MODULES)[number]; i: number; progress: Progress }) {
  const p = moduleProgress(m, progress);
  const lessons = m.sections.reduce((a, s) => a + s.lessons.length, 0);
  return (
    <Reveal delay={i * 0.07}>
      <button
        onClick={() => navigate(`/curriculum?m=${m.num}`)}
        className="group relative grid w-full grid-cols-[auto_1fr] items-center gap-x-6 gap-y-3 border-t-2 border-ink py-7 text-left transition-colors hover:bg-card sm:grid-cols-[90px_1fr_auto] lg:gap-x-10"
      >
        <span
          className="pointer-events-none absolute left-0 top-0 h-full w-[5px] origin-top scale-y-0 transition-transform duration-300 group-hover:scale-y-100"
          style={{ background: m.accent }}
        />
        <span className="font-display text-[52px] font-extrabold leading-none text-outline transition-colors duration-300 sm:text-[68px]" style={{ ["--o" as string]: m.accent }}>
          <span className="group-hover:text-ink/10">{m.code}</span>
        </span>
        <span className="min-w-0">
          <span className="flex flex-wrap items-center gap-3">
            <span className="font-display text-[22px] font-bold tracking-tight text-ink sm:text-[26px] group-hover:translate-x-1 transition-transform duration-300 inline-block">
              {m.title}
            </span>
            <Badge color={m.accent} soft={m.accentSoft}>{m.tag}</Badge>
          </span>
          <span className="mt-2 block max-w-2xl text-[15px] leading-relaxed text-ink-2">{m.description}</span>
          <span className="mt-4 flex max-w-xl items-center gap-4">
            <span className="w-full max-w-[260px]"><Bar pct={p.pct} color={m.accent} h={5} /></span>
            <span className="whitespace-nowrap font-mono text-[12px] font-semibold tabular-nums" style={{ color: m.accent }}>
              {p.done}/{p.total} done
            </span>
          </span>
        </span>
        <span className="col-span-2 flex items-center justify-between gap-6 sm:col-span-1 sm:flex-col sm:items-end sm:gap-3">
          <span className="font-mono text-[12px] uppercase tracking-[0.16em] text-ink-3">{lessons} lessons</span>
          <span
            className="grid h-11 w-11 place-items-center border-2 border-ink text-ink transition-all duration-300 group-hover:translate-x-1 group-hover:bg-ink group-hover:text-paper"
            style={{ borderRadius: 8 }}
          >
            <Icon name="arrow" size={18} />
          </span>
        </span>
      </button>
    </Reveal>
  );
}

/* ---------------- stats band ---------------- */

function StatBand() {
  const [on, setOn] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ob = new IntersectionObserver(([e]) => e.isIntersecting && setOn(true), { threshold: 0.3 });
    ob.observe(el);
    return () => ob.disconnect();
  }, []);
  const lessons = useCountUp(TOTAL, on);
  const sections = useCountUp(TOTAL_SECTIONS, on);
  const quizzes = useCountUp(TOTAL_QUIZ, on);
  const labs = useCountUp(TOTAL_PRACTICE, on);
  const hours = useCountUp(Math.round(TOTAL_MINUTES / 6) / 10, on);
  const stats = [
    { v: String(lessons).padStart(2, "0"), l: "lessons, freshly written", c: "var(--color-m1)" },
    { v: String(sections).padStart(2, "0"), l: "sections across 4 modules", c: "var(--color-m2)" },
    { v: String(quizzes), l: "quiz questions with explanations", c: "var(--color-m3)" },
    { v: String(labs), l: "hands-on lab tasks for testers", c: "var(--color-m4)" },
    { v: `~${hours}h`, l: "of focused reading time", c: "var(--color-pass)" },
  ];
  return (
    <div ref={ref} className="border-y-2 border-ink bg-panel">
      <div className="grid-paper-dark mx-auto grid max-w-7xl grid-cols-2 gap-x-6 gap-y-10 px-5 py-14 sm:grid-cols-3 lg:grid-cols-5 lg:px-8">
        {stats.map((s, i) => (
          <div key={i}>
            <p className="font-display text-[44px] font-extrabold leading-none tracking-tight" style={{ color: s.c }}>
              {s.v}
            </p>
            <p className="mt-2 font-mono text-[11.5px] uppercase tracking-[0.14em] text-term/50">{s.l}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ---------------- how it works (sticky two-column) ---------------- */

const STEPS = [
  {
    n: "01",
    icon: "book",
    color: "var(--color-m1)",
    t: "Read the lesson",
    d: "Each of the 78 lessons is written fresh for testers — plain language, real numbers, tables and code you can run. Every lesson carries a 'Tester's angle' callout that translates the concept into QA terms.",
  },
  {
    n: "02",
    icon: "flask",
    color: "var(--color-m2)",
    t: "Run the lab tasks",
    d: "Theory evaporates; muscle memory stays. Each lesson ends with hands-on tasks — fuzz a tokenizer, measure variance across 15 runs, compute PSI on a drifted column. Check them off as you go; your ticks persist.",
  },
  {
    n: "03",
    icon: "target",
    color: "var(--color-m3)",
    t: "Prove it with the quiz",
    d: "Two scored questions per lesson, with instant feedback and an explanation for every answer. Scores are recorded — beat your best anytime. 156 questions across the curriculum.",
  },
  {
    n: "04",
    icon: "loop",
    color: "var(--color-m4)",
    t: "Track & repeat",
    d: "Mark lessons complete, watch module bars fill, and let the prev/next rail carry you through all 78. Everything lives in your browser — close the tab, resume next week, same seat.",
  },
];

function HowItWorks() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <div className="lg:sticky lg:top-28 lg:self-start">
          <Reveal>
            <Kicker>[ study loop ]</Kicker>
            <h2 className="font-display text-4xl font-extrabold leading-[1.05] tracking-tight sm:text-5xl">
              Read. Run.
              <br />
              Prove. <span className="text-m3">Repeat.</span>
            </h2>
            <p className="mt-5 max-w-md text-[16px] leading-relaxed text-ink-2">
              This isn't a video course you half-watch. It's a manual with an exam attached — built the way you'd
              build a regression suite: specification first, evidence after.
            </p>
            <div className="mt-8 flex items-center gap-3 border border-ink/15 bg-card p-4" style={{ borderRadius: 8 }}>
              <span className="grid h-10 w-10 shrink-0 place-items-center bg-ink text-glow" style={{ borderRadius: 7 }}>
                <Icon name="shield" size={20} />
              </span>
              <p className="font-mono text-[12px] leading-relaxed text-ink-2">
                progress, quiz scores & lab ticks persist locally.<br />no account. no cloud. no judgment.
              </p>
            </div>
          </Reveal>
        </div>
        <div>
          {STEPS.map((s, i) => (
            <Reveal key={s.n} delay={i * 0.06}>
              <div className="group relative border-t-2 border-ink py-8 pl-20 transition-colors sm:pl-24">
                <span
                  className="absolute left-0 top-8 grid h-13 w-13 place-items-center border-2 border-ink bg-paper transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-press-sm"
                  style={{ borderRadius: 10, height: 52, width: 52, color: s.color }}
                >
                  <Icon name={s.icon} size={24} />
                </span>
                <p className="font-mono text-[12px] font-bold tracking-[0.2em]" style={{ color: s.color }}>
                  STEP {s.n}
                </p>
                <h3 className="mt-1.5 font-display text-[26px] font-bold tracking-tight">{s.t}</h3>
                <p className="mt-2.5 max-w-xl text-[15.5px] leading-relaxed text-ink-2">{s.d}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- tester's translation ---------------- */

const MAPS = [
  { a: "Flaky test", b: "Output variance", note: "same prompt, N runs, pass-rate assertion" },
  { a: "Test oracle", b: "Eval battery", note: "promptfoo assertions replace eyeballing" },
  { a: "Regression suite", b: "Prompt versioning + CI evals", note: "a prompt diff that drops scores fails the build" },
  { a: "Prod monitoring", b: "Drift detection", note: "PSI alerts when inputs stop looking like training" },
  { a: "State-transition test", b: "Agent trace assertions", note: "every tool call schema-valid, loop capped" },
  { a: "Boundary values", b: "Near-miss few-shot pairs", note: "the hard cases teach the category line" },
];

function Translation() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
      <Reveal>
        <Kicker color="var(--color-m2)">[ speak both languages ]</Kicker>
        <h2 className="max-w-2xl font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
          You already know this. <span className="text-m2">It just changed names.</span>
        </h2>
      </Reveal>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MAPS.map((m, i) => (
          <Reveal key={m.a} delay={i * 0.05}>
            <div className="group h-full border border-ink/15 bg-card p-5 transition-all duration-300 hover:-translate-y-1 hover:border-ink hover:shadow-press-sm" style={{ borderRadius: 8 }}>
              <p className="font-mono text-[12px] font-semibold uppercase tracking-[0.14em] text-ink-3">{m.a}</p>
              <p className="mt-2 flex items-center gap-2 font-display text-[19px] font-bold text-ink">
                <span className="text-m2">→</span> {m.b}
              </p>
              <p className="mt-2 text-[13.5px] leading-relaxed text-ink-2">{m.note}</p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- start-here track ---------------- */

function StartHere({ progress }: { progress: Progress }) {
  return (
    <section className="mx-auto max-w-7xl px-5 pb-8 pt-4 lg:px-8">
      <Reveal>
        <div className="border-2 border-ink bg-ink p-7 text-paper sm:p-10" style={{ borderRadius: 12 }}>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="font-mono text-[12px] font-semibold tracking-[0.22em] text-glow uppercase">[ warm-up track ]</p>
              <h2 className="mt-2 font-display text-3xl font-extrabold tracking-tight sm:text-4xl">
                Short on time? Six lessons, ~40 minutes.
              </h2>
              <p className="mt-2 max-w-xl text-[15px] text-paper/70">
                The minimum viable AI-tester: what AI is, how LLMs actually work, the dials you can turn, your first
                prompt pattern, and how to read a benchmark without being sold.
              </p>
            </div>
            <div className="flex items-center gap-4">
              <Ring pct={Math.round((START_HERE.filter((id) => progress.completed.includes(id)).length / START_HERE.length) * 100)} color="var(--color-glow)" size={64} />
              <button
                onClick={() => navigate(`/lesson/${START_HERE[0]}`)}
                className="group flex items-center gap-3 border-2 border-glow bg-transparent px-5 py-3 font-mono text-[13px] font-bold uppercase tracking-[0.14em] text-glow transition-all hover:bg-glow hover:text-ink"
                style={{ borderRadius: 8 }}
              >
                start track
                <span className="transition-transform group-hover:translate-x-1"><Icon name="arrow" size={16} /></span>
              </button>
            </div>
          </div>
          <div className="mt-8 grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
            {START_HERE.map((id, i) => {
              const l = getLesson(id)!;
              const done = progress.completed.includes(id);
              return (
                <button
                  key={id}
                  onClick={() => navigate(`/lesson/${id}`)}
                  className="group flex items-center gap-3 border border-paper/15 px-4 py-3 text-left transition-all hover:border-glow/60 hover:bg-paper/5"
                  style={{ borderRadius: 7 }}
                >
                  <span className={`grid h-7 w-7 shrink-0 place-items-center border font-mono text-[11px] font-bold ${done ? "border-glow bg-glow text-ink" : "border-paper/30 text-paper/60"}`} style={{ borderRadius: 6 }}>
                    {done ? <Icon name="check" size={13} /> : i + 1}
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[14px] font-semibold">{l.title}</span>
                    <span className="font-mono text-[11px] text-paper/45">lesson {String(l.number).padStart(2, "0")} · {l.minutes} min</span>
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- page ---------------- */

export function HomePage({ progress }: { progress: Progress }) {
  return (
    <main>
      {/* opening spec sheet */}
      <section className="relative overflow-hidden border-b-2 border-ink">
        <div className="grid-paper noise absolute inset-0" />
        <FloatingGlyphs />
        <div className="relative mx-auto max-w-7xl px-5 pb-16 pt-10 lg:px-8 lg:pb-24 lg:pt-14">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-[11.5px] uppercase tracking-[0.2em] text-ink-3"
          >
            <span>doc no. AI-CUR-078</span><span className="text-m1">■</span>
            <span>rev 2.1 · 2026</span><span className="text-m2">■</span>
            <span>classification: self-study</span><span className="text-m3">■</span>
            <span className="flex items-center gap-1.5 text-pass"><span className="inline-block h-2 w-2 animate-pulse rounded-full bg-pass" />open for testing</span>
          </motion.div>

          <div className="grid items-start gap-12 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)]">
            <div>
              <h1 className="font-display font-extrabold leading-[0.98] tracking-[-0.02em]">
                <span className="block text-[44px] sm:text-[64px] lg:text-[76px]">
                  <ScrambleLine text="Learn AI the way" />
                </span>
                <span className="block text-[44px] text-m1 sm:text-[64px] lg:text-[76px]">
                  <ScrambleLine text="a tester learns." delay={250} />
                </span>
              </h1>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.6 }}
                className="mt-6 max-w-xl text-[17px] leading-relaxed text-ink-2"
              >
                A <strong className="text-ink">78-lesson curriculum</strong> covering AI/ML foundations, LLM internals
                and advanced prompting — every lesson written fresh, with a tester's angle, lab tasks to run and a
                quiz to prove it. No fluff, no vibes. <strong className="text-ink">Evals over vibes.</strong>
              </motion.p>
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9, duration: 0.5 }}
                className="mt-8 flex flex-wrap items-center gap-4"
              >
                <button
                  onClick={() => navigate("/lesson/what-is-ai")}
                  className="group flex items-center gap-3 border-2 border-ink bg-ink px-6 py-3.5 font-mono text-[13px] font-bold uppercase tracking-[0.14em] text-paper transition-all hover:-translate-y-0.5 hover:shadow-press"
                  style={{ borderRadius: 8 }}
                >
                  <Icon name="terminal" size={17} />
                  open lesson 01
                  <span className="transition-transform group-hover:translate-x-1"><Icon name="arrow" size={15} /></span>
                </button>
                <button
                  onClick={() => navigate("/curriculum")}
                  className="link-slide font-mono text-[13px] font-bold uppercase tracking-[0.14em] text-ink"
                >
                  browse all 78 specs ↓
                </button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.1 }}
                className="mt-10 flex flex-wrap gap-2.5"
              >
                {MODULES.map((m) => (
                  <Badge key={m.code} color={m.accent} soft={m.accentSoft}>
                    {m.code} · {m.tag}
                  </Badge>
                ))}
              </motion.div>
            </div>
            <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4, duration: 0.7 }}>
              <Terminal progress={progress} />
              <p className="mt-3 text-right font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
                fig. 0 — the curriculum, as a test run
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <Ticker />

      {/* module map */}
      <section className="mx-auto max-w-7xl px-5 py-20 lg:px-8">
        <Reveal>
          <div className="mb-4 flex flex-wrap items-end justify-between gap-6">
            <div>
              <Kicker color="var(--color-m1)">[ the syllabus ]</Kicker>
              <h2 className="font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                Four modules. <span className="text-m1">One ladder.</span>
              </h2>
            </div>
            <p className="max-w-sm text-[15px] leading-relaxed text-ink-2">
              Start at the bedrock, climb into the black box, master the craft, then learn to read the scoreboard.
            </p>
          </div>
        </Reveal>
        <div className="border-b-2 border-ink">
          {MODULES.map((m, i) => (
            <ModuleRow key={m.code} m={m} i={i} progress={progress} />
          ))}
        </div>
      </section>

      <StatBand />
      <HowItWorks />

      <div className="border-t-2 border-ink">
        <Translation />
      </div>

      <StartHere progress={progress} />
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <Reveal>
          <p className="border border-dashed border-ink/25 bg-card/60 px-5 py-4 text-center font-mono text-[12.5px] tracking-wide text-ink-3" style={{ borderRadius: 8 }}>
            ⌘ curriculum trivia — {FLAT.length} lessons, {TOTAL_QUIZ} quiz questions, {TOTAL_PRACTICE} lab tasks, {TOTAL_MINUTES} minutes of reading. all of it free, all of it yours.
          </p>
        </Reveal>
      </div>
    </main>
  );
}
