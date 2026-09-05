import type { Section } from "./types";

export const MODULE4_SECTIONS: Section[] = [
  {
    title: "LLM Benchmarks",
    lessons: [
      {
        id: "llm-benchmarks",
        title: "LLM Benchmarks: Reading the Scoreboard Skeptically",
        minutes: 9,
        summary:
          "MMLU, HumanEval, GSM8K, SWE-bench, MT-Bench, Arena — what each measures, how each gets gamed, and why your own eval beats them all.",
        blocks: [
          {
            kind: "p",
            text: "Benchmarks are standardized exams for models. MMLU samples college-level multiple choice across 57 subjects (broad knowledge). GSM8K and MATH grade multi-step arithmetic and math reasoning. HumanEval and MBPP run generated code against unit tests. SWE-bench hands the model real GitHub issues and checks the patch. MT-Bench and Chatbot Arena measure conversational quality — the latter via thousands of human preference votes, the closest thing to a live taste test.",
          },
          {
            kind: "table",
            head: ["Benchmark", "Measures", "Weakness"],
            rows: [
              ["MMLU", "Broad factual knowledge", "MCQ format; saturation at the top"],
              ["GSM8K / MATH", "Multi-step math reasoning", "Narrow skill; easily over-trained"],
              ["HumanEval", "Code synthesis vs unit tests", "Small, leak-prone problem set"],
              ["SWE-bench", "Real-repo issue fixing", "Hard, but environment-sensitive"],
              ["MT-Bench", "Instruction quality (judge-scored)", "Judge model bias, positional bias"],
              ["Chatbot Arena", "Human preference at scale", "Style can beat substance; recency bias"],
            ],
          },
          { kind: "h", text: "Three reasons to read skeptically" },
          {
            kind: "ul",
            items: [
              "Contamination: benchmark questions leak into training data; high scores may be memorization. Saturated benchmarks (everyone near 100%) tell you almost nothing.",
              "Distribution mismatch: public exams ≠ your production inputs. A model can top MMLU and fail your ticket triage.",
              "Goodhart: once a benchmark becomes the target, vendors optimize it directly — style-heavy Arena wins don't always transfer to task accuracy.",
            ],
          },
          { kind: "h", text: "The tester's conclusion" },
          {
            kind: "p",
            text: "Treat public benchmarks as vendor acceptance pre-screening, never as proof. The eval that matters is yours: 50–200 cases drawn from your real inputs, with assertions matched to your definition of correct, rerun on every model or prompt change. Benchmark scores get you a shortlist; your battery makes the decision.",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Build the 'acceptance bench': your battery + a pass bar + a version history chart. When a vendor or team says 'this model is better', your reply is a diff on the acceptance bench — the same move as comparing release candidates against the regression suite.",
          },
        ],
        takeaways: [
          "Each benchmark measures a slice: knowledge, math, code, real issues, preference.",
          "Contamination, saturation and Goodhart's law make top-line scores suspect.",
          "Your own eval battery is the only benchmark that predicts your production.",
        ],
        practice: [
          "Pick a model's marketing claim ('#1 on X') and find one independent critique or contamination discussion of benchmark X.",
          "Draft your team's acceptance bench: 20 cases, pass bar, and the chart you'd present at release review.",
        ],
        quiz: [
          {
            q: "Benchmark contamination means…",
            options: [
              "GPU errors during testing",
              "Benchmark items leaking into training data, inflating scores",
              "Human judges colluding",
              "Test servers crashing",
            ],
            answer: 1,
            explain: "Memorized exams aren't intelligence — a core skepticism filter.",
          },
          {
            q: "The best predictor of a model's value for YOUR product is…",
            options: [
              "MMLU score",
              "Your own eval battery on real production-like inputs",
              "Arena rank",
              "Parameter count",
            ],
            answer: 1,
            explain: "Public benchmarks pre-screen; your battery decides.",
          },
          {
            q: "SWE-bench evaluates…",
            options: [
              "Poetry quality",
              "Fixing real GitHub issues in real repositories",
              "Translation",
              "Image captioning",
            ],
            answer: 1,
            explain: "End-to-end software engineering on genuine codebases.",
          },
        ],
      },
    ],
  },
];
