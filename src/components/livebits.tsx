import { useCallback, useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import type { LiveExample } from "../data/live";
import type { Desi } from "../data/desi";

/* ---------------- tiny custom icons ---------------- */

function ChaiIcon({ size = 20 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4.5 10h11.5v4.5a5 5 0 0 1-5 5h-1.5a5 5 0 0 1-5-5z" />
      <path d="M16 11h1.6a2.4 2.4 0 0 1 0 4.8H16" />
      <path d="M8 3.5c0 1.3 1.1 1.4 1.1 2.7M11.6 3.5c0 1.3 1.1 1.4 1.1 2.7" />
    </svg>
  );
}

function PlayIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="currentColor" aria-hidden="true">
      <path d="M8 5.5v13l11-6.5z" />
    </svg>
  );
}

function LoopIcon({ size = 14 }: { size?: number }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 9a8 8 0 0 1 14-2.5M20 15a8 8 0 0 1-14 2.5" />
      <path d="M18 3v4h-4M6 21v-4h4" />
    </svg>
  );
}

/* ---------------- section heading ---------------- */

export function BitHeading({ kicker, title, accent }: { kicker: string; title: string; accent: string }) {
  return (
    <div className="mb-5">
      <p className="font-mono text-[11px] font-semibold uppercase tracking-[0.22em]" style={{ color: accent }}>
        {kicker}
      </p>
      <h2 className="mt-1 font-display text-[26px] font-bold tracking-tight text-ink sm:text-[30px]">{title}</h2>
    </div>
  );
}

/* ---------------- "In short" strip ---------------- */

export function InShort({ text, accent }: { text: string; accent: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -16 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.55, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
      className="relative mb-8 overflow-hidden rounded-lg border border-ink/10 p-5 pl-6 sm:pl-7"
      style={{ background: `linear-gradient(100deg, ${accent}1f, ${accent}08 55%, transparent)`, borderLeft: `4px solid ${accent}` }}
    >
      <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.24em]" style={{ color: accent }}>
        In short — no jargon
      </p>
      <p className="mt-2 font-display text-[17.5px] font-semibold leading-relaxed text-ink sm:text-[19.5px]">{text}</p>
    </motion.div>
  );
}

/* ---------------- "In order" animated flow ---------------- */

function Connector({ accent, vertical }: { accent: string; vertical?: boolean }) {
  return vertical ? (
    <div className="flex justify-center py-1 md:hidden" aria-hidden="true">
      <svg width="2" height="34">
        <line x1="1" y1="0" x2="1" y2="34" stroke={accent} strokeWidth="2" className="dash-flow" />
      </svg>
    </div>
  ) : (
    <div className="hidden flex-1 items-center px-1 md:flex" aria-hidden="true">
      <svg width="100%" height="10" preserveAspectRatio="none">
        <line x1="0" y1="5" x2="100%" y2="5" stroke={accent} strokeWidth="2" className="dash-flow" />
      </svg>
      <svg viewBox="0 0 12 12" width="12" height="12" className="-ml-1" fill={accent} aria-hidden="true">
        <path d="M2 1l8 5-8 5z" />
      </svg>
    </div>
  );
}

export function ConceptFlow({ items, accent }: { items: string[]; accent: string }) {
  return (
    <div className="mb-2 flex flex-col md:flex-row md:items-stretch">
      {items.map((t, i) => (
        <div key={i} className={`flex flex-col md:flex-row md:items-stretch ${i < items.length - 1 ? "" : ""}`} style={{ flex: 1, minWidth: 0 }}>
          <motion.div
            initial={{ opacity: 0, y: 22, scale: 0.96 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ delay: i * 0.16, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
            whileHover={{ y: -4 }}
            className="group relative flex-1 rounded-lg border border-ink/10 bg-panel-2 p-5 transition-colors duration-300 hover:border-ink/30"
            style={{ minWidth: 0 }}
          >
            <span
              className="absolute -top-3 left-4 grid h-7 w-7 place-items-center rounded-md font-mono text-[12px] font-bold text-panel transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6"
              style={{ background: accent }}
            >
              {i + 1}
            </span>
            <p className="mt-1.5 text-[14.5px] leading-relaxed text-term/85">{t}</p>
          </motion.div>
          {i < items.length - 1 && (
            <>
              <Connector accent={accent} />
              <Connector accent={accent} vertical />
            </>
          )}
        </div>
      ))}
    </div>
  );
}

/* ---------------- "Picture this" desi card ---------------- */

export function DesiCard({ desi, accent }: { desi: Desi; accent: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-lg border border-ink/10 bg-card p-6 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-press-sm sm:p-7"
    >
      <span className="absolute inset-x-0 top-0 h-[3px]" style={{ background: `linear-gradient(90deg, ${accent}, transparent 70%)` }} />
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-md text-panel" style={{ background: accent }}>
          <ChaiIcon size={19} />
        </span>
        <div>
          <p className="font-mono text-[10.5px] font-bold uppercase tracking-[0.22em] text-ink-3">picture this · real life, India edition</p>
          <p className="font-display text-[16px] font-bold text-ink">Same idea, from your daily life</p>
        </div>
      </div>
      <p className="mt-4 text-[16px] font-medium leading-relaxed text-ink">
        <span className="mr-2 font-mono text-[13px]" style={{ color: accent }}>▸</span>
        {desi.scene}
      </p>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-2">{desi.explain}</p>
    </motion.div>
  );
}

/* ---------------- "Try it live" streaming console ---------------- */

type Phase = "idle" | "cmd" | "out" | "done";

export function LiveConsole({ live, accent }: { live: LiveExample; accent: string }) {
  const [phase, setPhase] = useState<Phase>("idle");
  const [cmdShown, setCmdShown] = useState("");
  const [lines, setLines] = useState<string[]>([]);
  const timers = useRef<number[]>([]);
  const started = useRef(false);
  const rootRef = useRef<HTMLDivElement>(null);

  const clearTimers = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  const run = useCallback(() => {
    clearTimers();
    setLines([]);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) {
      setCmdShown(live.cmd);
      setLines(live.out.split("\n"));
      setPhase("done");
      return;
    }
    setCmdShown("");
    setPhase("cmd");
    let i = 0;
    const typeStep = () => {
      i += 1;
      setCmdShown(live.cmd.slice(0, i));
      if (i < live.cmd.length) {
        timers.current.push(window.setTimeout(typeStep, 12 + Math.random() * 26));
      } else {
        setPhase("out");
        const outLines = live.out.split("\n");
        outLines.forEach((line, li) => {
          timers.current.push(
            window.setTimeout(() => {
              setLines((prev) => [...prev, line]);
              if (li === outLines.length - 1) setPhase("done");
            }, 260 + li * 210)
          );
        });
      }
    };
    timers.current.push(window.setTimeout(typeStep, 420));
  }, [live]);

  // auto-run once when scrolled into view
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !started.current) {
          started.current = true;
          run();
          obs.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [run]);

  useEffect(() => clearTimers, []);

  const running = phase === "cmd" || phase === "out";

  return (
    <div ref={rootRef}>
      <div className="overflow-hidden rounded-lg border border-ink/12 bg-[#0a0f15] shadow-[0_18px_50px_-24px_rgba(0,0,0,0.9)]">
        {/* chrome bar */}
        <div className="flex items-center justify-between border-b border-term/10 px-4 py-2.5">
          <div className="flex items-center gap-3">
            <span className="flex gap-1.5" aria-hidden="true">
              <i className="h-2.5 w-2.5 rounded-full bg-fail/80" />
              <i className="h-2.5 w-2.5 rounded-full bg-[#e8b93d]/80" />
              <i className="h-2.5 w-2.5 rounded-full bg-pass/80" />
            </span>
            <span className="font-mono text-[11px] tracking-wide text-term/45">
              try-it-live.console · <span className="text-term/30">simulated — nothing leaves your browser</span>
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[0.14em]">
              <i
                className={`h-2 w-2 rounded-full ${running ? "pulse-dot" : ""}`}
                style={{ background: phase === "done" ? "var(--color-pass)" : phase === "idle" ? "var(--color-ink-3)" : "#e8b93d" }}
              />
              <span className={phase === "done" ? "text-pass" : "text-term/45"}>{phase === "done" ? "done" : running ? "running" : "ready"}</span>
            </span>
            <button
              onClick={run}
              className="flex items-center gap-1.5 rounded-md border border-term/15 px-2.5 py-1 font-mono text-[11px] text-term/70 transition-all hover:border-term/40 hover:text-glow active:scale-95"
            >
              {phase === "idle" ? <PlayIcon size={11} /> : <LoopIcon size={12} />}
              {phase === "idle" ? "run" : "re-run"}
            </button>
          </div>
        </div>
        {/* terminal body */}
        <div className="min-h-[130px] px-4 py-4 font-mono text-[13px] leading-[1.75] sm:px-5">
          <p className="text-term">
            <span style={{ color: accent }}>$</span> <span className="text-term/95">{cmdShown}</span>
            {phase === "cmd" && <span className="cursor-blink ml-0.5 inline-block h-[15px] w-[8px] translate-y-[2px] bg-glow/90" />}
          </p>
          {lines.map((l, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, x: -6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className="whitespace-pre-wrap text-term/75"
            >
              {l}
            </motion.p>
          ))}
          {phase === "out" && <span className="cursor-blink inline-block h-[15px] w-[8px] translate-y-[2px] bg-glow/70" />}
        </div>
      </div>
      {/* why it matters */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: phase === "done" ? 1 : 0, y: phase === "done" ? 0 : 10 }}
        transition={{ duration: 0.4 }}
        className="mt-3 flex gap-3 rounded-lg border border-ink/10 bg-panel-2 p-4"
        aria-hidden={phase !== "done"}
      >
        <span className="mt-0.5 shrink-0 font-mono text-[15px] font-bold" style={{ color: accent }}>
          ↳
        </span>
        <p className="text-[14.5px] leading-relaxed text-term/80">
          <span className="mr-2 font-mono text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: accent }}>
            why this matters
          </span>
          {live.note}
        </p>
      </motion.div>
    </div>
  );
}
