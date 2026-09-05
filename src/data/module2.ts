import type { Section } from "./types";

export const MODULE2_SECTIONS: Section[] = [
  {
    title: "How LLMs Actually Work",
    lessons: [
      {
        id: "how-llms-work",
        title: "How LLMs Actually Work",
        minutes: 9,
        summary:
          "Strip away the mystique: an LLM is a next-token probability engine. Everything else — chat, code, reasoning — emerges from that one mechanic.",
        blocks: [
          {
            kind: "p",
            text: "At each step the model looks at everything so far and assigns a probability to every token in its vocabulary — tens of thousands of them. A sampler picks one token (influenced by temperature, top-p, top-k), it's appended, and the model runs again. 'Hello, how are' → probably 'you'. A full answer is thousands of these coin-flips chained together, autoregressively. No database lookup, no intent parser — just conditioned probability.",
          },
          {
            kind: "code",
            lang: "python",
            title: "The loop that writes novels",
            code: "context = \"The best testing strategy is\"\nfor _ in range(50):\n    probs = model.next_token_probs(context)\n    token = sample(probs, temperature=0.7)\n    context += token\nprint(context)",
          },
          { kind: "h", text: "Why that simple loop explains the symptoms" },
          {
            kind: "ul",
            items: [
              "Hallucination: the most probable continuation can be factually wrong — fluency is not truth.",
              "Nondeterminism: sampling means the same prompt yields different answers run to run.",
              "No internal 'knowledge store': facts live smeared across weights, hence confident errors.",
              "Context dependence: the model only knows what's in the window plus what weights memorized.",
              "Format obedience: it continues patterns — show a pattern, get the pattern.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "This mechanic hands you your test taxonomy: sampling tests (variance across runs), grounding tests (claims vs provided evidence), continuation tests (does it follow your format pattern), and context tests (does it use what you gave it). You're not testing intelligence; you're testing a very powerful pattern-continuer.",
          },
        ],
        takeaways: [
          "LLMs sample the next token from a probability distribution, repeatedly.",
          "Fluency ≠ truth; confidence is a style, not a verification.",
          "Nondeterminism is architectural, not a bug to be filed away.",
        ],
        practice: [
          "Run one factual prompt 10 times at temperature 0.7; count distinct answers. Repeat at temperature 0 and compare.",
          "Give a model a factually wrong premise in the context and observe whether the fluent continuation agrees with you.",
        ],
        quiz: [
          {
            q: "An LLM generates text by…",
            options: [
              "Looking up a database of answers",
              "Repeatedly sampling the most plausible next token",
              "Executing a parse tree",
              "Retrieving whole paragraphs from memory",
            ],
            answer: 1,
            explain: "Autoregressive next-token sampling, one step at a time.",
          },
          {
            q: "Why do identical prompts give different answers?",
            options: ["Server load", "Stochastic sampling from the probability distribution", "The prompt is hashed", "Rate limits"],
            answer: 1,
            explain: "Unless temperature is 0 (and even then, sometimes), sampling injects randomness.",
          },
        ],
      },
    ],
  },
  {
    title: "LLM Training",
    lessons: [
      {
        id: "pretraining-posttraining-finetuning",
        title: "Pretraining, Post-Training & Fine-Tuning",
        minutes: 8,
        summary:
          "LLMs are built in stages: learn language from the internet, learn helpfulness from human feedback, then (optionally) learn your domain from your data.",
        blocks: [
          {
            kind: "p",
            text: "Pretraining is the expensive foundation: predict the next token over trillions of internet tokens until the weights absorb grammar, facts and reasoning patterns. The result — a base model — is a brilliant autocomplete that rambles; ask it a question and it may answer with more questions, because that's what web text does.",
          },
          {
            kind: "p",
            text: "Post-training converts the autocomplete into an assistant: instruction fine-tuning on curated prompt–response pairs, then preference alignment (RLHF/DPO) so it picks helpful, harmless answers over merely probable ones. Fine-tuning is the same machinery applied by you, later: adapting a model to your data — style, formats, domain vocabulary — when prompting alone isn't enough.",
          },
          { kind: "h", text: "The decision ladder for teams" },
          {
            kind: "ul",
            items: [
              "1. Prompt engineering: cheapest, iterate in hours.",
              "2. Retrieval (RAG): inject fresh facts without retraining.",
              "3. Fine-tuning: change behaviour/style/format persistently.",
              "4. Continued pretraining / own model: rare, expensive, last resort.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Every rung on that ladder is a different test strategy: prompts need regression evals, RAG needs retrieval evals, fine-tunes need before/after behavioural suites (including 'did we break general ability?' — catastrophic forgetting is real). Ask which rung a feature uses before designing its tests.",
          },
        ],
        takeaways: [
          "Pretraining = language from scale; post-training = helpfulness from feedback.",
          "Base models autocomplete; instruct models assist.",
          "Escalate prompt → RAG → fine-tune; each rung has its own test suite.",
        ],
        practice: [
          "Prompt a base model (e.g. via API or local GPT-2) with a question and observe autocomplete behaviour vs an instruct model.",
          "For a feature you know, argue which ladder rung fits and what its regression suite would contain.",
        ],
        quiz: [
          {
            q: "A base model given 'What is the capital of France?' might output more questions because…",
            options: [
              "It is broken",
              "It continues web-text patterns rather than following instructions",
              "It lacks a tokenizer",
              "Temperature is too low",
            ],
            answer: 1,
            explain: "Instruction-following is added in post-training; base models just continue text.",
          },
          {
            q: "When is fine-tuning clearly preferable to prompting?",
            options: [
              "When facts change daily",
              "When you need persistent behaviour/style changes and have quality examples",
              "For one-off tasks",
              "Never",
            ],
            answer: 1,
            explain: "Frequently changing facts belong in RAG; stable behavioural shifts suit fine-tuning.",
          },
        ],
      },
      {
        id: "sft-rlhf-dpo-lora",
        title: "SFT, RLHF, DPO & LoRA",
        minutes: 8,
        summary:
          "The alignment cookbook: supervised fine-tuning teaches format, preference learning teaches judgement, and LoRA makes all of it affordable.",
        blocks: [
          {
            kind: "p",
            text: "SFT (Supervised Fine-Tuning): train on thousands of curated (instruction, good response) pairs. Teaches the shape of helpfulness — answer the question, use the format, stop when done. RLHF (Reinforcement Learning from Human Feedback): humans rank pairs of answers, a reward model learns those rankings, and reinforcement learning pushes the LLM toward high-reward outputs. Powerful, famously fiddly to train.",
          },
          {
            kind: "p",
            text: "DPO (Direct Preference Optimization) skips the reward model: it optimizes the LLM directly on preference pairs, same destination with fewer moving parts — much of the recent alignment work has migrated here. LoRA (Low-Rank Adaptation) is the efficiency key: instead of updating billions of weights, train small injected matrices (often <1% of parameters). Result: fine-tunes that fit on one GPU and swap like plugins.",
          },
          {
            kind: "table",
            head: ["Technique", "Teaches", "Cost"],
            rows: [
              ["SFT", "Format & instruction style", "Moderate"],
              ["RLHF", "Human-preferred judgement", "High (extra reward model + RL)"],
              ["DPO", "Preferences, directly", "Moderate–high"],
              ["LoRA", "Any of the above, cheaply", "Low (tiny adapter weights)"],
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Alignment has observable side effects you can test: over-refusals ('I can't discuss knives' in a cooking app), sycophancy (agreeing with your wrong claim), and hedging everywhere. Build a red-team + over-refusal suite; both ends of the safety dial break products.",
          },
        ],
        takeaways: [
          "SFT = format; RLHF/DPO = preference; LoRA = cheap adapter-based training.",
          "DPO reaches RLHF's goal without a separate reward model.",
          "Alignment introduces its own defects: over-refusal and sycophancy are testable.",
        ],
        practice: [
          "Test sycophancy: assert something false confidently and check whether the model corrects you or agrees.",
          "Test over-refusal: phrase 5 benign domain questions in edgy words and record refusal rate.",
        ],
        quiz: [
          {
            q: "What does LoRA change during fine-tuning?",
            options: [
              "All base weights",
              "Small low-rank adapter matrices added to the model",
              "The tokenizer",
              "The context window",
            ],
            answer: 1,
            explain: "LoRA freezes the base and trains tiny injected matrices — cheap and swappable.",
          },
          {
            q: "DPO differs from RLHF mainly by…",
            options: [
              "Using more data",
              "Optimizing on preferences directly, without a separate reward model + RL loop",
              "Being unsupervised",
              "Requiring human labelers at inference",
            ],
            answer: 1,
            explain: "DPO folds the preference objective into a supervised-style loss.",
          },
        ],
      },
    ],
  },
  {
    title: "Inference Parameters",
    lessons: [
      {
        id: "inference-parameters",
        title: "Temperature, top-p, Penalties & Friends",
        minutes: 9,
        summary:
          "The sampling dials decide whether your model is a poet or a clerk. Knowing them turns 'the output changed' from mystery to configuration.",
        blocks: [
          {
            kind: "p",
            text: "After the model produces raw probabilities, sampling parameters shape the pick. Temperature rescales the distribution: 0 → always the top token (near-deterministic), ~0.7 → balanced, 1.5+ → wild. top-p (nucleus) keeps the smallest set of tokens whose probabilities sum to p. top-k keeps only the k most likely. Frequency/presence penalties push down tokens already used — anti-repetition. max_tokens caps the reply; stop sequences halt generation on a marker.",
          },
          { kind: "h", text: "Recipes that ship" },
          {
            kind: "table",
            head: ["Task", "Typical dials"],
            rows: [
              ["Extraction / classification", "temperature 0, small max_tokens"],
              ["Structured JSON", "temperature 0 + JSON mode/schema"],
              ["Code generation", "temperature 0–0.3"],
              ["Brainstorming / marketing", "temperature 0.7–1.0, top-p ~0.9"],
              ["Logs / fixed formats", "stop sequences, tight max_tokens"],
            ],
          },
          { kind: "h", text: "Gotchas" },
          {
            kind: "ul",
            items: [
              "temperature 0 is still not 100% reproducible across providers (GPU nondeterminism, batching).",
              "max_tokens truncation is silent — JSON cut mid-object is the classic.",
              "Penalties too high produce unnatural, repetitive-avoiding gibberish.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Make the dials part of your test matrix: same prompt × {temp 0, 0.7, 1.2} × 5 runs. You'll map exactly where variance lives in your feature — and prove to the team that 'flaky AI' has settings, not ghosts.",
          },
        ],
        takeaways: [
          "Temperature shapes randomness; top-p/top-k trim the candidate set.",
          "Penalties fight repetition; max_tokens and stop sequences enforce shape.",
          "Even temperature 0 doesn't guarantee bit-identical reproducibility.",
        ],
        practice: [
          "Run one prompt at temperatures 0, 0.7 and 1.3; save outputs and describe the behavioural delta.",
          "Set max_tokens low enough to truncate a JSON response; document the failure mode you observe.",
        ],
        quiz: [
          {
            q: "For deterministic data extraction you'd choose…",
            options: ["temperature 1.2", "temperature 0 (or near-0) + tight max_tokens", "high presence penalty", "no stop sequences"],
            answer: 1,
            explain: "Clerk mode: always the top token, bounded output.",
          },
          {
            q: "A response ends with '{\"name\": \"Ada' — most likely cause?",
            options: ["Model refused", "max_tokens truncation", "High temperature", "Wrong tokenizer"],
            answer: 1,
            explain: "Silent truncation mid-JSON is the signature of a too-small max_tokens.",
          },
        ],
      },
      {
        id: "top-k-sampling",
        title: "Top-k Sampling, Deep Dive",
        minutes: 6,
        summary:
          "top-k keeps only the k most probable tokens before sampling. Simple dial, subtle consequences — including famous failure modes.",
        blocks: [
          {
            kind: "p",
            text: "With top-k = 40, the sampler throws away everything outside the 40 most likely next tokens and renormalizes. Small k → conservative, repetitive prose; large k → closer to the raw distribution with its long tail of oddities. Unlike top-p, k is fixed regardless of context — and that rigidity is the interesting part.",
          },
          { kind: "h", text: "The flat-distribution trap" },
          {
            kind: "p",
            text: "Sometimes the model is genuinely uncertain: 200 tokens each plausible (open-ended 'It was a...'). top-k=40 keeps 40 — fine. Other times it's razor-certain: one token at 0.99. top-k=40 still keeps 40, injecting 39 near-zero-probability strays that can occasionally win the lottery and derail the sentence. top-p adapts to the shape of the distribution; top-k doesn't. Modern APIs often default to top-p (or both, with k set high).",
          },
          {
            kind: "callout",
            tone: "tip",
            title: "Rule of thumb",
            text: "Prefer temperature + top-p for generation quality; use top-k when you want a hard floor on conservatism (k=1 is greedy decoding — always the top token).",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "k=1 vs temperature=0: both 'greedy-ish' but not identical in every provider (some apply k before temperature). When reproducibility matters, pin all dials explicitly and record them in the test report — 'model gpt-x, temp 0, top_p 1, seed unset' is a test environment description.",
          },
        ],
        takeaways: [
          "top-k truncates to the k most likely tokens, regardless of confidence shape.",
          "Fixed k misbehaves on both razor-certain and flat distributions.",
          "k=1 = greedy decoding; document all dials as part of the test environment.",
        ],
        practice: [
          "Compare outputs of the same creative prompt with top_k=5 vs top_k=100 (where the API exposes it).",
          "Write your team's 'inference environment' spec sheet: model, temperature, top_p, top_k, max_tokens, seed.",
        ],
        quiz: [
          {
            q: "top-k's weakness versus top-p is that…",
            options: [
              "It's slower",
              "The cutoff is fixed and ignores how peaked or flat the distribution is",
              "It can't be combined with temperature",
              "It only works locally",
            ],
            answer: 1,
            explain: "top-p adapts the candidate set to cumulative probability; top-k is rigid.",
          },
          {
            q: "Setting top_k=1 produces…",
            options: ["Random output", "Greedy decoding — always the most probable token", "Truncation", "Refusals"],
            answer: 1,
            explain: "One candidate means no choice: always argmax.",
          },
        ],
      },
    ],
  },
  {
    title: "Context Window & Tokens",
    lessons: [
      {
        id: "tokenizers-tiktoken",
        title: "Tokenizers in Practice: tiktoken",
        minutes: 7,
        summary:
          "Count tokens before you send them. tiktoken makes the invisible currency of LLMs visible — and budgetable.",
        blocks: [
          {
            kind: "p",
            text: "Every API call is priced and limited in tokens, yet editors show characters. tiktoken (OpenAI's tokenizer library) closes the gap: exact token counts for the model you're calling. English prose averages ~4 characters per token; code and non-Latin scripts run worse — Vietnamese or emoji can be 2–3× the token cost of English for the same text.",
          },
          {
            kind: "code",
            lang: "python",
            title: "Budget before you send",
            code: "import tiktoken\n\nenc = tiktoken.encoding_for_model(\"gpt-4o\")\nprompt = open(\"spec.md\").read()\nn = len(enc.encode(prompt))\nprint(f\"{n} tokens, est. {n/4:.0f} would-be English chars\")\nassert n < 100_000, \"prompt exceeds context budget\"",
          },
          { kind: "h", text: "What changes with the tokenizer" },
          {
            kind: "ul",
            items: [
              "Different models use different vocabularies — counts are not transferable.",
              "Numbers split oddly ('123456' can be 2–3 tokens) — arithmetic suffers.",
              "Whitespace and leading spaces are tokens too.",
              "Tool/function schemas consume tokens on every call.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Add token counts to every prompt test case: input tokens, output tokens, headroom to the limit. A regression suite that tracks token creep catches cost explosions before finance does.",
          },
        ],
        takeaways: [
          "Tokens, not characters, are the unit of cost and limit.",
          "Counts depend on the exact model's tokenizer; measure with tiktoken.",
          "Code, numbers and non-English text cost disproportionately more.",
        ],
        practice: [
          "Count tokens for the same paragraph in English, German and Japanese with tiktoken; compare.",
          "Instrument one real prompt in your product to log token usage per call for a day.",
        ],
        quiz: [
          {
            q: "Why can't you reuse one token count across models?",
            options: [
              "Counts are encrypted",
              "Different models use different tokenizer vocabularies",
              "Tokens expire",
              "APIs hide them",
            ],
            answer: 1,
            explain: "Each model family ships its own merges; the same text splits differently.",
          },
          {
            q: "Which content typically costs the most tokens per meaning?",
            options: ["Plain English prose", "Emoji-heavy or low-resource-language text", "Whitespace-only", "Repeated words"],
            answer: 1,
            explain: "Uncommon scripts and symbols fall back to many small pieces.",
          },
        ],
      },
      {
        id: "cost-math",
        title: "Cost Math for LLMs",
        minutes: 7,
        summary:
          "Pricing is per million tokens, input and output separately. Ten minutes of arithmetic saves real budgets.",
        blocks: [
          {
            kind: "p",
            text: "A typical price sheet: $X per 1M input tokens, $Y per 1M output tokens — and outputs usually cost 3–5× more than inputs, because generation is sequential and compute-heavy. A support copilot sending 2,000 input tokens and receiving 300, at $3/$15 per million, costs (2000·3 + 300·15)/1e6 ≈ $0.0105 per call. At 100k calls/day: ~$1,050/day. Suddenly 'let's add the whole ticket history to the prompt' is a budget decision.",
          },
          { kind: "h", text: "Levers that move the number" },
          {
            kind: "ul",
            items: [
              "Prompt caching: repeated system/context prefixes cached at 50–90% discount.",
              "Smaller models for triage, big models only when needed (routing).",
              "Truncation & summarization: pay to compress now, save on every call.",
              "max_tokens caps: runaway outputs are runaway bills.",
              "Batch APIs: half-price for non-urgent workloads.",
            ],
          },
          {
            kind: "callout",
            tone: "warn",
            title: "Watch out",
            text: "Agentic loops multiply everything: 8 tool-call rounds = 8× the growing context billed again. Cost-test agent flows end-to-end, not per call.",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Load tests should assert cost, not just latency: expected tokens per scenario, p95 cost per session, daily projection at expected traffic. 'Performance testing' for AI includes the invoice.",
          },
        ],
        takeaways: [
          "Cost = (input_tokens·pin + output_tokens·pout) / 1e6; outputs priced higher.",
          "Caching, routing and caps are the main savings levers.",
          "Agent loops re-bill a growing context every step — measure whole flows.",
        ],
        practice: [
          "Price your product's flagship AI flow per call and per day at 3 traffic levels.",
          "Propose one caching or routing change and compute its monthly savings.",
        ],
        quiz: [
          {
            q: "Output tokens usually cost more than input tokens because…",
            options: [
              "They're longer",
              "Generation is sequential and compute-heavy per token",
              "They're encrypted",
              "Marketing",
            ],
            answer: 1,
            explain: "Each output token needs a full forward pass; inputs process in parallel.",
          },
          {
            q: "An agent takes 6 tool-calling steps. Its token bill resembles…",
            options: [
              "One normal call",
              "Roughly the sum of 6 calls over a growing context",
              "A flat fee",
              "Only the final answer's tokens",
            ],
            answer: 1,
            explain: "Each step resends the accumulating history — costs compound.",
          },
        ],
      },
      {
        id: "context-window-limits",
        title: "Context Windows, Stuffing & 'Lost in the Middle'",
        minutes: 8,
        summary:
          "Bigger windows aren't free: attention degrades in the middle, costs grow linearly, and stuffing everything in is a design smell.",
        blocks: [
          {
            kind: "p",
            text: "The context window is the model's working memory — everything it can consider at once, in tokens. Modern models advertise 128k–1M+, but capacity ≠ quality. The 'lost in the middle' effect: information buried mid-context is retrieved worse than the same facts at the start or end. Needle-in-a-haystack tests pass marketing slides and fail real documents.",
          },
          { kind: "h", text: "Context stuffing pitfalls" },
          {
            kind: "ul",
            items: [
              "Dumping 40 pages 'just in case' → diluted attention, slower, pricier, often worse answers.",
              "Contradictory chunks in context → the model picks one arbitrarily.",
              "Irrelevant history → prompt sensitivity spikes (see Module 2.6).",
              "Truncation at the limit silently drops the tail — usually your newest data.",
            ],
          },
          { kind: "h", text: "Better shapes" },
          {
            kind: "ul",
            items: [
              "Retrieve narrowly: top-k relevant chunks, not the whole corpus.",
              "Put key instructions at the start AND repeat critical constraints near the end.",
              "Summarize or compress history; keep raw detail only where needed.",
              "Structure with headers/labels so attention has landmarks.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Your needle test: hide one required fact at position 10%, 50%, 90% of a long context and check compliance at each. Report per-position pass rates — that chart ends the 'just add more context' argument.",
          },
        ],
        takeaways: [
          "Window size is capacity, not attention quality; the middle degrades.",
          "Stuffing everything in hurts accuracy, latency and cost at once.",
          "Narrow retrieval + strategic placement beats brute context.",
        ],
        practice: [
          "Run a 3-position needle test on a long-document feature; tabulate results.",
          "Refactor one stuffed prompt: remove 50% of the context and compare answer quality.",
        ],
        quiz: [
          {
            q: "'Lost in the middle' means…",
            options: [
              "Models forget the system prompt",
              "Facts in the middle of long contexts are used less reliably",
              "Tokens expire mid-stream",
              "APIs drop packets",
            ],
            answer: 1,
            explain: "Retrieval accuracy dips for mid-context information versus the edges.",
          },
          {
            q: "The usual cure for context stuffing is…",
            options: [
              "A bigger window",
              "Narrower retrieval, compression, and deliberate placement",
              "Higher temperature",
              "More penalties",
            ],
            answer: 1,
            explain: "Give the model less, better-positioned evidence.",
          },
        ],
      },
    ],
  },
  {
    title: "Open-Source LLM Landscape",
    lessons: [
      {
        id: "open-vs-closed-llms",
        title: "Open vs Closed LLMs, Agents & the AI Stack",
        minutes: 8,
        summary:
          "Closed models are rented APIs; open-weight models you can run, inspect and modify. The modern AI stack has room for both.",
        blocks: [
          {
            kind: "p",
            text: "Closed (proprietary) models — GPT, Claude, Gemini — arrive as APIs: instant capability, zero ops, but your data crosses the boundary, prices change, and model updates can shift behaviour under you. Open-weight models — Llama, Mistral, Qwen, DeepSeek — ship the weights: you host them, control the data path, and can fine-tune anything, in exchange for GPU bills and ops responsibility. 'Open source' is nuanced: many carry use restrictions (Llama's community licence), while Apache-2.0 models are truly permissive.",
          },
          { kind: "h", text: "The stack, bottom up" },
          {
            kind: "ul",
            items: [
              "Hardware & serving: GPUs, vLLM / TGI / llama.cpp, quantized formats.",
              "Models: base and instruct variants, open-weight or API.",
              "Orchestration: agents, tools, RAG pipelines, gateways.",
              "Applications: copilots, chatbots, workflow automation.",
            ],
          },
          {
            kind: "p",
            text: "A pragmatic pattern: open models for high-volume, privacy-sensitive, latency-critical work; closed frontier models for the hardest reasoning, behind a gateway that can swap providers. Portability lives at the API layer — which is exactly why the OpenAI-compatible standard matters (lesson 2.7.1).",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Test with provider-swappability in mind: pin model versions in every environment ('gpt-4o-2024-11-20', not 'latest'), and keep an eval suite that runs against any backend. Model drift on auto-update is a real production incident class.",
          },
        ],
        takeaways: [
          "Closed = capability-as-a-service; open-weight = control + ops burden.",
          "Licences vary: check what 'open' actually permits.",
          "Hybrid stacks + a swap-friendly API layer are the pragmatic norm.",
        ],
        practice: [
          "List 3 workloads in your org suited to open-weight models and 3 suited to closed APIs, with reasons.",
          "Check the licence of one popular open model and note two restrictions that could matter commercially.",
        ],
        quiz: [
          {
            q: "The strongest argument for open-weight models is…",
            options: [
              "They're always smarter",
              "Data control, customizability and no vendor lock-in",
              "Zero cost",
              "No GPUs needed",
            ],
            answer: 1,
            explain: "You host the weights: data stays, behaviour is tunable — at an ops cost.",
          },
          {
            q: "'Open-weight' automatically means…",
            options: [
              "Free for any commercial use",
              "You can download and run the weights; the licence may still restrict use",
              "Training data is public",
              "No licence exists",
            ],
            answer: 1,
            explain: "Weights availability ≠ freedom; read the licence (Llama Community Licence vs Apache-2.0).",
          },
        ],
      },
      {
        id: "should-use-open-source",
        title: "Should You Use Open-Source LLMs?",
        minutes: 7,
        summary:
          "A decision framework, not a religion: privacy, cost, control and latency on one side; capability and ops simplicity on the other.",
        blocks: [
          {
            kind: "p",
            text: "Choose open-weight when: data cannot leave your perimeter (health, finance, defence); volume makes per-token APIs brutal; you need guaranteed latency or offline operation; you want to fine-tune deeply or inspect internals; vendor lock-in is a board-level risk. Choose closed APIs when: you need frontier reasoning now; the team has no GPU/MLOps muscle; volume is modest; time-to-market beats cost-per-token.",
          },
          { kind: "h", text: "The honest cost model" },
          {
            kind: "table",
            head: ["Factor", "Open-weight", "Closed API"],
            rows: [
              ["Upfront", "GPUs + MLOps effort", "Near zero"],
              ["Marginal per call", "Low at scale", "Linear in tokens"],
              ["Data path", "Yours", "Vendor's"],
              ["Capability ceiling", "A step behind (closing fast)", "Frontier"],
              ["Model updates", "Your schedule", "Vendor's schedule"],
            ],
          },
          {
            kind: "p",
            text: "The break-even intuition: at a few thousand calls/day, APIs win; at millions, self-hosting usually wins — provided you amortize the ops. And nothing stops a phased path: prototype on an API, migrate hot paths to open-weight once volume proves out.",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Whichever path wins, your eval suite is the migration ticket: the same scenarios must pass on the candidate model before any switch. 'Capability parity' is a testable release criterion, not a vibe.",
          },
        ],
        takeaways: [
          "Open-weight trades ops burden for control, privacy and scale economics.",
          "Closed APIs trade cost-at-scale for capability and zero ops.",
          "A shared eval suite makes switching a tested release, not a leap of faith.",
        ],
        practice: [
          "Build a one-page decision matrix for your org's top AI use case; score both paths.",
          "Estimate the monthly API bill at 2× current volume and the rough self-hosting equivalent.",
        ],
        quiz: [
          {
            q: "A hospital that cannot send patient text externally should lean…",
            options: ["Closed API", "Open-weight, self-hosted", "Either — identical data paths", "No AI at all"],
            answer: 1,
            explain: "Data residency requirements push toward weights you host.",
          },
          {
            q: "The main hidden cost of open-weight adoption is…",
            options: ["Licence fees", "MLOps/serving engineering and GPU operations", "Token pricing", "API rate limits"],
            answer: 1,
            explain: "The weights are free-ish; the team that keeps them serving well is not.",
          },
        ],
      },
      {
        id: "base-instruct-coder-reasoning",
        title: "Base vs Instruct vs Coder vs Reasoning Models",
        minutes: 7,
        summary:
          "Model flavours are different products wearing the same family name. Pick the flavour by job, not by leaderboard.",
        blocks: [
          {
            kind: "p",
            text: "Base models are raw autocomplete — great for fine-tuning foundations and perplexity research, awkward for chat. Instruct/chat models are aligned to follow directions: the default for assistants. Coder variants are further trained on code corpora and tool use: better at syntax, repo context and function calling. Reasoning models (o-series style, DeepSeek-R1) spend extra 'thinking' tokens before answering, trading latency and cost for harder problem-solving — and they can overthink simple questions.",
          },
          {
            kind: "table",
            head: ["Flavour", "Best at", "Watch out for"],
            rows: [
              ["Base", "Fine-tuning foundation", "Won't follow instructions out of the box"],
              ["Instruct/chat", "General assistance", "Refusals, sycophancy"],
              ["Coder", "Code gen, tool calls", "Chattier-than-needed prose"],
              ["Reasoning", "Multi-step hard problems", "Latency, cost, overthinking easy tasks"],
            ],
          },
          {
            kind: "callout",
            tone: "tip",
            title: "Routing intuition",
            text: "Cheap fast model for triage and simple answers; reasoning model only for the genuinely hard slice. Most production savings come from not using the biggest model for everything.",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Flavour mismatches are a defect class: a base model in a chat UI, a reasoning model on latency-budgeted paths. Verify the deployed flavour matches the workload — and test the easy-question path of reasoning models for cost blowups.",
          },
        ],
        takeaways: [
          "Base = foundation, instruct = assistant, coder = code & tools, reasoning = deliberate thinking.",
          "Reasoning models buy accuracy with latency and token cost.",
          "Route by difficulty: biggest model only where it earns its keep.",
        ],
        practice: [
          "Classify 5 real prompts from your product into the flavour that should serve them.",
          "Time and price one reasoning-model call vs a standard call on the same medium question.",
        ],
        quiz: [
          {
            q: "Which flavour ships without instruction-following?",
            options: ["Instruct", "Base", "Chat", "Reasoning"],
            answer: 1,
            explain: "Base models continue text; alignment happens later.",
          },
          {
            q: "Reasoning models mainly trade…",
            options: [
              "Accuracy for privacy",
              "Extra thinking tokens (latency + cost) for better multi-step answers",
              "Context for speed",
              "Quality for licence freedom",
            ],
            answer: 1,
            explain: "Chain-of-thought at inference time costs tokens and time.",
          },
        ],
      },
      {
        id: "running-llms-locally",
        title: "Running LLMs Locally",
        minutes: 7,
        summary:
          "Ollama, llama.cpp and LM Studio put capable models on a laptop — a private playground for testers.",
        blocks: [
          {
            kind: "p",
            text: "Local inference is now a one-liner: install Ollama, run 'ollama run llama3.1:8b', chat. Under the hood, llama.cpp (and MLX on Apple silicon) runs quantized GGUF models efficiently on CPUs/GPUs; LM Studio wraps it all in a friendly GUI and even exposes an OpenAI-compatible local server. A 7–8B Q4 model fits in ~5–6 GB RAM and answers briskly on ordinary hardware.",
          },
          { kind: "h", text: "Hardware intuition" },
          {
            kind: "ul",
            items: [
              "Rule of thumb: parameters × bytes-per-weight ≈ memory needed (8B × 0.5 bytes at Q4 ≈ 4 GB, plus overhead).",
              "Unified memory (Apple silicon) punches above its weight for local LLMs.",
              "GPU VRAM > system RAM speed; CPU-only works but is slower.",
            ],
          },
          { kind: "h", text: "Why testers should care" },
          {
            kind: "ul",
            items: [
              "Unlimited free experiment space: prompt variants, red-teaming, no rate limits or billing.",
              "Private data stays private while you build evals.",
              "Deterministic-ish local baselines for CI evals (with seeds and temp 0).",
              "A local OpenAI-compatible endpoint makes provider-swap testing trivial.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Stand up a local model as your team's eval sandbox: run prompt regressions overnight for free, then confirm against the production API. Two environments, one suite — the AI version of dev vs prod.",
          },
        ],
        takeaways: [
          "Ollama / llama.cpp / LM Studio make local inference nearly trivial.",
          "Memory ≈ params × bytes-per-weight; Q4 7–8B fits a laptop.",
          "Local models are free, private sandboxes for evals and red-teaming.",
        ],
        practice: [
          "Install Ollama and run a 7–8B model; ask it to classify 10 bug titles.",
          "Point a script's OpenAI base_url at the local server and re-run one API test unchanged.",
        ],
        quiz: [
          {
            q: "Rough memory for a 13B model at Q4 quantization?",
            options: ["~1 GB", "~7 GB", "~40 GB", "~100 GB"],
            answer: 1,
            explain: "13B × ~0.5 bytes ≈ 6.5 GB plus overhead — about 7–8 GB.",
          },
          {
            q: "The biggest testing advantage of a local model is…",
            options: [
              "Higher intelligence",
              "Free, private, unlimited experimentation for evals",
              "Better UI",
              "Vendor support",
            ],
            answer: 1,
            explain: "No billing, no data leaving the machine — ideal for suites and red-teaming.",
          },
        ],
      },
      {
        id: "quantization-gguf",
        title: "Quantization, GGUF & Safetensors",
        minutes: 8,
        summary:
          "Quantization shrinks weights from 16-bit floats to 4-bit integers: 4× smaller, much faster, slightly dumber. Format wars included.",
        blocks: [
          {
            kind: "p",
            text: "Models ship as weights — originally 16-bit floats (FP16/BF16). Quantization re-encodes them in fewer bits. Q8_0 keeps near-original quality at half size; Q4_K_M — the community sweet spot — quarters the size with modest degradation; Q2 gets desperate. The '_K_M' suffixes are k-quant mixed schemes: sensitive layers keep more bits, the rest fewer. Quality loss isn't uniform — reasoning and long-tail knowledge degrade first, chit-chat barely notices.",
          },
          { kind: "h", text: "Formats you'll meet" },
          {
            kind: "table",
            head: ["Format", "What it is", "Where it lives"],
            rows: [
              ["Safetensors", "Safe, fast tensor storage (full precision)", "Hugging Face hubs, training"],
              ["GGUF", "Single-file format for llama.cpp inference", "Local runners, quantized downloads"],
              ["GGML", "GGUF's predecessor", "Legacy files"],
            ],
          },
          {
            kind: "p",
            text: "Safetensors replaced pickles because loading arbitrary pickles is a remote-code-execution gift — a security fact testers should know. GGUF bundles weights + tokenizer + metadata in one file that llama.cpp/Ollama/LM Studio consume directly, with the quantization baked in (hence filenames like 'mistral-7b-instruct-v0.2.Q4_K_M.gguf').",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Quantization is a behavioural change, not just a packaging one. Run your eval suite across Q8 and Q4 of the same model and diff results — the gap is your quality budget for running locally.",
          },
        ],
        takeaways: [
          "Quantization trades bits for size/speed: Q4_K_M is the popular balance.",
          "Reasoning degrades before chatter as bits drop.",
          "GGUF = inference file with quantization; safetensors = safe full-precision storage.",
        ],
        practice: [
          "Download Q4 and Q8 of the same small model; run 10 identical prompts and diff outputs.",
          "Explain in two sentences why safetensors replaced pickle files.",
        ],
        quiz: [
          {
            q: "What does Q4_K_M roughly mean?",
            options: [
              "4-bit mixed-precision quantization",
              "4 layers removed",
              "Version 4 of the model",
              "4 GPU mode",
            ],
            answer: 0,
            explain: "4-bit weights with a mixed k-quant scheme keeping sensitive parts sharper.",
          },
          {
            q: "Why did the ecosystem move from pickle to safetensors?",
            options: [
              "Smaller files",
              "Loading pickles can execute arbitrary code — safetensors can't",
              "Faster downloads",
              "Legal reasons",
            ],
            answer: 1,
            explain: "Model files are data, not programs; safetensors enforces that.",
          },
        ],
      },
    ],
  },
  {
    title: "LLM Failure Modes",
    lessons: [
      {
        id: "hallucinations",
        title: "Hallucination: Patterns & Causes",
        minutes: 8,
        summary:
          "Confident, fluent, wrong. Hallucinations aren't glitches — they're the sampling mechanism doing its job without a truth constraint.",
        blocks: [
          {
            kind: "p",
            text: "Two species: intrinsic hallucination (contradicts the provided context — your spec says v2, the summary says v3) and extrinsic (claims beyond the context — invented citations, fake library functions). Causes stack: training data contains errors and fictions; next-token sampling optimizes plausibility, not truth; decoding under uncertainty averages into confident-sounding middles; retrieval returns wrong chunks that get 'cited'.",
          },
          { kind: "h", text: "The patterns you'll actually meet" },
          {
            kind: "ul",
            items: [
              "Invented references: papers, URLs, API methods that almost exist.",
              "Precision laundering: false facts dressed in exact numbers and dates.",
              "Entity blending: attributes of two real things merged into one.",
              "Sycophantic agreement: 'you're right!' to your false premise.",
              "Zombie answers: repeating a retracted claim later in the same chat.",
            ],
          },
          { kind: "h", text: "Mitigations that earn their keep" },
          {
            kind: "ul",
            items: [
              "Grounding: require answers from provided context; ask for citations you can verify.",
              "RAG with retrieval quality metrics (wrong chunk in → hallucination out).",
              "Structured output + schema validation (Module 2.8).",
              "Verification passes: a second call or tool checks the claim.",
              "Calibrated refusal: 'I don't know' must be a rewarded output.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Build a hallucination eval: questions whose true answers are NOT in the provided context. Correct behaviour is refusal or 'not in the docs'; every confident answer is a counted defect. Track the rate per release.",
          },
        ],
        takeaways: [
          "Intrinsic = contradicts context; extrinsic = invents beyond it.",
          "Plausibility optimization makes confidence a poor truth signal.",
          "Grounding, citations, verification and rewarded 'I don't know' are the defence stack.",
        ],
        practice: [
          "Create 10 unanswerable-from-context questions; measure the confident-wrong rate.",
          "Find one 'almost exists' hallucination (fake API method) and document how a schema/tool check would catch it.",
        ],
        quiz: [
          {
            q: "A summary claims a feature your provided spec never mentions. That's…",
            options: ["Intrinsic hallucination", "Extrinsic hallucination", "Data drift", "Overfitting"],
            answer: 1,
            explain: "Extrinsic = content beyond (unsupported by) the given context.",
          },
          {
            q: "The most direct structural defence against invented facts is…",
            options: [
              "Higher temperature",
              "Grounding answers in retrieved context with verifiable citations",
              "Longer system prompts",
              "Bigger context windows",
            ],
            answer: 1,
            explain: "Constrain generation to evidence and make the evidence checkable.",
          },
        ],
      },
      {
        id: "prompt-sensitivity-variance",
        title: "Prompt Sensitivity & Output Variance",
        minutes: 7,
        summary:
          "Rephrase a prompt, flip the answer. LLM behaviour is a distribution, not a function — so test it like one.",
        blocks: [
          {
            kind: "p",
            text: "LLMs are notoriously sensitive to paraphrase, word order, even capitalization: 'Is this a bug?' vs 'Classify: bug or not?' can move accuracy by double digits. Layer sampling variance on top — same prompt, different outputs run to run — and you get behaviour that classic testing considers 'flaky'. It isn't flaky; it's stochastic. The right mental model is a probability distribution over outputs for each input.",
          },
          { kind: "h", text: "Measuring the spread" },
          {
            kind: "ul",
            items: [
              "Run N samples (10–20) per case; record pass-rate, not pass/fail.",
              "pass@k / majority-vote accuracy: does the right answer appear reliably?",
              "Semantic dedup of outputs: 20 runs may produce only 3 real variants.",
              "Sensitivity sweep: paraphrase battery × runs, chart the worst case.",
            ],
          },
          { kind: "code",
            lang: "python",
            title: "A minimal variance probe",
            code: "results = [ask(prompt) for _ in range(15)]\nvariants = len(set(normalize(r) for r in results))\npass_rate = sum(is_correct(r) for r in results) / 15\nprint(f\"{variants} variants, pass@15 = {pass_rate:.0%}\")",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Retire binary assertions for generative features. Your report card becomes: 'extraction accuracy 93% ± 4 over 20 runs; 2 semantic variants observed'. Statistically honest, still a hard gate.",
          },
        ],
        takeaways: [
          "Outputs are samples from a distribution; variance is architecture, not flakiness.",
          "Measure pass@k and semantic variant counts, not single runs.",
          "Paraphrase batteries expose sensitivity that single prompts hide.",
        ],
        practice: [
          "Write 6 paraphrases of one production prompt; run each 5× and chart the accuracy spread.",
          "Convert one binary test case into a pass-rate test with a threshold and sample size.",
        ],
        quiz: [
          {
            q: "Same prompt, 20 runs, 17 correct. The honest report is…",
            options: [
              "'Passed'",
              "'Failed'",
              "'85% pass-rate over 20 samples'",
              "'Flaky — rerun until green'",
            ],
            answer: 2,
            explain: "Stochastic systems get statistical assertions.",
          },
          {
            q: "Accuracy swinging with paraphrase is called…",
            options: ["Prompt sensitivity", "Concept drift", "Quantization error", "Token rot"],
            answer: 0,
            explain: "Surface-form changes altering behaviour — a core robustness dimension.",
          },
        ],
      },
      {
        id: "reasoning-failures-cot",
        title: "Reasoning Failures & CoT Breakdown",
        minutes: 7,
        summary:
          "Chain-of-thought makes models show their work — and exposes exactly where the work falls apart.",
        blocks: [
          {
            kind: "p",
            text: "Ask for step-by-step reasoning and models solve many multi-step problems they'd otherwise botch. But the chain is generated text, not computation: arithmetic slips mid-chain, constraints stated in line 2 are forgotten by line 8, and the model can write a beautifully confident step that doesn't follow from the previous one. 'Reasoning' degrades with step count — each step is another sampling event with its own error probability.",
          },
          { kind: "h", text: "Classic breakdowns" },
          {
            kind: "ul",
            items: [
              "Counting & comparison failures ('which is larger: 9.11 or 9.9?').",
              "Constraint amnesia in long plans.",
              "Irreversible early errors: a wrong step 2 poisons the whole chain.",
              "Faithless chains: the conclusion was sampled first, the 'reasoning' rationalizes it.",
            ],
          },
          { kind: "h", text: "Making reasoning trustworthy" },
          {
            kind: "ul",
            items: [
              "Offload computation: let tools calculate, let the model orchestrate.",
              "Verify intermediate steps (self-consistency, checker models).",
              "Shorten chains: decompose into smaller validated steps (prompt chaining, Module 3).",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "When a feature uses CoT, test the chain, not just the answer: inject a wrong intermediate fact and see if the model notices; count how often the final answer contradicts its own shown steps. Faithfulness is a testable property.",
          },
        ],
        takeaways: [
          "CoT helps multi-step tasks but chains are text — they drift, forget and miscompute.",
          "Error probability compounds with chain length.",
          "Tools for math, verification for steps, decomposition for length.",
        ],
        practice: [
          "Give a 5-step word problem; identify which step the model gets wrong most often across 10 runs.",
          "Inject a contradiction mid-chain and record whether the model recovers or plows on.",
        ],
        quiz: [
          {
            q: "Why do reasoning errors compound in long chains?",
            options: [
              "Memory leaks",
              "Each generated step is a sampling event that can err, feeding the next",
              "GPUs throttle",
              "Tokens expire",
            ],
            answer: 1,
            explain: "A wrong step becomes context for every following step.",
          },
          {
            q: "The most reliable fix for arithmetic inside reasoning is…",
            options: [
              "Asking more politely",
              "Delegating calculation to a tool (calculator/code)",
              "Higher temperature",
              "Longer context",
            ],
            answer: 1,
            explain: "Let deterministic software compute; let the model decide and explain.",
          },
        ],
      },
      {
        id: "context-rot",
        title: "Context Rot in Long Inputs",
        minutes: 7,
        summary:
          "Long contexts don't just cost more — they actively degrade instruction following, retrieval and consistency.",
        blocks: [
          {
            kind: "p",
            text: "'Context rot' is the practitioner's name for quality decay as the window fills: instructions followed less precisely, relevant facts retrieved less reliably, tone and format drifting. Part is lost-in-the-middle attention physics; part is interference — irrelevant or contradictory material actively distracts; part is instruction dilution, where your one crisp rule drowns in 40 pages.",
          },
          { kind: "h", text: "Symptoms checklist" },
          {
            kind: "ul",
            items: [
              "Format compliance drops as history grows.",
              "The model answers stale early questions instead of the latest.",
              "Repeated instructions get 'averaged' with older contradictory ones.",
              "Needle-in-haystack recall falls below the provider's marketing chart.",
            ],
          },
          { kind: "h", text: "Countermeasures" },
          {
            kind: "ul",
            items: [
              "Compress history aggressively (summarize, keep decisions not chatter).",
              "Restate critical constraints near the end of context.",
              "Prune: remove retrieved chunks that didn't earn their tokens.",
              "Architect for short contexts: session memory outside the window.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Context-rot regression: fix a task battery, run it at context fills of 10%, 50%, 90% (padded with realistic history), and chart pass-rate vs fill. That curve is one of the most useful artifacts an AI QA team can own.",
          },
        ],
        takeaways: [
          "Quality decays with context fill: attention, interference and dilution.",
          "Stale-context answers and format drift are the tell-tale symptoms.",
          "Compress, restate at the end, and prune unearned context.",
        ],
        practice: [
          "Run the same 5-question battery at three context-fill levels; plot the decay curve.",
          "Take one long chat feature and design a history-summarization policy with test cases.",
        ],
        quiz: [
          {
            q: "Instructions being followed worse as a chat grows long is…",
            options: ["Data drift", "Context rot / instruction dilution", "Overfitting", "Quantization"],
            answer: 1,
            explain: "The window's contents degrade the model's adherence to the rules within it.",
          },
          {
            q: "Where should critical constraints go in a long context?",
            options: [
              "Only at the very start",
              "Restated near the end as well",
              "In the middle, once",
              "They shouldn't — constraints hurt quality",
            ],
            answer: 1,
            explain: "Start and end get the strongest attention; the middle is the danger zone.",
          },
        ],
      },
    ],
  },
  {
    title: "LLM APIs",
    lessons: [
      {
        id: "openai-compatible-api",
        title: "The OpenAI-Compatible API Standard",
        minutes: 7,
        summary:
          "One request shape conquered the industry: /v1/chat/completions with a messages array. Learn it once, talk to dozens of providers.",
        blocks: [
          {
            kind: "p",
            text: "OpenAI's chat API became the de-facto standard: POST /v1/chat/completions with a JSON body containing model, messages (a role-tagged conversation), and sampling parameters. Together, Groq, Mistral, DeepSeek, Ollama, vLLM, LM Studio, Azure OpenAI and many more expose the same contract — so switching providers is often a base_url and API-key change, not a rewrite.",
          },
          {
            kind: "code",
            lang: "bash",
            title: "The universal shape",
            code: "curl https://api.example.com/v1/chat/completions \\\n  -H \"Authorization: Bearer $KEY\" \\\n  -H \"Content-Type: application/json\" \\\n  -d '{\"model\": \"my-model\",\n       \"messages\": [{\"role\": \"user\", \"content\": \"Say hi\"}],\n       \"temperature\": 0}'",
          },
          { kind: "h", text: "Where the standard frays" },
          {
            kind: "ul",
            items: [
              "Feature support varies: JSON mode, tools, vision and logprobs differ per provider.",
              "Model names are vendor-specific strings.",
              "Rate limits, error payloads and retry semantics differ.",
              "Some 'compatible' servers lag behind newer fields (reasoning content, cached tokens).",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Treat provider compatibility as a conformance suite: the same 10 request shapes (plain chat, JSON mode, tool call, streaming, long input…) run against every backend you support. Failures become per-provider notes in your test matrix.",
          },
        ],
        takeaways: [
          "model + messages + params over /v1/chat/completions is the lingua franca.",
          "Gateways (LiteLLM, Portkey) exploit it for multi-provider routing.",
          "Advanced features are where 'compatible' stops — test conformance per provider.",
        ],
        practice: [
          "Send the same chat request to two different compatible endpoints (e.g. OpenAI and a local Ollama); diff the response JSON.",
          "List which advanced fields (tools, response_format…) each of your providers actually supports.",
        ],
        quiz: [
          {
            q: "The core payload of the standard chat API is…",
            options: [
              "A single prompt string only",
              "model + messages array with roles + sampling params",
              "An embedding vector",
              "A file upload",
            ],
            answer: 1,
            explain: "The role-tagged messages conversation is the heart of the contract.",
          },
          {
            q: "Switching from one compatible provider to another usually requires…",
            options: [
              "Rewriting the app",
              "Changing base_url + API key (and verifying feature parity)",
              "A new tokenizer library",
              "Re-training",
            ],
            answer: 1,
            explain: "Same contract; verify the advanced features you rely on exist.",
          },
        ],
      },
      {
        id: "sdks",
        title: "SDKs: Reliable Calls in Practice",
        minutes: 7,
        summary:
          "The SDKs handle auth, retries and streaming — but timeouts, idempotency and error budgets are still your problem.",
        blocks: [
          {
            kind: "p",
            text: "Official SDKs (openai for Python/JS/TS, plus vendor SDKs) wrap HTTP with typed requests, automatic retries with exponential backoff on 429/5xx, streaming iterators for token-by-token delivery, and helpers for tools and structured outputs. They're the right default — hand-rolled HTTP clients quietly miss edge cases like idempotency keys and partial-stream failures.",
          },
          {
            kind: "code",
            lang: "python",
            title: "Production-shaped call",
            code: "from openai import OpenAI\n\nclient = OpenAI(timeout=30, max_retries=3)\nresp = client.chat.completions.create(\n    model=\"gpt-4o\",\n    messages=[{\"role\": \"user\", \"content\": \"Extract the SKU\"}],\n    temperature=0,\n    max_tokens=200,\n)\nprint(resp.choices[0].message.content)",
          },
          { kind: "h", text: "Error taxonomy to test" },
          {
            kind: "ul",
            items: [
              "429 rate limit: respect Retry-After; queue, don't hammer.",
              "400 invalid request: context too long, bad JSON — a test input class of its own.",
              "Timeouts: set them explicitly; a 120s default can stall your whole service.",
              "Partial streams: connection dies mid-response — handle incomplete output.",
              "Content policy refusals: distinguish model refusal from transport failure.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Your API test suite should include: oversized prompt (400), burst traffic (429 handling), killed connections mid-stream, and refusal responses — each with the app's expected degradation path. AI reliability testing is API reliability testing with weirder payloads.",
          },
        ],
        takeaways: [
          "Official SDKs give retries, typing and streaming for free — use them.",
          "Set timeouts and retry budgets explicitly; defaults are rarely right.",
          "Refusals, truncations and partial streams are test cases, not anomalies.",
        ],
        practice: [
          "Write tests for 429 and oversized-prompt handling in your app; verify user-visible behaviour.",
          "Kill a streaming call mid-response and document what the UI shows.",
        ],
        quiz: [
          {
            q: "An HTTP 429 from an LLM API means…",
            options: [
              "Invalid JSON",
              "Rate limited — back off using Retry-After",
              "Model not found",
              "Content policy refusal",
            ],
            answer: 1,
            explain: "Throttling; exponential backoff (which SDKs do) plus queueing.",
          },
          {
            q: "Why set client timeouts explicitly?",
            options: [
              "SDKs have none",
              "Generous defaults can hang your service during slow generations",
              "Timeouts reduce cost",
              "They're required by law",
            ],
            answer: 1,
            explain: "LLM calls can take tens of seconds; unbounded waits cascade into outages.",
          },
        ],
      },
    ],
  },
  {
    title: "Structured Outputs",
    lessons: [
      {
        id: "json-mode",
        title: "JSON Mode",
        minutes: 6,
        summary:
          "response_format: json_object guarantees syntactically valid JSON — not the JSON you wanted, but a foundation to build on.",
        blocks: [
          {
            kind: "p",
            text: "Plain chat responses are free text; downstream parsers choke on prose. JSON mode constrains decoding so the output is valid JSON. Two catches everyone meets: the prompt must mention 'JSON' (providers enforce this), and valid ≠ correct-shape — the model may return '{\"answer\": \"maybe\"}' when you needed '{\"verdict\": \"bug\", \"severity\": 2}'. It's a syntax guarantee, not a schema guarantee.",
          },
          {
            kind: "code",
            lang: "python",
            title: "JSON mode + example = decent results",
            code: "resp = client.chat.completions.create(\n    model=\"gpt-4o\",\n    response_format={\"type\": \"json_object\"},\n    messages=[\n        {\"role\": \"system\", \"content\": \"Return JSON only.\"},\n        {\"role\": \"user\", \"content\":\n         'Classify: \"Login fails on Safari\". '\n         'JSON: {\"category\": str, \"severity\": int}'},\n    ],\n)",
          },
          { kind: "h", text: "Failure modes that survive JSON mode" },
          {
            kind: "ul",
            items: [
              "Wrong keys or nesting vs your schema.",
              "Truncation at max_tokens still yields... invalid JSON after all (cut mid-string).",
              "Numeric fields as strings ('\"severity\": \"2\"').",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Test in two layers: (1) JSON syntax validity rate, (2) schema conformance rate. They fail independently; your assertions should too. Track both per release.",
          },
        ],
        takeaways: [
          "JSON mode guarantees parseable JSON, not your schema.",
          "The prompt must reference JSON; truncation still breaks outputs.",
          "Validate syntax and schema as separate test layers.",
        ],
        practice: [
          "Enable JSON mode and count schema violations across 30 runs of a classification prompt.",
          "Demonstrate truncation: force a low max_tokens and observe the parser error.",
        ],
        quiz: [
          {
            q: "JSON mode guarantees…",
            options: [
              "Your exact schema",
              "Syntactically valid JSON output",
              "Faster responses",
              "No hallucinations",
            ],
            answer: 1,
            explain: "Parsing succeeds; shape conformance is still your job.",
          },
          {
            q: "A common provider requirement for JSON mode is…",
            options: [
              "Temperature 2",
              "The prompt must mention JSON",
              "A paid tier",
              "Vision input",
            ],
            answer: 1,
            explain: "Omit 'JSON' from the prompt and some providers throw a 400.",
          },
        ],
      },
      {
        id: "instructor",
        title: "Instructor: Pydantic-Validated LLM Calls",
        minutes: 7,
        summary:
          "Instructor patches the OpenAI client so LLM outputs arrive as validated Pydantic objects — with automatic retries when validation fails.",
        blocks: [
          {
            kind: "p",
            text: "Instructor's pitch: define a Pydantic model, patch the client, and chat.completions.create returns instances of your class. It generates the JSON schema from your types, steers the model with it (function-calling or JSON mode under the hood), validates the response, and — this is the killer feature — retries with the validation error appended when the output doesn't conform.",
          },
          {
            kind: "code",
            lang: "python",
            title: "Typed extraction in ~10 lines",
            code: "import instructor\nfrom openai import OpenAI\nfrom pydantic import BaseModel\n\nclass Bug(BaseModel):\n    title: str\n    severity: int  # 1-5\n\nclient = instructor.from_openai(OpenAI())\nbug = client.chat.completions.create(\n    model=\"gpt-4o\",\n    response_model=Bug,\n    max_retries=3,\n    messages=[{\"role\": \"user\",\n              \"content\": \"Extract: app crashes on upload, blocks release\"}],\n)\nprint(bug.severity + 1)  # real int, guaranteed",
          },
          { kind: "h", text: "What you gain" },
          {
            kind: "ul",
            items: [
              "Field types enforced (int is int, enum is enum).",
              "Field-level validators run on every response.",
              "Retry-with-error dramatically lifts conformance at small cost.",
              "Works across providers (patch their clients too).",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Instructor turns schema conformance into an exception you can count: log retry counts per prompt. A prompt needing 3 retries on 20% of calls is a defect metric — optimize the prompt, not the retry budget.",
          },
        ],
        takeaways: [
          "Instructor = Pydantic schema → model → validated object, with error-aware retries.",
          "Validation failures become structured, countable events.",
          "Retry-rate is a prompt-quality metric in disguise.",
        ],
        practice: [
          "Model one feature's expected output as a Pydantic class and extract it with Instructor.",
          "Add a validator (e.g. severity 1–5) and watch a retry happen with a deliberately hard prompt.",
        ],
        quiz: [
          {
            q: "Instructor's retry mechanism works by…",
            options: [
              "Restarting the server",
              "Resending with the validation error so the model can correct itself",
              "Lowering temperature",
              "Switching providers",
            ],
            answer: 1,
            explain: "Feedback-driven self-correction at the schema level.",
          },
          {
            q: "With Instructor, an int field arrives in Python as…",
            options: ["A string", "A real int, validated", "JSON text", "A float always"],
            answer: 1,
            explain: "Typed, validated objects — the parser and schema live in one class.",
          },
        ],
      },
      {
        id: "outlines",
        title: "Outlines: Constrained Decoding",
        minutes: 7,
        summary:
          "Outlines doesn't ask the model nicely — it forbids invalid tokens during generation. The output can't violate the grammar, by construction.",
        blocks: [
          {
            kind: "p",
            text: "Prompting and validation are after-the-fact: generate, then check, maybe retry. Outlines intervenes during generation: at each sampling step it computes which tokens could still lead to valid output (per your regex, JSON schema or grammar) and zeroes out the rest. The result is guaranteed-conforming output on the first pass — no retries, no invalid JSON, ever. It runs against local models (transformers, llama.cpp, vLLM backends).",
          },
          {
            kind: "code",
            lang: "python",
            title: "Regex-constrained generation",
            code: "import outlines\n\nmodel = outlines.models.transformers(\"mistralai/Mistral-7B-v0.1\")\ngen = outlines.generate.regex(model, r\"(bug|feature|question):\\s[\\w ]+\")\nprint(gen(\"Classify: 'dark mode request'\"))\n# e.g. \"feature: dark mode request\" — format guaranteed",
          },
          { kind: "h", text: "Trade-offs" },
          {
            kind: "ul",
            items: [
              "Needs access to logits — so it's a local/open-model technique (some providers now ship equivalents).",
              "Over-tight grammars can force unnatural wording inside a valid shell.",
              "Schema-guided JSON mode from providers is the hosted-API cousin.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Constrained decoding changes your test focus: syntax tests become obsolete by construction; content-quality tests become everything. Does the forced format distort the answer? That's the new defect class.",
          },
        ],
        takeaways: [
          "Constrained decoding masks invalid tokens during sampling — guarantees by construction.",
          "Regex, JSON schema and full grammars are supported.",
          "It's primarily a local-model technique; quality-under-constraint is the new risk.",
        ],
        practice: [
          "Define a regex for a ticket ID format and generate 20 constrained samples; verify 100% conformance.",
          "Compare answer quality with and without a tight constraint on the same prompt.",
        ],
        quiz: [
          {
            q: "Outlines guarantees valid output by…",
            options: [
              "Retrying on failure",
              "Masking disallowed tokens during generation",
              "Post-hoc validation",
              "Fine-tuning the model",
            ],
            answer: 1,
            explain: "Invalid continuations are removed from the distribution before sampling.",
          },
          {
            q: "Constrained decoding mainly requires…",
            options: ["A paid API", "Access to the model's logits (local/open models)", "A bigger context", "JSON mode"],
            answer: 1,
            explain: "You must modify the sampling step — hence local-model territory.",
          },
        ],
      },
      {
        id: "pydantic-generation",
        title: "Pydantic-Guided Generation: Schemas as Contracts",
        minutes: 7,
        summary:
          "When the LLM's output schema lives as code — validated, versioned, documented — contract testing finally applies to AI.",
        blocks: [
          {
            kind: "p",
            text: "The pattern: Pydantic models are the single source of truth for what an LLM must return. The same class generates the steering schema (via Instructor or provider schema modes), validates every response, and documents the contract for humans. Change the class, the contract changes everywhere — versioned in Git like any API schema.",
          },
          {
            kind: "code",
            lang: "python",
            title: "One class, three jobs",
            code: "from pydantic import BaseModel, Field\nfrom enum import Enum\n\nclass Verdict(str, Enum):\n    BUG = \"bug\"\n    FEATURE = \"feature\"\n\nclass Triage(BaseModel):\n    verdict: Verdict\n    confidence: float = Field(ge=0, le=1)\n    reason: str = Field(max_length=200)\n# -> steering schema + runtime validation + docs",
          },
          { kind: "h", text: "Contract-testing the LLM" },
          {
            kind: "ul",
            items: [
              "Consumer tests: every downstream component codes against the class, not string parsing.",
              "Provider tests: N runs must produce class-valid instances above a threshold.",
              "Semantic validators: 'confidence' correlates with actual accuracy — measurable.",
              "Versioning: schema bumps are releases; old prompts must still satisfy old consumers.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "You now have an oracle with teeth: Pydantic's ValidationError is an unambiguous defect signal. Build a dashboard of validation-failure rate per prompt × per model version. When it spikes, you know exactly where to look.",
          },
        ],
        takeaways: [
          "Schema-as-code unifies steering, validation and documentation.",
          "Validation errors are structured defect signals — count them.",
          "Treat schema changes as API versioning events.",
        ],
        practice: [
          "Convert one prompt's expected output into a Pydantic class with 2+ Field constraints.",
          "Run 50 generations; report the validation-failure rate and the top offending field.",
        ],
        quiz: [
          {
            q: "The main benefit of Pydantic-as-contract is…",
            options: [
              "Faster models",
              "One versioned source of truth for steering, validation and docs",
              "Cheaper tokens",
              "Smaller models",
            ],
            answer: 1,
            explain: "The class is simultaneously prompt input, runtime check and documentation.",
          },
          {
            q: "A ValidationError spike after a model upgrade signals…",
            options: [
              "Nothing — retries fix it",
              "A contract regression worth blocking the rollout on",
              "Cheaper pricing",
              "Tokenizer change only",
            ],
            answer: 1,
            explain: "Structured outputs make model upgrades contract-testable — use that.",
          },
        ],
      },
    ],
  },
];
