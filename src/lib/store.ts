import { useEffect, useState, useCallback, useMemo } from "react";
import type { ModuleDef, FlatLesson } from "../data/types";
import { MODULES } from "../data";

/* ---------------- hash router ---------------- */

export interface Route {
  page: "home" | "curriculum" | "lesson";
  param?: string;
  query?: string;
}

export function parseHash(): Route {
  const raw = window.location.hash.replace(/^#\/?/, "");
  const [path, query] = raw.split("?");
  const segs = path.split("/").filter(Boolean);
  if (segs[0] === "curriculum") return { page: "curriculum", query };
  if (segs[0] === "lesson" && segs[1]) return { page: "lesson", param: segs[1], query };
  return { page: "home" };
}

export function navigate(to: string) {
  window.location.hash = to.startsWith("/") ? `#${to}` : `#/${to}`;
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(parseHash);
  useEffect(() => {
    const onChange = () => setRoute(parseHash());
    window.addEventListener("hashchange", onChange);
    return () => window.removeEventListener("hashchange", onChange);
  }, []);
  return route;
}

/* ---------------- flattened curriculum ---------------- */

export const FLAT: FlatLesson[] = (() => {
  const out: FlatLesson[] = [];
  let n = 0;
  for (const m of MODULES as ModuleDef[]) {
    for (const s of m.sections) {
      for (const l of s.lessons) {
        n += 1;
        out.push({
          ...l,
          number: n,
          moduleCode: m.code,
          moduleNum: m.num,
          moduleTitle: m.title,
          accent: m.accent,
          accentSoft: m.accentSoft,
          sectionTitle: s.title,
        });
      }
    }
  }
  return out;
})();

export const TOTAL = FLAT.length;

export function getLesson(id: string): FlatLesson | undefined {
  return FLAT.find((l) => l.id === id);
}

export function neighbors(id: string): { prev?: FlatLesson; next?: FlatLesson } {
  const i = FLAT.findIndex((l) => l.id === id);
  if (i === -1) return {};
  return { prev: FLAT[i - 1], next: FLAT[i + 1] };
}

/* ---------------- progress persistence ---------------- */

interface ProgressShape {
  completed: string[];
  quiz: Record<string, { score: number; total: number }>;
  practice: Record<string, number[]>;
}

const KEY = "testbench-ai:v1";

function load(): ProgressShape {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return JSON.parse(raw) as ProgressShape;
  } catch {
    /* ignore */
  }
  return { completed: [], quiz: {}, practice: {} };
}

export function useProgress() {
  const [state, setState] = useState<ProgressShape>(load);

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      /* ignore */
    }
  }, [state]);

  const toggleComplete = useCallback((id: string) => {
    setState((s) => ({
      ...s,
      completed: s.completed.includes(id)
        ? s.completed.filter((x) => x !== id)
        : [...s.completed, id],
    }));
  }, []);

  const setQuiz = useCallback((id: string, score: number, total: number) => {
    setState((s) => {
      const prev = s.quiz[id];
      if (prev && prev.score >= score) return s;
      return { ...s, quiz: { ...s.quiz, [id]: { score, total } } };
    });
  }, []);

  const togglePractice = useCallback((id: string, idx: number) => {
    setState((s) => {
      const cur = s.practice[id] ?? [];
      const next = cur.includes(idx) ? cur.filter((x) => x !== idx) : [...cur, idx];
      return { ...s, practice: { ...s.practice, [id]: next } };
    });
  }, []);

  const resetAll = useCallback(() => {
    setState({ completed: [], quiz: {}, practice: {} });
  }, []);

  return { ...state, toggleComplete, setQuiz, togglePractice, resetAll };
}

export type Progress = ReturnType<typeof useProgress>;

export function moduleProgress(m: ModuleDef, p: Progress) {
  const ids = m.sections.flatMap((s) => s.lessons.map((l) => l.id));
  const done = ids.filter((id) => p.completed.includes(id)).length;
  return { done, total: ids.length, pct: ids.length ? Math.round((done / ids.length) * 100) : 0 };
}

export function useScrolled(threshold = 8) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);
  return scrolled;
}

export function useCountUp(target: number, active: boolean, duration = 1100) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!active) return;
    let raf = 0;
    const t0 = performance.now();
    const tick = (t: number) => {
      const k = Math.min(1, (t - t0) / duration);
      const eased = 1 - Math.pow(1 - k, 3);
      setVal(Math.round(target * eased));
      if (k < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, active, duration]);
  return val;
}

export function usePrefersReducedMotion() {
  return useMemo(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches,
    []
  );
}
