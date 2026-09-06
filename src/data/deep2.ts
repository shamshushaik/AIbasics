import type { DeepContent } from "./types";

export const DEEP2: Record<string, DeepContent> = {
  "how-llms-work": {
    hook: "An LLM is the world's most confident autocomplete. Give it 'The deploy failed because', and it assigns a probability to all ~100,000 words in its vocabulary, rolls weighted dice, appends the winner, and repeats — thousands of times. No database lookup, no intent parser, no understanding. Just 'what comes next, given everything so far?' Fluency is a side effect of doing that prediction extremely well.",
    worked: {
      title: "Worked example: watching one answer get written",
      steps: [
        { head: "The prompt enters", body: "'What is a test oracle?' is tokenized into pieces, each becoming a vector. The model now holds your whole prompt as its complete universe — it knows nothing else exists." },
        { head: "Step 1 of the loop", body: "Given the prompt, it scores every vocabulary token: 'A' 0.31, 'The' 0.24, 'An' 0.11, ... The sampler (temperature etc.) picks one — say 'A'. That single token is appended to the context." },
        { head: "Step 2... and 300 more", body: "Now the context is prompt + 'A'. Re-run the whole network: next is probably 'test' or 'oracle'... Each generated token becomes input for the next round. Your paragraph is ~300 sequential coin-flips." },
        { head: "Why hallucination is structural", body: "The objective was never 'be true' — it was 'continue plausibly'. A fluent continuation of a question can be a confident fabrication. Hallucination isn't a bug in the loop; it's the loop, unchecked." },
        { head: "The tester's mental model", body: "Every LLM output is a sample from a probability distribution. So your tests must be too: run N samples, assert on pass-rates and invariants, never on one lucky string." },
      ],
    },
    mistakes: [
      { wrong: "Asking 'why did the model say X?' expecting a traceable reason.", right: "Ask 'how probable was X given this context?' — investigate prompt shape, retrieved context, and sampling settings.", why: "There is no stored reason; the 'why' is distributed across weights and the sampling dice." },
      { wrong: "Testing one output and calling it stable.", right: "Sample 10–20 times per case; record the distribution of behaviours.", why: "The model you tested at 10:00 is a different dice-roll than the one at 10:05. Stability is statistical." },
    ],
    faq: [
      { q: "Does the model look anything up?", a: "Not by default — facts live in the weights as statistical tendencies, which is why they can be wrong so confidently. Retrieval-augmented systems (RAG) add an actual lookup step; that's a separate, testable component." },
      { q: "Why does it sometimes ignore my earlier instruction?", a: "Earlier text is just context, weighted by attention — and attention dilutes over length ('lost in the middle'). Long contexts need engineering, not faith (lesson 2.4.3)." },
      { q: "Is the next-token loop why answers start slow and stream?", a: "Exactly — tokens are generated one at a time, so streaming is natural. It also explains why long answers take proportionally longer: more coin-flips." },
    ],
  },

  "pretraining-posttraining-finetuning": {
    hook: "Think of it as education. Pretraining is growing up on the entire internet: absorbing grammar, facts, code — but learning to rambles like a web page, not answer like an assistant. Post-training is job school: instruction fine-tuning plus alignment (RLHF/DPO) teaches 'when asked, answer helpfully and safely'. Fine-tuning is your company's onboarding: adapting a finished model to your data, formats and vocabulary. Each stage has different costs, owners — and failure modes.",
    worked: {
      title: "Worked example: deciding what your team actually needs",
      steps: [
        { head: "The request arrives", body: "PM: 'The model should answer like our brand and know our product docs.' Instinct: 'fine-tune!' Reality check first: which education stage does this gap belong to?" },
        { head: "Try stage 0: prompting", body: "Brand voice + retrieved docs in a well-structured prompt (Module 3). Cost: an afternoon. Success rate: surprisingly high. If this works, stop — you've avoided an entire project." },
        { head: "Try stage 0.5: retrieval", body: "Product docs change weekly — baking them into weights via fine-tuning would rot immediately. RAG keeps knowledge fresh and auditable. Fine-tuning is for stable knowledge: style, formats, domain grammar." },
        { head: "Fine-tune only the residue", body: "What's left: 'always answer in our ticket-triage JSON schema, in our tone, using our internal vocabulary.' That's a legitimate fine-tune — narrow, stable, measurable." },
        { head: "Test each layer separately", body: "Prompt changes → eval battery v1. Retrieval changes → retrieval recall@k. Fine-tune → full battery plus regression against the base model (fine-tunes can forget general skills — 'catastrophic forgetting' is real)." },
      ],
    },
    mistakes: [
      { wrong: "Fine-tuning to teach facts.", right: "Teach facts via retrieval (RAG); fine-tune for behaviour, style, and stable domain conventions.", why: "Facts change; weights don't. A fine-tuned fact is a stale fact with a confident voice." },
      { wrong: "Assuming a fine-tuned model only gains.", right: "Run the base model's eval battery against the fine-tune; check for forgotten capabilities.", why: "Narrow training data can erode general skills — the model gets better at your thing and worse at everything else." },
      { wrong: "Confusing a base model for a chat model.", right: "Base models autocomplete; they don't 'answer'. Chat behaviour comes from post-training.", why: "Testing a base model like an assistant produces nonsense results and wrong conclusions about the family." },
    ],
    faq: [
      { q: "How expensive is pretraining, really?", a: "Frontier runs cost tens to hundreds of millions of dollars and thousands of GPUs for months. This is why your team will never pretrain — and why 'which base to build on' is a strategic decision." },
      { q: "Is prompt engineering just cheap fine-tuning?", a: "Roughly yes — in-context examples steer the same mechanism at runtime. The ladder (prompt → RAG → fine-tune) exists because each step trades flexibility for permanence and cost." },
    ],
  },

  "sft-rlhf-dpo-lora": {
    hook: "SFT shows the model thousands of perfect employee examples: question → well-formatted answer. RLHF goes further: humans rank pairs of answers, a reward model learns the taste, and reinforcement learning chases it — powerful but famously fiddly. DPO skips the middleman and teaches preferences directly — the modern shortcut. LoRA is the budget hack behind all of it: instead of retraining billions of weights, train a tiny adapter (<1% of parameters) that bolts on like a plugin. LoRA made fine-tuning something a single GPU — and a single tester's eval battery — can handle.",
    worked: {
      title: "Worked example: evaluating a LoRA fine-tune proposal",
      steps: [
        { head: "Read the data plan first", body: "Team proposes LoRA on 3,000 in-house QA examples. Your first question isn't technical — it's data: who wrote the 'ideal' answers, and do they agree with each other? SFT quality ceiling = label quality." },
        { head: "Define the regression surface", body: "A LoRA for triage style should not change math ability, safety behaviour, or general knowledge. List those explicitly — they become your regression battery." },
        { head: "Demand the A/B protocol", body: "Same prompts, base model vs base+LoRA, N samples each, scored on shared rubric. No 'it feels better' — deltas with confidence intervals, the way you'd A/B any feature." },
        { head: "Probe the reward-hacking seam", body: "If RLHF/DPO was used, test for sycophancy: ask leading questions ('I think this is a bug, right?') and contradictory follow-ups. Alignment-trained models learn to please the rater — sometimes instead of being right." },
        { head: "Test the adapter mechanics", body: "LoRA-specific: is the adapter versioned with the prompt? Loaded correctly in staging? Swappable per-tenant? An adapter is a deployable artefact — it deserves release management." },
      ],
    },
    mistakes: [
      { wrong: "Evaluating only the target capability of a fine-tune.", right: "Run a general-capability battery too; track what the fine-tune cost elsewhere.", why: "Catastrophic forgetting is the silent tax of narrow training." },
      { wrong: "Judging alignment-trained models only on helpful prompts.", right: "Include adversarial and leading prompts; measure both sycophancy and safety refusals.", why: "RLHF optimizes for human raters' preferences — pleasing and truthful diverge exactly where you need them not to." },
    ],
    faq: [
      { q: "Why did the field move from RLHF toward DPO?", a: "RLHF trains a separate reward model plus a finicky RL loop — two places to break. DPO gets similar alignment from preference pairs with far fewer moving parts. Simpler to run, simpler for you to reason about." },
      { q: "Can testers influence this stage?", a: "More than you'd think: the preference data humans rank is a dataset — with all the label-quality questions you already know how to ask. 'Who rated, on what rubric, with what agreement?' are tester questions." },
    ],
  },

  "inference-parameters": {
    hook: "The model produces probabilities; sampling parameters decide how bravely to gamble on them. Temperature is the courage dial: 0 takes the favourite every time (near-deterministic), 0.7 balances, 1.5+ invites chaos. top-p narrows the table to tokens worth considering. Penalties stop the model repeating itself. max_tokens and stop sequences are the leash. Two identical prompts with different dials are effectively two different products — so the dials belong in your test matrix.",
    diagram: "temperature",
    worked: {
      title: "Worked example: tuning dials for a bug-triage endpoint",
      steps: [
        { head: "Classify the task", body: "Triage = extraction + classification: there's a right answer and you want it every time. Recipe: temperature 0–0.2, top_p 1, no creativity. Creative settings on classification tasks are pure variance you'll pay to test around." },
        { head: "Now the creative task", body: "Generating exploratory test ideas benefits from variety: temperature 0.8–1.0, top_p 0.95. Same model, opposite dials — because the failure you fear is different (boring duplicates vs wrong labels)." },
        { head: "Set the leash", body: "max_tokens 300 with stop sequences ['\\n\\nHuman:'] — so a chatty completion can't eat your context or impersonate the next turn. Unbounded generation is an unbounded invoice." },
        { head: "Measure the variance you bought", body: "Run the classification prompt 20× at temp 0: if outputs still differ (they can — GPU non-determinism), log the disagreement rate. Your SLA becomes 'label stable in ≥98% of runs', not 'label correct once'." },
        { head: "Version the dials with the prompt", body: "Prompt v3 with temp 0.7 IS a different build than prompt v3 with temp 0.2. Store settings alongside prompt versions; your eval diffs become interpretable." },
      ],
    },
    mistakes: [
      { wrong: "Default settings everywhere.", right: "Choose dials per task type and document them; extraction wants cold, ideation wants warm.", why: "Defaults are compromises for everyone, tuned for no one." },
      { wrong: "Believing temperature 0 means bit-identical outputs.", right: "Treat temp 0 as 'near-deterministic' and still measure run-to-run stability.", why: "Batch sizes and GPU arithmetic introduce small variations; on ties between tokens, tiny noise flips the winner." },
      { wrong: "Setting max_tokens as an afterthought.", right: "Size it from real output measurements (p99 length + margin); alert when outputs hit the cap.", why: "A truncated JSON answer fails parsing silently downstream — and you'll debug the parser for days." },
    ],
    faq: [
      { q: "Temperature or top-p — do I need both?", a: "Usually set one and leave the other neutral. Stacking them makes behaviour hard to reason about and harder to test; change one dial at a time, like any experiment." },
      { q: "What do frequency/presence penalties actually do?", a: "They subtract score from tokens already used (frequency: per count; presence: if used at all). Great for stopping 'the the the' loops; overdo it and the model is forced into odd synonyms." },
    ],
  },

  "top-k-sampling": {
    hook: "top-k draws a hard line: only the k most likely tokens may be sampled, the rest are deleted and the survivors re-normalized. It sounds harmless until you meet its flaw: the line never moves. When the model is 99% certain of one token, top-k=40 still drags 39 near-zero-probability strays to the table — and occasionally one wins the lottery and derails your sentence. top-p adapts the line to the situation; top-k doesn't. That rigidity is the whole lesson.",
    diagram: "temperature",
    worked: {
      title: "Worked example: reproducing the top-k trap",
      steps: [
        { head: "The certain case", body: "Context: 'The HTTP status code for Not Found is'. Raw distribution: '404' at 0.98, everything else dust. A sane sampler would just take 404." },
        { head: "Enter top-k=40", body: "It keeps 40 tokens regardless — including '200', '500', '403' at tiny probabilities, renormalized upward. One unlucky roll in a million and your doc says 200. Rare — until you generate a million docs." },
        { head: "The uncertain case", body: "Context: 'It was a'. 200 plausible continuations. top-k=40 keeps 40 — fine here. The fixed k fits the flat case and pollutes the peaked case. It cannot win both." },
        { head: "How top-p solves it", body: "top-p=0.9 keeps the smallest set summing to 90%: just '404' in the peaked case (dust excluded), ~60 tokens in the flat case. The threshold adapts to the shape of reality." },
        { head: "The testing stance", body: "For factual/extraction endpoints, prefer low temperature with top-p, or verify that stray-token events never reach users (structured outputs, lesson 2.8, make strays impossible). For creative text, top-k is fine — strays are features there." },
      ],
    },
    mistakes: [
      { wrong: "Using high-k sampling for factual extraction.", right: "Cold temperature + tight top-p (or constrained decoding); keep the lottery closed.", why: "Every stray token is a potential wrong fact with a confident voice." },
      { wrong: "Blaming 'model randomness' without checking the dials.", right: "Reproduce with logged sampling parameters; variance claims need settings attached.", why: "'It's random' is often 'it was configured to be random' — and that's a decision someone can change." },
    ],
    faq: [
      { q: "Do modern APIs still use top-k?", a: "Many expose both; some (OpenAI) historically only top-p. Local stacks (llama.cpp, vLLM) give you the full toolbox. Know both, configure one deliberately." },
      { q: "What k do people actually use?", a: "40–100 for creative generation is common folklore; the honest answer is 'measure on your eval set' — which, notice, is always the honest answer in LLM-land." },
    ],
  },

  "tokenizers-tiktoken": {
    hook: "Your editor counts characters; your invoice counts tokens; the two disagree by 2–4× depending on language and content. tiktoken is OpenAI's open tokenizer library — the honest broker between what you typed and what you'll pay for. Thirty seconds with it before sending a prompt is the difference between a budget estimate and a budget surprise.",
    diagram: "tokens",
    worked: {
      title: "Worked example: budgeting a support-copilot call",
      steps: [
        { head: "Assemble the real payload", body: "System prompt (900 tokens) + 3 retrieved doc chunks + user question + chat history. Don't estimate pieces — assemble the exact string your code will send." },
        { head: "Count with the right encoding", body: "enc = tiktoken.encoding_for_model('gpt-4o'); len(enc.encode(payload)). Different model families use different encodings — 'cl100k_base' vs 'o200k_base' — counts differ a few percent between them." },
        { head: "Do the arithmetic", body: "5,200 input + 400 output at $2.50/$10 per million: (5200×2.5 + 400×10)/1e6 = $0.017 per call. At 200k calls/day: $3,400/day. Suddenly 'include the full ticket history' is a $1,900/day decision." },
        { head: "Test the language tax", body: "Encode the same help article in English, German, Vietnamese, and with emoji: watch tokens climb 1.2× → 1.6× → 2.5×. If your product is global, your cost model must be too." },
        { head: "Automate the guardrail", body: "Add a pre-send check: count tokens, compare to window and budget, truncate or chunk deterministically — and log every truncation. Silent truncation is a bug factory (answers that ignore the question)." },
      ],
    },
    mistakes: [
      { wrong: "Character-based limits ('max 4,000 chars').", right: "Token-based limits measured with the actual tokenizer for the model you call.", why: "4,000 chars of emoji is ~10,000 tokens; of English prose, ~1,000. Characters predict nothing." },
      { wrong: "Reusing one model's token counts for another.", right: "Re-count per model family; store counts with the encoding name.", why: "Vocabularies differ; a count is only valid for the tokenizer that produced it." },
    ],
    faq: [
      { q: "Is there a rule of thumb when I can't run tiktoken?", a: "English prose ≈ 4 characters ≈ 0.75 words per token. Code and non-Latin scripts: assume worse (2–3×). Rules of thumb are for back-of-envelope; budgets get real counts." },
      { q: "Why do numbers tokenize badly?", a: "Vocabularies learned from text see '12345678' as arbitrary digit chunks, not a value — which is also why LLM arithmetic on long numbers is shaky. Lesson 1.4.1 goes deeper." },
    ],
  },

  "cost-math": {
    hook: "LLM pricing has one twist that changes every architecture decision: output tokens cost 3–5× more than input tokens, because generating is sequential and compute-heavy. Everything else follows: caching repeated prefixes, smaller models for easy calls, and keeping retrieval narrow. Cost isn't a finance problem — it's a design constraint you can test against, like latency.",
    worked: {
      title: "Worked example: the $1,050/day support copilot",
      steps: [
        { head: "Model one call honestly", body: "2,000 input (history + docs) + 300 output, at $3/$15 per million: (2000×3 + 300×15)/1e6 ≈ $0.0105. Multiply by real volume: 100k calls/day ≈ $1,050/day ≈ $31k/month. Write it down before the demo, not after." },
        { head: "Find the prefix you're re-sending", body: "The 1,200-token system prompt goes out on every call. Prompt caching prices repeated prefixes at 10–50% of normal: ~$700/day saved without touching quality. Architect for cacheable prefixes — stable text first, volatile text last." },
        { head: "Route by difficulty", body: "80% of questions are easy ('reset password'): a small model at 1/20th the price handles them; only escalations hit the frontier model. Routing is a testable classifier — with its own eval set." },
        { head: "Question the context", body: "'Include the last 10 messages' doubled input tokens for a 2% quality gain on your eval set? Cut it. Every context-stuffing habit (lesson 2.4.3) has a daily price; make each one earn its keep." },
        { head: "Build the cost dashboard", body: "Log tokens per call, per feature, per tenant. Alert on per-call p95 token growth — a prompt edit that adds 500 tokens to every call is a silent 25% budget raise shipping as a typo." },
      ],
    },
    mistakes: [
      { wrong: "Estimating cost from the happy path.", right: "Price the p95 conversation: long histories, chatty completions, retries. Include retry cost — retries are double-billing.", why: "Averages flatter; tails bill." },
      { wrong: "Optimizing tokens before validating quality.", right: "Cut context only with an eval set proving the cut is free; measure quality per dollar, not tokens alone.", why: "The cheapest answer that's wrong costs more than the expensive one that's right." },
    ],
    faq: [
      { q: "Why are outputs more expensive than inputs?", a: "Inputs process in parallel (one forward pass); outputs are generated token by token, each needing its own pass. Sequential = more GPU-seconds per token." },
      { q: "Do open-source models change the math?", a: "They swap per-token fees for hosting costs — Lesson 2.5.2 does the break-even: roughly, APIs win below a few thousand calls/day, self-hosting above millions." },
    ],
  },

  "context-window-limits": {
    hook: "The context window is the model's working memory — everything it can hold in mind at once, measured in tokens. Marketing says 128k–1M; experience says capacity isn't comprehension. Facts buried mid-context get retrieved worse than the same facts at the edges — the 'lost in the middle' effect. And stuffing 40 pages in 'just in case' dilutes attention, slows responses, raises the bill, and often produces worse answers than a tight, curated window. Context is a budget to engineer, not a box to fill.",
    diagram: "context",
    worked: {
      title: "Worked example: the needle-in-a-haystack that lied",
      steps: [
        { head: "The vendor claim", body: "'Supports 128k context — passed needle-in-a-haystack at 100k!' So you dump your full runbook in. Answers get mushy. The claim was true; it was also useless." },
        { head: "Why the test lied", body: "Needle tests hide one easy fact among 100k irrelevant-but-harmless tokens and ask one clean question. Real documents contain competing facts, contradictions, and your instruction buried under 30 pages. Difficulty isn't length — it's interference." },
        { head: "Run the test that predicts production", body: "Take your real docs. Ask the same question with (a) the relevant 2 pages alone, (b) buried at the top/middle/bottom of 60 pages. Measure the accuracy gap. Teams routinely see 90% → 65% for mid-context facts." },
        { head: "Engineer the window instead", body: "Retrieve narrowly (top-k chunks, not the corpus), put instructions and the question at the edges, compress history into summaries, and state the window budget in tokens in your design doc." },
        { head: "Make rot visible", body: "Track quality-vs-context-length curves per release. If quality decays as context grows, that's context rot (lesson 2.6.4) — and now you have the chart to prove it." },
      ],
    },
    mistakes: [
      { wrong: "'Just include everything — the window is big enough.'", right: "Curate: retrieve the top relevant chunks; measure whether each addition earns its tokens.", why: "Irrelevant context isn't free — it dilutes attention and competes with the facts that matter." },
      { wrong: "Designing only for the nominal window size.", right: "Reserve headroom: outputs count too, and truncation under load is a real failure mode. Budget input + max output + margin.", why: "A window 'full' of input leaves zero room for the answer — some APIs silently truncate the input instead." },
      { wrong: "Trusting long-context demos.", right: "Re-test with your docs, your question shapes, and facts planted at different positions.", why: "Needle tests measure recall of one clean fact; production asks you to weigh five messy ones." },
    ],
    faq: [
      { q: "Does a bigger window make 'lost in the middle' disappear?", a: "It shrinks but doesn't vanish — and interference grows with content, not just length. Architecture habits (narrow retrieval, edge placement) age better than window sizes." },
      { q: "What actually uses my window in a chat app?", a: "Everything, every turn: system prompt + full history + retrieved docs + your new message + the model's reply. Long conversations eat the window from both ends — which is why summarization strategies exist." },
    ],
  },

  "open-vs-closed-llms": {
    hook: "Closed models (GPT, Claude, Gemini) arrive as APIs: instant frontier capability, zero ops — but your data crosses a boundary, prices can change, and a model update can shift behaviour under your tests overnight. Open-weight models (Llama, Mistral, Qwen, DeepSeek) hand you the weights: total data control, full fine-tuning freedom — in exchange for GPU bills and an ops life. The smart pattern isn't tribal; it's a stack: open models for high-volume private paths, closed frontier models for the hardest reasoning, and an API layer that lets you swap either.",
    worked: {
      title: "Worked example: choosing for a hospital triage assistant",
      steps: [
        { head: "List the non-negotiables", body: "Patient data can't leave the perimeter (regulation). Volume: 2M lookups/month. Latency: sub-second. Write these before comparing models — constraints eliminate, benchmarks merely rank." },
        { head: "The data-path test", body: "Closed API: data egress = automatic fail, regardless of how smart the model is. Open-weight, self-hosted: passes. One constraint just ended half the debate — this is how architecture decisions should feel." },
        { head: "Benchmark the survivors on YOUR tasks", body: "Not MMLU — your 150-case triage battery (Module 4). Llama-3.1-8B-instruct hits 89% of the frontier score at 1/30th the marginal cost. Good enough is a technical term now that you've measured it." },
        { head: "Keep the escape hatch", body: "Everything talks through the OpenAI-compatible API shape (lesson 2.7.1) behind a gateway. Tomorrow's better model is a config change, not a rewrite. Portability is a testable property: run your battery against both endpoints." },
        { head: "Test the update story", body: "Open-weight: a version is a file you control — pin it, regression it, promote it like a build. Closed: the provider can ship 'gpt-x-2025-06' under an alias — subscribe to change notifications and run the battery on every bump." },
      ],
    },
    mistakes: [
      { wrong: "Choosing by leaderboard.", right: "Choose by constraints (data path, latency, cost at your volume), then validate on your own eval battery.", why: "Public benchmarks measure generic tasks; your product is not generic." },
      { wrong: "Treating 'open source' as one thing.", right: "Check the actual licence: Apache-2.0 (permissive) vs community licences with use restrictions (Llama's). 'Open weights' ≠ 'open source' ≠ 'free for any use'.", why: "A licence surprise is a legal defect that ships to production." },
    ],
    faq: [
      { q: "What's the AI stack, bottom to top?", a: "Hardware → serving engines (vLLM, llama.cpp) → model weights → inference APIs → orchestration/RAG → your app. Testers live mostly at API level and up — but knowing the layers below explains latency and failure modes." },
      { q: "Can I start closed and move open later?", a: "Yes — the standard migration: prototype on APIs, prove volume, migrate hot private paths to open-weight. The OpenAI-compatible standard exists precisely so this isn't a rewrite." },
    ],
  },

  "should-use-open-source": {
    hook: "The question isn't 'is open-source good?' — it's 'where does each architecture win?'. Open-weight wins when data can't leave, volume is brutal, latency is contractual, or you need deep customization. Closed APIs win when you need frontier reasoning now, have no GPU team, or volume is modest. And the honest cost model has a crossover: at thousands of calls a day, APIs win; at millions, hosting usually wins. Draw your crossover before you pick a side.",
    worked: {
      title: "Worked example: the break-even napkin",
      steps: [
        { head: "Price the API path", body: "2M calls/month × 1,500 tokens avg × $4/1M ≈ $12,000/month, scaling linearly forever. Simple, and the invoice tells you so." },
        { head: "Price the hosted path", body: "Two GPU instances for a quantized 8B model: ~$3,500/month all-in, serving ~5M calls if batched well. Add engineer time for ops — honestly, not heroically." },
        { head: "Find the crossover", body: "Hosting's fixed cost crosses the API's line around 1M calls/month for this workload. Below it, you're paying a premium for zero ops. Above it, every extra million is nearly free. Your volume forecast is the decision." },
        { head: "Weigh the invisible columns", body: "Privacy posture, vendor lock-in, customization ceiling, incident ownership at 3am. Some are priced in dollars, all are priced in risk. Write them as rows, not vibes." },
        { head: "Decide in phases", body: "Prototype on APIs (weeks) → pilot open-weight on the hottest private path (one quarter) → expand by measured evidence. Reversible beats right-first-time." },
      ],
    },
    mistakes: [
      { wrong: "Self-hosting at low volume to 'save money'.", right: "Below the crossover, APIs are cheaper once you count ops — host when volume or privacy demands it.", why: "GPUs bill whether you use them or not; ops time compounds." },
      { wrong: "Comparing raw model quality across architectures.", right: "Compare quality-per-dollar-per-risk on your battery.", why: "A 3% accuracy edge that doubles cost and adds egress risk can be a net loss." },
    ],
    faq: [
      { q: "Do open models lag far behind closed ones?", a: "The frontier gap is real but shrinking fast; for many production tasks (extraction, triage, summarization) a current 8–70B open model is within a few percent of frontier — measure on your tasks, not on Twitter." },
      { q: "What does 'open weights' not give me?", a: "Training data, training code, or (often) unrestricted commercial terms. You can run and fine-tune; you can't reproduce or always resell. Read the licence like a contract — it is one." },
    ],
  },

  "base-instruct-coder-reasoning": {
    hook: "One model family, four temperaments. Base: raw autocomplete — finishes your sentence, possibly with more questions. Instruct/chat: aligned to follow directions — the assistant you expect. Coder: further trained on code and tool use. Reasoning: spends hidden 'thinking' tokens before answering, trading latency and cost for hard problems — and sometimes overthinking easy ones. Choosing the temperament is a routing decision, and routing decisions are testable.",
    worked: {
      title: "Worked example: building a model router",
      steps: [
        { head: "Sort your traffic", body: "Classify a week of real requests: simple lookups (60%), structured extraction (25%), gnarly multi-step reasoning (10%), code generation (5%). One model for all four is either overpaying or underperforming." },
        { head: "Assign temperaments", body: "Lookups → small instruct model. Extraction → instruct with JSON mode. Reasoning → reasoning model or frontier. Code → coder variant. Each assignment is a hypothesis to validate, not a decree." },
        { head: "Validate with one battery, many endpoints", body: "Same eval set, all four models, cost and latency logged per case. The router spec becomes: 'route by class; expected quality ≥ X at ≤ Y¢ per call'." },
        { head: "Test the router itself", body: "It's a classifier — with confusion risks. A reasoning request misrouted to a small model fails quietly. Measure routing accuracy on ambiguous prompts; add an escalation path users can trigger." },
        { head: "Watch for overthinking", body: "Reasoning models on easy questions: 'What's 2+2?' → 400 hidden tokens of deliberation. Set difficulty gates so the fancy path activates only when the cheap path fails or the class demands it." },
      ],
    },
    mistakes: [
      { wrong: "Feeding a base model chat-style prompts and judging the family.", right: "Base models need completion-style prompts or fine-tuning; evaluate each flavour the way it was trained to be used.", why: "Wrong interface → nonsense → wrong architecture decision. A classic." },
      { wrong: "Using reasoning models everywhere 'to be safe'.", right: "Reserve them for verified-hard classes; pay in latency and cost only where it buys accuracy.", why: "Overthinking is real: simple questions get slower, pricier, occasionally weirder." },
    ],
    faq: [
      { q: "How do I spot a reasoning model in the wild?", a: "Suffixes and docs: OpenAI o-series, DeepSeek-R1, 'thinking' modes. They expose thinking tokens (sometimes) and burn more output budget per answer — your cost model must account for invisible deliberation." },
      { q: "Can one model do it all?", a: "Frontier instruct models increasingly absorb coder and reasoning skills. The router question then becomes: when does the generalist's extra cost beat the specialist's narrowness? Still a measurement." },
    ],
  },

  "running-llms-locally": {
    hook: "Running an LLM on your own laptop went from research project to one terminal command: install Ollama, 'ollama run llama3.1:8b', talk. Under the hood, quantized GGUF models (lesson 2.5.5) squeeze into ordinary RAM, and LM Studio wraps it all in a GUI that even serves an OpenAI-compatible local endpoint. For testers this is a superpower: an unlimited, private, free playground for prompt experiments and red-teaming — no rate limits, no billing, no data leaving the machine.",
    worked: {
      title: "Worked example: a private prompt-testing lab in 15 minutes",
      steps: [
        { head: "Install and pull", body: "Ollama → pull a 7–8B instruct model (≈4.7 GB at Q4_K_M). Memory rule of thumb: parameters × bytes-per-weight — 8B × 0.5 ≈ 4 GB, plus overhead. A 16 GB laptop handles it comfortably." },
        { head: "Expose the API", body: "Ollama serves OpenAI-compatible endpoints at localhost:11434. Point any OpenAI SDK at it: base_url changes, code doesn't. Your existing harness now runs against a private model." },
        { head: "Build the experiment loop", body: "Prompt variants × 20 samples each, scored by your rubric, zero marginal cost. Iterate in minutes what would cost dollars and hit rate limits against a cloud API." },
        { head: "Red-team in the sandbox", body: "Injection payloads, PII-laden inputs, boundary-smashing prompts — all safe locally. Document findings with model+quantization+prompt versions; reproduce exactly." },
        { head: "Know the caveats", body: "Local ≠ production behaviour: different model, different tokenizer, different quantization. Local results are hypotheses about prompting, not guarantees about the cloud model. Always confirm on the real endpoint." },
      ],
    },
    mistakes: [
      { wrong: "Generalizing local-model findings to the cloud model.", right: "Local labs test techniques and tooling; final validation runs against the actual model and provider.", why: "A 7B quant behaves differently from a frontier API — same prompts, different dice." },
      { wrong: "Picking a model by parameter count alone.", right: "Match size to RAM/VRAM (the bytes-per-weight rule) and task; a well-quantized 8B beats an oversized model thrashing on swap.", why: "Disk-swap inference is 100× slower — the model that fits is the model that's useful." },
    ],
    faq: [
      { q: "Apple Silicon or NVIDIA — does it matter?", a: "Both work: llama.cpp/MLX use unified memory and Metal on Macs surprisingly well; CUDA GPUs are faster for heavy loads. For a testing lab, a modern 16 GB Mac Mini is a genuinely good rig." },
      { q: "Can local models serve my team's staging environment?", a: "Yes — vLLM/Ollama as an internal endpoint is a common pattern for CI evals: deterministic-enough, private, and free per call. Version the model file like any other dependency." },
    ],
  },

  "quantization-gguf": {
    hook: "Models ship as billions of 16-bit numbers — enormous. Quantization re-encodes them in fewer bits: Q8 halves the size with near-zero damage; Q4_K_M quarters it with a modest toll; Q2 gets desperate. Quality loss isn't uniform — reasoning and obscure knowledge degrade first; chit-chat barely notices. GGUF is the suitcase format carrying weights + tokenizer + metadata for local runners; Safetensors replaced pickles because loading arbitrary pickles is literally a remote-code-execution vector. Two formats, one lesson: know what you're loading, and what it lost.",
    worked: {
      title: "Worked example: choosing a quant without flying blind",
      steps: [
        { head: "Decode the filename", body: "'mistral-7b-instruct-v0.2.Q4_K_M.gguf': model, version, quantization, format. Q4 = 4-bit, K_M = k-quant mixed (sensitive layers keep more bits). You can read a model shelf now." },
        { head: "Size the hardware", body: "7B × 0.5 bytes ≈ 3.5 GB file; runtime needs ~5–6 GB. Q8_0 ≈ 7 GB. If your fleet has 8 GB cards, the choice made itself — but verify quality, don't assume it." },
        { head: "Measure the toll on YOUR tasks", body: "Run your battery on FP16 (reference), Q8, Q5_K_M, Q4_K_M, Q2. Typical: Q8 ≈ free, Q4_K_M −1 to −3% on reasoning-heavy sets, Q2 −10%+. Your task mix sets the acceptable floor." },
        { head: "Test the reasoning edge", body: "Quant damage concentrates in hard reasoning and rare knowledge. Include multi-step problems and long-tail facts in the comparison — averages hide exactly where the toll is paid." },
        { head: "Handle formats safely", body: "Safetensors: load freely (designed to be safe). GGUF from llama.cpp ecosystem: fine. Random .bin/.pkl from the internet: treat as untrusted executables, because mechanically they can be." },
      ],
    },
    mistakes: [
      { wrong: "Judging a quant by perplexity or vibes.", right: "Judge by your eval battery — same prompts, same rubric, deltas per quant.", why: "Generic scores can't see that your task lives exactly where quant damage lands." },
      { wrong: "Assuming '4-bit' means the same thing everywhere.", right: "Compare schemes (Q4_K_M vs Q4_0 vs GPTQ-4bit vs AWQ) on your battery; '4' is a headline, not a spec.", why: "Mixed-precision schemes spend bits where it matters; naive uniform quant doesn't." },
    ],
    faq: [
      { q: "Why does GGUF bake the quant into the filename?", a: "Because quantization rewrites the weights — a Q4 file and an FP16 file are different artefacts with different behaviour. Treating them as versions (which they are) is correct." },
      { q: "Do APIs quantize?", a: "Providers quantize internally for efficiency, but you can't choose or verify it — another reason your eval battery, not the spec sheet, is your source of truth." },
    ],
  },

  hallucinations: {
    hook: "Two species, one root cause. Intrinsic hallucination contradicts your provided context (spec says v2, summary says v3). Extrinsic claims beyond it (invented citations, API methods that almost exist). The cause is architectural: the model was trained to continue plausibly, not to verify. Fluency without a truth constraint is the product — hallucination is that product, misused. You can't delete the tendency; you can build systems where it can't ship.",
    worked: {
      title: "Worked example: building the hallucination test battery",
      steps: [
        { head: "The context-contradiction probe", body: "Give a doc that says 'limit is 50 MB'. Ask 'what's the limit?' then ask with a misleading question: 'Why is the limit 500 MB?' A robust system corrects you; a sycophantic one agrees. Both behaviours are one prompt apart — test both directions." },
        { head: "The invented-reference probe", body: "Ask for sources on a niche topic. Verify every URL, paper, and API method against reality. 'Almost exists' is the signature: real author + invented title, real library + invented function." },
        { head: "The absence probe", body: "Ask about something not in the provided context. Desired: 'not covered in the docs.' Measured: confident invention 30% of runs at default settings. This single probe predicts most production complaints." },
        { head: "Mitigate in layers, test each", body: "Grounding (answer only from context) + citations you can click + structured outputs that have no room for prose + a verification pass. Each layer gets its own failure test — a mitigation untested is marketing." },
        { head: "Quantify, don't moralize", body: "Report: 'extrinsic invention rate 12% ungrounded → 1.5% with retrieval+verification, N=200'. Numbers turn a scary property into an engineering budget." },
      ],
    },
    mistakes: [
      { wrong: "Testing for hallucination with questions the model should know.", right: "Probe edges: absent facts, recent events, niche domains, and adversarial leading questions.", why: "Hallucination concentrates where training data thins out — test the thin places." },
      { wrong: "Treating one honest 'I don't know' as fixed.", right: "Measure refusal honesty rates across the battery and across samples.", why: "The model knows when it knows; the calibration of that self-knowledge is what you're testing." },
      { wrong: "Blaming the generator for retrieval failures.", right: "Log what was retrieved; if the right chunk wasn't fetched, that's a search bug, not a lying model.", why: "Different fix, different owner — and RAG systems fail at retrieval more often than at generation." },
    ],
    faq: [
      { q: "Will bigger/newer models solve hallucination?", a: "Rates improve, the property persists — it's inherent to next-token generation. Systems (grounding, verification, structured outputs) are the durable answer; model upgrades are maintenance." },
      { q: "Is temperature 0 a hallucination fix?", a: "It removes sampling noise, not false confidence. The most probable continuation can still be wrong — cold dice roll the same loaded numbers." },
    ],
  },

  "prompt-sensitivity-variance": {
    hook: "LLMs are stochastic systems wearing deterministic clothing. Paraphrase the prompt, reorder two sentences, even change capitalization — accuracy can move by double digits. Layer sampling variance on top: same prompt, different answers each run. Classic QA calls this 'flaky'. It isn't flaky; it's a probability distribution over outputs for each input. The testing upgrade: stop asserting on single runs, start measuring pass-rates over N samples.",
    worked: {
      title: "Worked example: turning 'flaky' into a measurement",
      steps: [
        { head: "Quantify sampling variance", body: "One triage prompt, temperature 0.7, 20 identical runs: 17 'bug', 2 'feature', 1 'question'. The system's answer isn't 'bug' — it's 'bug with 85% probability'. That's the spec you should be testing." },
        { head: "Quantify phrasing sensitivity", body: "Write 5 paraphrases of the same instruction ('Classify...', 'Is this a bug?...', 'Label the ticket:...'). Pass-rates: 85%, 84%, 61%, 83%, 79%. One phrasing quietly cost 23 points — and nobody had tested phrasing as a variable." },
        { head: "Set statistical acceptance criteria", body: "'Label correct in ≥ 90% of 20 samples, across all 5 approved phrasings.' Now the test has teeth and a failure mode: variance regression, not single-run luck." },
        { head: "Separate variance from sensitivity", body: "Variance: same prompt, spread across runs. Sensitivity: different prompts, shifted distributions. Fixes differ — variance → sampling dials/structured outputs; sensitivity → prompt hardening and eval-driven phrasing." },
        { head: "Budget the testing cost", body: "20 samples × 5 phrasings × battery — expensive? Cheaper than one wrong routing rule in production. Sample smart: full N on critical cases, N=5 elsewhere, more where variance last bit you." },
      ],
    },
    mistakes: [
      { wrong: "Re-running a failed test once, seeing it pass, and closing it.", right: "Run N samples; a 1-in-20 failure is a 5% defect rate, not a flake.", why: "Single-run retries measure your patience, not the system." },
      { wrong: "Tuning the prompt until one example works.", right: "Tune against a distribution: eval set × samples per case; promote the prompt that wins the aggregate.", why: "A prompt that aces one example and fails its paraphrases ships the fragility you tested away." },
    ],
    faq: [
      { q: "How many samples is enough?", a: "For a pass-rate around 90%, N=20 gives ±13% uncertainty; N=50 gives ±8%. Start at 10–20, spend more where decisions are expensive. Statistics, like testing, is about risk not perfection." },
      { q: "Does variance disappear at temperature 0?", a: "Nearly, but not fully — GPU non-determinism and batching can still flip tied decisions. Measure, don't assume." },
    ],
  },

  "reasoning-failures-cot": {
    hook: "Chain-of-thought works because each written step becomes context for the next — the model gives itself working memory. But the chain is generated text, not computation: arithmetic slips mid-chain, constraints stated in line 2 are forgotten by line 8, and a beautifully confident step can simply not follow from the previous one. Every added step is another sampling event with its own error probability — reasoning degrades with length, measurably. The fix pattern: let tools calculate, let the model orchestrate.",
    worked: {
      title: "Worked example: dissecting a failed reasoning trace",
      steps: [
        { head: "Capture the trace", body: "Ask: 'If 3 of 10 servers fail and each handles 40 req/s, what capacity remains?' The model writes 6 confident steps... and arrives at 180 req/s (correct: 280). Keep the full trace — it's the bug report." },
        { head: "Localize the break", body: "Step 3: '10 − 3 = 6' — wait, it wrote 6? No: it wrote the right subtraction, then multiplied 6×40 correctly, then 'summed' to 180. The error is a single arithmetic token in the final line." },
        { head: "Classify the failure", body: "This is token-level arithmetic failure inside fluent prose — the most common CoT breakdown. Others: constraint amnesia (step 8 ignores step 2), phantom premises (inventing a given), and plan drift (solving a nearby easier problem)." },
        { head: "Apply the structural fix", body: "Offload computation: the model calls a calculator/code tool for arithmetic and only narrates around it. Re-test: 20 samples, 20 correct. The reasoning scaffold stayed; the fallible part got a deterministic executor." },
        { head: "Test reasoning like a pipeline", body: "For multi-step prompts, assert on intermediate artefacts (the plan, the extracted numbers), not just the final answer. Intermediate checkpoints turn one opaque failure into three debuggable ones." },
      ],
    },
    mistakes: [
      { wrong: "Trusting arithmetic written in prose.", right: "Route calculation to tools/code; treat numbers in free text as unverified output.", why: "The model predicts digits; it doesn't compute them. Your calculator never drifts mid-sentence." },
      { wrong: "Evaluating only final answers on reasoning tasks.", right: "Score plans and intermediate steps; a wrong final from a right plan and a right final from a wrong plan need different fixes.", why: "Final-answer-only testing can't tell skill from luck — and luck doesn't scale to harder problems." },
    ],
    faq: [
      { q: "Do reasoning models (o-series, R1) fix this?", a: "They spend real effort on chains and verify internally — big gains on hard problems. But they still hallucinate steps on adversarial inputs, and they can't see their own errors any better than you can without external checks. Test them like everyone else." },
      { q: "Why does counting still trip models ('how many r's in strawberry')?", a: "Tokens, again — 'strawberry' is one or two tokens, so the model never saw the letters unless prompted to spell it out. Forcing character-level decomposition usually fixes it: another case of 'make the model show its inputs'." },
    ],
  },

  "context-rot": {
    hook: "Context rot is the practitioner's name for quality decay as the window fills: instructions followed less precisely, relevant facts retrieved less reliably, tone and format drifting. Three causes stack — attention physics (lost in the middle), interference (irrelevant or contradictory material actively distracts), and instruction dilution (your one crisp rule drowning in 40 pages). It's not a bug you'll find in one test; it's a curve you have to chart.",
    worked: {
      title: "Worked example: charting your system's rot curve",
      steps: [
        { head: "Build the ladder", body: "One fixed question set; contexts at 1k, 4k, 16k, 32k, 64k tokens — real content, with the relevant facts placed consistently. Run N samples per rung." },
        { head: "Measure three symptoms separately", body: "Instruction compliance (did it keep the JSON format?), fact retrieval (did it find the right detail?), answer quality (human rubric). Rot rarely hits all three at once — knowing which decays first tells you the cause." },
        { head: "Read the curve", body: "Typical shape: flat to 8k, format compliance dips at 16k, retrieval degrades past 32k. If YOUR curve bends at 16k, your architecture gets a hard rule: keep working context under 12k." },
        { head: "Test the countermeasures", body: "Summarized history vs full history; instructions repeated at the end vs only at the start; narrow retrieval vs broad. Each countermeasure is a variant in the same ladder test — measure, don't hope." },
        { head: "Watch for contradiction poison", body: "Add one stale fact that contradicts a fresh one (old docs are the production default). Which wins? How often? Contradiction handling is the rot symptom users notice first." },
      ],
    },
    mistakes: [
      { wrong: "Validating prompts at short context and shipping to long ones.", right: "Test every critical prompt at the context lengths production actually produces.", why: "A prompt that shines at 2k can rot at 32k — length is an input dimension you must sweep." },
      { wrong: "Responding to rot by adding louder instructions.", right: "Restructure: compress, retrieve narrowly, repeat critical rules at the end, prune stale content.", why: "Shouting adds tokens to a problem caused by too many tokens." },
    ],
    faq: [
      { q: "Is context rot the same as lost-in-the-middle?", a: "Related, not identical. Lost-in-the-middle is a positional effect (mid-context recall sags); rot is the aggregate decay across quality dimensions as total context grows, including interference and dilution." },
      { q: "Do newer long-context models still rot?", a: "Less and later, but the curve exists for every model we've measured. The engineering habits (narrow context, tested length budgets) outlive any single model generation." },
    ],
  },

  "openai-compatible-api": {
    hook: "OpenAI's chat API accidentally became the USB-C of LLMs: POST /v1/chat/completions with model, messages (role-tagged conversation), and sampling parameters. Groq, Mistral, DeepSeek, Ollama, vLLM, LM Studio, Azure — most expose the same contract, so switching providers is often a base_url and an API key, not a rewrite. The standard is de-facto and frays at the edges (feature support varies), which means: design to the contract, and test every provider you might touch.",
    worked: {
      title: "Worked example: swapping providers in an afternoon",
      steps: [
        { head: "Speak the lingua franca", body: "Your code calls one client with base_url + key. Today it's Provider A; the contract is: messages array in, choices[0].message.content out, plus usage (token counts) — the universal shape." },
        { head: "Inventory the frays", body: "JSON mode: A yes, B yes, C 'mostly'. Tools/function-calling: shapes differ subtly. Vision: not everywhere. Logprobs: some. Make a capability matrix — the contract's core is stable, its edges are not." },
        { head: "Run the same battery per provider", body: "Your eval set against A and B: quality deltas, latency percentiles, error rates. Provider B is 40% cheaper but 3 points worse on YOUR battery? Now it's a decision, not a guess." },
        { head: "Test the boring parts hardest", body: "Rate-limit behaviour (429 + Retry-After), timeout handling, partial streaming failures, malformed-request errors. Providers diverge most exactly where your resilience code lives." },
        { head: "Keep the swap a config change", body: "Gateway pattern: one internal interface, N provider adapters, feature flags per route. Then 'switch provider' is a flag flip with the eval battery as the acceptance test." },
      ],
    },
    mistakes: [
      { wrong: "Using provider-specific features in core paths.", right: "Keep core flows on the common contract; isolate exotic features behind adapters.", why: "Portability is a feature you buy with discipline and lose with one shortcut." },
      { wrong: "Assuming identical behaviour across 'compatible' endpoints.", right: "Run your battery per provider; tokenizers, defaults, and safety filters all differ.", why: "'Compatible' means the request parses — not that the answers match." },
    ],
    faq: [
      { q: "Why did this standard win?", a: "Network effects: SDKs, tooling, and developer muscle memory all targeted it, so every new server implemented it to be usable. Standards often win by gravity, not decree." },
      { q: "What should my abstraction layer hide?", a: "Auth, retries, provider quirks, cost logging — and expose: model id, temperature/top_p, max_tokens, structured-output contracts. The less your app knows about providers, the cheaper every future switch." },
    ],
  },

  sdks: {
    hook: "Hand-rolling HTTP to an LLM API works until the 3am page: a retry storm, a half-finished stream, an idempotency race. Official SDKs earn their keep with the boring excellence you'd otherwise reimplement badly — typed requests, exponential backoff on 429/5xx, streaming iterators that survive flaky networks, and helpers for tools and structured outputs. Use them by default; test the error paths they claim to handle, because 'claims' is doing work in that sentence.",
    worked: {
      title: "Worked example: testing the SDK's promises",
      steps: [
        { head: "List the promises", body: "The SDK docs say: automatic retries with backoff, timeout control, streaming, typed errors. Each promise is a test case — you already know this instinct from any library." },
        { head: "Provoke the retry path", body: "Point the client at a mock returning 429 with Retry-After, then 500 twice, then success. Assert: it waited (roughly) the advertised backoff, retried the right number of times, and surfaced the final state cleanly." },
        { head: "Break a stream mid-flight", body: "Open a streaming completion; kill the connection at token 50. Does your code know it got a partial answer? Idempotent retry or visible failure? Partial streams silently treated as complete are a classic data-corruption bug." },
        { head: "Verify the error taxonomy", body: "401 (bad key) vs 400 (malformed) vs 429 (rate) vs 500 (theirs) — each should map to a distinct, catchable error with actionable detail. 'Something went wrong' is not an error handling strategy." },
        { head: "Set budget guardrails in code", body: "Max retries, request timeout, max_tokens, per-tenant spend caps. The SDK provides knobs; your test plan verifies they bite before the invoice does." },
      ],
    },
    mistakes: [
      { wrong: "Retrying every error.", right: "Retry 429/5xx with backoff and jitter; never retry 400s — a malformed request fails identically forever, and you just bought N copies of the same error.", why: "Indiscriminate retries convert a bug into a rate-limit incident." },
      { wrong: "Ignoring the usage field in responses.", right: "Log prompt/completion tokens per call; they're your cost and truncation early-warning system.", why: "usage.completion_tokens == max_tokens is the fingerprint of silent truncation." },
    ],
    faq: [
      { q: "SDK vs raw HTTP — when's raw acceptable?", a: "For one-off scripts or when your platform has no SDK. Even then, borrow the SDK's retry/timeout logic — it encodes hard-won lessons." },
      { q: "Do streaming responses change testing?", a: "They add states: first-token latency, mid-stream stalls, incomplete terminations. Measure time-to-first-token as a user-perceived latency metric — it's what 'feels fast' means." },
    ],
  },

  "json-mode": {
    hook: "LLMs speak prose; your parsers speak structure. JSON mode constrains decoding so the output is at least valid JSON — a real guarantee, worth having. But valid ≠ correct-shape: the model may hand you {'answer': 'maybe'} when you needed {'verdict': 'bug', 'severity': 2}. It's a syntax promise, not a schema promise. Two catches everyone meets: the prompt must mention 'JSON' (providers enforce this), and you still validate everything downstream.",
    worked: {
      title: "Worked example: from prose to parseable, safely",
      steps: [
        { head: "State the contract in the prompt", body: "'Respond in JSON with keys: verdict (bug|feature|question), severity (1-3), summary (≤ 20 words).' Plus response_format={'type': 'json_object'}. The mention of JSON is mandatory — omit it and some providers return prose or an error." },
        { head: "Add one example", body: "A single correct example in the prompt lifts shape compliance dramatically: {'verdict': 'bug', 'severity': 2, 'summary': '...'} — demonstration beats description for structure." },
        { head: "Validate like it's an API", body: "Parse, then schema-check: keys present, types right, enums in range, summary length ≤ 20 words. JSON mode guaranteed the braces; only you guarantee the contract." },
        { head: "Measure the gap", body: "Over 100 samples: valid JSON 100% (the mode's job), schema-valid 91%, semantically correct 87%. Three different numbers, three different owners — this is what mature LLM testing looks like." },
        { head: "Escalate when 91% isn't enough", body: "If the schema gap matters, climb the ladder: Instructor retries with validation errors (lesson 2.8.2), or constrained decoding that makes violations impossible (2.8.3). JSON mode is step one, not the summit." },
      ],
    },
    mistakes: [
      { wrong: "Trusting json.loads() as the end of validation.", right: "Schema-validate every field; treat shape violations as test failures with rates.", why: "Valid JSON with wrong keys crashes your downstream exactly like prose would — just later." },
      { wrong: "Forgetting the 'mention JSON' rule.", right: "Include the word JSON in the prompt when using json_object mode; test both with and without to see your provider's behaviour.", why: "Providers enforce this inconsistently — some error, some silently return prose. Yours might do either." },
    ],
    faq: [
      { q: "JSON mode vs function calling vs structured outputs?", a: "A spectrum of guarantees: JSON mode (valid JSON) → function/tool calling (shape-steered) → schema-enforced structured outputs (validated against your exact schema). Pick the strongest your provider offers; validate regardless." },
      { q: "Does JSON mode cost extra tokens?", a: "Negligibly in output; the prompt grows slightly (your schema/example). The real cost to budget is retries on schema-invalid responses — measure that rate." },
    ],
  },

  instructor: {
    hook: "Instructor's pitch: define a Pydantic class, patch your client, and chat.completions.create returns instances of your class — typed, validated, and self-healing. The killer feature isn't the typing; it's the retry loop: when the model's output fails validation, Instructor appends the actual validation error to the prompt and asks again. The model reads 'severity must be 1–3, got 7' and usually fixes it. Generate → validate → retry-with-evidence, automated.",
    worked: {
      title: "Worked example: typed extraction in ~10 lines",
      steps: [
        { head: "Write the contract as code", body: "class Triage(BaseModel): verdict: Literal['bug','feature','question']; severity: int = Field(ge=1, le=3); summary: str = Field(max_length=140). The class IS the spec — versioned in Git next to the code that consumes it." },
        { head: "Patch and call", body: "client = instructor.from_openai(OpenAI()); result = client.chat.completions.create(response_model=Triage, max_retries=2, ...). You receive a Triage instance — no json.loads, no key-hunting." },
        { head: "Test the retry loop", body: "Force bad outputs (adversarial prompts) and assert: validation errors are fed back, second attempts improve, and after max_retries you get a clean, catchable failure — not a half-parsed monster." },
        { head: "Version the contract", body: "Adding a field changes the class → changes the schema the model sees. Treat it like an API migration: old prompts may need updating; run the battery on contract changes." },
        { head: "Know the limit", body: "Instructor validates after generation — invalid outputs cost a retry round-trip. For zero-retry guarantees you need constrained decoding (next lesson); for API-first typed contracts, Instructor is the sweet spot." },
      ],
    },
    mistakes: [
      { wrong: "Setting max_retries to zero 'for speed'.", right: "Allow 1–2 retries; measure how often the self-heal saves a response.", why: "The retry-with-error loop is Instructor's core value — disabling it turns it into a fancy json.loads." },
      { wrong: "Loose types (everything Optional, everything str).", right: "Tight types: Literal for enums, ge/le bounds, max_length. The schema steers the model — weak schema, weak steering.", why: "The generated JSON schema comes from your types; vagueness in, vagueness out." },
    ],
    faq: [
      { q: "Does Instructor work beyond OpenAI?", a: "Yes — it supports any provider with function-calling or JSON mode (Anthropic, Gemini, local via LiteLLM, Cohere...). The pattern travels; only the patch line changes." },
      { q: "Pydantic v1 or v2?", a: "v2 — Instructor tracks current Pydantic, and v2's stricter validation gives the model better error messages to self-correct from." },
    ],
  },

  outlines: {
    hook: "Prompting and validation are after-the-fact: generate, check, maybe retry. Outlines intervenes during generation. At every sampling step it computes which tokens could still lead to valid output — per your regex, JSON schema, or grammar — and zeroes out the rest. The output is guaranteed conforming on the first pass: no retries, no invalid JSON, structurally impossible. The price: it needs access to the model's logits, so it's a local/open-model technique (some providers now ship equivalents).",
    worked: {
      title: "Worked example: making wrong answers unrepresentable",
      steps: [
        { head: "Express the contract as a pattern", body: "A verdict must be exactly 'bug', 'feature', or 'question': a regex (bug|feature|question). Or a full JSON schema for richer contracts. The constraint is data, sitting next to your tests." },
        { head: "Constrain the sampler", body: "Outlines wraps the model: at each token, allowed continuations are computed from the pattern's state machine; impossible tokens get probability zero. The model is free within the rails — and only within them." },
        { head: "Feel the guarantee", body: "Run 10,000 samples: schema violations = 0, by construction. Your test matrix loses an entire failure column and gains certainty. This is what 'correct by construction' means for LLM outputs." },
        { head: "Know the trade-offs", body: "Local models only (needs logits); tight constraints on long outputs can fight the model into odd-but-valid text; setup is heavier than JSON mode. Reserve it for high-volume, strict-shape paths — IDs, codes, schemas — where guarantees beat retries." },
        { head: "Test the seams that remain", body: "Structure is guaranteed; meaning isn't. A guaranteed-valid verdict can still be the wrong verdict. Your semantic eval battery stays exactly as important as before." },
      ],
    },
    mistakes: [
      { wrong: "Assuming constrained decoding guarantees correct answers.", right: "It guarantees valid shape. Semantics — was the right class chosen? — still need your eval battery.", why: "A perfectly formatted wrong answer is still wrong; the guarantee is syntactic." },
      { wrong: "Over-constraining free-form fields.", right: "Constrain the skeleton (keys, enums, formats); leave prose fields free.", why: "Squeezing natural language through a tiny grammar produces stilted output and can degrade the reasoning around it." },
    ],
    faq: [
      { q: "Why can't cloud APIs do this?", a: "Constrained decoding needs the probability layer (logits) at each step — providers don't expose it. Their alternative: schema-enforced 'structured outputs' features, which approximate the guarantee server-side." },
      { q: "Outlines vs Instructor — choose one?", a: "They compose: Instructor's contracts + a constrained local backend (Instructor can drive outlines). Cloud + loose shapes: Instructor. Local + strict shapes at volume: Outlines." },
    ],
  },

  "pydantic-generation": {
    hook: "Here's the whole architecture in one idea: the Pydantic class is the single source of truth for what an LLM must return. The same class generates the steering schema (telling the model what to emit), validates every response (catching what it got wrong), and documents the contract (for the humans). Change the class, the contract changes everywhere at once — versioned in Git like any API schema. LLM integration stops being prompt-and-pray and becomes contract engineering.",
    worked: {
      title: "Worked example: one class, three jobs",
      steps: [
        { head: "The class", body: "class BugReport(BaseModel): title ≤ 100 chars; steps: list of ≥1 items; severity: enum; affects: version string matching r'\\d+\\.\\d+'. Every constraint you'd write in a test plan, expressed once." },
        { head: "Job 1: steering", body: "The schema derived from this class goes into the request (function-calling / structured outputs / Instructor). The model is told the contract in machine language, not vibes." },
        { head: "Job 2: validation", body: "Every response parses through the same class. A severity of 'critical' (not in enum) fails fast with an exact error — at the boundary, not three services downstream." },
        { head: "Job 3: consumer contract", body: "Downstream code programs against BugReport instances — typed fields, autocomplete, refactor-safe. Nobody string-parses LLM output anymore; the class is the API." },
        { head: "Contract-test it", body: "Consumer tests: components accept any valid BugReport instance. Producer tests: the LLM, over N samples, produces schema-valid instances ≥ target rate. Two-sided contract testing — you already know this pattern from microservices." },
      ],
    },
    mistakes: [
      { wrong: "Keeping the 'real' spec in the prompt prose and a different one in code.", right: "The class is the spec; the prompt references it. One source, zero drift.", why: "Two specs diverge silently; the model follows one, your parser expects the other." },
      { wrong: "Validating with hand-written checks.", right: "Let the schema do the work: enums, bounds, regex, required fields — declarative, auditable, and it generates the steering schema for free.", why: "Hand checks rot; schemas version. Also, hand checks can't steer the model — schemas do both jobs." },
    ],
    faq: [
      { q: "What if the model genuinely can't satisfy the schema?", a: "Then you've found a real finding: either the task is too hard for that model at that context, or the schema encodes assumptions the input violates. Either way, a guaranteed schema error beats a silent shape-drift." },
      { q: "Does this pattern work for non-Python teams?", a: "The concept (schema as contract: JSON Schema, TypeScript zod, etc.) transfers fully; Pydantic is just the most mature LLM-integrated implementation." },
    ],
  },
};
