import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { navigate, useCountUp, usePrefersReducedMotion, moduleProgress, FLAT, TOTAL, type Progress } from "../lib/store";
import { MODULES, TOTAL_QUIZ, TOTAL_PRACTICE, TOTAL_MINUTES, TOTAL_SECTIONS, START_HERE } from "../data";
import { FloatingGlyphs, Ticker } from "./chrome";
import { Diagram } from "./diagrams";
import { Icon } from "./ui";

const ease = [0.22, 1, 0.36, 1] as const;

/* ---------------- helpers ---------------- */

function Spotlight({ className, children }: { className?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect();
    if (!r) return;
    ref.current?.style.setProperty("--mx", `${e.clientX - r.left}px`);
    ref.current?.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return (
    <div ref={ref} onMouseMove={onMove} className={`card-spot border border-line-2 bg-card ${className ?? ""}`} style={{ borderRadius: 10 }}>
      {children}
    </div>
  );
}

function useScramble(text: string, delay = 500) {
  const reduced = usePrefersReducedMotion();
  const [out, setOut] = useState(reduced ? text : "");
  useEffect(() => {
    if (reduced) return;
    const chars = "▚▞#%&@$?!<>/\\*+=";
    let raf = 0;
    let start = 0;
    const dur = 900;
    const tick = (t: number) => {
      if (!start) start = t;
      const k = Math.max(0, Math.min(1, (t - start - delay) / dur));
      const shown = Math.floor(k * text.length);
      let s = text.slice(0, shown);
      for (let i = shown; i < text.length; i++) s += chars[Math.floor(Math.random() * chars.length)];
      setOut(s);
      if (k < 1) raf = requestAnimationFrame(tick);
      else setOut(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, delay, reduced]);
  return out;
}

function Reveal({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 26 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.7, delay, ease }}
    >
      {children}
    </motion.div>
  );
}

function SectionHead({ kicker, title, accent }: { kicker: string; title: React.ReactNode; accent: string }) {
  return (
    <Reveal className="mb-10">
      <p className="mb-3 flex items-center gap-3 font-mono text-[11px] font-semibold uppercase tracking-[0.28em]" style={{ color: accent }}>
        <span className="inline-block h-2 w-2 rotate-45" style={{ background: accent }} />
        {kicker}
      </p>
      <h2 className="font-display text-4xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-5xl">{title}</h2>
    </Reveal>
  );
}

/* ---------------- opening ---------------- */

function BootTerminal() {
  const LINES: { t: string; c: string }[] = [
    { t: "$ testbench run --suite ai-curriculum", c: "text-glow" },
    { t: "✓ module_1 · AI/ML Foundations ……… 32 lessons", c: "text-term/80" },
    { t: "✓ module_2 · LLM Foundations ………… 23 lessons", c: "text-term/80" },
    { t: "✓ module_3 · Prompt Engineering …… 22 lessons", c: "text-term/80" },
    { t: "✓ module_4 · LLM Benchmarks ………… 01 lesson", c: "text-glow" },
    { t: `▸ assertions: ${TOTAL_QUIZ} quiz · ${TOTAL_PRACTICE} lab tasks`, c: "text-term/60" },
    { t: "status: PASS — your move, tester_", c: "text-glow" },
  ];
  const reduced = usePrefersReducedMotion();
  const [n, setN] = useState(reduced ? LINES.length : 0);
  useEffect(() => {
    if (reduced) return;
    if (n >= LINES.length) return;
    const id = setTimeout(() => setN(n + 1), n === 0 ? 500 : 420);
    return () => clearTimeout(id);
  }, [n, reduced, LINES.length]);

  return (
    <div className="relative overflow-hidden border border-line-2 bg-panel shadow-press" style={{ borderRadius: 10 }}>
      <div className="flex items-center justify-between border-b border-line-2 px-4 py-2.5">
        <div className="flex items-center gap-2.5">
          <span className="flex gap-1.5">
            <i className="h-2.5 w-2.5 rounded-full bg-fail/80" />
            <i className="h-2.5 w-2.5 rounded-full bg-[#e8b93d]/80" />
            <i className="h-2.5 w-2.5 rounded-full bg-pass/80" />
          </span>
          <span className="font-mono text-[11px] text-term/45">testbench — curriculum runner</span>
        </div>
        <span className="font-mono text-[10px] uppercase tracking-widest text-glow/70">live</span>
      </div>
      <div className="relative h-56 px-4 py-3 font-mono text-[12.5px] leading-[1.9] sm:text-[13px]">
        <div className="pointer-events-none absolute left-0 h-16 w-full bg-gradient-to-b from-transparent via-glow/[0.04] to-transparent scanline" />
        {LINES.slice(0, n).map((l, i) => (
          <motion.p key={i} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.25 }} className={l.c}>
            {l.t}
          </motion.p>
        ))}
        {n >= LINES.length && <span className="cursor-blink text-glow">▮</span>}
      </div>
    </div>
  );
}

function Opening({ progress }: { progress: Progress }) {
  const scrambled = useScramble("think.", 900);
  const pct = Math.round((progress.completed.length / TOTAL) * 100);
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 grid-paper" />
      <div className="absolute inset-0 aurora" />
      <FloatingGlyphs />
      <div className="noise relative mx-auto max-w-7xl px-5 pb-20 pt-14 lg:px-8 lg:pt-20">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease }}
              className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.22em] text-ink-3"
            >
              <span>spec no. AI-CUR-078</span>
              <span className="text-line-2">|</span>
              <span>rev 2.1</span>
              <span className="text-line-2">|</span>
              <span className="flex items-center gap-2 text-glow">
                <span className="inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-glow" /> status: open for testing
              </span>
            </motion.p>

            <h1 className="font-display text-[13.5vw] font-extrabold leading-[0.94] tracking-tight text-ink sm:text-7xl lg:text-[5.4rem]">
              <span className="mask-line">
                <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.1, ease }}>
                  Teach your tests
                </motion.span>
              </span>
              <span className="mask-line">
                <motion.span initial={{ y: "110%" }} animate={{ y: 0 }} transition={{ duration: 0.8, delay: 0.22, ease }}>
                  to <span className="italic text-glow">{scrambled || "think."}</span>
                </motion.span>
              </span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.5, ease }}
              className="mt-7 max-w-xl text-[17px] leading-relaxed text-ink-2"
            >
              A <strong className="text-ink">78-lesson AI curriculum written for software testers</strong> — from “what even is a
              neuron” to regression-testing prompts in CI. Every lesson: plain-words theory, an interactive diagram, a worked
              example, the classic mistakes, and a quiz that proves it stuck.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65, ease }}
              className="mt-9 flex flex-wrap items-center gap-4"
            >
              <button
                onClick={() => navigate("/lesson/what-is-ai")}
                className="group flex items-center gap-3 border border-glow bg-glow px-6 py-3.5 font-mono text-[13px] font-bold uppercase tracking-[0.14em] text-[#071008] transition-all duration-300 hover:shadow-[0_0_38px_-6px_rgba(126,226,168,0.55)]"
                style={{ borderRadius: 8 }}
              >
                start lesson 01
                <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
              </button>
              <button
                onClick={() => navigate("/curriculum")}
                className="link-slide border border-line-2 px-6 py-3.5 font-mono text-[13px] font-semibold uppercase tracking-[0.14em] text-ink-2 transition-colors hover:text-ink"
                style={{ borderRadius: 8 }}
              >
                browse all 78
              </button>
              {pct > 0 && (
                <button onClick={() => navigate("/curriculum")} className="flex items-center gap-2 font-mono text-[12px] text-glow">
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-glow/40 bg-glow/10 text-[11px] tabular-nums">{pct}%</span>
                  resume where you left off
                </button>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.9 }}
              className="mt-10 flex flex-wrap gap-x-7 gap-y-3 font-mono text-[12px] text-ink-3"
            >
              {[
                ["78", "lessons"],
                ["4", "modules"],
                [String(TOTAL_QUIZ), "quiz questions"],
                [String(TOTAL_PRACTICE), "lab tasks"],
                [`~${Math.round(TOTAL_MINUTES / 60)}h`, "of reading"],
              ].map(([v, l]) => (
                <span key={l}>
                  <strong className="mr-1.5 text-[15px] text-ink">{v}</strong>
                  {l}
                </span>
              ))}
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.35, ease }}
            className="lg:col-span-5"
          >
            <BootTerminal />
            <div className="mt-4 flex items-center justify-between font-mono text-[11px] uppercase tracking-[0.18em] text-ink-3">
              <span>no accounts · no cookies</span>
              <span>progress lives in your browser</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

/* ---------------- module bento ---------------- */

const PATTERNS = ["zero-shot", "few-shot", "chain-of-thought", "ReAct", "reflexion", "tree-of-thought", "self-consistency", "critique-revise"];

function Cycler() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setI((x) => (x + 1) % PATTERNS.length), 1300);
    return () => clearInterval(id);
  }, []);
  return (
    <div className="relative h-9 overflow-hidden">
      {PATTERNS.map((p, k) => (
        <motion.span
          key={p}
          initial={false}
          animate={{ y: k === i ? 0 : k < i || (k === 0 && i > 0) ? -40 : 40, opacity: k === i ? 1 : 0 }}
          transition={{ duration: 0.45, ease }}
          className="absolute inset-0 flex items-center font-mono text-[13px] font-semibold text-m3"
        >
          ▸ {p}
        </motion.span>
      ))}
    </div>
  );
}

function ModuleBento({ progress }: { progress: Progress }) {
  const bars = [
    { label: "MMLU", v: 88, c: "var(--color-m4)" },
    { label: "HumanEval", v: 92, c: "var(--color-m4)" },
    { label: "your eval set", v: 71, c: "var(--color-glow)" },
  ];
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <SectionHead kicker="the syllabus" accent="var(--color-m2)" title={<>Four modules.<br />Zero hand-waving.</>} />
      <div className="grid gap-5 lg:grid-cols-12">
        {MODULES.map((m, idx) => {
          const p = moduleProgress(m, progress);
          const spans = ["lg:col-span-7", "lg:col-span-5", "lg:col-span-5", "lg:col-span-7"][idx];
          return (
            <Reveal key={m.code} delay={idx * 0.08} className={spans}>
              <button onClick={() => navigate("/curriculum")} className="block w-full text-left">
                <Spotlight className="group relative h-full p-7 transition-transform duration-300 hover:-translate-y-1 sm:p-8">
                  <div className="flex items-start justify-between">
                    <span className="text-outline font-display text-[76px] font-extrabold leading-none transition-colors duration-300" style={{ WebkitTextStrokeColor: `${m.accent}55` }}>
                      {m.num}
                    </span>
                    <span className="border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.2em]" style={{ borderColor: `${m.accent}66`, color: m.accent, borderRadius: 5 }}>
                      {m.tag}
                    </span>
                  </div>
                  <h3 className="mt-3 font-display text-[26px] font-bold leading-tight text-ink sm:text-3xl">{m.title}</h3>
                  <p className="mt-2.5 max-w-md text-[14.5px] leading-relaxed text-ink-2">{m.description}</p>

                  <div className="mt-6">
                    {idx === 0 && (
                      <div className="space-y-2">
                        {m.sections.map((s) => (
                          <div key={s.title} className="flex items-center justify-between font-mono text-[12px] text-ink-3">
                            <span className="truncate pr-4">{s.title}</span>
                            <span className="shrink-0 tabular-nums" style={{ color: m.accent }}>{s.lessons.length} lessons</span>
                          </div>
                        ))}
                      </div>
                    )}
                    {idx === 1 && (
                      <div className="flex flex-wrap gap-1.5">
                        {["How LLMs work", "Inference dials", "Tokens & cost", "Open-source", "Failure modes", "APIs", "Structured outputs"].map((t, i) => (
                          <motion.span key={t} initial={{ opacity: 0.35 }} whileInView={{ opacity: [0.35, 1, 0.35] }}
                            viewport={{ once: true }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3 }}
                            className="border border-line-2 bg-panel-2 px-2.5 py-1 font-mono text-[11px] text-ink-2" style={{ borderRadius: 5 }}>
                            {t}
                          </motion.span>
                        ))}
                      </div>
                    )}
                    {idx === 2 && (
                      <div>
                        <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.2em] text-ink-3">patterns you'll master</p>
                        <Cycler />
                        <p className="mt-3 font-mono text-[11px] text-ink-3">+ promptfoo CI gates & the five engineering disciplines</p>
                      </div>
                    )}
                    {idx === 3 && (
                      <div ref={ref} className="space-y-3">
                        {bars.map((b) => (
                          <div key={b.label}>
                            <div className="mb-1 flex justify-between font-mono text-[11px] text-ink-3">
                              <span>{b.label}</span><span className="tabular-nums" style={{ color: b.c }}>{b.v}%</span>
                            </div>
                            <div className="h-2 overflow-hidden bg-panel-2" style={{ borderRadius: 4 }}>
                              <motion.div initial={{ width: 0 }} animate={inView ? { width: `${b.v}%` } : {}}
                                transition={{ duration: 1.1, ease }} className="h-full" style={{ background: b.c, borderRadius: 4 }} />
                            </div>
                          </div>
                        ))}
                        <p className="font-mono text-[11px] text-ink-3">leaderboards lie. your eval set doesn't. lesson 78 shows why.</p>
                      </div>
                    )}
                  </div>

                  <div className="mt-7 flex items-center justify-between border-t border-line pt-4">
                    <span className="font-mono text-[12px] tabular-nums text-ink-3">
                      {p.done}/{p.total} complete
                    </span>
                    <div className="h-1.5 w-36 overflow-hidden bg-panel-2" style={{ borderRadius: 4 }}>
                      <motion.div initial={{ width: 0 }} whileInView={{ width: `${p.pct}%` }} viewport={{ once: true }}
                        transition={{ duration: 1, ease }} className="h-full" style={{ background: m.accent, borderRadius: 4 }} />
                    </div>
                  </div>
                </Spotlight>
              </button>
            </Reveal>
          );
        })}
      </div>
    </section>
  );
}

/* ---------------- diagram wall ---------------- */

function DiagramWall() {
  return (
    <section className="relative border-y border-line bg-panel-2/60 py-24">
      <div className="absolute inset-0 grid-paper opacity-60" />
      <div className="relative mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHead kicker="learn by seeing" accent="var(--color-glow)" title={<>Every abstraction gets<br />a diagram you can <span className="italic text-glow">poke.</span></>} />
        <div className="grid gap-6 xl:grid-cols-3">
          {[
            { n: "temperature" as const, t: "Sampling, live", d: "Slide the temperature, watch the distribution flatten, sample tokens yourself." },
            { n: "confusion" as const, t: "Metrics, demystified", d: "Drag TP/FP/FN/TN and watch precision and recall fight while accuracy shrugs." },
            { n: "context" as const, t: "The window budget", d: "Stuff history and docs until it overflows — then watch what truncation does." },
          ].map((x, i) => (
            <Reveal key={x.n} delay={i * 0.1}>
              <Spotlight className="h-full p-5">
                <p className="mb-1 font-mono text-[11px] uppercase tracking-[0.22em]" style={{ color: "var(--color-glow)" }}>{x.t}</p>
                <h3 className="mb-2 font-display text-lg font-bold text-ink">{x.d}</h3>
                <Diagram name={x.n} />
              </Spotlight>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- study loop ---------------- */

const LOOP = [
  { k: "01", t: "Read", d: "Plain-words theory with analogies that stick — no math gatekeeping.", c: "var(--color-m1)" },
  { k: "02", t: "Run", d: "Poke the diagram, follow the worked example step by step.", c: "var(--color-m2)" },
  { k: "03", t: "Prove", d: "Pass the quiz, tick the lab tasks, earn the green check.", c: "var(--color-m3)" },
  { k: "04", t: "Repeat", d: "78 lessons later, you speak fluent model — and you can prove it.", c: "var(--color-glow)" },
];

/* ---------------- anatomy: what's inside every lesson ---------------- */

const ANATOMY = [
  { icon: "book", title: "“In short” — zero jargon", desc: "Every lesson opens with the whole idea in one plain-English line, before any theory.", stat: "78 intros" },
  { icon: "chip", title: "Diagrams you can poke", desc: "Token streams, neural nets, attention heatmaps — interactive, not screenshots.", stat: "8 interactives" },
  { icon: "layers", title: "Remember it in order", desc: "The lesson's three key ideas as an animated flow — beats, not bullet points.", stat: "78 flows" },
  { icon: "target", title: "Picture this · desi edition", desc: "Every concept re-told with Swiggy, IRCTC tatkal, UPI, IPL and your chai break.", stat: "78 real-life scenes" },
  { icon: "terminal", title: "Try it live", desc: "A simulated console types a real command and streams real-looking output as you watch.", stat: "78 consoles" },
  { icon: "gauge", title: "Prove it stuck", desc: "Checkpoint quiz with PASS/partial/FAIL, explanations, confetti — and a lab bench to run.", stat: `${TOTAL_QUIZ} questions · ${TOTAL_PRACTICE} lab tasks` },
];

function AnatomyBand() {
  return (
    <section className="relative border-y border-line bg-panel-2/40 py-24">
      <div className="absolute inset-0 grid-paper opacity-40" />
      <div className="relative mx-auto grid max-w-7xl gap-14 px-5 lg:grid-cols-12 lg:px-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-28">
            <SectionHead kicker="inside every lesson" accent="var(--color-glow)" title={<>Never just<br />a wall of text.</>} />
            <motion.p
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, ease }}
              className="mt-5 max-w-md text-[16px] leading-relaxed text-ink-2"
            >
              Each of the 78 lessons is a small workshop: you read it in easy English, watch it move,
              relate it to your daily life, run a real command — then prove you got it. Six living
              parts, every single lesson.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 14 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55, delay: 0.1, ease }}
              className="mt-7 flex flex-wrap gap-2.5"
            >
              {["78 × 6 parts", "470+ interactive moments", "0 walls of text"].map((t) => (
                <span key={t} className="border border-line-2 bg-card px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-2" style={{ borderRadius: 6 }}>
                  {t}
                </span>
              ))}
            </motion.div>
            <motion.button
              initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 0.2 }}
              onClick={() => navigate("/lesson/what-is-ai")}
              className="link-slide mt-8 flex items-center gap-2 font-mono text-[13px] font-semibold text-glow"
            >
              see all six in lesson 01 <Icon name="arrow" size={15} />
            </motion.button>
          </div>
        </div>
        <div className="relative lg:col-span-7">
          <span className="absolute left-[21px] top-2 bottom-2 hidden w-px sm:block" aria-hidden="true">
            <svg width="2" height="100%" preserveAspectRatio="none">
              <line x1="1" y1="0" x2="1" y2="100%" stroke="var(--color-line-2)" strokeWidth="2" className="dash-flow" />
            </svg>
          </span>
          <ul className="space-y-4">
            {ANATOMY.map((a, i) => (
              <motion.li
                key={a.title}
                initial={{ opacity: 0, x: 26 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-40px" }}
                transition={{ duration: 0.55, delay: i * 0.07, ease }}
                className="group relative flex items-start gap-5 rounded-lg border border-line-2 bg-card p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-glow/50 hover:shadow-press-sm sm:p-6"
              >
                <span className="relative z-10 grid h-11 w-11 shrink-0 place-items-center rounded-md border border-line-2 bg-panel text-glow transition-all duration-300 group-hover:border-glow group-hover:shadow-[0_0_18px_-2px_rgba(126,226,168,0.5)]">
                  <Icon name={a.icon} size={19} />
                </span>
                <div className="min-w-0">
                  <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                    <span className="font-mono text-[11px] font-bold text-ink-3">0{i + 1}</span>
                    <span className="font-display text-[18px] font-bold text-ink transition-colors group-hover:text-glow">{a.title}</span>
                  </p>
                  <p className="mt-1 text-[14.5px] leading-relaxed text-ink-2">{a.desc}</p>
                  <p className="mt-2 font-mono text-[10.5px] uppercase tracking-[0.18em] text-glow/80">{a.stat}</p>
                </div>
              </motion.li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function StudyLoop() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <SectionHead kicker="the method" accent="var(--color-m1)" title={<>A study loop with<br />a pass condition.</>} />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-4">
        {LOOP.map((s, i) => (
          <Reveal key={s.k} delay={i * 0.1}>
            <div className="group relative h-full border border-line-2 bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-glow/40" style={{ borderRadius: 10 }}>
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] font-bold" style={{ color: s.c }}>{s.k}</span>
                <svg width="26" height="10" className="opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                  <line x1="0" y1="5" x2="19" y2="5" stroke={s.c} strokeWidth="2" className="dash-flow" />
                  <path d="M19 1 L26 5 L19 9" fill="none" stroke={s.c} strokeWidth="2" />
                </svg>
              </div>
              <h3 className="mt-5 font-display text-2xl font-bold text-ink">{s.t}</h3>
              <p className="mt-2 text-[14.5px] leading-relaxed text-ink-2">{s.d}</p>
              <div className="mt-5 h-1 w-8 transition-all duration-500 group-hover:w-full" style={{ background: s.c, borderRadius: 2 }} />
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}

/* ---------------- translation grid ---------------- */

const TRANSLATE: [string, string][] = [
  ["flaky test", "output variance across N samples"],
  ["test oracle", "eval set + LLM judge rubric"],
  ["regression suite", "promptfoo battery in CI"],
  ["boundary value", "adversarial prompt & context overflow"],
  ["exploratory testing", "red-teaming & prompt injection probes"],
  ["bug triage", "failure-mode taxonomy: hallucination, context rot…"],
  ["test environment", "sandboxed model endpoint + local Ollama"],
  ["release sign-off", "eval score diff vs baseline"],
];

function Translation() {
  return (
    <section className="relative mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <SectionHead kicker="good news" accent="var(--color-m3)" title={<>You already speak<br />this language.</>} />
      <Reveal>
        <div className="overflow-hidden border border-line-2" style={{ borderRadius: 10 }}>
          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 border-b border-line-2 bg-panel px-5 py-3.5 font-mono text-[11px] uppercase tracking-[0.2em] text-term/50 sm:gap-6 sm:px-7">
            <span>classic QA says</span><span /><span className="text-right">AI-era QA means</span>
          </div>
          {TRANSLATE.map(([a, b], i) => (
            <div key={a} className={`group grid grid-cols-[1fr_auto_1fr] items-center gap-3 px-5 py-4 transition-colors hover:bg-card sm:gap-6 sm:px-7 ${i % 2 ? "bg-card/40" : ""}`}>
              <span className="font-mono text-[13px] text-ink-2 sm:text-[14px]">{a}</span>
              <svg width="34" height="12" className="shrink-0">
                <line x1="0" y1="6" x2="26" y2="6" stroke="var(--color-m3)" strokeWidth="2" className="dash-flow opacity-40 transition-opacity group-hover:opacity-100" />
                <path d="M26 2 L33 6 L26 10" fill="none" stroke="var(--color-m3)" strokeWidth="2" className="opacity-40 transition-opacity group-hover:opacity-100" />
              </svg>
              <span className="text-right font-display text-[15px] font-semibold text-ink sm:text-[16px]">{b}</span>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- warm-up track ---------------- */

function Warmup() {
  return (
    <section className="relative border-y border-line bg-panel-2/60 py-24">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <SectionHead kicker="start here" accent="var(--color-m4)" title={<>The 6-lesson<br />warm-up lap.</>} />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {START_HERE.map((id, i) => {
            const l = FLAT.find((x) => x.id === id);
            if (!l) return null;
            return (
              <Reveal key={id} delay={i * 0.07}>
                <button onClick={() => navigate(`/lesson/${id}`)} className="group block w-full text-left">
                  <Spotlight className="flex h-full items-center gap-5 p-5 transition-transform duration-300 hover:-translate-y-1">
                    <span className="grid h-12 w-12 shrink-0 place-items-center border font-display text-lg font-extrabold transition-transform duration-300 group-hover:-rotate-6"
                      style={{ borderColor: l.accent, color: l.accent, borderRadius: 8 }}>
                      {String(l.number).padStart(2, "0")}
                    </span>
                    <span>
                      <span className="block font-display text-[17px] font-bold leading-snug text-ink">{l.title}</span>
                      <span className="mt-1 block font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">
                        {l.moduleCode} · {l.minutes} min · {l.quiz.length} quiz
                      </span>
                    </span>
                    <span className="ml-auto text-ink-3 transition-all duration-300 group-hover:translate-x-1 group-hover:text-glow">→</span>
                  </Spotlight>
                </button>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------- stats + CTA ---------------- */

function Stat({ v, suffix, label, color }: { v: number; suffix?: string; label: string; color: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });
  const n = useCountUp(v, inView);
  return (
    <div ref={ref} className="border-l-2 py-2 pl-5" style={{ borderColor: color }}>
      <div className="font-display text-5xl font-extrabold tabular-nums tracking-tight text-ink sm:text-6xl">
        {n}{suffix}
      </div>
      <div className="mt-2 font-mono text-[11.5px] uppercase tracking-[0.2em] text-ink-3">{label}</div>
    </div>
  );
}

function StatsBand() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 lg:px-8">
      <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
        <Stat v={78} label="lessons, written fresh" color="var(--color-m1)" />
        <Stat v={TOTAL_SECTIONS} label="sections · 4 modules" color="var(--color-m2)" />
        <Stat v={TOTAL_QUIZ} label="quiz questions with explanations" color="var(--color-m3)" />
        <Stat v={TOTAL_PRACTICE} label="hands-on lab tasks" color="var(--color-m4)" />
        <Stat v={Math.round(TOTAL_MINUTES / 60)} suffix="h" label="of focused reading" color="var(--color-glow)" />
        <Stat v={8} label="interactive diagrams" color="var(--color-m1)" />
      </div>
    </section>
  );
}

function CtaBanner() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 aurora" />
      <div className="absolute inset-0 grid-paper" />
      <div className="noise relative mx-auto max-w-7xl px-5 py-28 text-center lg:px-8">
        <Reveal>
          <p className="mb-5 font-mono text-[11px] uppercase tracking-[0.3em] text-glow">final assertion</p>
          <h2 className="mx-auto max-w-4xl font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-ink sm:text-7xl">
            The models ship weekly.
            <br />
            <span className="italic text-glow">Your tests should too.</span>
          </h2>
          <button
            onClick={() => navigate("/lesson/what-is-ai")}
            className="group mt-10 inline-flex items-center gap-3 border border-glow bg-glow px-8 py-4 font-mono text-[13px] font-bold uppercase tracking-[0.16em] text-[#071008] transition-all duration-300 hover:shadow-[0_0_50px_-8px_rgba(126,226,168,0.65)]"
            style={{ borderRadius: 8 }}
          >
            open lesson 01 — it's 6 minutes
            <span className="transition-transform duration-300 group-hover:translate-x-1.5">→</span>
          </button>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- page ---------------- */

export function HomePage({ progress }: { progress: Progress }) {
  return (
    <main>
      <Opening progress={progress} />
      <Ticker />
      <ModuleBento progress={progress} />
      <DiagramWall />
      <AnatomyBand />
      <StudyLoop />
      <Translation />
      <Warmup />
      <StatsBand />
      <CtaBanner />
    </main>
  );
}
