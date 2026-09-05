import { useEffect, useRef } from "react";
import { animate, stagger } from "animejs";
import { navigate, useRoute, useScrolled, usePrefersReducedMotion, TOTAL, type Progress } from "../lib/store";
import { Icon } from "./ui";

/* ---------------- ambient floating glyphs (animejs) ---------------- */

const GLYPHS = ["{ }", "fn", "=>", "λ", "0x", "&&", "p95", "Δ", "k=5", "Q4", "ROC", "BPE", "CI", "≠", "±σ"];

export function FloatingGlyphs() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = usePrefersReducedMotion();
  useEffect(() => {
    if (reduced || !ref.current) return;
    const els = ref.current.querySelectorAll(".glyph");
    const ctrl = animate(els, {
      y: () => animeRandom(-26, 26),
      duration: () => animeRandom(2600, 4600),
      alternate: true,
      loop: true,
      ease: "inOutSine",
      delay: stagger(140),
      opacity: [0.0, 0.55],
    });
    return () => {
      ctrl.pause();
    };
  }, [reduced]);

  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      {GLYPHS.map((g, i) => (
        <span
          key={i}
          className="glyph absolute font-mono font-semibold select-none"
          style={{
            left: `${(i * 61) % 95}%`,
            top: `${(i * 37 + 12) % 88}%`,
            fontSize: `${12 + ((i * 7) % 14)}px`,
            color: ["var(--color-m1)", "var(--color-m2)", "var(--color-m3)", "var(--color-m4)"][i % 4],
            opacity: 0,
          }}
        >
          {g}
        </span>
      ))}
    </div>
  );
}

function animeRandom(min: number, max: number) {
  return min + Math.random() * (max - min);
}

/* ---------------- top bar ---------------- */

export function TopBar({ progress }: { progress: Progress }) {
  const route = useRoute();
  const scrolled = useScrolled(10);
  const done = progress.completed.length;
  const pct = Math.round((done / TOTAL) * 100);

  const nav = [
    { label: "Overview", to: "/", page: "home" },
    { label: "Curriculum", to: "/curriculum", page: "curriculum" },
    { label: "Lesson 001", to: "/lesson/what-is-ai", page: "lesson" },
  ];

  return (
    <header
      className={`sticky top-0 z-50 border-b transition-all duration-300 ${
        scrolled ? "border-ink/15 bg-paper/95 shadow-[0_2px_0_rgba(20,24,29,0.06)]" : "border-transparent bg-paper/80"
      } backdrop-blur-sm`}
    >
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 lg:px-8">
        <button onClick={() => navigate("/")} className="group flex items-center gap-3 text-left">
          <span className="grid h-9 w-9 place-items-center border-2 border-ink bg-ink text-glow transition-transform duration-300 group-hover:-rotate-6" style={{ borderRadius: 8 }}>
            <Icon name="logo" size={20} />
          </span>
          <span className="leading-none">
            <span className="block font-display text-[17px] font-extrabold tracking-tight">
              TestBench<span className="text-m1">/</span>AI
            </span>
            <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-ink-3">
              the tester's AI curriculum
            </span>
          </span>
        </button>

        <nav className="hidden items-center gap-7 md:flex">
          {nav.map((n) => (
            <button
              key={n.to}
              onClick={() => navigate(n.to)}
              className={`link-slide font-mono text-[13px] font-medium tracking-wide ${
                route.page === n.page ? "text-ink" : "text-ink-3 hover:text-ink"
              }`}
            >
              {n.label}
            </button>
          ))}
        </nav>

        <button
          onClick={() => navigate("/curriculum")}
          className="group flex items-center gap-2.5 border border-ink bg-card px-3 py-1.5 transition-all hover:bg-ink hover:text-paper"
          style={{ borderRadius: 6 }}
          title="Your progress"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" className="-rotate-90">
            <circle cx="10" cy="10" r="7" fill="none" stroke="currentColor" strokeOpacity="0.2" strokeWidth="3" />
            <circle
              cx="10" cy="10" r="7" fill="none" stroke="var(--color-pass)" strokeWidth="3" strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 7}
              strokeDashoffset={2 * Math.PI * 7 * (1 - pct / 100)}
              className="transition-all duration-700"
            />
          </svg>
          <span className="font-mono text-[12px] font-semibold tabular-nums">
            {done}<span className="opacity-50">/{TOTAL}</span>
          </span>
        </button>
      </div>
      {/* global progress hairline */}
      <div className="h-[3px] w-full bg-ink/8">
        <div
          className="h-full transition-all duration-700"
          style={{ width: `${pct}%`, background: "linear-gradient(90deg, var(--color-m1), var(--color-m2), var(--color-pass))" }}
        />
      </div>
    </header>
  );
}

/* ---------------- keyword ticker ---------------- */

const TERMS = [
  "BPE TOKENIZATION", "RLHF", "FEW-SHOT", "ROC-AUC", "CONTEXT ROT", "LoRA", "PROMPTFOO",
  "CHAIN-OF-THOUGHT", "DATA DRIFT", "GGUF", "TOP-P SAMPLING", "HALLUCINATION", "ReAct",
  "EMBEDDINGS", "SWE-BENCH", "JSON MODE", "BIAS–VARIANCE", "REFLEXION", "QUANTIZATION", "EVALS > VIBES",
];

export function Ticker() {
  const row = (key: string) => (
    <div key={key} className="flex shrink-0 items-center" aria-hidden={key === "b"}>
      {TERMS.map((t, i) => (
        <span key={i} className="flex items-center font-mono text-[12px] font-medium tracking-[0.18em] text-paper/80">
          <span className="px-5">{t}</span>
          <span className="text-glow">▰</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="ticker overflow-hidden border-y-2 border-ink bg-ink py-2.5">
      <div className="ticker-track flex w-max">{[row("a"), row("b")]}</div>
    </div>
  );
}

/* ---------------- footer ---------------- */

export function Footer({ progress }: { progress: Progress }) {
  return (
    <footer className="relative mt-24 overflow-hidden border-t-2 border-ink bg-panel text-term">
      <div className="grid-paper-dark noise relative">
        <div className="mx-auto max-w-7xl px-5 py-14 lg:px-8">
          <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="font-mono text-[11px] uppercase tracking-[0.24em] text-term/40">doc no. AI-CUR-078 · rev 2.1</p>
              <p className="mt-3 font-display text-4xl font-extrabold tracking-tight sm:text-5xl">
                Test like the future<br />depends on it. <span className="text-glow">▮</span>
              </p>
            </div>
            <div className="flex flex-wrap gap-x-10 gap-y-3 font-mono text-[13px]">
              <button onClick={() => navigate("/")} className="link-slide text-term/70 hover:text-glow">overview</button>
              <button onClick={() => navigate("/curriculum")} className="link-slide text-term/70 hover:text-glow">curriculum</button>
              <button onClick={() => navigate("/lesson/what-is-ai")} className="link-slide text-term/70 hover:text-glow">start lesson 01</button>
              <button
                onClick={() => {
                  if (window.confirm("Reset all progress, quiz scores and practice checkmarks?")) progress.resetAll();
                }}
                className="link-slide text-fail/80 hover:text-fail"
              >
                reset progress
              </button>
            </div>
          </div>
          <div className="mt-12 flex flex-col gap-2 border-t border-term/10 pt-6 font-mono text-[11px] tracking-wide text-term/35 sm:flex-row sm:justify-between">
            <span>78 lessons · 22 sections · 4 modules — written for software testers</span>
            <span>progress lives in your browser · no accounts · no cookies</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
