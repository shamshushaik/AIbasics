import type { DeepContent } from "./types";

export const DEEP1: Record<string, DeepContent> = {
  "what-is-ai": {
    hook: "Think of AI like hiring. Classical software is a checklist: do exactly these steps. AI is a junior employee: you show them thousands of past cases and say 'figure out the pattern'. Sometimes the junior is brilliant; sometimes they're confidently wrong — and never raise a hand to admit it. Your job as tester shifts from checking steps to judging judgement.",
    worked: {
      title: "Worked example: classifying a support ticket",
      steps: [
        { head: "Pick the human task", body: "A human agent reads 'My app crashes when I upload a photo' and tags it: bug, account, or billing. That judgement is the task the AI will take over." },
        { head: "Ask what 'correct' means", body: "For a calculator, correct is one value. Here, two experts might disagree 10% of the time. So 'correct' becomes 'agrees with experts most of the time' — a statistical bar, not an exact one." },
        { head: "Choose the AI style", body: "You could write rules (contains 'crash' → bug) — brittle. Or train an ML model on 20,000 past tagged tickets — it learns rules you never wrote." },
        { head: "Define the failure you fear", body: "The model won't crash loudly. It will silently tag billing complaints as 'bug'. Write that failure down now — it becomes your first test case." },
        { head: "Test like a hiring manager", body: "Give it 200 tickets humans already tagged. Measure agreement rate, especially on tricky ones. 93% agreement with no errors on 'billing' might be shippable; 93% with billing blind spots is not." },
      ],
    },
    mistakes: [
      { wrong: "Writing exact-output assertions for AI features: expect(response).toBe('bug').", right: "Assert on distributions and invariants: agreement ≥ 92%, zero 'billing→bug' confusions in the regression set.", why: "AI answers vary; a single sample proves nothing about the system's behaviour." },
      { wrong: "Treating 'AI' as one technology with one test strategy.", right: "Ask which kind: rules, ML, generative, agent — each has different failure modes.", why: "A spam filter and a chatbot share a label, not a risk profile." },
      { wrong: "Assuming no error message means it works.", right: "Assume plausible-looking wrong answers are the default failure mode and design oracles for them.", why: "AI fails open — wrong outputs look identical to right ones." },
    ],
    faq: [
      { q: "Is a chatbot with canned answers AI?", a: "No — canned answers are a lookup table. The moment it generates or learns, it crosses into AI territory, and your test strategy must change with it." },
      { q: "Do I need to know math to test AI?", a: "You need statistics literacy (rates, distributions, samples), not calculus. If you can read a pass-rate report, you can read a confusion matrix — we'll prove it in lesson 1.2.6." },
      { q: "Why can't developers just unit-test the model?", a: "A model has no branches to cover — its 'logic' is millions of numbers. Quality evidence comes from evaluating behaviour on data, which is exactly a tester's craft." },
    ],
  },

  "what-is-ml": {
    hook: "Classical programming is rules → answers. Machine learning inverts it: answers → rules. You feed the machine 10,000 emails already labelled 'spam' or 'not spam' and it reverse-engineers the rules itself. The program you ship isn't code you wrote — it's rules the data taught. That's why in ML, bad data is bad code.",
    worked: {
      title: "Worked example: will this test run flake?",
      steps: [
        { head: "Gather labelled history", body: "Export 6 months of CI runs: test name, duration, retries, machine, time of day, and the label — flaked or didn't. This table IS your specification." },
        { head: "Split before you touch anything", body: "Set aside the most recent month as a holdout. You will not look at it until the end. (This is lesson 1.2.5 in one sentence.)" },
        { head: "Train", body: "Feed the rest to a simple classifier (logistic regression is fine). It infers rules like 'duration > 40s AND nightly → likely flake' — you never wrote them." },
        { head: "Evaluate on the holdout", body: "Run the model on the held-back month. It flags 80 of 100 real flakes and only 15 false alarms. That's your evidence — not vibes." },
        { head: "Ship with a human loop", body: "Don't delete 'flake-risk' tests automatically. Quarantine and notify. ML earns trust gradually, exactly like a new team member." },
      ],
    },
    mistakes: [
      { wrong: "Training and testing on the same rows, then celebrating 100% accuracy.", right: "Always hold out unseen data; judge only on that.", why: "The model memorized the training rows — you graded the exam with the answer key." },
      { wrong: "Blaming 'the algorithm' when results are bad.", right: "Inspect the labels and features first — 80% of ML problems are data problems.", why: "A mislabelled training row is a bug the model will faithfully reproduce at scale." },
      { wrong: "Expecting the model to explain its rules.", right: "Treat learned rules as emergent behaviour; verify them statistically.", why: "Nobody wrote 'if duration > 40s' — you can't review code that doesn't exist." },
    ],
    faq: [
      { q: "Is machine learning just fancy statistics?", a: "They're cousins. Statistics asks 'what does the data tell me?'; ML asks 'what function predicts new data best?'. For testers, both mean: evidence from samples, uncertainty everywhere." },
      { q: "Can ML learn from zero examples?", a: "Not classic ML — that's the LLM trick (they pre-train on the internet, then your prompt acts like examples). Module 2 explains exactly how." },
      { q: "What does 'the model' actually look like on disk?", a: "A big list of numbers (weights) plus code to apply them. For a linear model, maybe a few hundred numbers; for GPT-class models, hundreds of billions." },
    ],
  },

  "what-is-dl": {
    hook: "Deep learning is machine learning with a twist: instead of you inventing features (edges, word counts, durations), a stack of neuron-layers invents them while training. Early layers find simple things, later layers combine them into concepts. Nobody programs the hierarchy — gradient descent sculpts it. The price of that magic: you can no longer point at the line of code that decided.",
    worked: {
      title: "Worked example: why a screenshot diff tool keeps failing",
      steps: [
        { head: "Spot the symptom", body: "Your visual-regression tool flags every build: a 1px antialiasing shift produces thousands of 'diff' pixels. Pixel comparison is a hand-crafted feature, and it's brittle." },
        { head: "Reframe as a learning problem", body: "Question: 'do these two screenshots show the same UI state?' Collect pairs: same-state pairs and real-bug pairs, labelled." },
        { head: "Let the network learn features", body: "A small CNN learns what 'same' means: layout, components, text — while ignoring antialiasing, fonts rendering slightly differently, cursor position." },
        { head: "Read the failure mode honestly", body: "Deep nets fail weirdly: a dark-mode toggle may look like 'same state' to it. Build a confusion set of exactly those tricky pairs and track them per release." },
        { head: "Keep a deterministic floor", body: "Ship the model alongside a hard check (HTTP 200, no console errors). Deep learning upgrades your oracle; it doesn't replace your smoke test." },
      ],
    },
    mistakes: [
      { wrong: "Assuming deeper models are always better.", right: "Match model complexity to data size — 5,000 labelled images want a small net, not a 70B-parameter monster.", why: "Too much capacity with too little data is the textbook recipe for overfitting (lesson 1.2.3)." },
      { wrong: "Expecting a reason for each wrong answer.", right: "Ask statistical questions: which slices fail, how often, under what conditions.", why: "The 'reason' is distributed across millions of weights; the useful answer lives in the data." },
    ],
    faq: [
      { q: "Are neural networks modeled on the brain?", a: "Loosely — the neuron math was inspired by biology decades ago. Modern networks are best understood as function approximators: stacks of adjustable weighted sums." },
      { q: "Do I need a GPU to test deep learning products?", a: "To run inference demos: often yes (or an API). To test them: no — you test behaviour through the product's interface, like any other system." },
      { q: "Why did deep learning suddenly take over around 2012?", a: "Three things arrived at once: big labelled datasets, GPU parallelism, and architecture tricks (ReLU, dropout). Same math as the 1990s, finally affordable to run." },
    ],
  },

  "genai-agents-agentic": {
    hook: "A chatbot is an intern who answers questions. An AI agent is an intern with your laptop: it reads, clicks, calls APIs, checks results, and tries again until the job is done. 'Agentic AI' is what happens when you let that loop run your workflow. Testing an intern's answers is easy. Testing what an intern did unsupervised for 20 minutes — that's a new discipline, and it's where testers become indispensable.",
    worked: {
      title: "Worked example: an agent that files bug reports",
      steps: [
        { head: "Map the loop", body: "The agent's loop: read a Slack complaint → search the tracker for duplicates → reproduce via browser tool → draft a report → file it. Every arrow is a failure point." },
        { head: "Invent the worst plausible run", body: "It finds a 'duplicate' that isn't one (semantic search miss), closes the real bug, and posts 'resolved 🎉' to Slack. Write this scenario before you ever run the agent." },
        { head: "Test tools, not just text", body: "Verify the tool contracts: can 'close ticket' be called with a wrong ID? Is there a dry-run mode? Agents are tested at the tool boundary — that's your API layer." },
        { head: "Add guardrails and prove they bite", body: "Rule: never close tickets, only comment. Then deliberately prompt it to close one and assert the guardrail blocks the call. A guardrail you never attacked is a decoration." },
        { head: "Review traces like code review", body: "For every agent run, keep the full trace: thoughts, tool calls, results. Sample 10 runs a week and read them. Agent quality lives in traces, not in the final message." },
      ],
    },
    mistakes: [
      { wrong: "Testing only the final answer of an agent run.", right: "Assert on the trace: right tools called, right order, no forbidden calls, bounded retries.", why: "A correct answer from a reckless process (500 tool calls, deleted a branch) is still a defect." },
      { wrong: "Giving agents production credentials during testing.", right: "Sandbox environments + read-only scopes + dry-run flags; audit everything.", why: "Agents pursue goals literally. 'Clean up the test data' is a phrase you only type once." },
      { wrong: "Treating GenAI output as deterministic text generation.", right: "Treat every generation as a sample from a distribution; run N samples and measure spread.", why: "Same prompt, different day, different answer — your assertions need a statistical shape." },
    ],
    faq: [
      { q: "Where's the line between a chatbot and an agent?", a: "Tools + loop. A chatbot turns prompts into text. An agent turns goals into sequences of actions, observing results between steps." },
      { q: "Is 'agentic AI' just marketing?", a: "The label is marketing-adjacent, the capability is real: models now reliably use tools across multi-step loops. Your risk register should care regardless of the buzzword." },
      { q: "How do I regression-test something that acts differently each run?", a: "Regress the policy, not the path: allowed tools, budgets, success criteria, and pass-rates across repeated runs. Module 3.6 shows the tooling." },
    ],
  },

  "supervised-unsupervised-rl": {
    hook: "Three ways to teach. Supervised: flashcards with answers on the back ('this email → spam'). Unsupervised: hand over a pile of receipts and say 'sort these into piles' — no answers, just structure. Reinforcement: a rat in a maze with treats — try things, get rewards, repeat. Most production ML you'll test is supervised; the other two show up exactly where 'correct' is hardest to define.",
    worked: {
      title: "Worked example: same problem, three paradigms",
      steps: [
        { head: "The problem", body: "Your team wants to triage incoming bug reports: duplicate, valid, or invalid." },
        { head: "Supervised route", body: "5,000 historical reports already triaged by humans → train a classifier → measure against fresh human triage. Clear oracle, clear test plan. This is the default." },
        { head: "Unsupervised route", body: "No labels available? Cluster all reports into groups, name the clusters by hand ('crash reports', 'UI complaints'), then route by cluster. Oracle is fuzzy — you test cluster usefulness, not correctness." },
        { head: "Reinforcement route", body: "Rarely right here, but imagine auto-assigning severity and learning from 'was this actually fixed fast?'. Watch for reward hacking: the agent learns to mark everything low-severity because it's never wrong quickly." },
        { head: "The tester's takeaway", body: "The paradigm decides the oracle. Supervised → compare to labels. Unsupervised → expert review of structure. RL → watch for the metric being gamed. Pick the test style before you pick the model." },
      ],
    },
    mistakes: [
      { wrong: "Judging a clustering model with accuracy.", right: "Judge it by stability and usefulness — do clusters match expert groupings? Do they persist across data samples?", why: "There are no labels; 'accuracy' is undefined. Wrong metric, meaningless number." },
      { wrong: "Trusting RL systems that show great reward curves.", right: "Probe for reward hacking: does the behaviour satisfy intent or just the score?", why: "RL optimizes the letter of the reward. 'Minimize crashes' → 'never launch the app' scores perfectly." },
      { wrong: "Ignoring label quality in supervised projects.", right: "Sample the labels themselves and measure annotator agreement before trusting any model metric.", why: "If humans agree only 85% of the time, a model at 86% isn't smart — it's at the ceiling." },
    ],
    faq: [
      { q: "Which paradigm are LLMs?", a: "All three, in stages: pretraining is self-supervised (predict the next token), alignment uses human labels (supervised) and preference rewards (reinforcement-ish). Lesson 2.2 breaks it down." },
      { q: "Can unsupervised learning find fraud?", a: "Yes — as anomaly detection: 'this transaction looks nothing like the pile'. The catch: 'unusual' ≠ 'fraud', so false alarms are the metric that matters." },
      { q: "Why is supervised learning the most common in industry?", a: "Because businesses usually have historical decisions (labels) and a clear notion of right/wrong. It's the paradigm where 'correct' is easiest to define — and therefore to test." },
    ],
  },

  "training-vs-inference": {
    hook: "Training is the chef spending eight hours perfecting a recipe. Inference is the kitchen serving 500 plates an hour using that recipe. Nobody complains about the chef's time; everyone notices when service is slow or the plate looks different. Testers care about inference — it's what users hit — but the nastiest bugs are mismatches between the two kitchens.",
    worked: {
      title: "Worked example: the feature that lied",
      steps: [
        { head: "The setup", body: "A churn model uses 'average session length' as a feature. Training computes it with a careful pandas script; production computes it in a real-time service." },
        { head: "The mismatch", body: "The training script averages in minutes; the service averages in seconds. Nobody converted. The model trains fine — validation looks great." },
        { head: "The symptom in production", body: "Predictions look random. But nothing 'crashed' — the service returns 200s. This is training/serving skew, the silent killer." },
        { head: "The test that catches it", body: "Log the feature vectors at inference and statistically compare their distributions to training's (mean, quantiles per feature). A 60× shift in one column screams instantly." },
        { head: "The permanent fix", body: "One shared feature-definition (feature store or shared library) used by both paths, plus a CI check that diffs distributions on a golden dataset." },
      ],
    },
    mistakes: [
      { wrong: "Testing only that the endpoint returns 200 and a number.", right: "Assert the prediction distribution: same inputs as training should produce a similar score spread.", why: "Skew produces valid-looking numbers from a broken pipeline." },
      { wrong: "Assuming inference cost is a developer concern.", right: "Measure p95 latency and cost-per-request as test metrics; budget regressions are defects.", why: "A prompt that doubled input tokens just doubled the bill — that's a functional change." },
    ],
    faq: [
      { q: "Why is inference so much cheaper per run than training?", a: "Training does millions of passes over data, adjusting billions of weights with backprop. Inference is one forward pass — apply the weights, no adjusting." },
      { q: "Can I test training itself?", a: "Yes: check loss curves behave (decreasing, not spiking), reproducibility with fixed seeds, and that validation wasn't leaked into training. Data teams love testers who ask for these." },
      { q: "When does an LLM 'train'?", a: "Never at your request. Every ChatGPT message is inference. The training happened once, at the provider, for millions of dollars. Your fine-tunes (lesson 2.2) are the exception." },
    ],
  },

  "overfitting-underfitting": {
    hook: "Overfitting is the student who memorizes last year's exam, including the typos, and aces it — then fails this year's. Underfitting is the student who read one chapter and fails both. The sweet spot is learning the pattern, not the noise. Every time a model 'works in the demo but dies in production', suspect the memorizer.",
    worked: {
      title: "Worked example: diagnosing a model that aced the demo",
      steps: [
        { head: "The claim", body: "Vendor shows 99.2% accuracy on their dataset. You plug in your data: 71%. Before blaming your data, check the curve." },
        { head: "Ask for both curves", body: "Training accuracy 99.2%, validation accuracy 74%, and the gap widening each epoch. That gap IS the diagnosis: memorization, not learning." },
        { head: "Confirm with one clean probe", body: "Give it 20 fresh examples you made up yourself, following the same distribution. If it fails those too, the pattern is confirmed." },
        { head: "Prescribe like an engineer", body: "More training data, simpler model, regularization, or early stopping — each attacks memorization differently. Ask the vendor which they tried and what the gap did." },
        { head: "Bake it into your acceptance criteria", body: "Acceptance: validation accuracy ≥ X AND train/validation gap ≤ 5 points. One number without the gap is a vanity metric." },
      ],
    },
    mistakes: [
      { wrong: "Accepting training-set accuracy as proof of quality.", right: "Only holdout numbers count; treat training accuracy as a diagnostic, never a grade.", why: "Training accuracy measures memory. You're buying generalization." },
      { wrong: "Seeing low accuracy and immediately demanding a bigger model.", right: "First check underfitting: if training accuracy is also low, more capacity won't help — the features or labels are the problem.", why: "A deeper net on garbage learns garbage more confidently." },
    ],
    faq: [
      { q: "Can overfitting ever be good?", a: "Rarely and deliberately: if you truly will only ever see training-like data (say, compressing one specific dataset), memorization is fine. Production systems almost never qualify." },
      { q: "Do LLMs overfit?", a: "At training, yes (mitigated by scale + regularization). For you as a user, the visible cousin is reciting memorized training text verbatim — which is also a privacy finding worth testing." },
      { q: "How much data prevents overfitting?", a: "No universal number — it's about the ratio of examples to model complexity. Practical rule: if the train/validation gap grows, you need more data or less model." },
    ],
  },

  "bias-variance-noise": {
    hook: "Imagine throwing darts. Bias: your throws consistently land left of the bullseye — a systematic error (wrong model shape). Variance: your throws scatter wildly depending on your stance — hypersensitivity to conditions (model too flexible). Noise: the dartboard is on a wobbly table — randomness no skill removes. Every model error decomposes into these three, and each demands a different fix.",
    worked: {
      title: "Worked example: which dart problem do we have?",
      steps: [
        { head: "Measure both targets", body: "Train error 2%, validation error 18%. Large, consistent miss on new data → high variance: the model is chasing sample quirks." },
        { head: "Now the opposite symptom", body: "Train error 22%, validation error 24%, both stuck. Consistently wrong everywhere → high bias: the model is too simple for the pattern (a straight line on a curve)." },
        { head: "Identify irreducible noise", body: "Two identical customer records, one churned and one didn't. Humans can't predict it either. That slice of error is noise — no model removes it; stop optimizing there." },
        { head: "Pick the matching fix", body: "High variance → more data, regularization, simpler model. High bias → richer features, more capacity. Noise → lower expectations and calibrate thresholds instead." },
        { head: "Turn it into test vocabulary", body: "In bug reports: 'model chases noise (variance)' vs 'model misses the pattern (bias)' routes the fix to the right engineer instead of 'AI is broken'." },
      ],
    },
    mistakes: [
      { wrong: "Throwing 'add more data' at every bad model.", right: "Diagnose first: more data cures variance, does nothing for bias.", why: "Wrong prescription wastes the most expensive resource in ML — labelled data." },
      { wrong: "Chasing the last 2% of error heroically.", right: "Estimate the noise floor first; humans often set the ceiling.", why: "If experts agree only 95% of the time, 96% model accuracy is fantasy territory." },
    ],
    faq: [
      { q: "Why is it called a trade-off?", a: "Classically, complexity cuts bias but raises variance, and simplicity does the reverse. Modern deep learning bends the curve with massive data, but the vocabulary still diagnoses most failures." },
      { q: "Can I measure bias and variance directly?", a: "Roughly: train the same model on different data samples. Spread of predictions = variance; average miss = bias. This 'multiple sample' trick is also a great robustness test." },
    ],
  },

  "train-test-split-cv": {
    hook: "You wouldn't study for an exam using only the questions you'll be asked — that's not studying, that's printing the certificate. Train-test split does the honest thing: hide a stack of questions (the test set) that the model never sees, then grade on those. Cross-validation is the stronger version: re-shuffle and re-grade five times so one lucky split can't flatter you.",
    diagram: "split",
    worked: {
      title: "Worked example: splitting a bug-prediction dataset",
      steps: [
        { head: "The data", body: "4,000 historical bug reports, label: 'reopened later' or not. You want a model that flags risky fixes." },
        { head: "First move: split by time", body: "Reports are dated — so hold out the last 3 months (800 reports) as the test set. Random splits leak: a bug and its near-twin clones land on both sides, inflating accuracy." },
        { head: "Split the rest for tuning", body: "From the remaining 3,200, carve 20% as validation. Train on 2,560, tune hyperparameters on 640. The test set stays sealed." },
        { head: "Run k-fold when data is scarce", body: "Only 400 labelled cases? Use stratified 5-fold: each fold keeps the 12% 'reopened' ratio; average five scores. 'Stratified' means rare classes survive every split." },
        { head: "One rule that's sacred", body: "No preprocessing computed on all data. Scaling, encoding, even 'remove duplicates' — fit on training folds only. Leakage is the cardinal sin; it turns honest 78% into fake 94%." },
      ],
    },
    mistakes: [
      { wrong: "Randomly splitting time-series data.", right: "Split by time: past trains, future tests.", why: "Random splits let the model train on 'the future' — information it will never have in production." },
      { wrong: "Tuning on the test set, then reporting that number.", right: "Tune on validation; touch the test set exactly once, at the end.", why: "Every peek adapts your choices to the test set — it silently becomes training data." },
      { wrong: "Ignoring class ratios when splitting.", right: "Stratify: keep the rare class proportion identical in every fold.", why: "A fold with zero fraud cases makes that run's score meaningless." },
    ],
    faq: [
      { q: "What's a healthy split ratio?", a: "80/20 or 70/15/15 are defaults. With millions of rows, 98/1/1 is fine — you still get tens of thousands of test rows." },
      { q: "Why not just cross-validate always?", a: "It costs k× training time and doesn't suit time series or huge data. Holdout is honest and cheap; k-fold shines when data is scarce." },
      { q: "How do I detect leakage?", a: "Suspiciously high accuracy is symptom one. Technique: include a 'future' column (e.g. resolution date) — if accuracy jumps when you add it, something in your pipeline is cheating." },
    ],
  },

  "metrics-precision-recall-f1-roc": {
    hook: "Your smoke alarm has two ways to fail: it screams at toast (false positive — annoying) or stays silent during a fire (false negative — fatal). Precision asks 'when it screamed, was there fire?'. Recall asks 'of all real fires, how many did it catch?'. Accuracy hides both: an alarm that never rings is 99.9% accurate in a non-burning building. Choosing which failure you can afford is product design — and it's testable.",
    diagram: "confusion",
    worked: {
      title: "Worked example: scoring a flaky-test detector",
      steps: [
        { head: "Build the matrix", body: "On 1,000 held-out runs, the detector called 120 runs 'flaky'. Reality: 100 truly flaked. Of its 120 calls, 90 were right. Matrix: TP=90, FP=30, FN=10, TN=870." },
        { head: "Compute the trio", body: "Precision = 90/120 = 75% (a quarter of its alarms are toast). Recall = 90/100 = 90% (it caught 9 in 10 real flakes). Accuracy = 96% — sounds great, hides everything." },
        { head: "Decide which error hurts", body: "False positive cost: a developer ignores an alarm (alarm fatigue). False negative cost: a flake ships to main. For CI triage, missing flakes hurts more → recall-first." },
        { head: "Move the threshold consciously", body: "Lower the confidence threshold: recall rises to 96%, precision drops to 61%. You didn't 'improve the model' — you bought recall with precision. Document the operating point." },
        { head: "Report the whole picture", body: "ROC-AUC summarizes performance across all thresholds (0.5 = coin flip, 1.0 = perfect). Ship a one-line dashboard: AUC, chosen threshold, precision/recall at that point." },
      ],
    },
    mistakes: [
      { wrong: "Reporting accuracy on imbalanced problems.", right: "Lead with precision/recall (and the confusion matrix); accuracy is a footnote.", why: "At 99:1 imbalance, 'always predict the majority' scores 99% and is worthless." },
      { wrong: "Treating F1 as universally better.", right: "Use F1 only when false positives and false negatives cost about the same; otherwise pick the metric matching the business cost.", why: "F1 is the harmonic mean — it silently assumes both errors are equally bad." },
      { wrong: "Comparing models at different thresholds.", right: "Compare ROC-AUC or precision@fixed-recall; state the operating point explicitly.", why: "Any model can reach 100% recall by predicting everything positive — the threshold is a dial, not an achievement." },
    ],
    faq: [
      { q: "Why is ROC-AUC threshold-free?", a: "It integrates performance over every possible threshold — the area under the curve of (false-positive rate vs true-positive rate). It measures ranking ability: does the model put real positives on top?" },
      { q: "What does AUC 0.7 mean, honestly?", a: "Pick a random positive and a random negative — the model scores the positive higher 70% of the time. Useful but far from decisive; domain baselines matter." },
      { q: "When is a false positive worse than a false negative?", a: "Spam filters: trashing a real job offer hurts more than one phishing mail reaching the inbox. In court-like decisions (loan denial), false rejections carry the heavier cost." },
    ],
  },

  "discriminative-vs-generative": {
    hook: "A discriminative model is a border guard: given this passport (input), which side of the line (class) do you belong on? A generative model is a novelist: it learned what passports — and people — generally look like, so well it can invent convincing new ones. LLMs are novelists we keep asking to work the border. It works... until the novelist improvises.",
    worked: {
      title: "Worked example: 'classify this ticket' — two architectures",
      steps: [
        { head: "The discriminative build", body: "Fine-tune a small classifier on 10k labelled tickets. Output: probabilities over 4 classes. Fast (milliseconds), cheap, deterministic-ish, and every output is one of your classes by construction." },
        { head: "The generative build", body: "Prompt an LLM: 'Classify as bug/feature/question. Reply with one word.' It usually works — and occasionally replies 'This seems like a bug, but I'd need more context...' Now your parser needs a parser." },
        { head: "Enumerate the failure surfaces", body: "Classifier failures: wrong class (boring, measurable). LLM failures: wrong class, refusal, extra words, invented fifth class, language drift. Same task, bigger blast radius." },
        { head: "Test each honestly", body: "Classifier: confusion matrix on a held-out set. LLM: same matrix PLUS format-compliance rate (did it even output a parseable class?) measured over repeated samples." },
        { head: "Choose on evidence", body: "If the classifier hits 93% and the LLM hits 91% with 4% format failures, the 'dumb' model wins. Use the LLM where flexibility is the feature — labelling novel free text, drafting, explaining." },
      ],
    },
    mistakes: [
      { wrong: "Defaulting to an LLM because it's fashionable.", right: "Start with the simplest discriminative model that could work; escalate only with eval evidence.", why: "You inherit generative failure modes (verbosity, hallucination, format drift) on a task that didn't need them." },
      { wrong: "Parsing LLM output with string split and hoping.", right: "Constrain the output: JSON mode, function calling, or one of the structured-output tools from Module 2.8.", why: "Free text is a contract with no terms. Make the contract machine-checkable." },
    ],
    faq: [
      { q: "Can a generative model do classification well?", a: "Yes — with careful prompting, few-shot examples, and structured outputs, LLMs are strong classifiers, especially when classes evolve faster than you can retrain. Measure format compliance alongside accuracy." },
      { q: "What about images — same split?", a: "Exactly: a CNN saying 'cat/dog' is discriminative; a diffusion model drawing new cats is generative. The tester's question is identical: does the system's output type match the task's contract?" },
    ],
  },

  neurons: {
    hook: "Strip away the biology and a neuron is a tiny decision: multiply each input by a 'how much I care' weight, add a bias, squash the result, pass it on. Alone it can only draw a straight line. Stack a few million with learned weights and the lines compose into curves, textures, grammar. The whole mystery of deep learning is: which weights, learned from which data.",
    diagram: "neural",
    worked: {
      title: "Worked example: one neuron that flags slow test runs",
      steps: [
        { head: "Define inputs and weights", body: "Inputs: duration (x₁), retry count (x₂). Weights: w₁=0.8 (duration matters a lot), w₂=0.3. Bias: b=−5 (the bar for 'suspicious')." },
        { head: "Do the math on a real run", body: "A run with duration 12, retries 1: 0.8×12 + 0.3×1 − 5 = 4.9. Positive → the neuron fires 'suspicious'. A quick run (3, 0): 0.8×3 + 0 − 5 = −2.6 → quiet." },
        { head: "See what the activation does", body: "Sigmoid(4.9) ≈ 0.99, sigmoid(−2.6) ≈ 0.07. The squash turns 'how positive' into 'how confident, 0 to 1'. That confidence number is what thresholds act on." },
        { head: "Understand where learning happens", body: "Training = adjusting w₁, w₂, b so that real flakes score high and healthy runs score low across thousands of examples. You never set the weights; the data does." },
        { head: "The tester's translation", body: "'The model misjudged this run' literally means 'these weights are wrong for this region of inputs' — and the fix is better data for that region, not a code patch." },
      ],
    },
    mistakes: [
      { wrong: "Imagining neurons 'understand' anything.", right: "Think of them as adjustable weighted votes. Understanding is an emergent property of millions of votes.", why: "Mysticism blocks debugging. Weights, data regions, and distributions are debuggable." },
      { wrong: "Believing one neuron does one human concept.", right: "Features are distributed: 'flakiness' lives in patterns across many neurons, and one neuron participates in many concepts.", why: "This is why you can't unit-test a neuron and why behavioural testing rules." },
    ],
    faq: [
      { q: "What is a bias term, intuitively?", a: "The neuron's default mood. It shifts where the firing threshold sits, independent of inputs — like requiring more evidence before raising an alarm." },
      { q: "How many neurons does a modern LLM have?", a: "Roughly 10–100 billion weights (parameters). GPT-3-class: 175B. Llama-3-70B: 70B. The number is less important than the fact that all of it was shaped by training data." },
    ],
  },

  layers: {
    hook: "A layer is a row of neurons that all see the same inputs and vote together. Stack rows and information gets refined as it climbs: row 1 spots edges, row 5 spots eyes, row 20 spots 'angry customer'. Depth is division of labour — each layer's job is to make the next layer's job easier. Width is how many opinions each row holds.",
    worked: {
      title: "Worked example: reading a network's shape",
      steps: [
        { head: "Decode the spec", body: "'MLP: 784 → 256 → 128 → 10' means: 784 inputs (28×28 pixels), two hidden layers, 10 outputs (digits 0–9). You can read an architecture like a floor plan." },
        { head: "Predict what each layer learns", body: "For digits: layer 1 → strokes and curves; layer 2 → loops and intersections; output layer → 'these parts mean a 9'. For text models: early layers → syntax, late layers → intent." },
        { head: "Know the families", body: "CNNs reuse weights across positions (great for images), RNNs pass state along sequences (legacy for text), Transformers attend across the whole sequence at once (today's LLMs — lesson 1.4.5)." },
        { head: "Respect the costs", body: "Every layer added costs training time and opacity. 'Deeper is better' died around the point where residual connections and good data mattered more than depth." },
        { head: "Tester's move", body: "When something fails, localize by layer type: preprocessing bugs look like garbage-in failures; late-layer failures look like confused decisions on edge cases. Different layers, different test probes." },
      ],
    },
    mistakes: [
      { wrong: "Assuming bigger architectures automatically mean better products.", right: "Ask for validation metrics per model size — often the smaller model within 1% accuracy is the right ship (cheaper, faster, simpler to host).", why: "The last 1% of accuracy often costs 10× the compute." },
    ],
    faq: [
      { q: "What's a hidden layer?", a: "Any layer between input and output. 'Hidden' just means you don't see its values from outside — a great name, since it's exactly what makes the model opaque." },
      { q: "Why can't we just inspect the middle layers to explain decisions?", a: "You can visualize them (they light up on edges, faces, topics), but they're not human arguments. They're evidence for XAI tools (lesson 1.6.6), not explanations by themselves." },
    ],
  },

  "activation-functions": {
    hook: "Without activations, a neural network — however deep — is just one big multiplication, no smarter than linear regression. Activations are the 'bend' in the wire: they decide how strongly a neuron fires and inject the non-linearity that lets stacks of simple math fit anything. ReLU's 'either zero or pass it through' is the bend that built modern deep learning.",
    worked: {
      title: "Worked example: why the bend matters",
      steps: [
        { head: "The problem with straight lines", body: "Predict house price from size: mostly a line. Predict 'will this bug be reopened?' from 30 intertwined factors: curves, cliffs, interactions. Stacked linear layers still produce a line — useless for cliffs." },
        { head: "Add the bend", body: "ReLU: output = max(0, z). Negative inputs die to zero; positive ones pass unchanged. Cheap, never saturates on the positive side — which is why deep nets finally trained well around 2012." },
        { head: "Know the output layer's job", body: "Inside the net: ReLU/GELU. At the exit: sigmoid for one probability (will it flake: 0.83), softmax for a distribution over classes (bug 70% / feature 20% / question 10%). LLM next-token probabilities are one enormous softmax." },
        { head: "Spot the failure flavour", body: "'Dying ReLU': neurons stuck at zero forever, contributing nothing. If a layer dies, capacity silently shrinks — Leaky ReLU and GELU exist partly to prevent this." },
        { head: "Tester's lens", body: "When outputs look dead-flat or probabilities look pegged at 0/1, suspect saturation at the activation or threshold level. Ask for the raw scores before the squash — they tell a different story." },
      ],
    },
    mistakes: [
      { wrong: "Treating probabilities from softmax as calibrated certainties.", right: "Check calibration: when the model says 80%, is it right ~80% of the time? Often it's overconfident — measure it.", why: "Softmax forces numbers to sum to 1; it doesn't force them to be honest." },
    ],
    faq: [
      { q: "Why did sigmoid fall out of favour inside networks?", a: "Saturation: far from zero, its gradient nearly vanishes, so learning crawls in deep stacks. It survives at outputs, where a bounded probability is exactly what you want." },
      { q: "Do I ever choose an activation as a tester?", a: "Rarely — but you should recognize the fingerprints: vanishing gradients (loss flat), dying units (dead features), miscalibration (overconfident probabilities). Naming the symptom speeds the fix." },
    ],
  },

  backpropagation: {
    hook: "Training is a blame game with calculus. The model makes a prediction, a loss function scores how wrong it was, and backpropagation walks backwards through the network assigning each weight its fair share of the blame — then nudges every weight a tiny step downhill. Repeat a million times and the network 'learns'. No insight, no understanding — just extremely well-distributed blame.",
    worked: {
      title: "Worked example: following the blame",
      steps: [
        { head: "Forward pass", body: "Input: 'checkout crashes on iOS'. The network computes a prediction: 'billing' (wrong — it's a bug). Loss function scores the miss: 2.4." },
        { head: "Backward pass", body: "Backprop applies the chain rule layer by layer: how much did the output layer's weights contribute to that 2.4? The layer before? Each weight gets a gradient — a signed 'nudge me this way' note." },
        { head: "The nudge", body: "Optimizer updates: weight −= learning_rate × gradient. Learning rate 0.001 means tiny cautious steps. Too big: loss oscillates and explodes. Too small: training crawls for days." },
        { head: "Read the training curves like test trends", body: "Loss steadily down → learning. Loss flat → not learning (rate too small, or data exhausted). Train loss down while validation loss rises → overfitting, stop soon. Spiky chaos → rate too big or bad data." },
        { head: "Why testers care", body: "You'll never backprop by hand — but you'll read these curves in model cards and incident reviews. 'Validation loss diverged after epoch 12' is a sentence you should be able to challenge: what changed at epoch 12?" },
      ],
    },
    mistakes: [
      { wrong: "Assuming 'trained longer' means 'better'.", right: "Ask for the validation curve — training beyond the sweet spot actively degrades the model (overfitting).", why: "More epochs can mean more memorization. The minimum of the validation curve is the finish line." },
    ],
    faq: [
      { q: "Is backpropagation how LLMs answer questions?", a: "No! Backprop only happens during training. At inference your prompt flows forward once — no weight changes, no learning. The model is frozen; only the context moves." },
      { q: "What's a gradient, in one line?", a: "The direction and steepness of 'how to increase the error' — so we step the opposite way to decrease it." },
    ],
  },

  "embeddings-dl": {
    hook: "An embedding is a meaning-address. Take 'dog' and plot it as a point in a 768-dimensional space; take 'puppy' and it lands nearby; 'invoice' lands far away. The magic: the geometry is learned from usage, so arithmetic works — king − man + woman ≈ queen. Everything semantic in modern AI (search, RAG, dedup, similarity) is geometry in these spaces.",
    worked: {
      title: "Worked example: deduplicating bug reports with vectors",
      steps: [
        { head: "The old way fails", body: "Keyword dedup matches 'app crashes on photo upload' and 'photo upload crashes app' but misses 'taking a picture kills the app'. Words differ, meaning doesn't." },
        { head: "Embed everything", body: "Pass each report through an embedding model → a vector (say 1,536 floats). Semantically similar reports land near each other regardless of wording." },
        { head: "Measure distance", body: "Cosine similarity between vectors: 0.96 for the crash trio above, 0.41 against 'billing question'. Threshold at ~0.85 (tuned on your data!) to flag likely duplicates." },
        { head: "Test the geometry", body: "Build a probe set: 50 known-duplicate pairs, 50 known-distinct pairs. Measure precision/recall of your threshold — it's a classic classification eval in disguise." },
        { head: "Watch the failure modes", body: "Embedding models have blind spots: negation ('works' vs 'does not work' can land close), version numbers, short texts. Add them to your probe set — they will bite." },
      ],
    },
    mistakes: [
      { wrong: "Using a magic similarity threshold from a blog post.", right: "Tune the threshold on YOUR labelled pairs; report precision/recall at the chosen point.", why: "Distance scales differ per model, per domain, per language. 0.85 in one space is 0.6 in another." },
      { wrong: "Blaming the LLM for bad RAG answers.", right: "Inspect retrieval first: were the right chunks even fetched? Embedding quality is a separate, testable component.", why: "A generator fed wrong context answering confidently is a retrieval bug wearing a hallucination costume." },
    ],
    faq: [
      { q: "Who decides which dimension means what?", a: "Nobody — dimensions have no labels. Meaning emerges from the training objective: words used in similar contexts get pushed together. 'Dimension 317' means nothing; the whole vector means everything." },
      { q: "Are embeddings deterministic?", a: "For a fixed model and input, yes — same text, same vector (unlike LLM generation). Which makes embedding pipelines pleasantly testable: exact-match assertions on vectors are legitimate." },
    ],
  },

  tokenization: {
    hook: "Models can't read — they count. Tokenization chops text into pieces from a fixed vocabulary: common words stay whole ('testing'), rare ones shatter ('unbeliev' + 'able'). These pieces, not words, are what the model sees, what you're billed for, and what your context window actually holds. Half of all 'weird AI behaviour' with numbers, code, and non-English text starts here.",
    diagram: "tokens",
    worked: {
      title: "Worked example: why '123456789' confuses the model",
      steps: [
        { head: "See the split", body: "Tokenize 'The total is 123456789': ['The', ' total', ' is', ' 123', '456', '789']. The number is chopped mid-value — the model never sees '123456789' as one thing." },
        { head: "Explain the symptom", body: "Arithmetic on big numbers fails because it's digit-group arithmetic on arbitrary chunks. 'Which is larger, 9.11 or 9.9?' dies for related tokenization + reasoning reasons." },
        { head: "Test the edges yourself", body: "Probe: emoji strings, German compounds ('Donaudampfschifffahrt'), code with unusual spacing, Vietnamese, right-to-left scripts. Count tokens per character — English ~4 chars/token; others can be 2–3× worse." },
        { head: "Find the truncation bomb", body: "A user paste that's 3,990 tokens fits; the same paste with 200 emoji might hit 8,000 tokens and get silently truncated mid-sentence. Test boundary inputs in TOKENS, not characters." },
        { head: "File the right bug", body: "'Model bad at math' is a vibe. 'Tokens 123|456|789 split the operand; outputs wrong sum 60% of runs on 8-digit numbers' is a bug an engineer can act on." },
      ],
    },
    mistakes: [
      { wrong: "Estimating cost and limits in characters.", right: "Count tokens with the model's actual tokenizer (tiktoken, lesson 2.4.1); characters lie by 2–3× depending on language and content.", why: "Billing, limits, and truncation all happen in token space." },
      { wrong: "Assuming every model splits text the same way.", right: "Each model family has its own vocabulary; token counts are not transferable between models.", why: "'500 tokens here' might be 700 there — your context budget and your invoice both change." },
    ],
    faq: [
      { q: "Why not just use characters?", a: "Sequences explode (a 300-char paragraph = 300 tokens) and attention cost grows quadratically with length. Subwords are the compromise: short sequences, small vocabulary, rare words still representable." },
      { q: "What are those spaces at the start of tokens?", a: "BPE marks word-initial pieces (usually with 'Ġ' or a leading space) so the model can reconstruct exact spacing. It's why ' test' and 'test' are different tokens — and why leading whitespace in prompts technically matters." },
      { q: "Can tokenization be a security issue?", a: "Yes: homoglyphs and unusual splits can smuggle text past keyword filters ('p​aypal' with an invisible character). Fuzz token boundaries like any other parser." },
    ],
  },

  "embeddings-nlp": {
    hook: "Keyword search asks 'do these strings share words?'. Embedding search asks 'do these ideas share meaning?'. Modern NLP embeds whole sentences — 'the deploy failed' and 'release is broken' land close with zero shared words. That one capability powers semantic search, RAG, clustering of bug reports, and every 'find similar' feature you use.",
    worked: {
      title: "Worked example: building a 'similar incidents' search you can trust",
      steps: [
        { head: "Chunk the corpus", body: "Split incident docs into ~300-token chunks with overlap. Chunking strategy is a product decision: too small loses context, too big dilutes relevance." },
        { head: "Embed and index", body: "Embed each chunk (deterministic, cacheable — embeddings never change for the same model+text). Store vectors in an index (FAISS, pgvector, pinecone — the plumbing, not the magic)." },
        { head: "Retrieve on query", body: "Embed the query, fetch top-5 nearest chunks by cosine similarity. This retrieval step decides everything downstream — the LLM only ever sees what retrieval hands it." },
        { head: "Build the eval that matters", body: "50 real queries with known-relevant docs. Measure recall@5: did the right chunk make the top 5? If retrieval recall is 60%, no prompt can save the other 40%." },
        { head: "Test the classic misses", body: "Queries with typos, abbreviations ('prod' vs 'production'), negations, and fresh incidents (embedded before the doc existed — re-index cadence is a real incident-response factor)." },
      ],
    },
    mistakes: [
      { wrong: "Evaluating only the final LLM answer in a RAG system.", right: "Evaluate retrieval and generation separately: retrieval recall@k, then answer-faithfulness given retrieved chunks.", why: "Two different failure modes need two different fixes — bad retrieval vs bad generation." },
      { wrong: "Keeping embeddings forever across model upgrades.", right: "Re-embed the corpus when the embedding model changes; old vectors in a new space are garbage.", why: "Vector spaces are model-specific. Mixing generations silently corrupts similarity." },
    ],
    faq: [
      { q: "How are sentence embeddings different from word embeddings?", a: "Old word embeddings (Word2Vec) gave one fixed vector per word — 'bank' (river) and 'bank' (money) shared it. Sentence embeddings capture the whole utterance's meaning, disambiguation included." },
      { q: "Is cosine similarity the only distance?", a: "The default for text (direction matters, length less so). Some indexes use dot product or Euclidean — the eval methodology stays identical." },
    ],
  },

  "tokens-vs-embeddings": {
    hook: "Tokens are the alphabet; embeddings are the map. Tokens are integer IDs — discrete, countable, billed, capped. Embeddings are float vectors — continuous coordinates in meaning-space. The pipeline: text → tokens → (model computes) → embeddings → ... → probabilities → tokens → text. Confuse the two and you'll debug the wrong layer: you count tokens, but you compare embeddings.",
    worked: {
      title: "Worked example: tracing one request through both worlds",
      steps: [
        { head: "Inbound: text becomes tokens", body: "'Why did build 482 fail?' → ['Why', ' did', ' build', ' 482', ' fail', '?'] — 6 tokens. This is the unit of billing and limits. Countable, exact, boring." },
        { head: "Middle: tokens become vectors", body: "Inside the model, each token ID looks up a vector, layers refine them into contextual embeddings. 'fail' here gets a CI-flavoured vector, not a classroom-exam one." },
        { head: "Outbound: vectors become token probabilities", body: "Final vectors → softmax over the whole vocabulary → next-token probabilities → sampled token → repeat. Generation lives in token space again." },
        { head: "Know which question lives where", body: "'Why is my bill high?' → token space. 'Why didn't search find my doc?' → embedding space. 'Why did the answer mention X?' → attention over embeddings (next lesson). Different layers, different probes." },
        { head: "The mixed-layer bug", body: "A real one: truncation (token space) silently removed the question at the end of a long context, so answers ignored it — misdiagnosed for weeks as 'the model is bad at our docs'. Layer discipline saves weeks." },
      ],
    },
    mistakes: [
      { wrong: "Comparing two texts by comparing token lists.", right: "Similarity questions are embedding questions: embed both, compare vectors.", why: "Paraphrases share almost no tokens yet nearly identical vectors." },
      { wrong: "Budgeting context in 'messages' or 'pages'.", right: "Budget in tokens — a 3-page paste with code and emoji can out-token ten pages of prose.", why: "The window doesn't know what a page is. It counts pieces." },
    ],
    faq: [
      { q: "Do embedding APIs return tokens?", a: "They consume input tokens (billed) and return a fixed-size vector (e.g. 1,536 floats) regardless of input length. Two different units in one API call — a classic source of confusion." },
      { q: "Can I invert an embedding back to text?", a: "Not cleanly — it's a lossy compression into meaning-space. This is both a privacy argument ('vectors aren't data') and its rebuttal (inversion attacks recover surprising amounts of text). Test accordingly." },
    ],
  },

  attention: {
    hook: "'The tester approved the build because IT passed.' Which thing does 'it' mean? You resolved that instantly — attention is the mechanism that lets a model do the same: for every word, compute how much every other word matters right now, then blend. Attention is not a metaphor for what transformers do. It literally IS the computation.",
    diagram: "attention",
    worked: {
      title: "Worked example: watching attention resolve 'it'",
      steps: [
        { head: "Set the scene", body: "Sentence: 'The tester approved the build because it passed.' When the model processes 'it', it must borrow meaning from the right noun — 'build', not 'tester'." },
        { head: "Queries, keys, values", body: "Each word carries three vectors: Query (what am I looking for?), Key (here's what I offer), Value (here's my actual content). 'It's query is 'I'm a pronoun, find my antecedent'." },
        { head: "The score", body: "Dot 'it's query with every word's key → scores. Softmax → weights: build 0.61, tester 0.22, approved 0.09, ... 'It's new representation becomes 61% 'build' plus a pinch of the rest." },
        { head: "Many heads, many jobs", body: "Multi-head attention runs this in parallel with different focuses: one head tracks syntax, another coreference ('it'→'build'), another topic. Inspecting heads is real debugging in interpretability research." },
        { head: "The cost law", body: "Every position scores every other: cost grows with length². Double the context, quadruple the attention work. This single fact explains context-window prices, long-context difficulty, and why 'just add more context' has a bill attached." },
      ],
    },
    mistakes: [
      { wrong: "Thinking attention means the model 'understands'.", right: "Attention is weighted averaging — powerful, but mechanical. It explains behaviour patterns, not comprehension.", why: "Keeping the mechanic in mind keeps your test expectations honest: attention dilutes over long contexts (lesson 2.4.3)." },
      { wrong: "Ignoring position in long prompts.", right: "Put critical instructions at the start or end; attention to the middle sags ('lost in the middle').", why: "Measured effect: identical facts retrieved worse from mid-context than from the edges." },
    ],
    faq: [
      { q: "Why not just use a dictionary lookup for references?", a: "Because 'it' isn't always the job: pronouns, implied subjects, cross-sentence references. Learned attention handles the messiness; a lookup table breaks on the first metaphor." },
      { q: "Can I see attention weights?", a: "Yes — visualizing attention maps is a standard interpretability tool. Caveat: weights show influence, not full causation. Evidence, not proof." },
    ],
  },

  transformers: {
    hook: "Before 2017, language models read one word at a time, like a finger tracing a line — slow, forgetful over distance. The transformer said: look at the whole page at once, and let every word talk directly to every other (that's attention). The result parallelizes beautifully on GPUs, remembers across long distances, and scaled so predictably that it became the skeleton of every model you've heard of: GPT, Claude, Llama, Gemini.",
    worked: {
      title: "Worked example: why scale made chatbots smart",
      steps: [
        { head: "The anatomy in four parts", body: "1) Token embeddings + positions (what and where). 2) Stacked attention layers (who relates to whom). 3) Feed-forward layers (per-word processing). 4) A softmax over the vocabulary (what comes next). That's the whole machine." },
        { head: "The next-token objective", body: "Training = predict the next token, billions of times. Sounds too simple to produce intelligence — until you notice that predicting well requires modelling facts, logic, and even deception present in the data." },
        { head: "Emergence: the surprise", body: "Around certain scales, capabilities appear that weren't explicitly trained: in-context learning (few-shot from examples in the prompt), chain-of-thought reasoning, instruction following. Nobody fully predicts which capability arrives at which size." },
        { head: "Emergence cuts both ways", body: "Failure modes also emerge unannounced: new hallucination flavours, sycophancy, jailbreak susceptibility. Every model upgrade is a new test surface — this is why 'the model got better' is not a regression test." },
        { head: "Tester's operating stance", body: "Treat each model version as a new build of a black-box system with unknown release notes: full behavioural battery, saved baselines, diffed results. Module 4 turns this into benchmark literacy." },
      ],
    },
    mistakes: [
      { wrong: "Assuming model upgrades only fix things.", right: "Re-run your eval battery on every version bump; track both improvements and regressions.", why: "Capability and failure modes both shift; providers' release notes under-report the latter." },
      { wrong: "Explaining transformer behaviour with human metaphors alone.", right: "Pair the metaphor with the mechanism: probabilities over tokens, conditioned on context.", why: "'It got confused' is a symptom. 'Long context diluted the instruction' is a diagnosis you can test." },
    ],
    faq: [
      { q: "Are all LLMs transformers?", a: "Effectively yes — every frontier model (GPT, Claude, Gemini, Llama, Qwen) is a transformer descendant. Alternatives exist (state-space models like Mamba) but transformers dominate production." },
      { q: "What does 'GPT' actually stand for?", a: "Generative Pre-trained Transformer — and each word is a fact: it generates (next-token sampling), was pre-trained (huge corpus, before your prompt), and is a transformer (attention-based). The whole course in three words." },
    ],
  },

  pandas: {
    hook: "Pandas is the spreadsheet that grew up and learned to script. A DataFrame is a typed table; every question you'd ask a dataset becomes one line: filter, group, count. For testers, it's the fastest road from 'this model feels off' to 'here's the slice where it's off, with numbers' — which is the difference between a hunch and a bug report.",
    worked: {
      title: "Worked example: auditing a training export in 10 minutes",
      steps: [
        { head: "Load and look", body: "df = pd.read_csv('tickets.csv'); df.shape (rows, columns); df.dtypes (is 'created_at' actually a date?); df.head(). Thirty seconds, and half of all data bugs are already visible." },
        { head: "Hunt the impossible", body: "df.describe() shows min/max per column: age −3, duration 40,000 minutes, created_at in 2031. Impossible values are free bugs — the model trained on them." },
        { head: "Count what matters", body: "df['label'].value_counts(normalize=True): is 'fraud' really 2% of rows? If so, accuracy is a liar here (lesson 1.2.6) and you now have the evidence." },
        { head: "Slice by segment", body: "df.groupby('region')['error_rate'].mean() — and there it is: EMEA error 11%, everywhere else 2%. One line, one finding, one very specific bug ticket." },
        { head: "Check the joins", body: "pd.merge(...) then check for exploded row counts: 10k rows became 40k after a join? Duplicate keys. Duplicate rows are the #1 silent train/test leak (lesson 1.2.5)." },
      ],
    },
    mistakes: [
      { wrong: "Trusting dtypes silently.", right: "Cast and verify: pd.to_datetime(..., errors='coerce') then count the NaTs it produced.", why: "'2024-13-45' parses to nothing; a string column pretending to be dates poisons every date feature." },
      { wrong: "Reading aggregate numbers without segmenting.", right: "Always group by at least one dimension (region, class, source) before believing an average.", why: "Averages hide slices. The model is usually fine overall and broken somewhere specific." },
    ],
    faq: [
      { q: "Do I need to become a data scientist?", a: "No — you need the audit toolkit: load, describe, value_counts, groupby, merge. ~20 functions cover 90% of testing needs." },
      { q: "Is pandas slow on big data?", a: "It holds everything in RAM; millions of rows are fine, billions are not. For those, the same grammar exists in Spark/Polars — the thinking transfers." },
    ],
  },

  numpy: {
    hook: "NumPy is a grid of numbers with a turbo button. A Python list of a million floats, looped over, is slow; the same numbers in a NumPy array run at near-C speed because operations apply to the whole grid at once ('vectorized'). Every weight, embedding, and image in AI is one of these grids — so NumPy is the arithmetic layer under everything you'll test.",
    worked: {
      title: "Worked example: measuring embedding similarity the fast way",
      steps: [
        { head: "The task", body: "You have 10,000 bug-report embeddings (10000 × 1536 floats) and one query embedding. Find the 5 most similar reports." },
        { head: "The loop way (don't)", body: "A Python for-loop over 10,000 rows computing a similarity each: works, takes minutes, teaches nothing. This is the anti-pattern vectorization exists to kill." },
        { head: "The NumPy way", body: "sims = M @ q — one matrix multiplication computes all 10,000 similarities at once, in milliseconds. np.argsort(sims)[-5:] grabs the top 5 indices." },
        { head: "Why it's fast", body: "Contiguous memory + no Python overhead per element + SIMD/GPU-friendly kernels. The mental shift: describe the whole computation, let the array engine execute it." },
        { head: "Tester's uses", body: "Cosine similarity probes, distribution distance checks (compare embedding batches across deploys), token-count histograms. When a similarity score looks suspicious, reproduce it in NumPy in three lines." },
      ],
    },
    mistakes: [
      { wrong: "Looping over arrays element by element.", right: "Express the whole operation with array math; reach for loops only when logic is genuinely sequential.", why: "10–100× speedups are routine; more importantly, array code matches the math and is easier to verify." },
      { wrong: "Ignoring shape mismatches until runtime.", right: "Assert shapes at boundaries: assert M.shape == (10000, 1536).", why: "Broadcasting will happily do something plausible with the wrong shape. Silent wrong math is the worst kind." },
    ],
    faq: [
      { q: "What is broadcasting?", a: "NumPy stretching a small array to match a bigger one: adding a per-column mean (1536,) to a whole matrix (10000×1536) without copying. Elegant, occasionally surprising — print shapes when results look odd." },
      { q: "NumPy vs PyTorch tensors?", a: "Same spirit; tensors add GPU and gradients (for training). As a tester, NumPy is enough for offline analysis; you'll rarely need to touch training code." },
    ],
  },

  "numpy-vs-pandas": {
    hook: "NumPy speaks mathematics: shapes, axes, raw speed, no labels. Pandas speaks data: named columns, mixed types, missing values, CSVs, joins. They're not rivals — pandas is built on NumPy, and they hand data back and forth freely. Rule of thumb: asking questions about rows? pandas. Doing math on numbers (like vector similarity)? NumPy.",
    worked: {
      title: "Worked example: the same audit, both tools",
      steps: [
        { head: "Load with pandas", body: "df = pd.read_csv('runs.csv') — column names, dates parsed, missing values visible. The entry point is always pandas because data arrives labelled." },
        { head: "Ask row questions in pandas", body: "'Flake rate per team': df.groupby('team')['flaked'].mean(). 'How many runs last week': df[df.date >= ...].shape[0]. Named columns make this readable prose." },
        { head: "Cross into NumPy for math", body: "To compare duration distributions between months as arrays: a = df[df.month==5].duration.to_numpy(). Quantiles, distances, histograms — array math." },
        { head: "Embeddings live in NumPy-land", body: "Model outputs are arrays, not columns. Cosine similarity, clustering distances, drift statistics: NumPy (or its GPU cousin). pandas got you there; NumPy does the arithmetic." },
        { head: "One fluent pipeline", body: "pandas to select → .to_numpy() to compute → back into pandas to report. Fluency is knowing which side of the bridge you're on — and that missing values (NaN) behave differently on each side." },
      ],
    },
    mistakes: [
      { wrong: "Doing heavy math in pandas loops (iterrows).", right: "Extract arrays and vectorize; iterrows is the slowest idiom in the ecosystem.", why: "iterrows converts fast columns back into slow Python objects, row by row." },
      { wrong: "Forgetting NaN rules change across the bridge.", right: "Check np.isnan after conversion; pandas' None and NumPy's NaN don't always translate silently.", why: "A silent NaN becomes 0.0 somewhere and quietly corrupts every statistic." },
    ],
    faq: [
      { q: "Which should I learn first?", a: "Pandas — it's the audit workbench you'll use daily. NumPy concepts arrive naturally the first time you need real math on a column." },
    ],
  },

  "basic-eda": {
    hook: "EDA is the detective's walk-through before the trial: don't theorize yet — walk the scene. Ten minutes of honest looking routinely finds what would have become a month of model confusion: dates in the future, ages of 300, a 'gender' column with 47 spellings. In ML, the data IS the specification — so EDA is requirements review.",
    worked: {
      title: "Worked example: the 60-second sweep, then the deep cuts",
      steps: [
        { head: "Shape & schema", body: "df.shape, df.dtypes, df.columns vs the data dictionary. Column 'status_code' arrived as float with NaNs — already a finding: where are the missing codes?" },
        { head: "The describe pass", body: "df.describe(include='all'). Min/max/unique counts surface impossibles: duration −14, 99,999 duplicate IDs, a 'country' column with 300 unique values for a 2-country product." },
        { head: "Missingness has meaning", body: "df.isna().mean(). 'Email' missing 40% of the time isn't a nuisance — maybe guest checkouts don't have one, and 'missing' is itself a signal the model should get." },
        { head: "Plot before you model", body: "Histograms of key columns: a 'duration' with a spike at exactly 3600? That's a timeout cap, not a real duration. A one-line plot just saved you from a garbage feature." },
        { head: "Write it up as test evidence", body: "EDA findings become test cases: 'assert no negative durations in serving data', 'alert if country cardinality > 50'. The detective's notes become the law." },
      ],
    },
    mistakes: [
      { wrong: "EDA after training, when results look bad.", right: "EDA first — it decides which features are even sane and which metrics are honest.", why: "Models amplify data pathologies confidently. Cheaper to catch a 300-year-old user before training." },
      { wrong: "Treating missing values as always-bad.", right: "Ask why they're missing; encode the reason when it carries signal.", why: "'Missing' is data too. Deleting rows can erase an entire user segment." },
    ],
    faq: [
      { q: "What's the minimum EDA before trusting a dataset?", a: "Shape/dtypes, describe(), missingness per column, duplicate-ID count, one histogram per key numeric column, one value_counts per key category. Ten minutes, catches 80%." },
      { q: "Does EDA count as 'testing'?", a: "It's exploratory testing applied to data — the same instincts (curiosity, impossible values, boundaries) with a different subject. Your team's best EDA practitioner is probably already a tester." },
    ],
  },

  "ml-pipeline": {
    hook: "A production ML system is a conveyor belt: data → labelling → training → validation → testing → deployment → monitoring → retrain. Everyone stares at the training station; failures overwhelmingly ship from the other stations — a mislabelled batch, a schema drift, a feature computed differently in production. Google measured it years ago: training code is a small island in an ocean of pipelines. Testers: the ocean is yours.",
    diagram: "pipeline",
    worked: {
      title: "Worked example: mapping the belt and planting sensors",
      steps: [
        { head: "Draw the belt honestly", body: "For your AI feature, trace every stage: where data comes from, who labels it, where the model trains, how it ships (batch file? API?), what monitors it. Most teams discover two stages they forgot existed." },
        { head: "Translate each stage to QA", body: "Data collection = input validation. Labelling = source-data integrity. Training = build pipeline. Validation = staging tests. Deployment = release management. Monitoring = production telemetry. You already know this discipline — it just changed costumes." },
        { head: "Find the hand-off gaps", body: "Every arrow is a contract: schema, freshness, ordering. The classic kill: training reads 'v2' of a table, serving computes features from 'v1'. Test the arrows, not just the boxes." },
        { head: "Plant the sensors", body: "Log at each station: row counts, schema hashes, label distributions, feature distributions, prediction distributions. Anomaly in any series is an early-warning bug — filed before users notice." },
        { head: "Make retraining a release", body: "A retrained model is new software: same regression battery, same sign-off, same rollback plan. 'It's just a model refresh' is how drift ships to production." },
      ],
    },
    mistakes: [
      { wrong: "Testing only the model's predictions.", right: "Test the pipeline: data contracts, label quality, feature parity train/serve, deploy rollback, monitor alarms.", why: "The model is one station. Most production ML incidents originate upstream or downstream of it." },
      { wrong: "Letting models retrain without regression gates.", right: "Every retrain runs the eval battery and requires sign-off like a code release.", why: "New weights = new behaviour. 'Same code, new model' is still a new build." },
    ],
    faq: [
      { q: "Why do ML teams under-invest in everything except training?", a: "Training is the intellectually glamorous part and the research community optimizes for it. Production reality is inverted — which is precisely the job opening for testers." },
    ],
  },

  "data-drift": {
    hook: "Your model learned 2019. Then 2020 happened. Data drift is the inputs quietly changing shape after deployment: amounts shift, formats change, a UI update alters what users type. Nothing crashes — the model just answers today's questions with yesterday's instincts. Drift is why 'it used to work' is a complete incident category.",
    worked: {
      title: "Worked example: the sensor that caught the schema migration",
      steps: [
        { head: "Baseline at launch", body: "Snapshot training-time distributions: median order value $52, 'mobile' platform share 61%, average description length 140 chars. This snapshot is your reference photograph." },
        { head: "Watch continuously", body: "Weekly, compare production inputs to the baseline: Population Stability Index (PSI) per feature. Rule of thumb: PSI < 0.1 calm, 0.1–0.25 investigate, > 0.25 alarm." },
        { head: "The alarm fires", body: "Week 9: 'order_value' PSI 0.4. Panic? Not yet — drift is necessary but not sufficient for harm. Check the model's metrics on recent data before escalating." },
        { head: "Find the mundane cause", body: "It was a currency change: the app switched to displaying (and logging) values in cents. Inputs shifted 100×. The model wasn't aging — the world was re-labelled." },
        { head: "Close the loop", body: "Fix the parser, add a schema contract test (units declared in the data contract, asserted on ingestion). Drift detection without root-cause workflow is just expensive anxiety." },
      ],
    },
    mistakes: [
      { wrong: "Alerting on every distribution wiggle.", right: "Tiered thresholds + correlation with model performance; drift alone is a lead, not a verdict.", why: "Seasonality makes inputs drift on schedule. Cry-wolf drift alerts get muted, and the real one sails past." },
      { wrong: "Assuming drift means retrain.", right: "Diagnose first: bug in logging? schema change? genuine behaviour shift? Only the last one needs retraining.", why: "Retraining on cent-not-dollar data teaches the model the bug." },
    ],
    faq: [
      { q: "What's the simplest drift check I can ship today?", a: "Weekly per-feature: compare mean/quantiles to baseline, alert on relative change > 20% for two consecutive weeks. Crude, effective, zero ML required." },
      { q: "Does drift apply to LLM apps?", a: "Constantly — user prompt styles evolve, retrieved docs change, upstream data rots. Prompt-distribution monitoring is the LLM-era version of this lesson." },
    ],
  },

  "model-drift": {
    hook: "Even with perfectly stable inputs, live models age. Data drift pushes them out of their comfort zone; feedback loops poison them — a fraud model blocks a pattern, fraudsters adapt, the blocked pattern vanishes from new data, and the model forgets it ever existed. Model drift is the slow slide in accuracy that arrives without a single error log.",
    worked: {
      title: "Worked example: measuring a model's mileage",
      steps: [
        { head: "The hard part: ground truth lags", body: "A loan model predicts 'will default'. Defaults arrive months later. You cannot measure accuracy live — so build proxies: early delinquency signals, manual review samples, holdout cohorts with fast labels." },
        { head: "Chart the slide", body: "Monthly precision/recall on the labelled-when-ready cohort: month 1: 0.81, month 4: 0.77, month 7: 0.69. The trend — not any single number — is the signal. Set the retrain trigger on slope." },
        { head: "Hunt the feedback loop", body: "The model denies risky applications → denied users never generate outcome data → retraining sees a world where denied profiles 'don't exist' → the model gets braver. If you can't draw the loop, you haven't found it yet." },
        { head: "Choose a response policy", body: "Calendar retraining (simple, predictable), trigger-based (drift or metric alarms), or continuous learning (fast, dangerous). Each retrain is a release: eval battery, sign-off, rollback plan (lesson 1.6.1)." },
        { head: "The tester's dashboard", body: "One screen: prediction distribution today vs launch, labelled-cohort accuracy over time, retrain history with eval scores. If the team can't produce it, monitoring is the first bug to file." },
      ],
    },
    mistakes: [
      { wrong: "Watching latency and uptime as 'model health'.", right: "Monitor outcomes: accuracy-on-labelled-cohorts, prediction-distribution stability, per-segment performance.", why: "A drifting model serves 200s faster than ever. Infrastructure metrics measure the car; accuracy measures the driving." },
      { wrong: "Retraining as a fix-all without root cause.", right: "Ask what changed — data, world, or loop — and fix that; retrain only if the world genuinely moved.", why: "Retraining on poisoned feedback data bakes the loop deeper." },
    ],
    faq: [
      { q: "How fast do models typically decay?", a: "Anywhere from weeks (fraud, ad-click) to years (physical-process models). The rate is a property of how fast your domain moves — ask the domain experts, then verify with data." },
      { q: "Can monitoring replace retraining?", a: "No — monitoring tells you when; retraining (or redesign) does the fixing. Monitoring without a retrain pipeline is a very expensive weather report." },
    ],
  },

  "concept-drift": {
    hook: "Data drift moves the inputs; concept drift moves the truth. 'High amount → fraud' held until fraudsters switched to many small transactions — inputs look similar, meaning inverted. Spam filters live here permanently: the enemy rewrites the playbook weekly. Same features, same model, new world. It's the sneakiest drift of all because nothing in the input distributions may scream.",
    worked: {
      title: "Worked example: when the rules of the game change",
      steps: [
        { head: "Spot the signature", body: "Input distributions: stable. Model accuracy: sliding. That combination — calm inputs, falling scores — is the concept-drift fingerprint (data drift shows noisy inputs first)." },
        { head: "Classify the flavour", body: "Sudden: a regulation redefines 'eligible' overnight. Gradual: phishing slowly migrates from links to QR codes. Recurring: retail seasonality returns every November. The flavour sets your detection strategy." },
        { head: "Detect on the error signal", body: "Watch the errors themselves: false-negative rate climbing while inputs stay stable? The relationship moved. Tools like ADWIN exist for exactly this; a rolling error-rate chart gets you 80% there." },
        { head: "Respond by flavour", body: "Sudden → human review gate + fast labelled refresh. Gradual → weight recent data heavier in retraining. Recurring → seasonal models or features ('days_to_holiday') that encode the cycle." },
        { head: "Build the canary set", body: "Maintain a small, hand-labelled 'current truth' set refreshed quarterly by experts. When the model's score on canaries diverges from its score on old test data, the concept moved — and you have receipts." },
      ],
    },
    mistakes: [
      { wrong: "Attributing every accuracy drop to data drift.", right: "Check inputs first: stable inputs + falling accuracy = concept drift; the responses differ entirely.", why: "You'll retrain on more of the same data and fix nothing, while the world keeps moving." },
      { wrong: "Testing only against historical labelled sets.", right: "Keep a fresh-labelled canary set; old gold standards fossilize.", why: "Your 2022 test set encodes 2022 fraud. Against 2025 fraud it's folklore." },
    ],
    faq: [
      { q: "Is concept drift just 'the model is old'?", a: "No — it's specifically that the input→output relationship changed, not merely that performance is lower. An old-but-stable world produces a stable old model." },
      { q: "Do LLMs suffer concept drift?", a: "They're frozen — but the world drifts around them: their 'knowledge' has a cutoff, and the facts, APIs, and slang they were trained on age. Retrieval and fine-tuning are the patches." },
    ],
  },

  "bias-in-ai": {
    hook: "An ML model doesn't invent prejudice — it launders it. Historical hiring decisions that excluded women become 'ground truth' labels; the model learns 'resume with women's college → reject' and calls it mathematics. 'The algorithm said no' carries an authority no human decision does — which makes biased models not just unfair, but harder to argue with. Finding those laundering paths is premium testing work.",
    worked: {
      title: "Worked example: auditing a resume screen for bias",
      steps: [
        { head: "Map the laundering paths", body: "Three doors: representation (whose resumes are in the data?), measurement ('prestigious college' as a proxy for class), and history (past biased decisions as labels). Check each door, not just the output." },
        { head: "Run the twin test", body: "Take 50 real resumes; create twins differing only in name (gender/ethnicity-correlated names, validated by prior-study lists). Run both through the model. Score gaps across the pairs = direct evidence." },
        { head: "Slice every metric by segment", body: "Precision/recall per gender, per age band, per region. Overall recall 88% can hide 'recall for candidates over 50: 61%'. Aggregate metrics are where bias goes to hide." },
        { head: "Check the proxies", body: "The model never sees 'gender' but sees 'women's chess club', 'maternity leave gap', 'zip code'. Proxy variables carry protected information; test with them removed and watch how little the score moves." },
        { head: "Report like an auditor", body: "Finding: 'Name-swap changes screening score in 31% of pairs; median shift −0.12 for group A. Recall gap: 27 points.' Not 'model might be biased' — a measurement with a magnitude." },
      ],
    },
    mistakes: [
      { wrong: "Dropping the protected column and calling it fair.", right: "You need the column to measure fairness; remove it from decision features, keep it for audit slices.", why: "Blindness to gender makes gender bias unmeasurable — and proxies fill the vacuum anyway." },
      { wrong: "Accepting 'overall accuracy is fine' as the answer.", right: "Require per-segment metrics in every model report, the way you'd require per-browser test results.", why: "Bias is a distributional property. Averages are its camouflage." },
    ],
    faq: [
      { q: "Is this testing or ethics?", a: "Both — and that's what makes it valuable. The ethical requirement ('don't discriminate') becomes a testable specification the moment you pick a metric and a segment definition." },
      { q: "What if we don't collect demographic data?", a: "Then you can't measure disparity — a finding in itself. Many regulations (EU AI Act) require exactly this capability for high-risk systems." },
    ],
  },

  explainability: {
    hook: "Deep models don't contain reasons — so XAI builds approximations: SHAP asks 'which inputs moved this decision, by how much?' by perturbing them; LIME fits a tiny honest model around one prediction. These explanations are models of the model — useful, testable, and occasionally lying. Treat every explanation as a hypothesis to verify, never as truth.",
    worked: {
      title: "Worked example: interrogating a loan denial",
      steps: [
        { head: "Get the explanation", body: "Loan denied. SHAP says: credit-history length (−0.31), debt ratio (−0.18), recent inquiries (−0.05). The story reads plausibly — which is exactly when you should get suspicious." },
        { head: "Perturb and verify", body: "SHAP blames debt ratio most after history. Change only debt ratio to a good value, rerun: still denied? Then the explanation is lying about what drove the decision. Explanations must survive counterfactual tests." },
        { head: "Check stability", body: "Add tiny noise to the same application; the explanation flips its top factor. Unstable explanations can't be shown to customers or regulators — file it." },
        { head: "Check for laundering", body: "An explanation highlighting 'zip code' as top factor in a lending model is a red flag waving: zip is a proxy for race in many regions. XAI doesn't just explain — it indicts." },
        { head: "Set the bar", body: "Acceptance criteria for explanations: faithful to the model (counterfactual tests pass), stable (small perturbations, same story), and free of protected proxies. Yes — explanations are testable software." },
      ],
    },
    mistakes: [
      { wrong: "Presenting SHAP values as the model's reasoning.", right: "Present them as measured influence estimates — and verify them against perturbation tests before anyone external sees them.", why: "SHAP explains the math, not intent; and approximations have error bars you should show." },
      { wrong: "Skipping explanation tests because 'it's just a visualization'.", right: "Test stability, faithfulness, and proxy leakage like any output.", why: "Regulators (GDPR, EU AI Act) increasingly demand reasons — an unstable explanation under audit is worse than none." },
    ],
    faq: [
      { q: "Can LLMs explain their own answers?", a: "They generate plausible-sounding explanations — but post-hoc self-reports are notoriously unfaithful (the model rationalizes, it doesn't introspect). The research field on this is young; trust measurements over narration." },
      { q: "What's the simplest XAI move for tabular models?", a: "Partial dependence plots: 'all else equal, how does the prediction move as debt ratio rises?' One chart, zero libraries, immediate insight." },
    ],
  },

  fairness: {
    hook: "'Fair' is not one definition — it's at least three, and they can mathematically contradict each other. Demographic parity: approve groups at equal rates. Equalized odds: equal error rates among qualified people. Calibration: a 70% score means 70% in every group. When base rates differ between groups, you cannot satisfy all three — so fairness is a product decision. And a decision with stated trade-offs is, at last, a testable requirement.",
    worked: {
      title: "Worked example: writing the fairness test plan",
      steps: [
        { head: "Force the decision into writing", body: "Product says 'fair model'. Ask: equal approval rates, or equal error rates among the creditworthy? They will pick — or discover they can't have both. The written choice becomes your spec." },
        { head: "Define segments precisely", body: "Which groups, which thresholds, which time window. 'Equalized odds across gender, measured quarterly, TP-rate gap ≤ 5 points, FP-rate gap ≤ 3 points.' Vague fairness stays untested fairness." },
        { head: "Measure with the full matrix per group", body: "Not just approval rates — per-group confusion matrices. A model can approve equally (parity ✓) while making twice as many bad loans in one group (odds ✗). The matrices tell the whole story." },
        { head: "Test the contradiction", body: "When gaps appear, don't just report numbers — report which definition failed and what the trade would cost: 'closing the TP-gap costs 2.1% overall precision.' Engineers and PMs can act on that." },
        { head: "Re-run on every release", body: "Fairness metrics join the regression battery: every retrain, every threshold change, every data refresh. Fairness is a continuous property, not a launch checkbox." },
      ],
    },
    mistakes: [
      { wrong: "Testing one fairness metric and declaring victory.", right: "Report at least two definitions plus per-group confusion matrices; state which definition the product chose and why.", why: "Metrics contradict; a single one hides the trade-off the product actually made." },
      { wrong: "Treating a fairness failure as a model bug only.", right: "Trace upstream: is the label data itself skewed? Often the fair fix is in data collection, not the threshold.", why: "You can't optimize fairness into laundered history; sometimes the laundry is the problem." },
    ],
    faq: [
      { q: "Why can't we satisfy all fairness definitions at once?", a: "Proven impossibility: when groups have different base rates, equalized odds and demographic parity conflict (except in trivial cases). The math forces a choice — the product must own it." },
      { q: "Is fairness testing legal advice territory?", a: "The measurement is engineering; the thresholds are policy. Your job: produce honest, precise numbers. The decision on what's acceptable belongs to product and legal — made visible by your numbers." },
    ],
  },
};
