import type { ModuleDef } from "./types";
import { MODULE1_SECTIONS } from "./module1";
import { MODULE2_SECTIONS } from "./module2";
import { MODULE3_SECTIONS } from "./module3";
import { MODULE4_SECTIONS } from "./module4";

export const MODULES: ModuleDef[] = [
  {
    code: "M1",
    num: 1,
    title: "AI/ML Foundations",
    tag: "the bedrock",
    accent: "#E8590C",
    accentSoft: "rgba(232,89,12,0.12)",
    description:
      "What machines learn, how they fail, and how to measure it. The vocabulary every tester needs before touching an LLM — from neurons to fairness metrics.",
    sections: MODULE1_SECTIONS,
  },
  {
    code: "M2",
    num: 2,
    title: "LLM Foundations",
    tag: "inside the black box",
    accent: "#0B7285",
    accentSoft: "rgba(11,114,133,0.12)",
    description:
      "How LLMs are trained and how they break: inference dials, tokens and cost, the open-source landscape, failure modes, APIs and structured outputs.",
    sections: MODULE2_SECTIONS,
  },
  {
    code: "M3",
    num: 3,
    title: "Advanced Prompting Engineering",
    tag: "the craft",
    accent: "#C2255C",
    accentSoft: "rgba(194,37,92,0.12)",
    description:
      "Patterns from zero-shot to tree-of-thought, production prompt anatomy, promptfoo regression testing, and the five engineering disciplines around the prompt.",
    sections: MODULE3_SECTIONS,
  },
  {
    code: "M4",
    num: 4,
    title: "LLM Benchmarks",
    tag: "the scoreboard",
    accent: "#1971C2",
    accentSoft: "rgba(25,113,194,0.12)",
    description:
      "Reading MMLU, SWE-bench, Arena and friends skeptically — and building the only benchmark that predicts your production: your own.",
    sections: MODULE4_SECTIONS,
  },
];

export const TOTAL_MINUTES = (() => {
  let m = 0;
  for (const mod of MODULES)
    for (const s of mod.sections) for (const l of s.lessons) m += l.minutes;
  return m;
})();

export const TOTAL_QUIZ = (() => {
  let q = 0;
  for (const mod of MODULES)
    for (const s of mod.sections) for (const l of s.lessons) q += l.quiz.length;
  return q;
})();

export const TOTAL_PRACTICE = (() => {
  let p = 0;
  for (const mod of MODULES)
    for (const s of mod.sections) for (const l of s.lessons) p += l.practice.length;
  return p;
})();

export const TOTAL_SECTIONS = MODULES.reduce((a, m) => a + m.sections.length, 0);

export const START_HERE = [
  "what-is-ai",
  "what-is-ml",
  "how-llms-work",
  "inference-parameters",
  "zero-shot",
  "llm-benchmarks",
];
