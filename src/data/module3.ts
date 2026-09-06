import type { Section } from "./types";

export const MODULE3_SECTIONS: Section[] = [
  {
    title: "What is Prompt Engineering",
    lessons: [
      {
        id: "prompt-engineering",
        title: "Prompt Engineering, Defined",
        minutes: 6,
        summary:
          "Prompt engineering is programming in natural language: designing inputs that reliably produce the behaviour you specified — and proving it with evals.",
        blocks: [
          {
            kind: "p",
            text: "A prompt is the model's entire universe for one request: instructions, context, examples and constraints assembled into text. Prompt engineering is the discipline of building that universe so the most probable continuation is the behaviour you want — for testers especially, doing so repeatably, measurably and regressively, not by lucky phrasing.",
          },
          { kind: "h", text: "The professional loop" },
          {
            kind: "ul",
            items: [
              "Specify: write the behaviour contract (inputs, output format, edge cases).",
              "Draft: encode it as a prompt with role, context, examples, constraints.",
              "Evaluate: run a case battery; score against the contract.",
              "Iterate: change one thing, re-measure. Keep what wins.",
              "Version: prompts live in Git with tests attached.",
            ],
          },
          {
            kind: "p",
            text: "The discipline split worth internalizing: amateurs tune prompts until one example works; engineers build an eval set first and tune until the distribution works. That inversion — evals before eloquence — is the whole game, and it's the same instinct that separates testers from typo-hunters.",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "You already own the hardest part: the case battery. A prompt engineer without test cases is guessing; a tester with 50 nasty real-world inputs is doing science. Bring your equivalence classes, boundary values and malicious payloads — they transfer directly.",
          },
        ],
        takeaways: [
          "Prompt engineering = designing inputs so desired behaviour is the probable continuation.",
          "The professional loop: specify → draft → evaluate → iterate → version.",
          "Evals before eloquence: build the case battery first.",
        ],
        practice: [
          "Take any prompt you use casually and write its behaviour contract (3 inputs, format, 3 edge cases).",
          "Run a 10-case battery against it and score pass/fail per case — no prompt changes allowed yet.",
        ],
        quiz: [
          {
            q: "The professional's first step before tuning a prompt is…",
            options: [
              "Making it longer",
              "Building an evaluation case set",
              "Raising temperature",
              "Adding emojis",
            ],
            answer: 1,
            explain: "Without a battery you can't tell improvement from luck.",
          },
          {
            q: "A prompt is best thought of as…",
            options: [
              "A question",
              "The model's entire input universe for one request",
              "A config file only",
              "A comment",
            ],
            answer: 1,
            explain: "Instructions, context, examples and constraints all shape the continuation.",
          },
        ],
      },
    ],
  },
  {
    title: "Prompt Patterns",
    lessons: [
      {
        id: "zero-shot",
        title: "Zero-shot Prompting",
        minutes: 5,
        summary:
          "Ask directly, show nothing. Zero-shot is your baseline — and it's stronger than it looks for well-formed tasks.",
        blocks: [
          {
            kind: "p",
            text: "Zero-shot means the prompt carries the instruction but no examples: 'Classify this ticket as bug, feature or question.' Modern instruct models handle a surprising range of tasks zero-shot — classification, summarization, extraction — because instruction-following was trained into them. It's the cheapest pattern: shortest prompts, lowest token cost, fastest iteration.",
          },
          { kind: "h", text: "When zero-shot wins (and loses)" },
          {
            kind: "ul",
            items: [
              "Wins: unambiguous tasks with obvious formats; quick baselines for everything.",
              "Loses: subtle category boundaries ('Is this a bug or expected behaviour?'), unusual output shapes, domain jargon with non-standard meaning.",
              "Diagnosis: if zero-shot errs mostly on boundary cases, add examples (few-shot). If it ignores format, add a schema or prefill.",
            ],
          },
          {
            kind: "callout",
            tone: "tip",
            title: "Always start here",
            text: "Zero-shot is the control group. Every fancier pattern must beat it on your eval battery — otherwise you're paying tokens for theatre.",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Record the zero-shot score before trying anything clever. Teams routinely ship 40%-more-expensive prompts that merely match the baseline. Your eval table makes that visible.",
          },
        ],
        takeaways: [
          "Zero-shot = instruction only, no examples; the universal baseline.",
          "Boundary-case errors signal the need for few-shot; format errors signal schemas.",
          "Every advanced pattern must beat zero-shot on the battery to justify its cost.",
        ],
        practice: [
          "Benchmark one task zero-shot on 15 cases; record accuracy and token cost.",
          "Categorize the failures: boundary vs format vs knowledge — and map each to its remedy.",
        ],
        quiz: [
          {
            q: "Zero-shot prompts contain…",
            options: ["Examples only", "Instructions without examples", "Neither", "Retrieved documents"],
            answer: 1,
            explain: "The instruction alone; the model relies on its trained abilities.",
          },
          {
            q: "Zero-shot failing mostly on edge-case categories suggests trying…",
            options: ["Few-shot examples for the boundary cases", "Higher temperature", "A bigger window", "Removing the instruction"],
            answer: 0,
            explain: "Examples teach the boundary the instruction couldn't pin down.",
          },
        ],
      },
      {
        id: "few-shot",
        title: "Few-shot Prompting",
        minutes: 6,
        summary:
          "Show, don't just tell: a handful of input→output examples teaches format, boundaries and style more reliably than paragraphs of instruction.",
        blocks: [
          {
            kind: "p",
            text: "Few-shot exploits the model's in-context learning: patterns demonstrated in the prompt are continued. Two to five well-chosen examples usually do what five paragraphs of rules cannot — they demonstrate the exact output shape, the tone, and crucially, where the category lines sit. The examples ARE the specification.",
          },
          { kind: "h", text: "Craft rules that matter" },
          {
            kind: "ul",
            items: [
              "Cover the boundary: include the hardest near-miss pairs ('bug' vs 'not a bug').",
              "Balance labels: three 'bug' examples and zero 'feature' teaches a bias.",
              "Keep format identical to what you expect — the model copies whitespace and punctuation too.",
              "Order can matter: recency bias means later examples weigh slightly more.",
              "Watch the budget: examples cost tokens on every single call.",
            ],
          },
          {
            kind: "code",
            lang: "text",
            title: "A boundary-teaching pair",
            code: "Input: \"App crashes when uploading >10MB\" -> BUG\nInput: \"Would love a dark mode option\"    -> FEATURE\nInput: \"Login takes 4 seconds, is that normal?\" -> QUESTION\nInput: \"Upload silently fails at exactly 10MB\" -> ?",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Ablation-test your examples: remove one, re-run the battery, measure the delta. Examples that change nothing are token waste; examples that guard a boundary are load-bearing — mark them in a comment so nobody 'cleans them up'.",
          },
        ],
        takeaways: [
          "Examples specify format and boundaries better than prose.",
          "Balance labels and include deliberate near-miss boundary pairs.",
          "Examples are per-call cost — ablate to keep only load-bearing ones.",
        ],
        practice: [
          "Build a 4-example few-shot set for a classification task, including one boundary pair.",
          "Ablate: rerun the battery with each example removed; note which removal hurts most.",
        ],
        quiz: [
          {
            q: "The most valuable few-shot examples are usually…",
            options: [
              "The easiest, clearest cases",
              "Boundary cases that disambiguate near-miss categories",
              "The longest ones",
              "Random samples",
            ],
            answer: 1,
            explain: "Trivial cases teach nothing; boundaries carry the specification.",
          },
          {
            q: "All examples labelled 'bug' will likely cause…",
            options: ["Better recall for features", "Label bias toward 'bug'", "Lower cost", "JSON errors"],
            answer: 1,
            explain: "The model mirrors the demonstrated distribution.",
          },
        ],
      },
      {
        id: "chain-of-thought",
        title: "Chain-of-Thought (CoT)",
        minutes: 7,
        summary:
          "'Think step by step' buys real accuracy on multi-step problems — at a token cost, and with new failure modes of its own.",
        blocks: [
          {
            kind: "p",
            text: "Chain-of-thought asks the model to emit reasoning before the answer. Because each generated step becomes context for the next, the model effectively gives itself working memory: multi-step arithmetic, logic and planning improve markedly. Zero-shot CoT is literally the phrase 'Let's think step by step'; few-shot CoT demonstrates reasoning traces.",
          },
          { kind: "h", text: "The honest trade-off" },
          {
            kind: "ul",
            items: [
              "Output tokens multiply (chains are long) — cost and latency rise.",
              "For simple tasks CoT can hurt: it invents complications that weren't there.",
              "Chains can be unfaithful: plausible text that doesn't reflect the actual 'computation' (Module 2.6.3).",
              "Reasoning models do this internally; with them you rarely need to ask.",
            ],
          },
          { kind: "h", text: "Structures that stabilize chains" },
          {
            kind: "ul",
            items: [
              "Numbered steps with a required checkpoint ('verify step 2 before step 3').",
              "Separate the chain from the answer: 'Reasoning: ... \\n Final answer: ...'.",
              "Force the answer format last, so parsers never eat the chain.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Test CoT features on two axes: answer accuracy AND chain faithfulness (does the final answer follow from the shown steps?). Also A/B with and without CoT on your easy cases — you may be paying 5× tokens for zero gain there.",
          },
        ],
        takeaways: [
          "CoT converts output tokens into working memory for multi-step tasks.",
          "It can backfire on trivial tasks — measure, don't assume.",
          "Separate chain from final answer; test faithfulness, not just correctness.",
        ],
        practice: [
          "Take 10 multi-step problems; compare accuracy with and without 'think step by step'.",
          "Write a parser-friendly CoT prompt where the final answer appears in a fixed, extractable line.",
        ],
        quiz: [
          {
            q: "Why does CoT improve multi-step accuracy?",
            options: [
              "It raises temperature",
              "Generated steps become context — external working memory",
              "It enables tool use",
              "It expands the context window",
            ],
            answer: 1,
            explain: "Each written step is re-read as input for the next one.",
          },
          {
            q: "A faithful chain is one where…",
            options: [
              "The reasoning is long",
              "The conclusion actually follows from the stated steps",
              "The model says it's sure",
              "No numbers appear",
            ],
            answer: 1,
            explain: "Faithfulness = the shown reasoning explains the answer — a testable property.",
          },
        ],
      },
      {
        id: "self-consistency",
        title: "Self-Consistency",
        minutes: 6,
        summary:
          "Sample many reasoning paths, take the majority answer. Trading compute for accuracy — the ensemble trick you can run in a prompt.",
        blocks: [
          {
            kind: "p",
            text: "One CoT chain can wander into a wrong answer. Self-consistency runs the same prompt several times (temperature > 0 so paths differ), collects the final answers and returns the majority vote. Errors are roughly random across paths while correct answers converge — so voting cancels noise. Reported gains are largest exactly where chains are unstable: arithmetic and multi-constraint logic.",
          },
          { kind: "h", text: "The price tag" },
          {
            kind: "ul",
            items: [
              "N samples ≈ N× output cost and latency (parallel helps latency, not cost).",
              "Diminishing returns: 5–10 samples capture most of the gain.",
              "Useless when the model is consistently wrong (systematic error doesn't vote away).",
            ],
          },
          {
            kind: "callout",
            tone: "tip",
            title: "Selective escalation",
            text: "Cheap production pattern: run once; if confidence is low or answers to a canary question waver, escalate to 5-sample voting. Pay the ensemble price only where it earns it.",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Self-consistency is your variance probe turned into a feature. Measure: single-shot accuracy vs voted accuracy vs cost. If voting doesn't move the needle on your task, the errors are systematic — a far more valuable finding than the accuracy bump.",
          },
        ],
        takeaways: [
          "Sample N diverse chains, majority-vote the final answers.",
          "Cancels random errors, not systematic ones — the distinction is diagnostic.",
          "5–10 samples hit diminishing returns; escalate selectively.",
        ],
        practice: [
          "Implement 5-sample voting on 10 hard cases; compare vs single-shot and note agreement rates.",
          "Identify one case where voting failed to fix the error — classify why (systematic bias).",
        ],
        quiz: [
          {
            q: "Self-consistency requires the samples to be…",
            options: ["Identical (temp 0)", "Diverse (temp > 0)", "From different models", "Sequential"],
            answer: 1,
            explain: "Diversity is the point — identical samples vote unanimously, right or wrong.",
          },
          {
            q: "Voting won't fix…",
            options: ["Random slips", "Systematic errors the model always makes", "Formatting issues", "Latency"],
            answer: 1,
            explain: "If every path shares the same wrong assumption, the majority agrees on wrong.",
          },
        ],
      },
      {
        id: "react",
        title: "ReAct: Reason + Act",
        minutes: 7,
        summary:
          "Interleave thinking with tool use: Thought → Action → Observation, repeat. The pattern that turned chat models into agents.",
        blocks: [
          {
            kind: "p",
            text: "Pure reasoning hallucinates facts it could have looked up; pure acting flails without a plan. ReAct alternates: the model states a Thought ('I need the current error rate'), chooses an Action (call query_metrics), receives the Observation (the tool result), thinks again. The loop continues until it can answer. This is the skeleton of nearly every agent framework — LangChain agents, function-calling loops, MCP clients.",
          },
          {
            kind: "code",
            lang: "text",
            title: "One ReAct cycle",
            code: "Thought: I need yesterday's failed-test count.\nAction: query_ci(status=\"failed\", date=\"yesterday\")\nObservation: 14 failures, 9 in login-suite\nThought: Login suite dominates — I'll inspect those first.\nAction: get_failures(suite=\"login\", date=\"yesterday\")\n...",
          },
          { kind: "h", text: "Failure modes to test" },
          {
            kind: "ul",
            items: [
              "Hallucinated actions: calling tools that don't exist or with invented parameters.",
              "Observation blindness: ignoring tool results that contradict its plan.",
              "Loops: repeating the same failing action (missing stop condition).",
              "Early surrender: answering from memory when the tool said 'no data'.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "ReAct gives you a structured trace to assert on: every Action must name a real tool with schema-valid args; every cited fact must trace to an Observation. Trace-based assertions are deterministic even when the final prose isn't.",
          },
        ],
        takeaways: [
          "ReAct = interleaved Thought/Action/Observation loop.",
          "It grounds reasoning in tool results — when the model actually uses them.",
          "Test the trace: real tools, valid args, observations honoured, clean stops.",
        ],
        practice: [
          "Trace one agent run and verify each cited fact appears in an Observation.",
          "Force a tool to return contradictory data mid-run; observe whether the plan adapts.",
        ],
        quiz: [
          {
            q: "ReAct's core advance over pure CoT is…",
            options: [
              "Longer chains",
              "Grounding reasoning in real tool observations",
              "Lower cost",
              "No prompting needed",
            ],
            answer: 1,
            explain: "Actions fetch real evidence; reasoning decides what to fetch next.",
          },
          {
            q: "An agent calling the same failing tool repeatedly lacks…",
            options: ["Vocabulary", "Stop/retry conditions in its loop", "Temperature", "A system prompt"],
            answer: 1,
            explain: "Loop engineering: budgets, backoff and abort rules.",
          },
        ],
      },
      {
        id: "reflexion",
        title: "Reflexion: Learning from Your Own Mistakes",
        minutes: 6,
        summary:
          "Act, evaluate, verbalize what went wrong, try again with that critique in context. Self-improvement without weight updates.",
        blocks: [
          {
            kind: "p",
            text: "Reflexion adds a mirror to the agent loop: after an attempt (and a scored outcome), the model writes a plain-language reflection — 'I searched for the file before checking the path format; next time validate first' — and the next attempt receives past reflections as context. No gradient updates; the 'learning' lives in the prompt. On coding and decision benchmarks this simple loop closes large gaps.",
          },
          { kind: "h", text: "The three actors" },
          {
            kind: "ul",
            items: [
              "Actor: executes the task.",
              "Evaluator: scores the outcome (unit tests, rubric, judge model).",
              "Self-reflector: turns the failure into advice for the next attempt.",
            ],
          },
          { kind: "h", text: "Where it shines and stalls" },
          {
            kind: "ul",
            items: [
              "Shines: tasks with fast, reliable evaluators (tests compile, answers checkable).",
              "Stalls: when the evaluator is weak — reflection amplifies confident wrongness.",
              "Budget: each cycle costs a full attempt; cap attempts explicitly.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Reflexion is the codification of your daily loop: test → diagnose → retest. The testable claim is monotonic improvement: score(attempt n+1) ≥ score(attempt n) most of the time. Chart it; a flat line means the evaluator can't teach.",
          },
        ],
        takeaways: [
          "Reflexion = attempt → evaluate → verbal reflection → retry with reflections in context.",
          "Its ceiling is the evaluator's quality.",
          "Cap attempts; learning-by-prompt has a hard budget.",
        ],
        practice: [
          "Run a 3-attempt reflexion loop on a solvable task; log scores per attempt.",
          "Break the evaluator (make it always say 'good job') and observe the loop's collapse.",
        ],
        quiz: [
          {
            q: "Reflexion 'learns' by…",
            options: [
              "Updating weights",
              "Carrying self-written critiques into the next attempt's prompt",
              "Fine-tuning online",
              "Increasing context size",
            ],
            answer: 1,
            explain: "Memory-in-prompt: reflections become context for future attempts.",
          },
          {
            q: "Reflexion struggles most when…",
            options: [
              "Tasks are easy",
              "The evaluator can't reliably score attempts",
              "Models are large",
              "APIs are fast",
            ],
            answer: 1,
            explain: "Garbage evaluation → garbage reflections → confident repetition of errors.",
          },
        ],
      },
      {
        id: "tree-of-thought",
        title: "Tree-of-Thought",
        minutes: 6,
        summary:
          "Explore reasoning as a tree: branch into candidate thoughts, score them, prune the losers, backtrack when stuck. Search, applied to thinking.",
        blocks: [
          {
            kind: "p",
            text: "A single chain commits to its first plausible step — wrong turn, whole answer doomed. Tree-of-Thought (ToT) generates several candidate next-steps, has the model evaluate each ('does this bring us closer?'), expands the promising branches and abandons dead ends. It's breadth-first search wearing a prompt costume, and it shines on tasks with look-ahead: puzzles, planning, negotiation strategy.",
          },
          { kind: "h", text: "The machinery" },
          {
            kind: "ul",
            items: [
              "Decompose: define what one 'thought step' is for your task.",
              "Branch: k candidates per node (2–5 keeps cost sane).",
              "Evaluate: score partial states against the goal.",
              "Search: BFS for broad problems, DFS for deep ones; keep a budget counter.",
            ],
          },
          { kind: "h", text: "Sober expectations" },
          {
            kind: "p",
            text: "ToT is expensive (every node is an LLM call) and only pays off when branches genuinely differ in quality and the evaluator can tell them apart early. For most production tasks, simple decomposition plus verification beats a full tree at a tenth of the cost.",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "If a vendor claims ToT, ask for the node budget and the evaluator. Then test the evaluator directly: give it clearly-good and clearly-bad partial plans and check it ranks them. A tree with a blind evaluator is just expensive randomness.",
          },
        ],
        takeaways: [
          "ToT = branch, evaluate, prune — search over reasoning paths.",
          "Needs a task that decomposes and an evaluator that discriminates early.",
          "Cost scales with nodes; budget ruthlessly.",
        ],
        practice: [
          "Hand-simulate a depth-2, breadth-2 ToT on a planning problem; count LLM calls needed.",
          "Evaluate 4 partial plans yourself, then have a model rank them; measure agreement.",
        ],
        quiz: [
          {
            q: "ToT's advantage over a single CoT chain is…",
            options: [
              "Cheaper runs",
              "Backtracking: bad branches are pruned instead of followed",
              "No prompting",
              "Guaranteed correctness",
            ],
            answer: 1,
            explain: "Search recovers from wrong turns a committed chain can't.",
          },
          {
            q: "ToT's cost driver is…",
            options: ["Input length", "Number of nodes evaluated", "Vocabulary size", "Model licence"],
            answer: 1,
            explain: "Every branch and every evaluation is a model call.",
          },
        ],
      },
      {
        id: "least-to-most",
        title: "Least-to-Most Prompting",
        minutes: 5,
        summary:
          "Decompose the hard question into an ordered ladder of easier ones, solve them in sequence, and let each answer feed the next.",
        blocks: [
          {
            kind: "p",
            text: "Least-to-Most (LtM) has two phases: first ask the model to decompose the problem into subquestions ordered easy→hard; then answer them one by one, each answer appended to the context for the next. Unlike one-shot CoT, the decomposition itself is a model output you can inspect — a testable intermediate artefact.",
          },
          {
            kind: "code",
            lang: "text",
            title: "The two-phase shape",
            code: "Phase 1 — Decompose:\n\"To find whether we should migrate the suite to AI-generated tests,\n what subquestions must we answer, easiest first?\"\n-> 1) Which suites are most flaky? 2) What's the cost of AI generation?\n   3) Do AI tests catch the same defects? ...\n\nPhase 2 — Solve sequentially, each answer in context for the next.",
          },
          { kind: "h", text: "Where it beats plain CoT" },
          {
            kind: "ul",
            items: [
              "Compositional tasks: the answer needs several intermediate facts combined.",
              "Long reasoning: the ladder keeps each step short and checkable.",
              "Inspectability: a wrong decomposition is visible before any solving starts.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Test the decomposition separately from the solving: is the subquestion list complete, ordered and non-redundant? Half of LtM failures live in phase 1 — a checkpoint your suite can gate on.",
          },
        ],
        takeaways: [
          "Decompose easy→hard, then solve sequentially with accumulating answers.",
          "The decomposition is an inspectable, testable intermediate.",
          "Best for compositional problems needing several combined facts.",
        ],
        practice: [
          "Apply LtM to a real estimation question in your team; review the subquestion list with a colleague.",
          "Deliberately break one subanswer and observe how the final answer degrades.",
        ],
        quiz: [
          {
            q: "LtM's phase 1 produces…",
            options: ["The final answer", "An ordered list of easier subquestions", "A tool plan", "A fine-tune dataset"],
            answer: 1,
            explain: "Decomposition first; solving follows the ladder.",
          },
          {
            q: "A key testability advantage of LtM is…",
            options: [
              "It never fails",
              "You can validate the decomposition before any solving happens",
              "It's cheaper than zero-shot",
              "It needs no prompt",
            ],
            answer: 1,
            explain: "Intermediate artefacts = intermediate checkpoints.",
          },
        ],
      },
      {
        id: "roles-system-user-assistant",
        title: "System vs User vs Assistant Roles",
        minutes: 6,
        summary:
          "The messages array is a cast list: system sets the law, user brings the work, assistant carries history. Misusing roles is a quiet bug farm.",
        blocks: [
          {
            kind: "p",
            text: "The conversation format tags each message with a role. System: durable instructions, persona, constraints — the model treats it as authoritative setup. User: the live request. Assistant: the model's own prior outputs (and, in some APIs, prefills). Models weight roles differently: overriding a system rule from a user message ('ignore previous instructions') is the classic injection attack precisely because the boundary exists.",
          },
          { kind: "h", text: "Design heuristics" },
          {
            kind: "ul",
            items: [
              "System: who you are, output contract, hard constraints, safety policy.",
              "User: the variable content — keep trusted and untrusted text distinguishable.",
              "Assistant history: prune aggressively; old turns dilute instructions.",
              "Never place secrets or injection-sensitive control logic in user-visible slots.",
            ],
          },
          {
            kind: "callout",
            tone: "warn",
            title: "Prompt injection lives here",
            text: "If user content can impersonate roles ('SYSTEM: new instructions...'), the hierarchy collapses. Defences: delimit untrusted text, repeat critical rules after it, and treat all model output as untrusted downstream.",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Your injection suite: role-impersonation payloads, delimiter escapes, 'ignore previous instructions' variants, multilingual rewrites of the same. Run it against every feature that mixes user text with system rules.",
          },
        ],
        takeaways: [
          "System = law, user = work, assistant = history; the hierarchy is a security boundary.",
          "Keep untrusted content delimited and distinguishable from instructions.",
          "Role-impersonation is your core injection test class.",
        ],
        practice: [
          "Write 5 role-impersonation injection payloads for a feature you know; test each.",
          "Refactor one prompt: move all durable rules to system, leaving only variables in user.",
        ],
        quiz: [
          {
            q: "'Ignore previous instructions and...' succeeds when…",
            options: [
              "Temperature is high",
              "User content is not isolated from instruction-level text",
              "The model is small",
              "JSON mode is off",
            ],
            answer: 1,
            explain: "Injection exploits blurred boundaries between data and instructions.",
          },
          {
            q: "Durable behavioural rules belong in…",
            options: ["User messages", "The system message", "Assistant history", "Stop sequences"],
            answer: 1,
            explain: "System carries authoritative, per-request setup.",
          },
        ],
      },
      {
        id: "response-prefilling",
        title: "Response Prefilling for Format Control",
        minutes: 5,
        summary:
          "Start the model's answer for it — '{' or '<report>' — and continuation does the rest. The cheapest format guarantee in the book.",
        blocks: [
          {
            kind: "p",
            text: "Since autoregressive models continue whatever came before, you can pre-write the first tokens of the response. Prime with '{' and the model is already inside JSON; prime with '<thinking>' and it thinks before answering; prime with 'The verdict is:' and you skip the preamble. Anthropic exposes assistant prefill directly; with OpenAI-style APIs you approximate it (e.g., a final user nudge or a developer message with the exact opening).",
          },
          { kind: "h", text: "High-value prefill moves" },
          {
            kind: "ul",
            items: [
              "Format lock: '{' guarantees the reply starts as an object.",
              "Anti-preamble: start the answer so there's no room for 'Sure! Here is...'.",
              "Structured openings: '<analysis>' forces reasoning before '<answer>'.",
              "Tone lock: begin with the register you want continued.",
            ],
          },
          { kind: "h", text: "Limits" },
          {
            kind: "ul",
            items: [
              "Only controls the beginning — the tail can still wander; pair with schemas/stop sequences.",
              "Some providers forbid or ignore prefills; test conformance per backend.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Prefill support is a per-provider conformance test: same prompt, expect the response to begin with your primed token. Where unsupported, verify your fallback (schema mode) produces the same first-token guarantee.",
          },
        ],
        takeaways: [
          "Prefilling exploits continuation: you write the first tokens, the model finishes.",
          "Kills preambles and locks opening formats for near-zero cost.",
          "Controls the start, not the end — combine with schemas and stop sequences.",
        ],
        practice: [
          "Compare preamble rates on 20 runs with and without an assistant prefill.",
          "Prime '<thinking>' and verify reasoning precedes the answer on 10 problems.",
        ],
        quiz: [
          {
            q: "Prefilling works because LLMs…",
            options: ["Obey the first speaker", "Continue existing text autoregressively", "Require JSON", "Cache prefixes"],
            answer: 1,
            explain: "You're not commanding; you're pre-writing the continuation.",
          },
          {
            q: "Prefilling cannot guarantee…",
            options: ["The opening format", "The entire response shape", "Skipping the preamble", "A starting token"],
            answer: 1,
            explain: "Only the beginning is forced — validate the rest with schemas/stop sequences.",
          },
        ],
      },
      {
        id: "prompt-chaining",
        title: "Prompt Chaining & Decomposition",
        minutes: 7,
        summary:
          "Break one heroic prompt into a pipeline of small, checkable steps. The most reliable 'advanced' technique — because it's just engineering.",
        blocks: [
          {
            kind: "p",
            text: "A single prompt asking for analysis + extraction + formatting + verdict concentrates all failure modes in one call. Chaining splits the job: call 1 extracts facts, call 2 (receiving only the facts) analyses, call 3 formats the verdict. Each link is short, single-purpose and independently measurable — and you can gate between links: if extraction found nothing, skip analysis and say so honestly.",
          },
          { kind: "h", text: "Why chains beat monoliths" },
          {
            kind: "ul",
            items: [
              "Smaller contexts per step → less dilution, better instruction following.",
              "Intermediate artefacts are inspectable and cacheable.",
              "Failures localize: you know which link broke.",
              "Different models per link: cheap extractor, strong analyser, tiny formatter.",
            ],
          },
          { kind: "h", text: "Chain discipline" },
          {
            kind: "ul",
            items: [
              "Type every link's output (Pydantic contracts — Module 2.8.4).",
              "Validate between links; never pass garbage downstream silently.",
              "Budget: N links ≈ N calls; measure total tokens, not per-call.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Chains restore everything classic testing loves: unit tests per link, integration tests across links, and obvious fault isolation. If your AI feature is a monolithic prompt, proposing a chain is a testability refactor — argue it that way.",
          },
        ],
        takeaways: [
          "Chains trade one fragile mega-prompt for small checkable steps.",
          "Typed, validated intermediates make every link unit-testable.",
          "Gate between links; measure whole-chain cost.",
        ],
        practice: [
          "Decompose one monolithic prompt into 3 typed links; unit-test each with 5 inputs.",
          "Add a gate (empty-extraction path) and verify the honest-failure behaviour.",
        ],
        quiz: [
          {
            q: "The main testability win of prompt chaining is…",
            options: [
              "Lower temperature needs",
              "Inspectable, independently testable intermediate steps",
              "No schemas needed",
              "Free caching",
            ],
            answer: 1,
            explain: "Each link becomes a unit with a contract — fault isolation returns.",
          },
          {
            q: "Between chain links you should…",
            options: ["Pass raw text blindly", "Validate the typed output before proceeding", "Retry forever", "Increase temperature"],
            answer: 1,
            explain: "Gates stop garbage from propagating downstream.",
          },
        ],
      },
      {
        id: "constitutional-critique-revise",
        title: "Constitutional AI & Critique-Revise",
        minutes: 7,
        summary:
          "Give the model principles, make it critique its own draft, then revise. Alignment-by-checklist — and a reusable quality loop for any pipeline.",
        blocks: [
          {
            kind: "p",
            text: "Constitutional AI trains alignment from a written 'constitution' — principles like 'be honest about uncertainty' — using AI feedback instead of endless human labels. Its workhorse mechanic is critique-revise: draft an answer, critique it against the principles ('Does claim 3 cite the provided text?'), then produce a revised draft. You can run this loop at inference time with plain prompts, no training required.",
          },
          {
            kind: "code",
            lang: "text",
            title: "The inference-time loop",
            code: "1) Draft   = model(task)\n2) Critique = model(\"Check this draft against the rules:\n             [cite sources, no invented numbers, admit uncertainty].\n             List violations.\" , draft)\n3) Revise  = model(\"Fix the listed violations.\", draft, critique)\n4) (optional) repeat 2-3 once more, with a retry cap",
          },
          { kind: "h", text: "Reality check" },
          {
            kind: "ul",
            items: [
              "Catches surface violations well (format, citations, tone); deep factual errors less so.",
              "A model critiquing itself shares its own blind spots — external verifiers beat self-critique for facts.",
              "Cost roughly doubles per revision round; cap the rounds.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Test the critic, not just the loop: inject known violations into a draft and measure detection rate. A critique step that passes planted defects is decoration. Red-team the constitution itself — ambiguous principles produce inconsistent revisions.",
          },
        ],
        takeaways: [
          "Critique-revise = draft → check against principles → revise; usable at inference time.",
          "Self-critique shares the model's blind spots — verify facts externally.",
          "The critic's detection rate is the metric that matters.",
        ],
        practice: [
          "Plant 3 violations in a draft and measure whether the critique step finds each.",
          "Write 5 constitutional rules for a support bot and test revision consistency across 10 drafts.",
        ],
        quiz: [
          {
            q: "Critique-revise improves drafts by…",
            options: [
              "Fine-tuning mid-conversation",
              "Checking the draft against principles and rewriting",
              "Lowering temperature",
              "Removing the system prompt",
            ],
            answer: 1,
            explain: "An explicit verification pass before publication.",
          },
          {
            q: "Self-critique's structural weakness is…",
            options: [
              "It's too slow",
              "The critic shares the author's blind spots",
              "It needs GPUs",
              "It can't run at inference",
            ],
            answer: 1,
            explain: "Same weights, same misconceptions — external checks complement it.",
          },
        ],
      },
    ],
  },
  {
    title: "Prompt Structure",
    lessons: [
      {
        id: "prompt-structure",
        title: "Anatomy of a Production Prompt",
        minutes: 8,
        summary:
          "Role, Context, Instruction, Examples, Format, Constraints, Output Schema — the seven slots that turn prose into specification.",
        blocks: [
          {
            kind: "p",
            text: "Reliable prompts aren't lucky phrasing; they're filled templates. Seven slots cover nearly everything: Role (who the model is), Context (the situation and relevant facts), Instruction (the task, one per prompt if possible), Examples (boundary cases), Format (shape and length), Constraints (what never to do), Output Schema (machine-checkable contract). Missing slots are where behaviour leaks.",
          },
          {
            kind: "code",
            lang: "text",
            title: "All seven slots, annotated",
            code: "[ROLE]       You are a senior QA triage assistant.\n[CONTEXT]    Bug report below; product = mobile banking app v4.2.\n[INSTRUCTION] Classify severity and suggest the owning team.\n[EXAMPLES]   \"crash on launch\" -> sev 1, team: platform\n             \"typo in tooltip\"  -> sev 4, team: content\n[FORMAT]     Two lines only: SEVERITY: n / TEAM: name\n[CONSTRAINTS] Never invent team names; if unsure, TEAM: triage.\n[SCHEMA]     Severity in {1..4}; team in the provided list.",
          },
          { kind: "h", text: "Delimiters & hygiene" },
          {
            kind: "ul",
            items: [
              "Fence untrusted content: <report>...</report>, XML tags or triple quotes.",
              "One instruction per prompt when you can afford the call.",
              "Put the most important constraints at the top AND bottom.",
              "Version prompts like code — the template is the spec.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Turn the seven slots into a review checklist for every prompt entering production. 'Which slots are empty, and why?' is a review question that has prevented more incidents than any linter.",
          },
        ],
        takeaways: [
          "Seven slots: role, context, instruction, examples, format, constraints, schema.",
          "Fence untrusted input; repeat critical constraints at both ends.",
          "An empty slot is a design decision that should be conscious.",
        ],
        practice: [
          "Audit 3 prompts in your team against the seven-slot checklist; report the gaps.",
          "Rewrite your worst prompt filling every slot; A/B both on 15 cases.",
        ],
        quiz: [
          {
            q: "The 'Constraints' slot exists to…",
            options: [
              "Add politeness",
              "State forbidden behaviours the model must never cross",
              "Reduce tokens",
              "Set temperature",
            ],
            answer: 1,
            explain: "Explicit never-do rules — the negative specification.",
          },
          {
            q: "Untrusted user content should be…",
            options: [
              "Mixed freely with instructions",
              "Fenced with clear delimiters",
              "Upper-cased",
              "Removed entirely",
            ],
            answer: 1,
            explain: "Delimiters help the model (and defenders) separate data from instructions.",
          },
        ],
      },
    ],
  },
  {
    title: "Prompt Templates & Management",
    lessons: [
      {
        id: "prompt-templates-management",
        title: "Templates, Prompty & Version Control for Prompts",
        minutes: 7,
        summary:
          "Prompts are code: templated, versioned, reviewed, diffable. Jinja2, LangChain templates and Prompty give them engineering homes.",
        blocks: [
          {
            kind: "p",
            text: "String-concatenated prompts in application code rot: logic and prose tangle, nobody reviews changes, rollback is folklore. The fix is separation — templates with variables, rendered at call time. Jinja2 gives conditionals and loops; LangChain's PromptTemplate/ChatPromptTemplate standardizes variables and partials; Microsoft's Prompty wraps a prompt with its model config, parameters and test cases in one Markdown-with-frontmatter file — prompt, settings and evals travelling together.",
          },
          {
            kind: "code",
            lang: "yaml",
            title: "Prompty-style file: prompt + config + tests, one artefact",
            code: "---\nname: triage-prompt\nmodel:\n  api: openai\n  configuration: { type: chat, name: gpt-4o }\n  parameters: { temperature: 0 }\nsample:\n  report: \"Crash on upload, v4.2\"\n---\nsystem:\nYou are a QA triage assistant.\nuser:\nClassify this report: {{ report }}",
          },
          { kind: "h", text: "Git discipline that transfers" },
          {
            kind: "ul",
            items: [
              "One prompt per file; changes as PRs with eval diffs attached.",
              "Semantic diffs: word-level diff review plus before/after eval scores.",
              "Registry: a catalogue with owner, version, consumers and deprecation dates.",
              "Rollback = git revert + redeploy; practise it before you need it.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "A prompt change without an eval diff is a code change without tests — say it in those words in review. Your deliverable: a CI job that renders each template, runs its battery, and posts the score delta on the PR.",
          },
        ],
        takeaways: [
          "Templatize (Jinja2/LangChain/Prompty) to separate prompt logic from app code.",
          "Prompty bundles prompt + model config + samples in one versioned file.",
          "PRs, eval diffs and a registry make prompts governable.",
        ],
        practice: [
          "Convert one hardcoded prompt into a template with 2 variables; render and test it.",
          "Draft a prompt-registry entry: owner, version, consumers, eval battery link.",
        ],
        quiz: [
          {
            q: "The core benefit of prompt templates is…",
            options: [
              "Faster models",
              "Separating versioned prompt logic from application code",
              "Smaller models",
              "Free hosting",
            ],
            answer: 1,
            explain: "Review, diff, rollback — engineering practices become possible.",
          },
          {
            q: "A Prompty file uniquely bundles…",
            options: [
              "Only the prompt text",
              "Prompt + model configuration + samples/tests together",
              "GPU settings",
              "Billing info",
            ],
            answer: 1,
            explain: "The artefact carries its own execution context and examples.",
          },
        ],
      },
    ],
  },
  {
    title: "QE-Specific Prompt Libraries",
    lessons: [
      {
        id: "qe-prompt-libraries",
        title: "Build Your QE Prompt Library",
        minutes: 7,
        summary:
          "A reviewed, categorized library of battle-tested prompts turns tribal knowledge into team infrastructure — the prompt equivalent of a test utility suite.",
        blocks: [
          {
            kind: "p",
            text: "Every QA team accumulates magic incantations in chat history. A QE prompt library makes them assets: reviewed templates with named purposes, input variables, expected-output contracts and the eval results that earned their place. Like a shared page-object library, it cuts duplication, standardizes quality and gives new joiners a map of what works.",
          },
          { kind: "h", text: "Categories that cover a QE team's life" },
          {
            kind: "ul",
            items: [
              "Generation: write test cases from a spec; turn bug notes into reproduction steps.",
              "Transformation: logs → summary; requirements → checklist; ticket → Gherkin.",
              "Evaluation: judge answers against a rubric; compare two responses (A/B judging).",
              "Adversarial: injection probes, boundary fuzzers, persona attacks.",
              "Analysis: failure clustering; root-cause hypotheses from stack traces.",
            ],
          },
          { kind: "h", text: "Governance, lightly applied" },
          {
            kind: "ul",
            items: [
              "Each entry: name, owner, version, variables, contract, eval score, last-verified date.",
              "Promotion path: draft → reviewed → recommended; demotion when scores decay.",
              "Quarterly re-eval: models change, libraries must be re-proven.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Start with five prompts you already trust, give each the full entry treatment, and publish. A library of five that's re-evaluated beats a wiki of fifty that isn't.",
          },
        ],
        takeaways: [
          "A QE prompt library = reviewed templates with contracts and eval evidence.",
          "Five categories cover most QE work: generate, transform, evaluate, attack, analyse.",
          "Re-evaluate entries on model upgrades — decay is guaranteed.",
        ],
        practice: [
          "Create 3 library entries from prompts you use today, with contracts and a 10-case score.",
          "Define your promotion criteria in one paragraph; apply it to one entry.",
        ],
        quiz: [
          {
            q: "What separates a library entry from a saved prompt?",
            options: [
              "Length",
              "A contract, owner, version and eval evidence",
              "The model it uses",
              "The language",
            ],
            answer: 1,
            explain: "Engineering metadata makes it trustworthy and maintainable.",
          },
          {
            q: "Entries must be re-evaluated when…",
            options: ["Never", "The underlying model version changes", "The font changes", "Costs drop"],
            answer: 1,
            explain: "Model updates shift behaviour; proven scores expire.",
          },
        ],
      },
    ],
  },
  {
    title: "Prompt Regression Testing",
    lessons: [
      {
        id: "promptfoo",
        title: "Promptfoo: Regression Testing for Prompts",
        minutes: 8,
        summary:
          "Promptfoo runs your prompts against case batteries with pluggable assertions — deterministic, LLM-judged or semantic — and turns results into a CI gate.",
        blocks: [
          {
            kind: "p",
            text: "Promptfoo is an open-source eval harness: a YAML config declares providers (any OpenAI-compatible endpoint), prompts (versioned variants) and test cases with assertions. Run it and you get a matrix — every prompt × case × assertion, scored and diffable. Wire it into CI and a prompt change that regresses cases fails the build, exactly like a code change.",
          },
          {
            kind: "code",
            lang: "yaml",
            title: "A minimal promptfoo config",
            code: "prompts:\n  - \"Classify as bug/feature: {{text}}\"\n  - \"You are QA triage. Classify as bug/feature: {{text}}\"\nproviders: [openai:gpt-4o]\ntests:\n  - vars: { text: \"App crashes on login\" }\n    assert:\n      - type: contains\n        value: \"bug\"\n  - vars: { text: \"Add dark mode please\" }\n    assert:\n      - type: llm-rubric\n        value: \"Answer classifies this as a feature request\"",
          },
          { kind: "h", text: "The assertion toolbox" },
          {
            kind: "ul",
            items: [
              "contains / regex / is-json: cheap deterministic checks.",
              "similar: embedding-distance tolerance for paraphrased gold answers.",
              "llm-rubric: a judge model grades against your criteria — for open-ended output.",
              "python/javascript: custom scorers for anything else.",
              "Red-team generators: auto-produced injection and jailbreak batteries.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "This is your regression suite, finally with tooling. Migration recipe: take your 20 gnarliest real cases, encode gold expectations as assertions, run against prompt v1 and v2, and make the diff the release decision. LLM-judged assertions need their own calibration — spot-check the judge's calls.",
          },
        ],
        takeaways: [
          "Promptfoo = providers × prompts × cases × assertions, as a diffable matrix.",
          "Mix deterministic, semantic and LLM-judged assertions by need.",
          "In CI, prompt regressions fail builds like code regressions do.",
        ],
        practice: [
          "Write a 5-case promptfoo config for one real prompt; run it and read the matrix.",
          "Add one llm-rubric assertion and manually verify the judge on its failures.",
        ],
        quiz: [
          {
            q: "An llm-rubric assertion is best for…",
            options: [
              "Exact string matches",
              "Open-ended outputs judged against criteria",
              "Latency checks",
              "Cost checks",
            ],
            answer: 1,
            explain: "When gold answers can't be string-matched, a judge model applies your rubric.",
          },
          {
            q: "In CI, promptfoo's job is to…",
            options: [
              "Generate training data",
              "Fail builds when prompt/model changes regress the eval battery",
              "Fine-tune models",
              "Replace testers",
            ],
            answer: 1,
            explain: "Eval-driven gates: the prompt equivalent of a failing unit test.",
          },
        ],
      },
    ],
  },
  {
    title: "Prompt vs Context vs Loop vs Harness vs Memory",
    lessons: [
      {
        id: "context-engineering",
        title: "Context Engineering",
        minutes: 7,
        summary:
          "Prompt engineering asks 'what do I say?'; context engineering asks 'what does the model see?'. Building the right window is the senior discipline.",
        blocks: [
          {
            kind: "p",
            text: "The model only knows its context window. Context engineering is the deliberate construction of that window: what evidence to retrieve, how much history to keep, which tools' outputs to include, in what order, at what compression. Prompt engineering is a subset — the instructions are just one component of context. In production systems the hard failures are rarely bad instructions; they're bad windows: stale facts in, fresh facts out, contradictions unresolved.",
          },
          { kind: "h", text: "The context builder's decisions" },
          {
            kind: "ul",
            items: [
              "Selection: retrieve narrowly (top-k relevant), not comprehensively.",
              "Compression: summarize old turns; keep decisions, drop chatter.",
              "Ordering: instructions early, critical constraints late, evidence labelled.",
              "Freshness: timestamp evidence; let the model prefer recency explicitly.",
              "Budgeting: every chunk must earn its tokens against the limit.",
            ],
          },
          { kind: "h", text: "Symptoms of bad context engineering" },
          {
            kind: "ul",
            items: [
              "Correct knowledge exists in the docs but answers stay wrong (retrieval miss).",
              "Answers cite deprecated policy (stale chunk outranked fresh one).",
              "Identical questions get different answers as the chat grows (dilution).",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Your new test layer: context assertions. For scenario X, assert which chunks SHOULD be in the window (retrieval recall) and which shouldn't (precision). Debug answers by inspecting the constructed window first — 'what did the model see?' precedes 'what did it say?'.",
          },
        ],
        takeaways: [
          "Context engineering = constructing the window: selection, compression, order, freshness, budget.",
          "Prompt engineering is one component of it.",
          "Inspect the window before blaming the model.",
        ],
        practice: [
          "Log the assembled context for 10 real queries; grade retrieval recall against known-correct sources.",
          "Rewrite one feature's context assembly to drop 40% of tokens; measure answer quality delta.",
        ],
        quiz: [
          {
            q: "Context engineering is best described as…",
            options: [
              "Writing prettier instructions",
              "Deliberately building everything the model sees per request",
              "Fine-tuning",
              "GPU optimization",
            ],
            answer: 1,
            explain: "The window is the product; the prompt is a component.",
          },
          {
            q: "Answers citing deprecated policy usually indicate…",
            options: ["High temperature", "Stale or mis-ranked context chunks", "Tokenizer bugs", "Small vocabulary"],
            answer: 1,
            explain: "A retrieval/freshness problem — context engineering territory.",
          },
        ],
      },
      {
        id: "loop-engineering",
        title: "Loop Engineering",
        minutes: 6,
        summary:
          "Agent loops need what all loops need: entry conditions, exit conditions, budgets and error paths. Most 'agent flakiness' is missing loop engineering.",
        blocks: [
          {
            kind: "p",
            text: "An agent is a while-loop whose body is an LLM call. Loop engineering is designing that control flow: when to continue, when to stop, what counts as done, how failures retry, and what happens when budgets run out. Models don't know your budget — without explicit limits an uncertain model will keep calling tools because 'keep trying' is a plausible continuation.",
          },
          { kind: "h", text: "The loop contract checklist" },
          {
            kind: "ul",
            items: [
              "Entry: clear goal statement + success criteria the model can self-check.",
              "Exit: explicit completion signal (structured 'DONE' with result), not vibes.",
              "Budgets: max steps, max tokens, max wall time, max cost — hard caps.",
              "Retry policy: per-tool backoff; no identical repeated calls (loop detection).",
              "Failure paths: budget exhausted → honest partial result, not silent truncation.",
            ],
          },
          { kind: "h", text: "Classic loop defects" },
          {
            kind: "ul",
            items: [
              "Infinite retry spirals; oscillation between two tools.",
              "Goal drift: step 12 is solving a different problem than step 1.",
              "Silent no-ops: declaring success without the success criteria being met.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Test loops the way you test state machines: enumerate states (searching, tool-calling, done, failed, budget-exhausted) and transitions, then force each transition. The budget-exhausted path is the most-skipped test in agent QA — and the one production hits first.",
          },
        ],
        takeaways: [
          "Agents are loops: define entry, exit, budgets, retries and failure paths explicitly.",
          "Structured completion signals beat prose 'I think we're done'.",
          "Budget-exhausted behaviour is a first-class test scenario.",
        ],
        practice: [
          "Instrument an agent flow to emit step count, tokens and cost per run; set and test hard caps.",
          "Force a tool to fail every call; verify the loop exits cleanly with an honest message.",
        ],
        quiz: [
          {
            q: "The most reliable completion signal for an agent is…",
            options: [
              "The model saying 'done' in prose",
              "A structured DONE output checked against success criteria",
              "Running out of context",
              "A fixed number of steps",
            ],
            answer: 1,
            explain: "Machine-checkable completion, validated by the harness.",
          },
          {
            q: "Loop detection means…",
            options: [
              "Counting tokens",
              "Catching repeated identical tool calls and breaking out",
              "Measuring latency",
              "Caching responses",
            ],
            answer: 1,
            explain: "Identical call repetition is the signature spiral — interrupt it.",
          },
        ],
      },
      {
        id: "harness-engineering",
        title: "Harness Engineering",
        minutes: 7,
        summary:
          "The harness is everything around the model: tools, parsers, validators, fallbacks, retries. In production, you're mostly testing the harness.",
        blocks: [
          {
            kind: "p",
            text: "Take the model out of an AI product and what remains is the harness — retrieval, tool schemas, output parsers, validators, fallback chains, caches, telemetry and the glue code between them. Practitioners increasingly report that capability gains come less from better models and more from better harnesses. It's also where deterministic engineering applies fully: the harness obeys classic testing, even when the model doesn't.",
          },
          { kind: "h", text: "Harness components and their failure modes" },
          {
            kind: "table",
            head: ["Component", "Typical failure"],
            rows: [
              ["Tool schemas", "Ambiguous descriptions → wrong tool chosen"],
              ["Output parser", "Brittle regex vs schema validation"],
              ["Validator", "Accepts semantically wrong but well-formed output"],
              ["Fallback chain", "Silent degradation nobody monitors"],
              ["Cache", "Stale answers served after data changes"],
              ["Telemetry", "Traces without decision points — unreadable"],
            ],
          },
          { kind: "h", text: "Design moves" },
          {
            kind: "ul",
            items: [
              "Validate everything the model emits before it touches the world.",
              "Degrade in layers: strong model → small model → template answer → honest error.",
              "Make fallbacks observable: users may never notice; dashboards must.",
              "Treat tool descriptions as prompts — version and eval them.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Split your suite explicitly: model tests (statistical, eval-driven) vs harness tests (deterministic, classic). Teams that blur them get flaky suites and false confidence. The deterministic half should run on every commit.",
          },
        ],
        takeaways: [
          "Harness = tools + parsers + validators + fallbacks + telemetry around the model.",
          "Harness defects are deterministic and classically testable.",
          "Fallbacks must be observable; silent degradation is an incident in waiting.",
        ],
        practice: [
          "Inventory one AI feature's harness components; assign a deterministic test to each.",
          "Trigger each fallback layer deliberately and verify user-visible behaviour + alerting.",
        ],
        quiz: [
          {
            q: "Which belongs to the harness, not the model?",
            options: ["Attention layers", "The output validator and fallback chain", "The tokenizer", "The weights"],
            answer: 1,
            explain: "Everything you engineer around the inference call.",
          },
          {
            q: "Tool descriptions should be treated as…",
            options: ["Comments", "Prompts — versioned and eval-tested", "Constants", "Docs only"],
            answer: 1,
            explain: "They steer tool selection; changes to them change behaviour.",
          },
        ],
      },
      {
        id: "memory-engineering",
        title: "Memory Engineering",
        minutes: 7,
        summary:
          "Context is the model's short-term memory; everything persistent is engineered memory. Design it deliberately or inherit its bugs.",
        blocks: [
          {
            kind: "p",
            text: "LLMs are stateless — every request starts blank. 'Memory' is whatever your system re-injects: the conversation window (working memory), summaries of past sessions (episodic), stored user facts and preferences (semantic), retrieved documents (long-term reference). Memory engineering decides what gets written, what gets recalled, when entries expire, and how conflicts resolve.",
          },
          { kind: "h", text: "The memory stack" },
          {
            kind: "table",
            head: ["Layer", "Example", "Failure mode"],
            rows: [
              ["Working", "Current context window", "Overflow, dilution"],
              ["Episodic", "Session summaries", "Lossy compression, wrong emphasis"],
              ["Semantic", "User preference store", "Stale facts, privacy leakage"],
              ["Reference", "Vector store / RAG", "Outdated chunks, poor recall"],
            ],
          },
          { kind: "h", text: "Hard problems nobody skips forever" },
          {
            kind: "ul",
            items: [
              "Staleness: 'user prefers X' from 2023 overriding today's statement.",
              "Conflicts: two memories disagree; resolution policy must exist.",
              "Privacy: memory is personal data — retention windows and deletion must work.",
              "Recall precision: injecting irrelevant memories pollutes the window.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Memory test classes: write→recall (roundtrip), staleness (old vs new fact), conflict (contradictory memories), deletion (right-to-be-forgotten end-to-end), and leakage (user A's memory appearing for user B — a severity-1 finding every time).",
          },
        ],
        takeaways: [
          "Memory is engineered: working, episodic, semantic and reference layers.",
          "Staleness, conflicts and deletion are the durable hard problems.",
          "Cross-user memory leakage is a top-severity defect class.",
        ],
        practice: [
          "If your product has memory, run the staleness test: state a preference, update it later, check which wins.",
          "Draft a deletion test: request forgetting and verify recall fails afterwards.",
        ],
        quiz: [
          {
            q: "The context window is which memory layer?",
            options: ["Semantic", "Working memory", "Reference", "Episodic"],
            answer: 1,
            explain: "It holds the current interaction; everything persistent is beyond it.",
          },
          {
            q: "User A's saved fact appearing in user B's session is…",
            options: [
              "Expected personalization",
              "A privacy/isolation defect — top severity",
              "A caching optimization",
              "Impossible by design",
            ],
            answer: 1,
            explain: "Memory stores must be keyed and isolated per user.",
          },
        ],
      },
      {
        id: "prompt-vs-context-vs-harness",
        title: "The Five Disciplines, Compared",
        minutes: 8,
        summary:
          "Prompt, context, loop, harness, memory — five engineering disciplines around the model. A comparison matrix, and a tester's map for each.",
        blocks: [
          {
            kind: "p",
            text: "The vocabulary matters because each discipline fails differently and is tested differently. Prompt engineering shapes the instruction; context engineering shapes everything the model sees; loop engineering shapes multi-step control flow; harness engineering shapes the machinery around the call; memory engineering shapes what persists across time. Production incidents trace to one of the five — naming it routes the fix.",
          },
          {
            kind: "table",
            head: ["Discipline", "Core question", "Test style"],
            rows: [
              ["Prompt", "Did I say it clearly?", "Battery accuracy, paraphrase robustness"],
              ["Context", "Did it see the right things?", "Retrieval recall/precision, window audits"],
              ["Loop", "Did it stop correctly?", "State-transition tests, budget exhaustion"],
              ["Harness", "Did the machinery hold?", "Deterministic unit/integration tests"],
              ["Memory", "Did the right thing persist?", "Roundtrip, staleness, isolation, deletion"],
            ],
          },
          { kind: "h", text: "Triage heuristic for incidents" },
          {
            kind: "ul",
            items: [
              "Wrong style or format → prompt.",
              "Right knowledge exists but wasn't used → context.",
              "Too many steps, never finishes, repeats → loop.",
              "Crashes, mis-parses, stale cache → harness.",
              "Remembers wrong things or forgets → memory.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Structure your AI test strategy around these five rows. Each has its own suite, its own assertion types and its own owners. One flat 'AI test plan' hides all the seams where real defects live.",
          },
        ],
        takeaways: [
          "Five disciplines: prompt, context, loop, harness, memory — distinct failure surfaces.",
          "Each maps to a different test style, from statistical to fully deterministic.",
          "Incident triage starts by naming the discipline.",
        ],
        practice: [
          "Take 5 past AI incidents (yours or public postmortems) and classify each into one discipline.",
          "Sketch your team's five-row test strategy table with one concrete suite per row.",
        ],
        quiz: [
          {
            q: "An agent that never stops and repeats tool calls is a ___ problem.",
            options: ["Prompt", "Loop engineering", "Memory", "Tokenizer"],
            answer: 1,
            explain: "Missing exit conditions and budgets — control flow, not wording.",
          },
          {
            q: "Retrieval recall/precision audits belong to…",
            options: ["Context engineering", "Prompt engineering", "Quantization", "RLHF"],
            answer: 0,
            explain: "They measure what the model gets to see — the window itself.",
          },
        ],
      },
    ],
  },
];
