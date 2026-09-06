/** "Picture this" — one relatable Indian real-life example + an easy one-liner for every lesson. */
export interface Desi {
  /** one-line easy-English summary of the whole lesson */
  short: string;
  /** the scene: a familiar Indian situation */
  scene: string;
  /** how the scene maps to the concept */
  explain: string;
}

export const DESI: Record<string, Desi> = {
  "what-is-ai": {
    short: "AI is software doing jobs that would normally need a human brain — and it's only good at its one job.",
    scene: "Swiggy shows you 'restaurants near you' in a smart order. Nobody wrote 'show Dosa Plaza first' — the app learned what makes you order.",
    explain: "That ranking is narrow AI: brilliant at one job (ranking), clueless about everything else. As a tester, your new question is: what does a 'wrong but tasty-looking' result look like? Like suggesting a restaurant 40 km away because it's famous.",
  },
  "what-is-ml": {
    short: "In ML you don't write the rules — you show thousands of examples, and the software learns the rules itself.",
    scene: "Your bank's fraud team can't write every rule for UPI fraud. Instead they feed the system lakhs of past transactions marked 'fraud' or 'fine', and it finds the patterns on its own.",
    explain: "The rules now live inside the data. So a bad training example — like old data where all fraud happened at night — becomes a real bug. You can file it, reproduce it, and regression-test it. Very familiar territory for you.",
  },
  "what-is-dl": {
    short: "Deep learning = many layers of simple math that together learn to see, hear and read.",
    scene: "Google Lens reads a blurry Hindi menu photo. Early layers find edges, middle layers find letters like 'क' and 'ख', late layers put words together. Nobody hand-coded Devanagari.",
    explain: "The power comes from depth — layers building on layers. The price? When it misreads 'पाणी' as 'पानी', there's no single line of code to blame. That's why explainability testing exists.",
  },
  "genai-agents-agentic": {
    short: "GenAI creates new content; an agent is an LLM given tools and a to-do loop so it can actually act.",
    scene: "Asking ChatGPT to write test cases is GenAI. Giving it access to your Jira, saying 'find all P1 bugs from last sprint and draft a regression plan' — and watching it click through steps — that's an agent.",
    explain: "Each step is a new failure point: it can call the wrong Jira filter, loop forever, or claim success without doing anything. You test an agent like you'd review a junior's process — by reading its trace, not just its answer.",
  },
  "supervised-unsupervised-rl": {
    short: "Supervised learns from labelled answers, unsupervised finds patterns alone, reinforcement learns by trial and reward.",
    scene: "Supervised: teaching with answer keys (spam/not-spam). Unsupervised: Flipkart grouping similar products with no labels. Reinforcement: the IRCTC tatkal bot trying strategies until booking succeeds.",
    explain: "Each has a different tester headache: supervised needs clean labels, unsupervised has no 'right answer' to assert, and reinforcement will cheat your reward metric if it can — the classic 'minimise crashes by never leaving the garage'.",
  },
  "training-vs-inference": {
    short: "Training is the expensive months of learning; inference is the single fast answer your user gets.",
    scene: "Making the chai is training: slow, costly, done once. Serving each cup is inference: quick, per customer, priced per cup.",
    explain: "Testers live in inference-land — but watch for training/inference skew: if features are computed differently in the two paths, accuracy silently drops. Also: inference has latency and cost budgets training never sees.",
  },
  "overfitting-underfitting": {
    short: "Overfitting = memorising the practice papers; underfitting = never reading the syllabus.",
    scene: "A student memorises last year's question paper word-for-word and scores 100% in practice. In the real exam, the paper is slightly different — and they blank out. That's overfitting.",
    explain: "A model that aces training data but fails new data memorised noise. An underfit model is too simple for the job — linear regression on a sine wave. Your holdout test set is the 'real exam' that catches both.",
  },
  "bias-variance-noise": {
    short: "Error = wrong assumptions (bias) + over-sensitivity to the sample (variance) + pure luck (noise).",
    scene: "Darts: consistently off-centre = bias. Scattered all over depending on your mood = variance. A wobbly dartboard = noise you can never fix.",
    explain: "Complex models trade bias for variance — they chase every quirk of the training sample. When a retrained model behaves differently, you're watching variance. Knowing which one you see tells you which knob to turn.",
  },
  "train-test-split-cv": {
    short: "Hide some data from training, then exam the model on that hidden part — never on what it studied.",
    scene: "A coaching centre that gives the actual exam paper as practice material will show 100% results. Meaningless. The honest test uses unseen papers.",
    explain: "Train/validation/test split is exactly this. For time data (stock prices, demand), split by time — training on the future is cheating. K-fold cross-validation reuses scarce data by rotating the exam paper k times.",
  },
  "metrics-precision-recall-f1-roc": {
    short: "Accuracy hides lopsided problems. Precision asks 'when you cry wolf, are you right?'; recall asks 'did you catch all the wolves?'",
    scene: "A dengue alert app with 99% accuracy sounds great — until you learn 1 in 100 people has dengue, and it's just saying 'healthy' to everyone. Accuracy: 99%. Usefulness: zero.",
    explain: "In bug-triage AI: precision = of the bugs it flagged, how many were real (false alarms waste dev time); recall = of all real bugs, how many it caught (missed bugs reach production). F1 balances the two; ROC-AUC scores the ranking across all thresholds.",
  },
  "discriminative-vs-generative": {
    short: "Discriminative models draw the line between classes; generative models learn to create new samples.",
    scene: "Discriminative: the security guard deciding 'employee or visitor' at your office gate. Generative: the artist who can paint a brand-new office that never existed.",
    explain: "The guard is easier to test — clear yes/no. The artist's output has infinite variety, so testing means judging plausibility, contracts and constraints, not exact matches. Your AI features mix both — know which you're testing.",
  },
  neurons: {
    short: "A neuron is tiny math: multiply inputs by weights, add a bias, squash the result. That's it.",
    scene: "Deciding 'go for the movie tonight?' — inputs: ticket price, friends free?, day of week. Each input gets a weight (Friday matters more). Add them up, cross a threshold, and you decide.",
    explain: "One neuron does exactly this with numbers: output = squashed(weighted sum + bias). Training is just tuning those weights. Demystifying the atom makes the whole network less scary.",
  },
  layers: {
    short: "Layers stack neurons so simple detections combine into complex understanding — depth is the 'deep' in deep learning.",
    scene: "Reading a Cricket scorecard: layer 1 sees strokes and dots, layer 2 sees digits, layer 3 sees '172/4', layer 4 understands 'India needs 40 off 18'. Each layer stands on the previous one.",
    explain: "Early layers = simple features, later layers = decisions. When a vision model fails, thinking in layers helps: was it a pixel problem or a judgement problem? Also — more layers means more compute and more opacity.",
  },
  "activation-functions": {
    short: "Activations add the non-linear bends that let networks learn real-world curves, not just straight lines.",
    scene: "A dimmer switch, not a light switch. ReLU says 'nothing below zero, then grow steadily'; sigmoid squeezes anything into 0–1 like a probability.",
    explain: "Without these bends, a 100-layer network collapses to one straight line — useless. Dead ReLU (neurons permanently stuck at 0) is a real failure mode: parts of your model quietly switch off during training.",
  },
  backpropagation: {
    short: "After a wrong answer, blame is passed backwards through the network so each weight learns its share of the mistake.",
    scene: "The team loses the match. The coach reviews the recording backwards: the dropped catch blames the fielder, the bad over blames the bowler, the wrong XI blames the selector. Each gets a correction.",
    explain: "Backprop does this with calculus: error at the output → each layer's contribution → nudge every weight a little. You'll never compute it by hand, but knowing it's 'error sharing' explains why training needs labels and patience.",
  },
  "embeddings-dl": {
    short: "Embeddings turn words and images into lists of numbers where meaning becomes distance.",
    scene: "On a map, Mumbai is closer to Pune than to Delhi. Embeddings do this for meaning: 'chai' lands near 'tea' and far from 'cricket' — as coordinates in a huge number-space.",
    explain: "This geometry powers search, recommendations and RAG. Your testing angle: embedding quality is testable — 'filter' should be closer to 'strainer' than to 'Instagram filter'. Wrong neighbourhoods = silent retrieval bugs.",
  },
  tokenization: {
    short: "Tokenizers chop text into pieces the model can digest — and how they chop decides cost, multilingual quality, even code quality.",
    scene: "Breaking a sentence like eating: some models chew whole words, some (BPE) learn common chunks — 'namaste' as one chunk, rare words as several small bites.",
    explain: "Non-English text often needs 2–4× more tokens than English — your Indian-language features quietly cost more and get less context. Token counts also drive billing. Always count tokens for the real user's language, not your English test data.",
  },
  "embeddings-nlp": {
    short: "Text embeddings map sentences into vectors so machines can compare meaning mathematically.",
    scene: "Two bug reports: 'app crashes on payment' and 'payment screen force closes'. Different words, same meaning — their embeddings land almost on the same spot, so your dedup tool catches them.",
    explain: "Cosine similarity (0 to 1) measures that closeness. Tune the threshold like any other: too high, duplicates survive; too low, different bugs get merged. Threshold = a testable config, not a vibe.",
  },
  "tokens-vs-embeddings": {
    short: "Tokens are the text's atoms (billing unit); embeddings are the text's coordinates (meaning unit). Same sentence, two views.",
    scene: "A novel: tokens are the individual letters and words you count to buy the book; the embedding is its one-line summary's position on a giant library map.",
    explain: "You pay per token and search by embedding. Mixing them up causes classic mistakes — like assuming a short prompt means a small meaning-space, or that token limits are semantic limits. They're not.",
  },
  attention: {
    short: "Attention lets each word look at every other word and decide what's relevant — 'it' figures out what 'it' means.",
    scene: "Reading 'The tester filed the bug because it kept crashing' — your eyes jump back to find what 'it' refers to. Attention is that jump, done with math, for every word at once.",
    explain: "The attention pattern is inspectable: a heatmap of who-looks-at-whom. When an LLM mislinks a pronoun or ignores your constraint buried mid-paragraph, you're watching attention fail. It's the mechanism behind 'lost in the middle'.",
  },
  transformers: {
    short: "The Transformer reads all tokens in parallel with attention — the engine under every modern LLM.",
    scene: "Old models read a sentence one word at a time, like a relay race passing the baton. Transformers read the whole sentence at once, every word checking every other word — like a team huddle.",
    explain: "Parallel reading = fast training on huge data = the reason LLMs exist at all. For you: the context window is the huddle's size — everything outside it simply isn't in the room. And attention cost grows with that size squared.",
  },
  pandas: {
    short: "Pandas is Excel-on-steroids for Python: tables (DataFrames) you can filter, group and clean with code.",
    scene: "Your PM sends a 50,000-row CSV of support tickets and asks 'which state has the most payment failures?' In Excel you'd scroll forever. In pandas: two lines — groupby, count, sort. Done before the chai cools.",
    explain: "Testers use pandas to build test datasets, profile data quality and check model inputs. df.describe(), df.isna().sum() and value_counts() are your first three moves on any dataset — they find half the data bugs before modelling begins.",
  },
  numpy: {
    short: "NumPy is fast number-crunching in Python: arrays and vectorised math, no slow loops.",
    scene: "Computing GST on 10 lakh invoices. A Python for-loop takes minutes; NumPy does it on the whole array at once in milliseconds — like a stamping machine versus hand-signing.",
    explain: "Every ML library is NumPy underneath. You need the basics: creating arrays, slicing, broadcasting (one rule applied to many shapes), and why array math beats loops. It's the grammar of the data world.",
  },
  "numpy-vs-pandas": {
    short: "NumPy = raw, fast number grids. Pandas = labelled tables with names, indexes and real-world mess-handling.",
    scene: "NumPy is a warehouse of identical boxes — fast to move, but you must remember what's where. Pandas is the same warehouse with labels on every box and an inventory register.",
    explain: "Use NumPy for pure math and features; pandas when rows mean things (orders, users, tickets) and columns have names. They interoperate freely — df.values gets you the NumPy grid. Picking the right one is just picking the right tool.",
  },
  "basic-eda": {
    short: "EDA = interrogating a dataset before trusting it: shape, nulls, ranges, duplicates, weird values.",
    scene: "Like a pre-trip car check: fuel (row count), tyres (nulls), odd engine sound (outliers like age=250), duplicate keys (duplicate rows). You wouldn't drive to Leh without it; don't train without EDA.",
    explain: "Five commands cover 80%: shape, describe, isna().sum(), duplicated().sum(), and value_counts on key columns. Every surprise here is a bug report waiting to happen — 'age=250' in training data means nonsense predictions in production.",
  },
  "ml-pipeline": {
    short: "Data → Train → Validate → Test → Deploy: the assembly line, and every stage is a place you can test.",
    scene: "Like a cricket academy pipeline: local trials (data), practice nets (train), intra-squad match (validate), Ranji trophy (test), then the national team (deploy). Skip a stage and selectors find out the hard way.",
    explain: "Testers own the gates between stages: data quality checks before training, validation gates before testing, canary checks after deploy. An ML pipeline is just software with more stages — and you already know how to test stages.",
  },
  "data-drift": {
    short: "Data drift = the input data quietly changed since training, so the model is solving yesterday's problem.",
    scene: "A model trained on 2019 shopping data meets 2024 reality: everyone pays by UPI, orders at midnight, and buys air fryers. Inputs shifted; nobody told the model.",
    explain: "You detect it by comparing input distributions (feature stats, PSI/KL divergence) against a training baseline. Add drift monitors like you'd add error-rate alerts — because drift is a slow incident, not a sudden one.",
  },
  "model-drift": {
    short: "Model drift is the umbrella: model performance decays over time, whatever the cause.",
    scene: "Your phone's battery: same phone, same apps, but a year later it dies by lunch. Nothing 'broke' on a specific day — it decayed.",
    explain: "Track live performance (accuracy on recent labelled data, proxy metrics, prediction distribution) on a rolling window. A decay trend line is your evidence; the fix is retraining or features — but catching it is monitoring, which is your department.",
  },
  "concept-drift": {
    short: "Concept drift = the relationship between input and answer itself changed. The old rules are obsolete.",
    scene: "Before UPI, 'large cash deposit' meant fraud. After UPI became normal, that rule flags honest customers. The meaning of the signal changed — that's concept drift.",
    explain: "Data looks the same, answers should be different. It's the sneakiest drift — input monitors stay green while accuracy rots. Retrain windows, champion/challenger models and regular eval refreshes are the counter. Test the refresh process itself.",
  },
  "bias-in-ai": {
    short: "AI bias = the model systematically treats some groups worse — usually because the data or labels carried our own biases.",
    scene: "A resume-screening model trained on 10 years of hiring data learns 'past hires were mostly men from 5 colleges' — and starts filtering exactly like that. It didn't invent the bias; it photocopied it.",
    explain: "Bias is a testable defect: run identical inputs differing only in the protected attribute (name, gender, pincode) and compare outcomes. Slice your metrics by group — overall accuracy hiding a 20-point gap for one group is still a bug.",
  },
  explainability: {
    short: "Explainability tools show WHY a model decided — local (this one case) or global (overall behaviour).",
    scene: "A loan rejection with no reason is a complaint waiting to happen. RBI expects banks to explain decisions. SHAP answers 'which features pushed this specific rejection' — like an umpire's slow-mo replay.",
    explain: "Test explanations like any output: do they change when the decision changes? Do important features match domain sense? A model that rejects on 'application submitted at 3am' deserves a bug ticket, and explainability is how you'd catch it.",
  },
  fairness: {
    short: "Fairness has competing mathematical definitions — and satisfying one can break another. Choose, document, test.",
    scene: "Equal outcomes (both teams score the same runs) vs equal treatment (same field size for both). In cricket and in AI, you often can't have both — you must choose and say why.",
    explain: "Demographic parity, equal opportunity, equalized odds — each catches different injustices and conflicts with the others. Your job: pick the definition with the business, write it as a metric threshold, and regression-test it like any requirement.",
  },
  "how-llms-work": {
    short: "An LLM is a next-word predictor on autopilot: guess the most likely next token, add it, repeat — billions of times.",
    scene: "Like the game where you finish your friend's sentence — except the LLM has read half the internet, so its guesses are eerily good, one word at a time, all the way to a full essay.",
    explain: "Everything about LLM behaviour follows from this: why they're fluent (great guessers), why they hallucinate (they optimise plausibility, not truth), and why they can't do exact arithmetic (guessing digits is still guessing).",
  },
  "pretraining-posttraining-finetuning": {
    short: "Pretraining learns language from the whole internet; post-training adds manners; fine-tuning adds your speciality.",
    scene: "Pretraining = schooling (learn everything, know nothing deeply). Post-training = finishing school (how to talk to customers politely). Fine-tuning = on-the-job training at YOUR company.",
    explain: "Each stage has different cost and risk. Fine-tuning on your bug-report data can teach jargon — but also teach your data's biases. And 'post-training' is why base models feel feral while chat models feel civilised.",
  },
  "sft-rlhf-dpo-lora": {
    short: "SFT teaches format from examples, RLHF/DPO teach preference from human thumbs, LoRA teaches cheaply with a small add-on.",
    scene: "SFT: showing a new chef 10,000 plated dishes. RLHF: letting customers taste two versions and pick. DPO: same tasting, cheaper recipe. LoRA: instead of retraining the chef, just add one specialist cookbook.",
    explain: "LoRA matters most for you: it's how teams specialise open models affordably. Test LoRA'd models like any build — but also test that general ability didn't quietly degrade (the classic fine-tuning side-effect).",
  },
  "inference-parameters": {
    short: "Temperature, top-p and friends are the dials between 'robot-precise' and 'creative-friend' — same model, different personality.",
    scene: "The same dosa batter, different tawa temperature: low = consistent, crisp, identical every time (your JSON extraction); high = experimental, occasional masterpiece, occasional disaster (your brainstorming bot).",
    explain: "Temperature 0 = nearly deterministic (great for tests); higher = diverse but flaky. Frequency/presence penalties fight repetition; stop sequences cut the rambling. Testers: fix these in config, version them, and eval at the shipped values — not the defaults.",
  },
  "top-k-sampling": {
    short: "Top-k narrows each guess to the k most likely next words, then samples among them — creativity with guardrails.",
    scene: "Choosing dinner: instead of 'anything in the city' (all words), you shortlist your top-5 dishes, then pick randomly among those. k=1 is always the favourite; k=50 is adventurous.",
    explain: "Small k = safe and repetitive; large k = vivid but occasionally nonsense. Combined with temperature and top-p, it defines your output's personality. Test boundary k values — the bugs love living at the edges of the shortlist.",
  },
  "tokenizers-tiktoken": {
    short: "tiktoken lets you count exactly what your prompt will cost before you pay for it — count locally, bill predictably.",
    scene: "Like weighing your luggage at home before the airport — because the airline's scale (the API) charges per kilo, and surprises at the counter cost real money.",
    explain: "Count tokens for every prompt + expected response, in every language you support. Hindi text and code both pack differently than English prose. Build token budgets into your load tests — a prompt that grew 30% is a cost regression.",
  },
  "cost-math": {
    short: "LLM cost = tokens × price, and small per-call costs become lakhs at scale — do the multiplication before launch.",
    scene: "One vada pav is ₹20. Fine. But 10,000 employees × 8 calls a day × 3,000 tokens × ₹0.004/token... that's ₹9.6 lakh a month. The unit price looked harmless.",
    explain: "Price your worst realistic prompt, multiply by real volume, add 2× headroom. Then find the levers: caching identical calls, smaller models for easy tasks, shorter prompts. Cost tests belong in your test plan — with a calculator, not a feeling.",
  },
  "context-window-limits": {
    short: "The context window is the model's entire working memory — stuff things in and the middle gets forgotten.",
    scene: "Cramming 60 people into a 40-seat bus: everyone technically 'boarded', but the people in the middle get squeezed and ignored. 'Lost in the middle' is real and measured.",
    explain: "Fitting ≠ useful. Long contexts also slow down and cost more per call. Test with the needle-in-a-haystack pattern: hide one fact at start, middle and end of a long prompt, and check all three get found. Most models fail the middle.",
  },
  "open-vs-closed-llms": {
    short: "Closed models: rented power, zero control. Open models: your own engine, your garage, your mechanic bills.",
    scene: "Closed = OLA/Uber: call and go, but you can't open the bonnet, and prices change on a whim. Open = buying a Mahindra: you control everything, but maintenance is on you.",
    explain: "Closed gives you frontier quality instantly but no data guarantees and vendor lock-in. Open (Llama, Mistral, Qwen) gives control, privacy, offline use — and real operational work. Your eval battery is the only fair comparison.",
  },
  "should-use-open-source": {
    short: "Use open-source LLMs when data privacy, cost at scale, or customisation matter more than peak quality.",
    scene: "A hospital can't send patient reports to a third-party API — so it runs an open model on its own server. Same for banks, defence, and any data with a 'not outside the building' sticker.",
    explain: "Decide on four axes: privacy, cost, control, quality gap. Benchmark the open candidate against the closed one on YOUR tasks — public leaderboards don't know your domain. The gap closes every year, so re-run this decision yearly.",
  },
  "base-instruct-coder-reasoning": {
    short: "Base models are raw text-completers; instruct models follow orders; coder models specialise in code; reasoning models think before answering.",
    scene: "Base = a brilliant student mid-sentence who just keeps writing anything related. Instruct = the same student after etiquette training. Coder = their version who minored in programming. Reasoning = the one who scribbles rough work before answering.",
    explain: "Shipping a base model into a chat UI is a classic mistake — it completes rather than answers. Match the variant to the job, and test each honestly: coder models aren't automatically better at SQL, and reasoning models are slow and pricey.",
  },
  "running-llms-locally": {
    short: "Tools like Ollama and llama.cpp let you run real LLMs on a laptop — private, offline, free per call.",
    scene: "Streaming a movie (API) vs downloading it (local). Downloaded: no internet needed, no per-view charge, plays on your terms — but you need the storage and a decent machine.",
    explain: "ollama run llama3.2 answers on your laptop, fully private — perfect for testing prompts against real models with zero cost and zero data leaving the room. Learn the basics: model size vs RAM, quantisation levels, tokens/second as your latency metric.",
  },
  "quantization-gguf": {
    short: "Quantization shrinks models by using smaller numbers (16-bit → 4-bit): 4× smaller, slightly dumber, often fine.",
    scene: "A full-resolution photo is 20 MB; a WhatsApp-compressed one is 200 KB. You can still recognise everyone's face. Quantization is the same trade for model weights.",
    explain: "Q4_K_M ≈ 4-bit, great size/quality sweet spot; Q8 ≈ nearly lossless but 2× bigger. GGUF is the file format local runners speak; safetensors is the safe training format. Test the quantised model, not just the original — quality loss shows up first in hard cases.",
  },
  hallucinations: {
    short: "Hallucination = confidently wrong output. It's not a glitch — it's next-word-prediction doing its normal job without facts.",
    scene: "That friend who answers every question instantly and confidently — and is wrong 20% of the time. The LLM has no 'I don't know' instinct; silence is harder to predict than a plausible fact.",
    explain: "Causes you can attack: asked beyond its knowledge, vague prompts, high temperature, no grounding. Defences you can test: retrieval grounding (cite sources or refuse), structured outputs, and explicit 'say uncertain if unsure' instructions — each measurably lowers the rate.",
  },
  "prompt-sensitivity-variance": {
    short: "Tiny prompt changes → different outputs. It's not flaky software; it's the product. Test the distribution, not one run.",
    scene: "Asking your mom 'khana?' vs 'khana mil jayega?' vs 'bhookh lagi hai' — same intent, three different answers. LLMs are like that, except the differences can flip your JSON schema.",
    explain: "Run the same prompt N times at production temperature and measure the spread: does format hold? do facts agree? That spread is a testable property. And before blaming the model, check for trailing spaces, casing, and instruction order — all documented landmines.",
  },
  "reasoning-failures-cot": {
    short: "LLMs reason like they recite, not like they calculate — chain-of-thought helps, but chains can confidently go wrong mid-way.",
    scene: "Watching someone do mental math out loud: usually right, but one slipped digit and the rest of the confident explanation just rationalises the error.",
    explain: "Known failure patterns: digit slips, unit mix-ups, 'satisficing' (stopping at a plausible answer), and self-anchoring (first guess wins). Your counter: verify arithmetic with tools, force step outputs, and never trust a chain you can't check step by step.",
  },
  "context-rot": {
    short: "In very long contexts, models lose the thread: old instructions fade, contradictions blur, the middle sags.",
    scene: "A 3-hour meeting: everyone remembers the first 10 minutes and the last 10 minutes. The middle? 'Was that even discussed?' — models suffer the same attention decay, measurably.",
    explain: "Symptoms: instructions from the top ignored after 20k tokens, stale facts outranking fresh ones, diluted constraints. Fixes: keep prompts short, repeat key constraints near the end, compress history, and test with the length-ladder — same prompt at 2k, 8k, 32k tokens.",
  },
  "openai-compatible-api": {
    short: "One API shape (POST /v1/chat/completions with messages) now works across dozens of providers — write once, swap engines freely.",
    scene: "The USB-C of AI: one cable shape, many devices. Whether behind it is OpenAI, Azure, Ollama or Groq, your code plugs in the same way.",
    explain: "This standard is your leverage: point the same test harness at five providers and compare quality, latency, cost. Watch the fine print: parameter support varies (no logprobs here, no stop there) — test what you actually use, per provider.",
  },
  sdks: {
    short: "SDKs wrap the API with retries, timeouts and typed responses — but only if you configure them; defaults are naive.",
    scene: "Booking through the app (SDK) vs the raw website: the app retries on network blips, caches your details, handles errors politely. Raw requests don't — unless you build all that yourself.",
    explain: "The defaults will hurt you: infinite retries, no timeout, unbounded waits. Set max_retries≈2, a hard timeout, and exponential backoff — then test failure modes: 429 storms, 500s, connection drops, malformed 200s. Your chaos test plan applies verbatim.",
  },
  "json-mode": {
    short: "JSON mode constrains generation so the output is always valid JSON — but 'valid JSON' is not 'your schema'.",
    scene: "A vending machine that always gives you A packet (valid JSON) — but sometimes it's the wrong snack. Format guaranteed, contents not.",
    explain: "JSON mode kills malformed-output bugs beautifully; it doesn't guarantee required fields or value ranges. Layer the defences: JSON mode (syntax) → schema validation (structure) → business rules (semantics). Test each layer's failure mode separately.",
  },
  instructor: {
    short: "Instructor + Pydantic: ask the LLM for a typed object, and it retries itself until your validation passes.",
    scene: "Filling a government form where the counter clerk instantly says 'field 4 is wrong, fix it' — and keeps saying it until the form is perfect. That validation-retry loop, automated.",
    explain: "The magic is max_retries with validation feedback: the model sees WHY its output failed and self-corrects. Measure: retries per call, success rate, and latency cost. It's the cheapest reliability upgrade in the structured-output toolbox.",
  },
  outlines: {
    short: "Outlines enforces your format during generation by masking invalid tokens as they're produced — the output can't break the rules.",
    scene: "Not a spell-checker that flags mistakes after typing (validation) — a keyboard that physically can't press the wrong keys (constrained decoding).",
    explain: "Because it filters the token stream against your schema/regex/grammar, violations become impossible rather than caught-after. Trade-offs: needs local model access, and over-strict grammars can squeeze quality. Test both: format compliance AND content sanity.",
  },
  "pydantic-generation": {
    short: "Treat your Pydantic schema as the contract: generate, validate, reject on failure — the LLM becomes a service with an API.",
    scene: "Like GST invoice rules: the format is law, not a suggestion. Any invoice without a GSTIN doesn't enter the system — no negotiation, no 'close enough'.",
    explain: "Schema-as-contract turns fuzzy AI output into testable integration: required fields, enums, ranges, custom validators. Your regression tests assert on parsed objects, not string matching. This is where AI testing starts to feel like your day job.",
  },
  "prompt-engineering": {
    short: "Prompt engineering = writing the evals first, then crafting instructions until the whole battery passes — not wordsmithing.",
    scene: "A good recipe isn't luck: it's 'taste → adjust salt → taste again', with a clear idea of what 'tasty' means. Prompting without evals is cooking blind.",
    explain: "The amateur loop: tweak until the demo works. The pro loop: 30 test cases first, then tune until the distribution passes. You already do this daily — it's called test-driven development, applied to prose.",
  },
  "zero-shot": {
    short: "Zero-shot = instruction alone, no examples. Cheapest pattern, always your baseline — and surprisingly strong on clear tasks.",
    scene: "Telling a new intern: 'Classify these tickets as bug, feature, or question.' No examples shown. Modern models often just... get it. That's instruction-following training paying off.",
    explain: "Run your battery on the bare instruction first. If it passes at 90%, stop — you saved every fancy token. Only when the eval set shows specific failures do you earn the right to add examples or structure.",
  },
  "few-shot": {
    short: "Few-shot = showing 2–5 examples in the prompt. Examples teach boundaries and format better than paragraphs of rules.",
    scene: "Teaching someone to fold samosas: you don't describe folding for ten minutes — you fold two in front of them. 'Like this.' Done. Examples beat explanations.",
    explain: "The trick is WHICH examples: not the obvious ones (the model gets those), but the boundary cases your eval set failed on. A 'crash while requesting a feature' example teaches the bug-vs-feature line better than any rule text.",
  },
  "chain-of-thought": {
    short: "Ask the model to show its working and accuracy jumps — each written step becomes context for the next.",
    scene: "School maths: full marks require showing steps. Turns out models also get more right when they show working — the written steps are their rough-work scratchpad.",
    explain: "Use it for genuinely multi-step tasks and add checkpoints ('re-check your list before counting'). Know the price: chains are long (cost ×5–10) and one wrong early step poisons the rest. Verify steps with tools whenever you can.",
  },
  "self-consistency": {
    short: "Run the same prompt 5 times, take the majority answer — random mistakes cancel out, correct answers cluster.",
    scene: "Asking five different shopkeepers the price of the same item. Three say ₹40, two say ₹60. You trust the majority — and a 3-2 split tells you the price is genuinely unclear.",
    explain: "Sampling at temperature >0 makes reasoning paths differ; voting cancels the noise. Bonus: a narrow vote margin is an uncertainty signal — route those cases to humans. It's ensemble voting, and it costs 5× tokens, so apply it where accuracy beats cost.",
  },
  react: {
    short: "ReAct = think → act → observe → repeat. The pattern behind every agent: reasoning that can use real tools.",
    scene: "How you'd debug a production issue: think ('check the logs'), act (open Grafana), observe ('error rate spiked 2pm'), think ('what changed at 2pm?'), act (check deploys)... ReAct is exactly this loop, formalised.",
    explain: "Each Action is an API call you can validate; each Observation is input you can corrupt in tests. The test gold is the trace: valid tools, sane arguments, bounded loops, graceful failure. Agent testing IS trace testing.",
  },
  reflexion: {
    short: "Reflexion = fail, write a post-mortem, retry with the notes. The model learns from its mistakes — without retraining.",
    scene: "The retro: sprint failed, team writes what went wrong ('we skipped code review'), next sprint the note is on the wall. Reflexion is that wall, but for the model's context window.",
    explain: "It shines when there's a fast honest scorer (tests, compilers, checkers): the model reflects on real failures, not vibes. Test the loop itself: attempt caps, reflection quality over retries, and whether old reflections start polluting the context.",
  },
  "tree-of-thought": {
    short: "Instead of committing to one reasoning path, explore several branches, score them, and grow the best — search with a model.",
    scene: "Planning a Goa trip: not just the first idea — sketch three routes, rate each on cost/time/fun, then detail the winner. ToT makes the model do this on purpose.",
    explain: "The evaluator step is what makes it work (and testable): can the model tell good branches from bad ones? Verify its branch scores against expert judgement. It's powerful for planning, but every branch is a billed call — reserve it for high-stakes decisions.",
  },
  "least-to-most": {
    short: "First ask the model to break the problem into sub-questions, then answer them one by one, easiest first.",
    scene: "Cooking a thali: you don't start everything at once. List the dishes, cook the easy ones first, and each finished dish sets you up for the next. Same idea, for reasoning.",
    explain: "The decomposition itself is an inspectable artefact — a wrong plan is caught before any answering cost. Unlike free-form CoT, every step is small and checkable. Gate between steps: if step 1 finds nothing, stop honestly instead of hallucinating downstream.",
  },
  "roles-system-user-assistant": {
    short: "Message roles are your access control: system = the constitution, user = live (untrusted) input, assistant = the model's own history.",
    scene: "Office hierarchy: system prompt = HR policy (hard to override), user message = a visitor's request (polite, but verify everything they say), assistant history = your own file notes.",
    explain: "When a user message says 'ignore previous instructions', it's attacking exactly this boundary. Your defences: fence untrusted content in delimiters, put rules in system, and validate outputs downstream anyway — the prompt is one wall, not the castle.",
  },
  "response-prefilling": {
    short: "Pre-write the first tokens of the answer yourself — start with '{' and the model is already inside your JSON.",
    scene: "Starting a sentence for a friend: you say 'The verdict is—' and they can't answer with a three-paragraph essay. They continue your sentence. That's prefill.",
    explain: "Cheapest format control in existence: you don't request the format, you begin it. Anthropic supports it directly; elsewhere, careful prompt endings approximate it. Prefill structure, not conclusions — prefilling 'definitely fine' manufactures its own agreement.",
  },
  "prompt-chaining": {
    short: "Split one big ask into small linked calls: extract → analyse → format. Each link is testable, and bad inputs stop at the gate.",
    scene: "A good kitchen: prep station, cooking station, plating station. One chef doing all three in one pan = chaos and blame games. Separate stations = clean handoffs and easy quality checks.",
    explain: "Type every handoff (lesson 2.8.4) so links pass contracts, not raw text. Add gates: extraction found nothing? Say so and stop — don't burn calls analysing air. A wrong final answer now localises to one link. That's debugging you recognise.",
  },
  "constitutional-critique-revise": {
    short: "Draft → critique against written principles → revise. A built-in self-review that catches rule violations before shipping.",
    scene: "The editor's pass: you write the article, then re-read it against the style guide ('every claim needs a source, no hyperbole'), and fix what gets flagged. Critique-revise automates that re-read.",
    explain: "Write your 'constitution' as versioned, testable rules. It catches structural sins beautifully (uncited claims, format slips, banned words) — but a wrong fact can survive two reviews by the same blind spot. Pair it with real verification for facts.",
  },
  "prompt-structure": {
    short: "Reliable prompts fill seven slots: role, context, instruction, examples, format, constraints, output schema. Missing slots = leaking behaviour.",
    scene: "A good work order: who's asking (role), the situation (context), the task (instruction), a sample (example), the deliverable format, what NOT to do, and the exact fields to fill. Vague order, vague result.",
    explain: "Most 'model misbehaved' tickets are empty slots: no constraints ('do not add recommendations'), format only described in prose instead of shown, or two tasks smuggled into one instruction. Walk the seven slots as your debugging checklist.",
  },
  "prompt-templates-management": {
    short: "Get prompts out of code strings and into versioned template files — with config and tests attached. Prompts are code that happens to be prose.",
    scene: "The family recipe written inside a 60-line cooking video vs the same recipe as a printed card with ingredients, steps and taste-checks. One is folklore; the other survives generations.",
    explain: "Jinja2/LangChain render variables; Prompty bundles prompt + model config + test cases in one file. Then Git does the rest: every prompt change is a PR with an eval diff. Rollback takes minutes instead of being an archaeology project.",
  },
  "qe-prompt-libraries": {
    short: "Turn your team's scattered magic prompts into a library: named, owned, versioned, and — the entry ticket — scored by evals.",
    scene: "Every kitchen has one auntie who 'just knows' the perfect masala ratio. A recipe book with measured, taste-tested entries means the dish survives her absence. Your team's prompts need the same book.",
    explain: "Each entry: name, owner, version, variables, output contract, eval score ('92% on the 30-case battery'), last-verified date. Admission requires a battery and a score — 'works for me' stays in chat. Re-verify quarterly; models change under your feet.",
  },
  promptfoo: {
    short: "Promptfoo = CI for prompts: a YAML config runs every prompt × test case × assertion and fails the build on regressions.",
    scene: "Your unit test suite, but for prose: change one word in the prompt, and the build tells you exactly which of the 30 cases got worse. No more 'did that prompt change break anything?' shrug-fests.",
    explain: "Layer assertions: cheap deterministic ones (contains, regex, is-json) on every push; semantic ones (LLM judge, similarity) nightly and on prompt PRs. Always read the per-case matrix, not just averages — averages happily hide a severity-1 regression.",
  },
  "context-engineering": {
    short: "The model only knows what's in its window — so engineering that window (what's retrieved, what's fresh, in what order) beats wordsmithing.",
    scene: "Preparing a briefing for your boss: you don't dump the entire shared drive. You pick the three relevant pages, current versions, most important first. A model's answer quality is set by that same curation.",
    explain: "'The docs say 100 MB but the bot says 50' is rarely a prompt bug — usually a stale chunk made the window. Dump the actual context when debugging; test retrieval recall, ordering, and freshness like any other input. Log the full window in prod — it's your debugging superpower.",
  },
  "loop-engineering": {
    short: "An agent is a while-loop with an LLM inside. Your job: exit conditions, budgets, stuck-detection — the loop never polices itself.",
    scene: "An auto-rickshaw meter without a cap: the driver keeps 'trying one more route' while the meter runs. Budgets and exit rules are your meter cap.",
    explain: "Models don't know your ₹ limits — 'keep trying' is always a plausible next token. Enforce max tool calls, wall-clock, and cost OUTSIDE the model, in code. Then attack each bound in tests. A silent no-op ('done!' with nothing done) is the loop's null-pointer — test exits first.",
  },
  "harness-engineering": {
    short: "Strip the model out and what's left — retrieval, parsers, validators, caches, fallbacks — is the harness, and it's plain old testable software.",
    scene: "The dosa is perfect but the order is wrong: the blame is the waiter, the billing system, the delivery app — not the cook. In AI products, the 'waiter' is the harness, and it causes most incidents.",
    explain: "Retrieval missed, parser dropped a leading zero, cache served stale, fallback engaged silently — all classic bugs with classic tests. Instrument every seam and check the harness before blaming the model. Best part: your entire existing QA playbook applies here unchanged.",
  },
  "memory-engineering": {
    short: "LLMs forget everything by default — memory is what your system re-injects, and it needs write rules, recall rules and conflict rules.",
    scene: "'Sir, you told us last month you moved to Bengaluru, but our system still says Mumbai.' A memory with no conflict policy is a database where every update appends and nothing supersedes.",
    explain: "Every stored fact needs a timestamp and a supersede rule; newer contradicts older. Test memory like a database: write-read roundtrips, contradiction cases, expiry — and 'forget me' must actually purge every layer (that's a compliance test, not a feature test).",
  },
  "prompt-vs-context-vs-harness": {
    short: "Five disciplines, five failure signatures: prompt (style), context (stale facts), loop (runaway), harness (plumbing), memory (wrong recall). Name the failure, route the fix.",
    scene: "A patient with a headache could need glasses, water, sleep or a doctor. Same symptom, different department. AI incidents are identical: 'bad answer' has five different homes.",
    explain: "Build a one-page triage card: symptom → discipline → first artefact to inspect (prompt diff / context dump / trace / harness telemetry / memory store). New joiners learn it in an afternoon; incidents route in minutes instead of days. That card IS the discipline.",
  },
  "llm-benchmarks": {
    short: "Public benchmarks are vendor report cards — useful for shortlisting, useless as proof. The only benchmark that predicts your product is the one you build.",
    scene: "A college topper's marksheet tells you they're smart — but will they handle YOUR office's work? Only their first month at your desk answers that. Benchmarks are the marksheet; your eval battery is the first month.",
    explain: "Read scores skeptically: contamination (the exam leaked into training), saturation (everyone scores 99), mismatch (MMLU doesn't measure your refund-policy chatbot). Your move: 50–200 real cases from your inputs, your definition of correct, rerun on every change. Benchmark shortlists; your battery decides.",
  },
};
