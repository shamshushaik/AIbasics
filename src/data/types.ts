export type Block =
  | { kind: "p"; text: string }
  | { kind: "h"; text: string }
  | { kind: "ul"; items: string[] }
  | { kind: "code"; lang: string; title?: string; code: string }
  | { kind: "callout"; tone: "lab" | "tip" | "warn"; title: string; text: string }
  | { kind: "table"; head: string[]; rows: string[][] };

export interface Quiz {
  q: string;
  options: string[];
  answer: number;
  explain: string;
}

export interface Lesson {
  id: string;
  title: string;
  minutes: number;
  summary: string;
  blocks: Block[];
  takeaways: string[];
  practice: string[];
  quiz: Quiz[];
}

export interface Section {
  title: string;
  lessons: Lesson[];
}

export interface ModuleDef {
  code: string;
  num: number;
  title: string;
  tag: string;
  accent: string;
  accentSoft: string;
  description: string;
  sections: Section[];
}

export interface FlatLesson extends Lesson {
  number: number;
  moduleCode: string;
  moduleNum: number;
  moduleTitle: string;
  accent: string;
  accentSoft: string;
  sectionTitle: string;
}
