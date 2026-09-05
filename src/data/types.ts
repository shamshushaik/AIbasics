export type Block =
  | { kind: "p"; text: string }
  | { kind: "h"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "code"; lang?: string; title?: string; code: string }
  | { kind: "callout"; tone?: "tip" | "warn" | "lab"; title?: string; text: string }
  | { kind: "table"; head: string[]; rows: string[][] };

export type Quiz = { q: string; options: string[]; answer: number; explain: string };

export type DiagramName =
  | "tokens"
  | "neural"
  | "split"
  | "confusion"
  | "temperature"
  | "context"
  | "attention"
  | "pipeline";

/** Beginner deep-dive layer attached to every lesson. */
export type DeepContent = {
  /** Plain-words analogy hook — the "aha" before the theory. */
  hook: string;
  /** Optional interactive diagram rendered inside the lesson. */
  diagram?: DiagramName;
  /** Step-by-step worked example a beginner can follow end to end. */
  worked: { title: string; steps: { head: string; body: string }[] };
  /** Classic beginner mistakes: wrong move → right move → why. */
  mistakes: { wrong: string; right: string; why: string }[];
  /** Questions every beginner asks. */
  faq: { q: string; a: string }[];
};

export type Lesson = {
  id: string;
  title: string;
  summary: string;
  minutes: number;
  blocks: Block[];
  takeaways: string[];
  testerAngle?: string;
  quiz: Quiz[];
  practice: string[];
};

export type Section = { title: string; lessons: Lesson[] };

export type ModuleDef = {
  code: string;
  num: number;
  title: string;
  tag: string;
  accent: string;
  accentSoft: string;
  description: string;
  sections: Section[];
};

export type FlatLesson = Lesson & {
  number: number;
  moduleCode: string;
  moduleNum: number;
  moduleTitle: string;
  accent: string;
  accentSoft: string;
  sectionTitle: string;
};
