import type { DeepContent } from "./types";

export const DEEP4: Record<string, DeepContent> = {
  "llm-benchmarks": {
    hook: "Benchmarks are standardized exams for models — MMLU for broad knowledge, GSM8K for arithmetic, HumanEval for code, SWE-bench for real-world patches, Chatbot Arena for taste. They're useful the way a university ranking is useful: a pre-screening shortcut that becomes dangerous the moment you mistake it for proof. Three poisons to know by name: contamination (the exam leaked into the study material), saturation (everyone scores 99%, the test says nothing), and domain mismatch (a model's generic score predicts nothing about YOUR inputs). The only benchmark that predicts your production is yours.",
    worked: {
      title: "Worked example: building the benchmark that matters",
      steps: [
        { head: "Read public scores skeptically", body: "'Model X: 88% MMLU!' Translate: broad college-level multiple choice, possibly memorized, certainly not your ticket corpus. Useful for a shortlist of three; useless for a decision. Write down what each score does and doesn't tell you." },
        { head: "Mine your inputs", body: "Pull 150 real cases from production: the triage requests, the summaries, the extractions — stratified by difficulty, including the nastiest 15% from your incident history. Real inputs are the moat no vendor benchmark has." },
        { head: "Write assertions that match YOUR 'correct'", body: "Deterministic where possible (regex, JSON schema, contains, numeric bounds); rubric-graded where meaning matters (with a judge calibrated against human labels, lesson 3.6.1). 'Correct' defined by your product, not by a leaderboard." },
        { head: "Run it like CI", body: "Every candidate model, every prompt change, every provider swap: same battery, same assertions, scored and diffed (promptfoo does this natively). The battery is now the acceptance gate — public benchmarks are just marketing you've already seen through." },
        { head: "Keep it alive", body: "Every production incident donates a case. Every quarter, retire cases the models have saturated and add fresh edges. A benchmark that can't fail you anymore is a trophy, not a test." },
      ],
    },
    mistakes: [
      { wrong: "Choosing a model by leaderboard position.", right: "Shortlist with public scores; decide with your battery on your inputs.", why: "Generic tasks measure generic capability; your product's failure modes are specific, and specificity is where models diverge." },
      { wrong: "Trusting a single saturated benchmark.", right: "Check the spread: if every frontier model scores 97–99%, the benchmark has no signal left — move to harder or newer ones (and note that your custom battery never saturates, because it's yours).", why: "A test everyone aces ranks no one. Saturation is the benchmark's expiration date." },
      { wrong: "Building the battery once and forgetting it.", right: "Grow it with incidents; re-tune rubrics as the product evolves; version it with the code.", why: "A static benchmark slowly measures the past. The incidents that hurt you this year should be next year's exam questions." },
    ],
    faq: [
      { q: "What's contamination, exactly?", a: "Benchmark questions appearing in training data — the model 'knows' the exam. Detecting it is hard (providers don't publish training sets), which is why fresh, private evals are the only trustworthy ones. Treat every public score as possibly tutored." },
      { q: "Is Chatbot Arena more honest?", a: "More human, yes — thousands of blind preference votes resist memorization. But preferences ≠ correctness: confident, fluent wrongness wins votes. Arena measures appeal; your battery measures usefulness. Both are data; neither is a verdict." },
      { q: "How big should my battery be?", a: "50–200 cases is the working range: big enough for stable scores, small enough to maintain with real care. Ten cases with sharp assertions beat two hundred vague ones — and you'll actually run the small one on every change." },
    ],
  },
};
