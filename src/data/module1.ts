import type { Section } from "./types";

export const MODULE1_SECTIONS: Section[] = [
  {
    title: "AI, ML, DL, GenAI, Agents & Agentic AI",
    lessons: [
      {
        id: "what-is-ai",
        title: "What is AI?",
        minutes: 6,
        summary:
          "Artificial Intelligence is software that performs tasks which, done by a human, would require intelligence — perception, reasoning, language, decision-making.",
        blocks: [
          {
            kind: "p",
            text: "AI is an umbrella term, not a single technology. A spam filter, a chess engine, a self-driving stack and a chatbot are all 'AI', but they share almost no internals. What they share is a job description: performing tasks that would require intelligence if a human did them. For a tester, that definition matters, because it tells you the first thing to ask about any AI feature — what human judgement is it replacing, and what does 'correct' even mean for it?",
          },
          { kind: "h", text: "The family tree" },
          {
            kind: "ul",
            items: [
              "Symbolic AI (1950s–90s): hand-written rules and logic. Transparent, brittle — great for chess, hopeless for recognizing cats.",
              "Machine Learning: systems that learn patterns from data instead of being explicitly programmed.",
              "Deep Learning: ML using many-layered neural networks; dominates vision, speech and language today.",
              "Generative AI: models that produce new content — text, images, code, audio.",
              "AI Agents: LLMs wired to tools and loops so they can act, not just answer.",
            ],
          },
          {
            kind: "p",
            text: "Nearly everything you will meet in production is narrow AI: excellent at one task, clueless outside it. An ML model that approves loans cannot triage your bug reports, however smart it looks. 'Artificial General Intelligence' — human-level breadth — remains research territory. Treat any vendor claiming otherwise as a test case, not a fact.",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Classic software fails by crashing or returning wrong values. AI systems 'fail' while returning plausible values — a wrongly approved loan looks exactly like a correctly approved one. Your test oracle problem starts here: you must define acceptable behaviour statistically, not assert exact outputs.",
          },
          {
            kind: "table",
            head: ["Style", "How it works", "Where you meet it"],
            rows: [
              ["Rule-based", "If/else written by humans", "Pricing engines, validation"],
              ["Machine learning", "Patterns learned from data", "Fraud scoring, ranking"],
              ["Deep learning", "Layered neural networks", "Vision, speech, LLMs"],
              ["Generative", "Produces novel content", "Copilots, drafting tools"],
            ],
          },
        ],
        takeaways: [
          "AI is a job description (do intelligent tasks), not one technology.",
          "Production AI is narrow: superb at one task, silent about everything else.",
          "AI outputs are plausible by design — exact-output assertions usually can't be your oracle.",
        ],
        practice: [
          "List three AI-powered features in a product you test. For each, write one sentence describing what 'wrong but plausible' output would look like.",
          "For one of those features, draft 3 acceptance criteria that do not depend on a single exact output.",
        ],
        quiz: [
          {
            q: "Which statement best describes 'narrow AI'?",
            options: [
              "AI that runs on small devices",
              "AI that excels at one task but cannot transfer to others",
              "AI with a small neural network",
              "AI that is not open source",
            ],
            answer: 1,
            explain: "Narrow AI is task-specific. A great fraud detector is still useless at translation.",
          },
          {
            q: "Why is testing AI harder than testing a deterministic function?",
            options: [
              "AI code is always larger",
              "AI systems can return plausible-looking wrong answers with no error signal",
              "AI cannot be versioned",
              "AI never crashes",
            ],
            answer: 1,
            explain: "There is no exception on a bad prediction — wrong answers look exactly like right ones, so oracles must be statistical.",
          },
        ],
      },
      {
        id: "what-is-ml",
        title: "What is Machine Learning?",
        minutes: 7,
        summary:
          "Machine Learning is software that infers its own rules from examples instead of being given the rules directly.",
        blocks: [
          {
            kind: "p",
            text: "In classic code you ship the rules: if cart > $100, free shipping. In ML you ship the examples — thousands of past carts labelled 'churned' or 'stayed' — and the algorithm infers the rules itself. The program you deploy is literally the learned rules (the model), plus code to feed it inputs and read outputs.",
          },
          { kind: "h", text: "Three ingredients, always" },
          {
            kind: "ul",
            items: [
              "Data: past examples, usually with labels ('this email was spam').",
              "A model family: the shape of function being searched (decision trees, neural nets, ...).",
              "A learning rule: how examples adjust the model — almost always, minimizing prediction error.",
            ],
          },
          {
            kind: "p",
            text: "The crucial property for QA: behaviour is emergent, not specified. Nobody wrote 'flag invoices over $9,000'; the model discovered a threshold on its own. That means requirements live in the data, and data bugs become product bugs. A biased training set is a defect you can reproduce, file and regression-test — once you know to look for it.",
          },
          {
            kind: "code",
            lang: "python",
            title: "The whole idea in five lines (scikit-learn)",
            code: "from sklearn.tree import DecisionTreeClassifier\n\nmodel = DecisionTreeClassifier()\nmodel.fit(X_train, y_train)        # learn rules from examples\npreds = model.predict(X_new)        # apply learned rules",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "ML introduces a second changelog you must test: the data. Same code + new training data = new behaviour, often with no code review. Ask for the training-data provenance the way you ask for dependency versions.",
          },
        ],
        takeaways: [
          "ML infers rules from labelled examples instead of being hand-coded.",
          "Requirements are encoded in training data — data defects are product defects.",
          "Same code, new data, new behaviour: retraining is a release event.",
        ],
        practice: [
          "Pick a rule in a system you know (e.g. password policy). Describe the dataset that could have taught an ML model that rule instead.",
          "Write one test case whose expected result depends on training data quality rather than code logic.",
        ],
        quiz: [
          {
            q: "What does an ML model contain after training?",
            options: [
              "The original training rows",
              "Learned parameters that encode rules inferred from data",
              "A copy of the source code",
              "A rules file written by engineers",
            ],
            answer: 1,
            explain: "Training converts examples into parameters (weights, splits...) that approximate the patterns.",
          },
          {
            q: "A model starts rejecting valid invoices after a retrain, code unchanged. Most likely cause?",
            options: [
              "The compiler changed",
              "The training data changed",
              "The CPU is faulty",
              "The model is overfitting to production",
            ],
            answer: 1,
            explain: "With code fixed, behaviour changes come from data. Retraining is a behavioural release.",
          },
        ],
      },
      {
        id: "what-is-dl",
        title: "What is Deep Learning?",
        minutes: 7,
        summary:
          "Deep Learning is machine learning with multi-layer neural networks that learn their own feature representations — the engine behind modern vision, speech and language AI.",
        blocks: [
          {
            kind: "p",
            text: "Before deep learning, ML engineers hand-crafted features: edge detectors for images, word counts for text. Deep learning moved that work into the model. A deep network's early layers learn simple detectors (edges), middle layers combine them (textures, eyes), late layers make decisions (face / not face). Nobody programmes the hierarchy — gradient descent sculpts it from data.",
          },
          { kind: "h", text: "Why it took over" },
          {
            kind: "ul",
            items: [
              "Scale laws: more data + bigger nets kept improving, predictably, for a decade.",
              "GPUs: the same silicon that renders games is perfect for matrix math.",
              "One architecture family (transformers) now handles text, image, audio and video.",
              "Pretraining: learn general representations once, reuse everywhere.",
            ],
          },
          {
            kind: "p",
            text: "The price of that power is opacity. A decision tree can explain itself; a 70-billion-parameter network cannot. When a deep model misclassifies, there is no line of code to point at — only patterns in data and weights. This is why explainability, bias testing and behavioural evaluation exist as disciplines at all.",
          },
          {
            kind: "callout",
            tone: "warn",
            title: "Watch out",
            text: "Deep models fail at the edges of their training distribution: a stop sign with a sticker, a typo'd address, a résumé in an unusual format. Edge-case hunting — a tester's native skill — is the highest-value activity in ML QA.",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Because features are learned, two inputs that look different to you can be identical to the model (adversarial examples), and inputs that look identical to you can be totally different to it (encoding, font, whitespace). Build equivalence classes from the model's point of view, not the GUI's.",
          },
        ],
        takeaways: [
          "Deep learning replaces hand-crafted features with learned, layered representations.",
          "Scale (data + parameters + compute) is its fuel and its moat.",
          "Opacity means behaviour must be tested empirically — you cannot inspect the 'why'.",
        ],
        practice: [
          "Find one AI feature in your product and list 5 inputs at the edge of what its training data likely covered.",
          "Write a bug-report template section titled 'Suspected training-data cause' and use it on a real AI misbehaviour.",
        ],
        quiz: [
          {
            q: "What did deep learning automate that earlier ML required by hand?",
            options: ["Labelling data", "Feature engineering", "Collecting data", "Deploying models"],
            answer: 1,
            explain: "Deep nets learn their own feature hierarchy from raw inputs.",
          },
          {
            q: "Why are deep models harder to debug than decision trees?",
            options: [
              "They are written in Python",
              "Behaviour is spread across millions of learned weights with no human-readable rules",
              "They run on GPUs",
              "They cannot log errors",
            ],
            answer: 1,
            explain: "There is no inspectable rule path — explanations must be reconstructed with special tools.",
          },
        ],
      },
      {
        id: "genai-agents-agentic",
        title: "GenAI, AI Agents & Agentic AI",
        minutes: 8,
        summary:
          "Generative AI creates content; agents wrap LLMs in loops and tools so they can act. Together they moved AI from 'answers questions' to 'does work' — and changed what testing means.",
        blocks: [
          {
            kind: "p",
            text: "Generative AI is models that produce new artefacts: text, code, images, SQL, test cases. ChatGPT writing a regression plan is GenAI. An AI agent goes further: it is an LLM given tools (search, browser, code interpreter, your internal APIs) and a loop — observe, think, act, observe again — until the job is done or a budget runs out. 'Agentic AI' describes systems where this loop drives real workflows with minimal human steering.",
          },
          { kind: "h", text: "The anatomy of an agent" },
          {
            kind: "ul",
            items: [
              "Model: the reasoning core (usually an LLM).",
              "Tools: functions the model can call — read a file, query a DB, send an email.",
              "Memory: what persists across steps — scratchpad, conversation, databases.",
              "Loop & stop conditions: how it decides to continue, retry, or halt.",
              "Guardrails: permissions, budgets, human approvals.",
            ],
          },
          {
            kind: "p",
            text: "Each piece is a new failure surface. The model can hallucinate a tool name, call the right tool with wrong arguments, loop forever, exhaust a budget, or quietly do nothing and claim success. Testing an agent is closer to testing a junior employee's process than testing a function: you review traces, not just outputs.",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Agent testing = trace testing. Capture every step (thought, tool call, observation) and assert on the trajectory: correct tools chosen, sane arguments, no repeated identical calls, clean termination. Your old friend 'state transition testing' just got a promotion.",
          },
        ],
        takeaways: [
          "GenAI produces content; agents produce actions via tools + loops.",
          "An agent = model + tools + memory + loop + guardrails; each is a failure surface.",
          "Test the trajectory (trace), not only the final answer.",
        ],
        practice: [
          "Use any coding agent and capture its trace. Identify one step where a wrong tool argument would have caused real damage.",
          "Draft 5 guardrail requirements (permissions/budgets/approvals) for an agent allowed to edit a staging database.",
        ],
        quiz: [
          {
            q: "What fundamentally separates an AI agent from a chatbot?",
            options: [
              "A bigger model",
              "Tools plus a repeated observe-think-act loop",
              "A better UI",
              "Access to the internet",
            ],
            answer: 1,
            explain: "Agency comes from acting on the world through tools inside a loop, not from model size.",
          },
          {
            q: "An agent keeps calling the same failing tool 40 times. Which component failed?",
            options: ["The tokenizer", "The loop's stop/retry conditions", "The display font", "The training data"],
            answer: 1,
            explain: "Runaway repetition is a loop-engineering failure: no budget, no backoff, no abort rule.",
          },
        ],
      },
    ],
  },
  {
    title: "Core ML Concepts",
    lessons: [
      {
        id: "supervised-unsupervised-rl",
        title: "Supervised, Unsupervised & Reinforcement Learning",
        minutes: 7,
        summary:
          "Three ways machines learn: from labelled answers, from raw structure, and from rewards. Each creates different test risks.",
        blocks: [
          {
            kind: "p",
            text: "Supervised learning maps inputs to known answers: email → spam/not-spam, photo → diagnosis. It needs labelled data, which is expensive and error-prone — a wrong label is a poison pill the model will happily memorize. Most production ML you will test is supervised.",
          },
          {
            kind: "p",
            text: "Unsupervised learning finds structure without labels: clustering customers, detecting anomalous transactions, reducing dimensions. There is no 'correct answer' to compare against, so evaluation is notoriously fuzzy — clusters must be judged by usefulness, not truth.",
          },
          {
            kind: "p",
            text: "Reinforcement learning learns by trial, error and reward: a game agent, a robot, a recommendation policy. The danger testers recognize instantly — reward hacking: the agent maximizes the measured reward while violating the intent ('minimize crashes' becomes 'never leave the garage').",
          },
          {
            kind: "table",
            head: ["Paradigm", "Signal", "Classic use", "Test risk"],
            rows: [
              ["Supervised", "Labels", "Classification, regression", "Label noise, class imbalance"],
              ["Unsupervised", "Structure", "Clustering, anomaly detection", "No ground truth to assert on"],
              ["Reinforcement", "Reward", "Control, policies", "Reward hacking, unsafe exploration"],
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "For supervised models, audit a sample of labels before blaming the model — annotator agreement below ~80% usually means the data, not the algorithm, is the bug. You are testing the label pipeline too.",
          },
        ],
        takeaways: [
          "Supervised = learn from labels; quality ceiling is label quality.",
          "Unsupervised = learn structure; evaluation is fuzzy by nature.",
          "RL = learn from rewards; watch for reward hacking — the metric is not the goal.",
        ],
        practice: [
          "Classify 5 ML features you have encountered into the three paradigms; note one failure mode each could cause.",
          "Design a 'reward hacking' scenario for a chatbot rewarded on conversation length.",
        ],
        quiz: [
          {
            q: "Detecting fraudulent transactions with no historical fraud labels is closest to…",
            options: ["Supervised learning", "Anomaly detection (unsupervised)", "Reinforcement learning", "Fine-tuning"],
            answer: 1,
            explain: "Without labels you look for deviations from normal structure — unsupervised anomaly detection.",
          },
          {
            q: "What is 'reward hacking'?",
            options: [
              "Stealing model weights",
              "Optimizing the measured reward while undermining the real objective",
              "Overfitting to the test set",
              "A SQL injection against the reward store",
            ],
            answer: 1,
            explain: "Goodhart's law in code: when the metric becomes the target, it stops being a good metric.",
          },
        ],
      },
      {
        id: "training-vs-inference",
        title: "Training vs Inference",
        minutes: 6,
        summary:
          "Training is the offline, expensive process of fitting a model; inference is the live path that serves predictions. Production bugs live in the gap between them.",
        blocks: [
          {
            kind: "p",
            text: "Training runs for hours or months on fleets of GPUs, repeatedly adjusting weights until error on the training data is low. Nobody is waiting on it. Inference is what your users hit: a single forward pass, milliseconds to seconds, priced per request. One chat completion from GPT-class models is inference; the millions of dollars that produced the weights were training.",
          },
          { kind: "h", text: "Why the distinction is a goldmine for testers" },
          {
            kind: "ul",
            items: [
              "Training/inference skew: features computed differently in the two paths silently degrade accuracy.",
              "Inference-only bugs: timeouts, batching errors, truncation, token limits — none exist during training.",
              "Cost asymmetry: inference cost scales with traffic; a 3× longer prompt is a 3× bill.",
              "Latency budgets: users forgive a slow training job; they abandon a slow prediction.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Treat inference as the system under test and the model as a dependency. Your suite: latency percentiles, malformed inputs, oversized payloads, concurrent load, and drift between what training assumed and what production sends.",
          },
        ],
        takeaways: [
          "Training fits weights offline; inference serves predictions online.",
          "Skew between the two paths is a classic silent bug.",
          "Inference is where latency, cost and input-validation testing live.",
        ],
        practice: [
          "Measure inference latency of one AI endpoint at p50/p95/p99 under light load; compare to its SLO.",
          "List three input shapes valid in production but impossible in the training data (e.g. 10,000-char fields).",
        ],
        quiz: [
          {
            q: "Which activity happens during inference?",
            options: [
              "Adjusting model weights",
              "A single forward pass producing a prediction",
              "Labelling data",
              "Hyperparameter search",
            ],
            answer: 1,
            explain: "Inference is read-only with respect to weights — one pass in, one answer out.",
          },
          {
            q: "What is training/inference skew?",
            options: [
              "GPU overheating",
              "Inputs or features handled differently at serving time than during training",
              "Using too few layers",
              "A licensing issue",
            ],
            answer: 1,
            explain: "If production computes features differently from the training pipeline, the model degrades silently.",
          },
        ],
      },
      {
        id: "overfitting-underfitting",
        title: "Overfitting & Underfitting",
        minutes: 7,
        summary:
          "Overfitting memorizes the training data; underfitting never learns it. Both look like 'the model is bad' — the cure is opposite.",
        blocks: [
          {
            kind: "p",
            text: "An overfit model aces its training data and flops on anything new — it memorized noise, quirks and all. A 200-layer tree that perfectly separates 500 examples is useless on example 501. An underfit model is too simple to capture the pattern: linear regression on a sine wave. It fails on training and new data alike.",
          },
          { kind: "h", text: "Reading the learning curves" },
          {
            kind: "ul",
            items: [
              "Overfit: training error → near zero, validation error high and diverging.",
              "Underfit: both errors high, hugging each other.",
              "Good fit: both low, small gap.",
            ],
          },
          { kind: "h", text: "Standard remedies" },
          {
            kind: "ul",
            items: [
              "Fighting overfitting: more data, regularization (L1/L2, dropout), simpler model, early stopping, cross-validation.",
              "Fighting underfitting: richer model, better features, longer training.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "A held-out test set is the ML version of an independent test environment. If a model was tuned against the test set (even accidentally), your 'independent' results are contaminated — the ML equivalent of testers peeking at the answer key. Ask how the holdout was protected.",
          },
        ],
        takeaways: [
          "Overfit = memorized noise (low train error, high val error); underfit = too simple (both high).",
          "The gap between train and validation error is your main diagnostic.",
          "Protect the holdout set like an exam paper — tuning against it voids the results.",
        ],
        practice: [
          "Given a model report, sketch the two learning curves you'd expect for overfit vs underfit and label the gap.",
          "Write a checklist item: 'evidence the final metrics come from data never used for tuning'.",
        ],
        quiz: [
          {
            q: "99% training accuracy, 61% validation accuracy. Diagnosis?",
            options: ["Underfitting", "Overfitting", "Perfect generalization", "Data leakage"],
            answer: 1,
            explain: "The huge train/validation gap is the signature of memorization.",
          },
          {
            q: "Which remedy targets overfitting?",
            options: ["Using a simpler model than needed", "Adding regularization or more data", "Training fewer epochs on tiny data", "Removing the validation set"],
            answer: 1,
            explain: "Regularization and data reduce the model's ability to memorize noise.",
          },
        ],
      },
      {
        id: "bias-variance-noise",
        title: "Bias, Variance & Noise",
        minutes: 7,
        summary:
          "Every model's error splits into bias (wrong assumptions), variance (sensitivity to the sample) and irreducible noise. The trade-off decides how you test.",
        blocks: [
          {
            kind: "p",
            text: "Decompose any model's expected error into three parts. Bias: error from wrong assumptions — fitting a line to a curve. Variance: error from sensitivity to which training sample you drew — a different 1,000 rows would give a different model. Noise: randomness inherent in the phenomenon itself, which no model can remove.",
          },
          {
            kind: "p",
            text: "The bias–variance trade-off: complex models lower bias but raise variance (they chase each sample's quirks); simple models do the opposite. Modern deep learning bent this curve with huge data and regularization tricks, but the vocabulary still explains most model misbehaviour you'll diagnose.",
          },
          {
            kind: "table",
            head: ["Component", "Feels like", "Tester's translation"],
            rows: [
              ["High bias", "Consistently wrong, same way", "A systematic defect — reproducible, file it"],
              ["High variance", "Right on average, unstable case-to-case", "Flaky behaviour — needs statistical assertions"],
              ["Noise", "Unpredictable residue", "Tolerance band — don't chase it"],
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Run the same model on 10 paraphrased inputs. If answers swing wildly, you're seeing variance — test with distributions (pass-rate over N runs), not single assertions. This is exactly how you'd handle a flaky test, applied to the model itself.",
          },
        ],
        takeaways: [
          "Error = bias + variance + noise; only the first two are engineerable.",
          "Complexity trades bias for variance.",
          "Variance behaviour demands statistical test assertions, not exact matches.",
        ],
        practice: [
          "Query a chat model 10 times with paraphrases of one question; tabulate how many distinct answers you get and classify the variance.",
          "Pick a metric in your product and argue whether its error is mostly bias or variance.",
        ],
        quiz: [
          {
            q: "A model gives a different (sometimes wrong) answer each retrain on similar data. That's mostly…",
            options: ["Bias", "Variance", "Noise", "Drift"],
            answer: 1,
            explain: "Sensitivity to the particular training sample is variance.",
          },
          {
            q: "Irreducible error is also called…",
            options: ["Bias", "Variance", "Noise", "Regularization"],
            answer: 2,
            explain: "Noise is randomness in the data itself; no model can remove it.",
          },
        ],
      },
      {
        id: "train-test-split-cv",
        title: "Train-Test Split & Cross-Validation",
        minutes: 7,
        summary:
          "You can't grade a model on the homework it studied. Splitting data — and cross-validating — creates honest report cards.",
        blocks: [
          {
            kind: "p",
            text: "The core ritual: hold out part of the data (say 20%) that the model never sees during training, then measure on it. Common splits are 80/20 or 70/15/15 (train / validation / test), where validation tunes hyperparameters and test gives the final, quoted-once number. Time-series data must split by time, never randomly — training on the future is cheating.",
          },
          { kind: "h", text: "K-fold cross-validation" },
          {
            kind: "p",
            text: "With scarce data, rotate the holdout: split into k folds, train k times, each fold serving once as validation, and average. Stratified folds preserve class ratios — essential when one class is 2% of the data. Leakage is the cardinal sin: any information from the test fold reaching training (scaling fitted on all data, duplicated rows across folds) inflates results and betrays you in production.",
          },
          {
            kind: "code",
            lang: "python",
            title: "Stratified 5-fold in scikit-learn",
            code: "from sklearn.model_selection import cross_val_score, StratifiedKFold\n\ncv = StratifiedKFold(n_splits=5, shuffle=True, random_state=42)\nscores = cross_val_score(model, X, y, cv=cv, scoring=\"f1\")\nprint(scores.mean(), scores.std())",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Leakage hunting is a tester's gift to ML teams: check for duplicate rows across splits, target-encoded features computed on full data, and 'helper' columns that are proxies for the label (the classic: hospital bill includes ICU charge → model 'predicts' severity from the bill).",
          },
        ],
        takeaways: [
          "Never evaluate on data used for training or tuning.",
          "K-fold (stratified) cross-validation squeezes honest estimates from small data.",
          "Leakage across splits silently inflates every metric.",
        ],
        practice: [
          "Split a small CSV 80/20 by hand (or in pandas) and verify no row appears in both halves.",
          "Invent one realistic leakage scenario for a churn model and write it as a test case.",
        ],
        quiz: [
          {
            q: "Why use stratified folds?",
            options: [
              "To train faster",
              "To keep class proportions in every fold",
              "To increase data size",
              "To avoid GPUs",
            ],
            answer: 1,
            explain: "With rare classes, a random fold could omit the minority class entirely.",
          },
          {
            q: "Scaling features using statistics computed on the full dataset before splitting causes…",
            options: ["Underfitting", "Data leakage", "Class imbalance", "Quantization"],
            answer: 1,
            explain: "Test-set statistics leaked into preprocessing — results will look better than reality.",
          },
        ],
      },
      {
        id: "metrics-precision-recall-f1-roc",
        title: "Accuracy, Precision, Recall, F1 & ROC-AUC",
        minutes: 9,
        summary:
          "The confusion matrix and its children: how to measure a classifier when '99% accurate' can be worthless.",
        blocks: [
          {
            kind: "p",
            text: "Every binary classifier produces four outcomes: true positive, false positive, false negative, true negative. Accuracy is the share correct — and with 99 healthy patients per 1 sick one, a model that always says 'healthy' scores 99% and kills patients. Imbalanced data makes accuracy a liar; you need the full matrix.",
          },
          { kind: "h", text: "The family" },
          {
            kind: "ul",
            items: [
              "Precision = TP / (TP + FP): of the positives I flagged, how many were real? (alarm fatigue)",
              "Recall = TP / (TP + FN): of the real positives, how many did I catch? (missed defects)",
              "F1 = harmonic mean of both; punishes lopsided models.",
              "ROC-AUC: probability the model ranks a random positive above a random negative; threshold-free.",
            ],
          },
          {
            kind: "p",
            text: "Choose by cost of errors. Spam filter: false positives (real mail trashed) hurt more than misses → favour precision. Cancer screening or security alerts: misses are catastrophic → favour recall. The threshold moves along the ROC curve; each operating point trades one error for the other. There is no free lunch, only a chosen one.",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Bug-triage ML is the perfect classroom example: precision = 'of bugs auto-filed, how many were real?'; recall = 'of real bugs, how many got filed?'. Ask the team which error costs more, then check the metric they optimize matches that answer. Mismatch = requirement defect.",
          },
        ],
        takeaways: [
          "Accuracy collapses under class imbalance — always inspect the confusion matrix.",
          "Precision guards against false alarms; recall guards against misses.",
          "The threshold is a product decision about error costs, not a model property.",
        ],
        practice: [
          "Compute precision/recall/F1 from this matrix: TP=40, FP=10, FN=20, TN=930.",
          "For a login-fraud detector, argue which of precision or recall the product should sacrifice, and why.",
        ],
        quiz: [
          {
            q: "A model always predicts 'no fraud' on data where fraud is 1%. Its accuracy is…",
            options: ["1%", "50%", "99%", "0%"],
            answer: 2,
            explain: "It's right 99% of the time and completely useless — why accuracy alone deceives.",
          },
          {
            q: "Doctors need to miss as few cancers as possible. Optimize for…",
            options: ["Precision", "Recall", "Training speed", "Model size"],
            answer: 1,
            explain: "Recall = fraction of real positives caught; missing them is the catastrophic error here.",
          },
        ],
      },
      {
        id: "discriminative-vs-generative",
        title: "Discriminative vs Generative Models",
        minutes: 6,
        summary:
          "Discriminative models draw the boundary between classes; generative models learn to produce the data itself. LLMs blurred the line — and it matters for how you use and test them.",
        blocks: [
          {
            kind: "p",
            text: "A discriminative model learns P(label | input): given this email, spam or not? Logistic regression, random forests, and classic classifiers are discriminative — decision-boundary drawers. A generative model learns how the data itself is distributed, P(input) or P(input | label), well enough to sample new instances: GAN faces, diffusion images, language models.",
          },
          {
            kind: "p",
            text: "LLMs are generative at heart — they model P(next token | context) — yet we routinely use them discriminatively: 'classify this ticket as bug/feature'. That works, but you inherit generative failure modes (verbosity, format drift, refusals) on a discriminative job. Sometimes the honest architecture is a small classifier; sometimes the LLM's flexibility wins. Knowing the difference is architecture literacy.",
          },
          {
            kind: "table",
            head: ["", "Discriminative", "Generative"],
            rows: [
              ["Learns", "Boundary between classes", "Distribution of the data"],
              ["Output", "Label / score", "New samples (text, image…)", ],
              ["Examples", "Logistic regression, XGBoost", "GPT, Stable Diffusion, GANs"],
              ["Testing focus", "Decision boundary cases", "Output quality, safety, format"],
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "When an LLM is pressed into a classification job, test the boundary like you would any classifier — near-boundary inputs, ambiguous cases — plus the generative extras: does it obey the label set, stay in format, and refuse politely on garbage?",
          },
        ],
        takeaways: [
          "Discriminative = model the boundary; generative = model the data well enough to create it.",
          "LLMs are generative models frequently used for discriminative tasks.",
          "Hybrid use-cases need both testing styles: boundary cases and generation quality.",
        ],
        practice: [
          "Take a classification feature and write 4 near-boundary test inputs plus 2 'generative extras' (format disobedience, out-of-label-set output).",
          "Debate in two paragraphs: LLM vs a small classifier for sentiment on support tickets.",
        ],
        quiz: [
          {
            q: "Which is fundamentally a generative task?",
            options: [
              "Predicting house price from features",
              "Writing a product description from a spec",
              "Detecting spam",
              "Segmenting customers",
            ],
            answer: 1,
            explain: "Producing new content is generation; the rest are boundary/density estimation jobs.",
          },
          {
            q: "Using an LLM to classify tickets means testing must cover…",
            options: [
              "Only accuracy",
              "Boundary behaviour AND format/obedience failure modes",
              "Only latency",
              "Nothing extra — it's just a classifier",
            ],
            answer: 1,
            explain: "You inherit both worlds' failure modes when a generative model does a discriminative job.",
          },
        ],
      },
    ],
  },
  {
    title: "Deep Learning Basics",
    lessons: [
      {
        id: "neurons",
        title: "Neurons: The Atom of Deep Learning",
        minutes: 6,
        summary:
          "A neuron multiplies inputs by weights, adds a bias, and squashes the result through an activation. Everything bigger is this, repeated.",
        blocks: [
          {
            kind: "p",
            text: "Strip away the biology and a neuron is one line of math: output = activation(w·x + b). Each input gets a weight — how much it matters. The bias shifts the threshold. The activation decides how strongly the neuron fires. That's it. A network is millions of these, arranged so that adjusting weights changes what the whole thing computes.",
          },
          {
            kind: "code",
            lang: "python",
            title: "One neuron, three lines",
            code: "import numpy as np\n\ndef neuron(x, w, b):\n    z = np.dot(w, x) + b      # weighted sum\n    return 1 / (1 + np.exp(-z))  # sigmoid activation",
          },
          {
            kind: "p",
            text: "Intuition for testers: weights are the learned 'knowledge', biases are per-neuron calibrations, and activations inject the nonlinearity that lets stacks of neurons approximate anything. If a model misbehaves, the cause is always 'the wrong weights for this input region' — the question is which data taught them.",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "You will never debug individual weights, but the mental model earns its keep in feature-importance questions: 'which input moves the output most?' is answered by perturbing inputs — a tester's experiment, not a mathematician's.",
          },
        ],
        takeaways: [
          "Neuron = weighted sum + bias + activation.",
          "Weights carry learned knowledge; activations add nonlinearity.",
          "Model behaviour always reduces to weights shaped by data.",
        ],
        practice: [
          "Hand-compute a neuron with x=[1,2], w=[0.5,-1], b=0.3 using sigmoid (calculator allowed).",
          "Perturb each input of a real model's form one at a time and record which changes the output most.",
        ],
        quiz: [
          {
            q: "In output = activation(w·x + b), what carries the learned knowledge?",
            options: ["The activation name", "The weights w (and bias b)", "The input x", "The layer count"],
            answer: 1,
            explain: "Training adjusts weights and biases; inputs are just data passing through.",
          },
          {
            q: "Why do neurons need an activation function at all?",
            options: [
              "To make training slower",
              "Without nonlinearity, stacked neurons collapse into one linear function",
              "To reduce memory",
              "To encode text",
            ],
            answer: 1,
            explain: "Linear-of-linear is still linear — activations are what make depth meaningful.",
          },
        ],
      },
      {
        id: "layers",
        title: "Layers & Depth",
        minutes: 6,
        summary:
          "Neurons are grouped into layers; layers learn a hierarchy of features. Width is how many neurons, depth is how many layers.",
        blocks: [
          {
            kind: "p",
            text: "A layer is a set of neurons receiving the same inputs and producing a vector of outputs. Data flows input layer → hidden layers → output layer. Each hidden layer transforms its input into a representation that makes the next step easier: edges → textures → parts → objects. Depth buys abstraction; width buys capacity per level of abstraction.",
          },
          { kind: "h", text: "The famous families" },
          {
            kind: "ul",
            items: [
              "MLP (dense): every neuron talks to every neuron of the next layer — the default.",
              "CNN (convolutional): local filters, translation invariance — the vision workhorse.",
              "RNN/LSTM: sequential memory — largely replaced by transformers for language.",
              "Transformer: attention over sequences — the architecture behind LLMs (Module 2).",
            ],
          },
          {
            kind: "p",
            text: "Depth has costs: vanishing gradients, longer training, more opacity. 'Deeper is better' stopped being true somewhere around 'deeper than useful'. Modern nets are deep but also wide, residual and heavily regularized — engineering, not religion.",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Layer hierarchy explains a testing heuristic: models fail first where their learned features are weakest — rare combinations, out-of-distribution styles. Probe systematically across input dimensions rather than uniformly at random.",
          },
        ],
        takeaways: [
          "A layer transforms its input into a more useful representation.",
          "Architecture family (MLP/CNN/Transformer) encodes assumptions about the data.",
          "Depth buys abstraction but costs trainability and interpretability.",
        ],
        practice: [
          "Draw a 3-layer network for 'is this test failure a flake?' — label what each hidden layer might represent.",
          "Find the architecture behind one AI feature you use (often in release notes) and note why it fits the data.",
        ],
        quiz: [
          {
            q: "What does increasing depth mainly buy?",
            options: ["Faster inference", "Hierarchical, more abstract representations", "Smaller files", "Simpler debugging"],
            answer: 1,
            explain: "Each layer builds on the previous one's features, enabling abstraction.",
          },
          {
            q: "Which architecture dominates modern language models?",
            options: ["CNN", "LSTM", "Transformer", "Decision tree"],
            answer: 2,
            explain: "Attention-based transformers underpin essentially all frontier LLMs.",
          },
        ],
      },
      {
        id: "activation-functions",
        title: "Activation Functions",
        minutes: 6,
        summary:
          "ReLU, sigmoid, tanh, softmax: the nonlinear switches that let networks curve. Choosing one is a small decision with big training consequences.",
        blocks: [
          {
            kind: "p",
            text: "An activation squashes or gates the neuron's weighted sum. Sigmoid maps anything to (0,1) — a probability-ish output, classic for binary classification, but it saturates: far from zero the gradient vanishes and learning crawls. Tanh maps to (-1,1), zero-centred, same saturation problem.",
          },
          {
            kind: "p",
            text: "ReLU — output = max(0, z) — fixed deep learning by never saturating on the positive side. Its flaw: 'dying ReLUs', neurons stuck at zero forever. Leaky ReLU and GELU soften that. For outputs: sigmoid for one probability, softmax for a distribution over many classes (the next-token probabilities of an LLM are a giant softmax).",
          },
          {
            kind: "table",
            head: ["Activation", "Range", "Typical role"],
            rows: [
              ["Sigmoid", "(0, 1)", "Binary output, gates"],
              ["Tanh", "(-1, 1)", "Hidden layers (older nets)"],
              ["ReLU / GELU", "[0, ∞)", "Standard hidden layers"],
              ["Softmax", "probabilities summing to 1", "Multi-class output"],
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "You'll meet activations through their symptoms: a classifier confidently stuck at 50% (saturated sigmoid inputs), or an LLM whose top-1 probability is 0.9999 (overconfident softmax). Calibration — does 80% confidence mean right 80% of the time? — is a testable property.",
          },
        ],
        takeaways: [
          "Activations add the nonlinearity depth depends on.",
          "ReLU-family rules hidden layers; softmax produces class probabilities.",
          "Saturation and overconfidence are observable, testable symptoms.",
        ],
        practice: [
          "Compute ReLU and sigmoid for z = -3, 0, 3; observe where sigmoid 'flattens'.",
          "If a model exposes probabilities, bin 100 predictions by confidence and check actual correctness per bin.",
        ],
        quiz: [
          {
            q: "Which activation produces a probability distribution over classes?",
            options: ["ReLU", "Softmax", "Tanh", "Identity"],
            answer: 1,
            explain: "Softmax normalizes scores into probabilities summing to 1.",
          },
          {
            q: "Why did ReLU replace sigmoid in deep hidden layers?",
            options: [
              "It is smoother",
              "It doesn't saturate for positive inputs, keeping gradients alive",
              "It outputs probabilities",
              "It uses less memory",
            ],
            answer: 1,
            explain: "Constant positive gradient lets deep networks train — sigmoid's vanishing gradient couldn't.",
          },
        ],
      },
      {
        id: "backpropagation",
        title: "Backpropagation (Conceptual)",
        minutes: 7,
        summary:
          "Training is a loop: predict, measure error, blame each weight for its share, nudge. Backpropagation is the blame-assignment algorithm.",
        blocks: [
          {
            kind: "p",
            text: "A loss function scores how wrong a prediction is. Training wants weights that minimize average loss — but there are millions of weights, no closed-form answer. Gradient descent instead takes small downhill steps: compute how the loss would change if each weight wiggled (the gradient), then nudge weights against it. Repeat for thousands of passes (epochs).",
          },
          {
            kind: "p",
            text: "Backpropagation is the efficient way to compute all those gradients at once, applying the chain rule from the output layer backwards. Each weight gets credit or blame proportional to how much it influenced the error. Nothing biological happens; it's calculus on a graph. The learning rate sizes each step — too big oscillates, too small crawls.",
          },
          { kind: "h", text: "Why a tester should care" },
          {
            kind: "ul",
            items: [
              "Loss curves are the training equivalent of test trends: flat = not learning, spiky = unstable, diverging train/val = overfit.",
              "Non-determinism: shuffling, GPU rounding and dropout mean two runs differ — models have 'flaky builds' too.",
              "Data is the lever: gradients only point where the data says. Poisoned or biased data steers the whole run.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Ask for the training run's loss curves the way you'd ask for a build's test report. A model shipped without them is like code shipped without CI.",
          },
        ],
        takeaways: [
          "Training = predict → loss → gradients (backprop) → nudge weights → repeat.",
          "The learning rate and loss-curve shape diagnose training health.",
          "Gradients follow the data — garbage in literally steers the model.",
        ],
        practice: [
          "Sketch loss-vs-epoch for: healthy training, learning-rate-too-high, and overfitting.",
          "Write a checklist of 4 artefacts a training run should produce for QA sign-off.",
        ],
        quiz: [
          {
            q: "What does backpropagation compute?",
            options: [
              "The model's architecture",
              "Each weight's contribution to the loss, via the chain rule",
              "The optimal dataset size",
              "The inference latency",
            ],
            answer: 1,
            explain: "It efficiently assigns gradient blame to every weight in one backward pass.",
          },
          {
            q: "Two identical training runs produce slightly different models. Why is that expected?",
            options: [
              "It isn't — something is broken",
              "Random shuffling, initialization and GPU nondeterminism",
              "Backprop is randomized on purpose",
              "The loss function changes",
            ],
            answer: 1,
            explain: "Training is stochastic by design; treat model builds like nondeterministic builds.",
          },
        ],
      },
      {
        id: "embeddings-dl",
        title: "Embeddings: Meaning as Geometry",
        minutes: 7,
        summary:
          "An embedding maps a thing — word, image, user, bug report — to a vector, so that similarity of meaning becomes closeness in space.",
        blocks: [
          {
            kind: "p",
            text: "Computers can't do arithmetic on the word 'dog'. An embedding turns it into a list of numbers, say 768 floats, learned so that related things land near each other: 'dog' and 'puppy' close, 'dog' and 'invoice' far. The trick is that the geometry is meaningful — vector arithmetic famously gives king − man + woman ≈ queen.",
          },
          {
            kind: "p",
            text: "Embeddings are learned as a side effect of useful tasks: predict the next word, and the network is forced to arrange words sensibly. They generalize beyond text: CLIP puts images and captions in one shared space; recommender systems embed users and products; code search embeds snippets.",
          },
          { kind: "h", text: "Where you'll use them daily" },
          {
            kind: "ul",
            items: [
              "Semantic search & RAG: retrieve by meaning, not keywords.",
              "Deduplication: near-duplicate bug reports cluster together.",
              "Similarity metrics: cosine similarity is the workhorse comparison.",
              "Anomaly detection: inputs far from every cluster deserve a human.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Embeddings give QA something rare in AI: a numeric, inspectable representation. 'Is this new bug report a duplicate?' becomes a cosine distance you can threshold, chart and regression-test like any other signal.",
          },
        ],
        takeaways: [
          "Embeddings turn discrete things into vectors where proximity ≈ similarity.",
          "They're learned from prediction tasks, then reused everywhere (search, RAG, dedup).",
          "Cosine similarity turns 'similar meaning' into a testable number.",
        ],
        practice: [
          "Use any embeddings API to embed 10 bug titles; find the most similar pair by cosine and sanity-check it.",
          "Design a dedup feature: threshold choice, false-duplicate risk, and how you'd test it.",
        ],
        quiz: [
          {
            q: "What does cosine similarity measure between two embeddings?",
            options: [
              "Exact equality",
              "Angular closeness — a proxy for semantic similarity",
              "Which is longer",
              "Encryption strength",
            ],
            answer: 1,
            explain: "Cosine of the angle: 1 = same direction (similar), 0 = unrelated, regardless of length.",
          },
          {
            q: "Embeddings are usually produced by…",
            options: [
              "Hand-written lookup tables",
              "Training a model on a prediction task and keeping its internal representations",
              "Hashing strings",
              "Compressing files",
            ],
            answer: 1,
            explain: "The representations a network learns to be useful are repurposed as embeddings.",
          },
        ],
      },
    ],
  },
  {
    title: "NLP Basics",
    lessons: [
      {
        id: "tokenization",
        title: "Tokenization: BPE & WordPiece",
        minutes: 7,
        summary:
          "Models don't read words — they read tokens. Tokenizers split text into subword pieces, and that split quietly shapes cost, quality and fairness.",
        blocks: [
          {
            kind: "p",
            text: "A tokenizer converts text into integer ids from a fixed vocabulary. Character-level vocabularies are tiny but sequences explode; word-level vocabularies explode on typos and new words. Subword tokenizers split the difference: common words stay whole ('testing'), rare ones break into pieces ('unbeliev' + 'able'). Byte-Pair Encoding (BPE) learns merges from frequency; WordPiece similarly optimizes likelihood.",
          },
          {
            kind: "code",
            lang: "python",
            title: "See the split yourself",
            code: "import tiktoken\nenc = tiktoken.encoding_for_model(\"gpt-4o\")\ntoks = enc.encode(\"Software testing is fun\")\nprint(toks)\nprint([enc.decode([t]) for t in toks])\nprint(len(toks))",
          },
          { kind: "h", text: "Consequences worth testing" },
          {
            kind: "ul",
            items: [
              "Vocabulary gaps: text in low-resource languages or unusual scripts costs many more tokens.",
              "Typos and case changes alter token boundaries — and sometimes the answer.",
              "Numbers and code tokenize unevenly; arithmetic tasks suffer.",
              "Token limits truncate silently at boundaries — mid-word, mid-code.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Tokenization is your first prompt-level fuzz target: feed the same sentence with altered casing, Unicode lookalikes and injected typos, and watch both token counts and outputs. Cheap to run, frequently surprising.",
          },
        ],
        takeaways: [
          "Text → subword tokens → ids; the split is learned from frequency.",
          "Token boundaries affect cost, multilingual fairness and edge-case behaviour.",
          "Truncation happens at token boundaries, often mid-word.",
        ],
        practice: [
          "Tokenize the same sentence in 3 languages with tiktoken and compare token counts.",
          "Write 5 fuzz inputs exploiting tokenization (typos, casing, emoji, RTL text) and record output changes.",
        ],
        quiz: [
          {
            q: "Why do subword tokenizers beat pure word tokenizers?",
            options: [
              "They are faster to type",
              "They handle unseen and misspelled words by splitting into known pieces",
              "They use no vocabulary",
              "They avoid numbers",
            ],
            answer: 1,
            explain: "Any word decomposes into familiar subwords, so nothing is truly 'unknown'.",
          },
          {
            q: "A user pastes 10,000 tokens into a 8,192-token context. What typically happens?",
            options: [
              "The API auto-summarizes",
              "Input is truncated or rejected — silently mid-content unless you handle it",
              "The model reads it anyway",
              "Tokens are compressed losslessly",
            ],
            answer: 1,
            explain: "Context limits are hard; truncation at token boundaries is a classic silent failure.",
          },
        ],
      },
      {
        id: "embeddings-nlp",
        title: "Embeddings in NLP",
        minutes: 6,
        summary:
          "Word and sentence embeddings put language in vector space, powering search, clustering and retrieval — the plumbing under RAG.",
        blocks: [
          {
            kind: "p",
            text: "Early NLP embedded single words (Word2Vec, GloVe): 'Paris is to France as Tokyo is to Japan' emerged from vector arithmetic. Modern systems embed whole sentences or documents (sentence-transformers, OpenAI embeddings) into 768–3072 dimensions, tuned so that paraphrases land close together even with zero shared words.",
          },
          { kind: "h", text: "The retrieval pipeline (preview of RAG)" },
          {
            kind: "ul",
            items: [
              "Offline: chunk your documents, embed each chunk, store in a vector index.",
              "Online: embed the query, fetch the nearest chunks, stuff them into the prompt.",
              "The LLM answers grounded in retrieved evidence instead of pure memory.",
            ],
          },
          {
            kind: "p",
            text: "Embedding quality is a product property: a weak embedding model retrieves wrong-but-plausible chunks, and the LLM will confidently answer from them. Retrieval failures masquerade as hallucinations — always check what was retrieved before blaming the generator.",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Build a retrieval eval: 20 questions with known-correct source chunks. Measure recall@k of the retriever separately from answer quality. Separating 'found it' from 'used it' is how you debug RAG systems.",
          },
        ],
        takeaways: [
          "Sentence embeddings capture meaning across paraphrases — no keyword overlap needed.",
          "RAG = embed → retrieve → generate; retrieval quality gates answer quality.",
          "Test retrieval and generation as separate components.",
        ],
        practice: [
          "Write 3 paraphrase pairs of one question and verify their embeddings are closer to each other than to unrelated questions.",
          "Draft a 20-item retrieval-eval spreadsheet for a knowledge-base feature you know.",
        ],
        quiz: [
          {
            q: "In RAG, embeddings are primarily used to…",
            options: [
              "Generate the final answer",
              "Retrieve relevant document chunks for the prompt",
              "Fine-tune the model",
              "Compress the context",
            ],
            answer: 1,
            explain: "Embeddings power the nearest-neighbour search that feeds evidence to the LLM.",
          },
          {
            q: "An LLM gives a wrong answer in a RAG system. First thing to check?",
            options: [
              "The temperature",
              "Whether the correct chunks were even retrieved",
              "The GPU type",
              "The font of the question",
            ],
            answer: 1,
            explain: "Retrieval failures look like hallucinations; debug 'found it' before 'used it'.",
          },
        ],
      },
      {
        id: "tokens-vs-embeddings",
        title: "Tokens vs Embeddings",
        minutes: 5,
        summary:
          "Tokens are the discrete alphabet a model reads; embeddings are the continuous meaning-space it thinks in. Confusing them causes real bugs.",
        blocks: [
          {
            kind: "p",
            text: "Tokens are ids — integers from a vocabulary, discrete and countable. They drive billing ('$3 per million tokens'), context limits and truncation. Embeddings are vectors of floats — continuous coordinates in meaning space. The pipeline runs text → tokens → embedding vectors → transformer layers → next-token probabilities → tokens → text.",
          },
          {
            kind: "table",
            head: ["", "Tokens", "Embeddings"],
            rows: [
              ["Nature", "Discrete ids", "Continuous vectors"],
              ["You count them for", "Cost, limits", "Similarity, retrieval"],
              ["Failure mode", "Truncation, budget overrun", "Wrong neighbours, drift"],
              ["Tooling", "tiktoken", "Vector DBs, cosine math"],
            ],
          },
          {
            kind: "p",
            text: "Practical confusion to avoid: 'embedding tokens' isn't a thing you count on a bill the same way — embedding APIs also charge per input token, but the returned vector has a fixed dimension regardless of length. And similarity between two texts compares vectors, never token lists.",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Two test dimensions: token-level tests (limits, truncation, cost) and embedding-level tests (retrieval quality, duplicate detection). Keep them separate in your suite — they fail independently.",
          },
        ],
        takeaways: [
          "Tokens = discrete ids (cost & limits); embeddings = continuous vectors (meaning & similarity).",
          "The model pipeline converts one to the other and back.",
          "Token tests and embedding tests are different suites with different failures.",
        ],
        practice: [
          "For a chat feature, list 3 token-level test cases and 3 embedding-level test cases.",
          "Verify an embeddings API returns the same vector length for a 3-word and a 300-word input.",
        ],
        quiz: [
          {
            q: "What drives LLM API billing?",
            options: ["Vector dimensions", "Token counts", "Embedding similarity", "Number of layers"],
            answer: 1,
            explain: "You pay per input and output token — embeddings' dimensions are fixed and free of that math.",
          },
          {
            q: "To detect near-duplicate reports you compare…",
            options: ["Token id lists", "Embedding vectors via cosine similarity", "Character counts", "Timestamps"],
            answer: 1,
            explain: "Meaning similarity lives in vector space; token lists differ for every paraphrase.",
          },
        ],
      },
      {
        id: "attention",
        title: "Attention: How Models Focus",
        minutes: 8,
        summary:
          "Attention lets each word weigh every other word when computing meaning — the mechanism that made long-context language models possible.",
        blocks: [
          {
            kind: "p",
            text: "In 'The tester approved the build because it passed', what does 'it' refer to? Humans resolve that instantly; older sequence models struggled across distance. Attention solves it: for each position, compute how relevant every other position is, then blend information proportionally. The sentence's representation of 'it' literally contains weighted pieces of 'build'.",
          },
          { kind: "h", text: "Queries, keys, values — the lock metaphor" },
          {
            kind: "ul",
            items: [
              "Query: what am I looking for? (the current word's need)",
              "Key: what do I contain that others might need?",
              "Value: the actual content I'd hand over.",
              "Score = query·key similarity → softmax → weighted sum of values.",
            ],
          },
          {
            kind: "p",
            text: "Multi-head attention runs this in parallel with different learned focuses — one head tracking syntax, another coreference, another topic. Cost grows quadratically with sequence length (every position scores every other), which is why context windows are expensive and why 'long context' is an engineering arms race.",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Coreference and long-distance dependency make great probes: 'The certificate expired. The system renewed the token, but it was too late.' — what is 'it'? Pronoun-resolution probes expose attention weaknesses cheaply.",
          },
        ],
        takeaways: [
          "Attention = learned relevance weighting across the whole context.",
          "Queries/keys/values: look up content by similarity.",
          "Quadratic cost explains context-window limits and pricing.",
        ],
        practice: [
          "Write 5 sentences with ambiguous pronouns and test whether a model resolves them correctly.",
          "Double a prompt's length with irrelevant filler and observe if answers to embedded questions degrade.",
        ],
        quiz: [
          {
            q: "In attention, what does the query·key score determine?",
            options: [
              "The model's temperature",
              "How much of each position's value is blended in",
              "The token price",
              "The vocabulary size",
            ],
            answer: 1,
            explain: "High similarity → high weight → that position contributes more to the output.",
          },
          {
            q: "Why does attention cost grow with context length?",
            options: [
              "Larger vocabularies",
              "Every position attends to every other — quadratic pairs",
              "GPUs get hotter",
              "Embeddings get longer",
            ],
            answer: 1,
            explain: "n positions produce n² query-key scores; that's the real cost of long contexts.",
          },
        ],
      },
      {
        id: "transformers",
        title: "Transformers: The Architecture Behind LLMs",
        minutes: 8,
        summary:
          "Stacked attention layers plus position information, trained at internet scale — the 2017 architecture that quietly ate all of AI.",
        blocks: [
          {
            kind: "p",
            text: "The transformer ('Attention Is All You Need', 2017) replaced recurrence with pure attention. Consequences: every position processes in parallel (GPU-friendly → scalable training), long-range dependencies cost one hop instead of many, and the same skeleton works for text, images, audio and video. GPT, BERT, Llama, Claude, Gemini — all transformers.",
          },
          { kind: "h", text: "Anatomy, briefly" },
          {
            kind: "ul",
            items: [
              "Token embeddings + positional encoding (where am I in the sequence?).",
              "Stacked blocks: multi-head attention + feed-forward network + normalization, with residual shortcuts.",
              "Encoders (BERT) read whole context bidirectionally — great for understanding.",
              "Decoders (GPT) attend only backwards, predicting the next token — great for generation.",
            ],
          },
          {
            kind: "p",
            text: "Scale did the rest. The same architecture at 100M, 7B and 400B parameters shows emergent jumps: in-context learning, chain-of-thought reasoning, instruction following. Nobody fully predicts which capability appears at which scale — which is itself a QA problem: capabilities and failure modes both emerge unannounced.",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Emergence means version bumps are not routine patches. A model upgrade can fix arithmetic and break role-play — test upgrades like migrations, with a broad behavioural regression suite, not a smoke test.",
          },
        ],
        takeaways: [
          "Transformers = parallel, attention-only sequence models; the LLM skeleton.",
          "Encoder = understand; decoder = generate (next-token, causal attention).",
          "Scale produces emergent capabilities — and emergent regressions.",
        ],
        practice: [
          "Draw the path of one token through a decoder block: embedding → attention → FFN → next-token probabilities.",
          "List 5 behaviours you'd regression-test across a model version upgrade in your product.",
        ],
        quiz: [
          {
            q: "What made transformers scale where RNNs stalled?",
            options: [
              "Smaller vocabularies",
              "Parallel processing of all positions via attention",
              "Binary tokenization",
              "CPU-friendly math",
            ],
            answer: 1,
            explain: "No sequential dependency → full GPU parallelism → vastly larger training runs.",
          },
          {
            q: "A GPT-style decoder uses which attention pattern?",
            options: [
              "Bidirectional over the whole sequence",
              "Causal — each token sees only previous tokens",
              "No attention",
              "Attention only to the first token",
            ],
            answer: 1,
            explain: "Generation must not peek at the future; causal masking enforces next-token prediction.",
          },
        ],
      },
    ],
  },
  {
    title: "Data Handling",
    lessons: [
      {
        id: "pandas",
        title: "Pandas: The Tester's Data Workbench",
        minutes: 8,
        summary:
          "DataFrames are spreadsheets with superpowers. Pandas is how you slice, audit and sanity-check the data behind any ML system.",
        blocks: [
          {
            kind: "p",
            text: "Pandas gives you the DataFrame — a typed, columnar table — and a grammar for manipulating it. For testers it is the fastest path from 'the model feels off' to evidence: load the training export, filter the suspicious slice, count what you find.",
          },
          {
            kind: "code",
            lang: "python",
            title: "The 80% toolkit",
            code: "import pandas as pd\n\ndf = pd.read_csv(\"bugs.csv\")\ndf.head()                              # first rows\ndf.info()                              # columns, nulls, types\ndf[\"severity\"].value_counts()          # distribution\ndf[df[\"status\"] == \"open\"]             # filter\nbugs = df.groupby(\"team\").size()       # aggregate\ndf.isna().sum()                        # null audit",
          },
          { kind: "h", text: "Audit moves worth memorizing" },
          {
            kind: "ul",
            items: [
              "value_counts(normalize=True): class balance at a glance.",
              "df.duplicated().sum(): silent double-counting.",
              "describe(): impossible values hiding in min/max.",
              "crosstab(col_a, col_b): suspicious correlations (leakage!).",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Write a one-page 'dataset test plan' for any ML feature: shape checks, null budgets, duplicate policy, label balance, and impossible-value rules. Run it with five lines of pandas before anyone blames the model.",
          },
        ],
        takeaways: [
          "DataFrame + read_csv + filter/groupby covers most data-audit needs.",
          "value_counts, duplicated, describe, crosstab are the audit quartet.",
          "Most 'model bugs' start life as data bugs you can find with pandas.",
        ],
        practice: [
          "Take any CSV you can get (bug export, CSV of test results) and produce: shape, null counts, one distribution, one filtered slice.",
          "Plant 3 deliberate defects in a copy (dupes, nulls, impossible value) and rediscover them with pandas one-liners.",
        ],
        quiz: [
          {
            q: "Which call reveals class imbalance fastest?",
            options: ["df.head()", "df['label'].value_counts(normalize=True)", "df.to_csv()", "df.rename()"],
            answer: 1,
            explain: "Normalized value counts show proportions — a 98/2 split jumps out instantly.",
          },
          {
            q: "df.duplicated().sum() > 0 in training data risks…",
            options: ["Faster training", "Over-weighting repeated examples and leakage across splits", "Better generalization", "Smaller files"],
            answer: 1,
            explain: "Duplicates can appear on both sides of a split — textbook leakage.",
          },
        ],
      },
      {
        id: "numpy",
        title: "NumPy Essentials",
        minutes: 7,
        summary:
          "NumPy is the numeric bedrock: fast multi-dimensional arrays, vectorized math, and the substrate every ML library stands on.",
        blocks: [
          {
            kind: "p",
            text: "A NumPy ndarray is a homogeneous grid of numbers stored contiguously in memory — which is why operations on it run at near-C speed. Instead of looping over rows in Python ('slow'), you express the whole computation as array math ('vectorized') and NumPy pushes it into optimized kernels. Every model weight, every embedding, every image is an ndarray under the hood.",
          },
          {
            kind: "code",
            lang: "python",
            title: "Vectorized thinking",
            code: "import numpy as np\n\na = np.array([1.0, 2.0, 3.0])\nb = a * 2 + 1            # elementwise, no loop\nprint(b.mean(), b.std())\n\n# cosine similarity in one expression\ndef cos(u, v):\n    return u @ v / (np.linalg.norm(u) * np.linalg.norm(v))",
          },
          { kind: "h", text: "Concepts that pay rent" },
          {
            kind: "ul",
            items: [
              "Broadcasting: small arrays stretch to match bigger ones — elegant, occasionally surprising.",
              "Shapes & axes: most ML bugs are shape mismatches; learn to read (batch, seq, dim).",
              "Randomness with seeds: np.random.default_rng(42) for reproducible experiments.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "You may never ship NumPy code, but you will read shapes in error messages ('cannot broadcast (8,3) to (8,4)'). Shape literacy turns cryptic ML stack traces into one-line bug reports.",
          },
        ],
        takeaways: [
          "ndarray + vectorization = the fast numeric core of all ML stacks.",
          "Broadcasting and shape reasoning prevent the most common numeric bugs.",
          "Seeded randomness makes experiments reproducible.",
        ],
        practice: [
          "Compute the cosine similarity of two 5-dim vectors by hand, then verify with NumPy.",
          "Deliberately add arrays of shapes (3,) and (3,3); predict the result before running it.",
        ],
        quiz: [
          {
            q: "Why is vectorized NumPy much faster than a Python loop?",
            options: [
              "It uses bigger numbers",
              "Operations run in optimized, contiguous-memory kernels without per-item Python overhead",
              "It skips math",
              "It uses the GPU only",
            ],
            answer: 1,
            explain: "One C-level sweep over contiguous memory beats millions of interpreted loop steps.",
          },
          {
            q: "What does 'broadcasting' do?",
            options: [
              "Streams arrays over the network",
              "Stretches smaller arrays to compatible shapes for elementwise ops",
              "Encrypts arrays",
              "Sorts arrays",
            ],
            answer: 1,
            explain: "Rules like (3,) + (3,3) align shapes automatically — powerful, worth understanding.",
          },
        ],
      },
      {
        id: "numpy-vs-pandas",
        title: "NumPy vs Pandas",
        minutes: 5,
        summary:
          "NumPy computes on arrays; pandas reasons about tables. Same ecosystem, different jobs — knowing the border saves hours.",
        blocks: [
          {
            kind: "p",
            text: "NumPy speaks mathematics: shapes, axes, vectorized ops, no column names. Pandas speaks data: named columns, mixed types, missing values, joins, CSVs. Pandas is built on NumPy — a DataFrame is labelled columns of arrays — so they hand data back and forth freely (df.to_numpy(), pd.Series(arr)).",
          },
          {
            kind: "table",
            head: ["", "NumPy", "Pandas"],
            rows: [
              ["Core object", "ndarray (one dtype)", "DataFrame (mixed dtypes)"],
              ["Superpower", "Fast numeric math", "Labelled queries, joins, IO"],
              ["Missing data", "NaN only, manual", "First-class NA handling"],
              ["You reach for it when", "Embeddings, metrics, math", "Auditing, slicing, reporting"],
            ],
          },
          {
            kind: "p",
            text: "Rule of thumb: if you're asking questions about rows ('how many open bugs per team?'), think pandas. If you're doing math on numbers ('cosine similarity of these vectors'), think NumPy. Models consume NumPy-shaped tensors; your audit trail is written in pandas.",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "A complete data investigation often uses both: pandas to find the suspicious slice, NumPy to quantify it (distances, statistics), pandas again to report it. Fluency in the hand-off is the skill.",
          },
        ],
        takeaways: [
          "NumPy = math on arrays; pandas = questions about labelled tables.",
          "Pandas sits on NumPy; conversion is one call each way.",
          "Audit in pandas, compute in NumPy, report in pandas.",
        ],
        practice: [
          "Convert a small DataFrame to NumPy, z-score one column, and write the result back as a new column.",
          "List 3 tasks that are painful in NumPy but trivial in pandas (joins, nulls, mixed types…).",
        ],
        quiz: [
          {
            q: "Which tool for 'join two CSVs on customer_id and count nulls'?",
            options: ["NumPy", "Pandas", "Both equally", "Neither"],
            answer: 1,
            explain: "Labelled joins and NA handling are pandas' home turf.",
          },
          {
            q: "A DataFrame column is internally…",
            options: ["A Python list", "A NumPy array (or an array-backed extension)", "A dictionary of rows", "A CSV string"],
            answer: 1,
            explain: "Pandas is built on NumPy; that's why interop is seamless.",
          },
        ],
      },
      {
        id: "basic-eda",
        title: "Basic EDA: Interrogating a Dataset",
        minutes: 8,
        summary:
          "Exploratory Data Analysis is testing applied to data itself — distributions, nulls, outliers and correlations — before any model touches it.",
        blocks: [
          {
            kind: "p",
            text: "EDA is what detectives do before the trial: walk the scene. Load the data, check its shape and types, count missing values, plot distributions, hunt impossible values. Ten minutes of EDA routinely finds what would have become a month of model confusion — dates in the future, ages of 300, a 'gender' column with 47 spellings.",
          },
          { kind: "h", text: "The standard sweep" },
          {
            kind: "ul",
            items: [
              "Shape & dtypes: does the schema match the documentation?",
              "Nulls per column: random gaps or systematic absence (missing = meaningful)?",
              "Numeric distributions: describe() + histograms for skew and impossible extremes.",
              "Categorical cardinality: 47 spellings of one value = data-entry chaos.",
              "Target balance: 98/2 classes change every metric decision downstream.",
              "Correlations: features that correlate suspiciously with the label (leakage).",
            ],
          },
          {
            kind: "code",
            lang: "python",
            title: "A 60-second EDA",
            code: "df = pd.read_csv(\"claims.csv\")\nprint(df.shape)\nprint(df.dtypes)\nprint(df.isna().mean().sort_values(ascending=False).head())\nprint(df.describe().T)\nprint(df[\"status\"].value_counts(normalize=True))",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Treat the dataset as the system under test and EDA as your test charter. Write findings as defects with evidence: 'claim_amount max = -42 (n=7); expected >= 0'. Teams respond to that language.",
          },
        ],
        takeaways: [
          "EDA = shape, nulls, distributions, cardinality, balance, correlations.",
          "Impossible values and systematic nulls are defects, not noise.",
          "EDA findings should be filed like bugs: evidence + expectation.",
        ],
        practice: [
          "Run the 60-second EDA on any real dataset and file 2 'data defects' with screenshots.",
          "Find one column where missingness correlates with the outcome — argue why it matters.",
        ],
        quiz: [
          {
            q: "A 'city' column has 4,000 unique values for 5,000 rows. First suspicion?",
            options: [
              "Perfect data",
              "Free-text entry chaos: typos, case variants, abbreviations",
              "Too many cities exist",
              "The column is encrypted",
            ],
            answer: 1,
            explain: "Cardinality near row count on a categorical screams unclean free text.",
          },
          {
            q: "A feature correlates 0.99 with the label. Healthy?",
            options: [
              "Always — great feature!",
              "Possibly leakage: it may be a disguised copy of the answer",
              "Means the model is small",
              "Means data is missing",
            ],
            answer: 1,
            explain: "Near-perfect predictors are often proxies of the label — they vanish in production.",
          },
        ],
      },
    ],
  },
  {
    title: "AI & ML Systems",
    lessons: [
      {
        id: "ml-pipeline",
        title: "Data → Train → Validate → Test → Deploy",
        minutes: 8,
        summary:
          "The ML lifecycle is a pipeline with a test environment at every seam — and monitoring after deploy. It maps eerily well onto CI/CD.",
        blocks: [
          {
            kind: "p",
            text: "Production ML is a conveyor: data collection → cleaning & labelling → training → validation (tuning) → held-out testing → deployment → monitoring → retraining. Each arrow is a place where reality drifts from assumptions, which is exactly where testers should stand. Google's classic finding still holds: in real systems, training code is a small island in an ocean of pipelines, serving and monitoring.",
          },
          { kind: "h", text: "The QA translation layer" },
          {
            kind: "table",
            head: ["ML stage", "Classic QA equivalent"],
            rows: [
              ["Data collection/labelling", "Requirements & test data management"],
              ["Validation set", "Integration/staging environment"],
              ["Held-out test set", "Independent acceptance testing"],
              ["Deployment", "Release to production"],
              ["Monitoring/drift alerts", "Production smoke tests & observability"],
              ["Retraining", "Regression release"],
            ],
          },
          { kind: "h", text: "Failure seams worth owning" },
          {
            kind: "ul",
            items: [
              "Label pipelines: annotator disagreement, stale guidelines.",
              "Feature pipelines: training/serving skew, late-arriving data.",
              "Serving: version mismatch between model and preprocessing.",
              "Monitoring: silent degradation with green dashboards.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Map your org's ML pipeline end-to-end on one page and mark every seam where data crosses a team or system boundary. Bugs cluster at boundaries — in ML more than anywhere.",
          },
        ],
        takeaways: [
          "ML is a pipeline; the model is one stage among many.",
          "Validation tunes, the held-out test certifies, monitoring protects production.",
          "Every boundary between stages is a defect magnet.",
        ],
        practice: [
          "Diagram the ML pipeline of a product you know; label each stage's input, output and owner.",
          "Write one test for each of three seams (labelling, feature pipeline, serving).",
        ],
        quiz: [
          {
            q: "Which set should be used exactly once, for the final go/no-go number?",
            options: ["Training set", "Validation set", "Held-out test set", "Monitoring data"],
            answer: 2,
            explain: "Reuse of the final test set contaminates it; quoted numbers must come from untouched data.",
          },
          {
            q: "Where do most real-world ML defects live?",
            options: [
              "Inside the training algorithm",
              "In pipelines: data, features, serving, monitoring",
              "In the loss function",
              "In the GPU drivers",
            ],
            answer: 1,
            explain: "The model code is a fraction of the system; the plumbing is where things break.",
          },
        ],
      },
      {
        id: "data-drift",
        title: "Data Drift",
        minutes: 7,
        summary:
          "The world changes; your training data doesn't. Data drift is the input distribution shifting under a live model — quietly, continuously.",
        blocks: [
          {
            kind: "p",
            text: "A model trained on 2019 travel claims meets 2020's world: amounts, destinations and fraud patterns all shifted. Data (covariate) drift means production inputs no longer resemble training inputs. Causes are mundane: seasonality, a new product line, a UI change that alters input formats, a schema migration, an upstream sensor recalibrated.",
          },
          { kind: "h", text: "Detecting it" },
          {
            kind: "ul",
            items: [
              "Compare distributions per feature: PSI (population stability index), KS test, Jensen-Shannon.",
              "Rule of thumb: PSI < 0.1 stable; 0.1–0.25 investigate; > 0.25 significant.",
              "Embedding-space monitoring: plot production embeddings against training — drift shows as movement.",
              "Schema/format canaries: new categories, null-rate jumps, value-range violations.",
            ],
          },
          {
            kind: "p",
            text: "Data drift is necessary but not sufficient for harm — if the model is robust in the shifted region, nothing breaks. The business question is always: did accuracy follow the drift down? That's model drift's territory (next lesson); here your job is the early-warning sensor.",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Write drift tests like smoke tests: per-feature distribution snapshots at release, compared in production daily. Alert on PSI > 0.25. You now own 'the model's environment changed' as a testable event.",
          },
        ],
        takeaways: [
          "Data drift = production inputs diverge from training inputs.",
          "PSI/KS on features + embedding-space views are standard detectors.",
          "Drift alone isn't failure — pair it with performance monitoring.",
        ],
        practice: [
          "Simulate drift: take a dataset, shift one feature's mean by 2σ in a copy, compute PSI between halves.",
          "Draft an alert rule set (3 rules) for input drift on a feature set you choose.",
        ],
        quiz: [
          {
            q: "A new app version changes a dropdown into free text. This primarily risks…",
            options: ["Concept drift", "Data drift (input distribution change)", "Overfitting", "Label leakage"],
            answer: 1,
            explain: "The input format/distribution changed; the underlying relationship may be untouched.",
          },
          {
            q: "PSI = 0.4 on a key feature. Interpretation?",
            options: ["Perfectly stable", "Significant shift — investigate now", "Model is overfit", "Data is encrypted"],
            answer: 1,
            explain: "Above 0.25 is the conventional 'significant drift' threshold.",
          },
        ],
      },
      {
        id: "model-drift",
        title: "Model Drift",
        minutes: 6,
        summary:
          "Model drift is performance decaying in production over time. The model stands still; the world moves past it.",
        blocks: [
          {
            kind: "p",
            text: "Even with perfectly stable inputs, live models age. Data drift pushes them out of their comfort zone; feedback loops poison them (a fraud model blocks a pattern, fraudsters adapt, the blocked pattern vanishes from new data, the model forgets it). The symptom is a slow slide in accuracy, precision or recall against ground truth — when ground truth eventually arrives.",
          },
          { kind: "h", text: "The monitoring problem" },
          {
            kind: "ul",
            items: [
              "Ground truth lags: a loan's 'defaulted?' label arrives months later.",
              "Proxies stand in: chargebacks for fraud, escalations for bad answers.",
              "Slice-level decay hides in averages: overall accuracy flat, one segment collapsing.",
              "Champion/challenger: run a freshly trained model in shadow and compare.",
            ],
          },
          {
            kind: "p",
            text: "Responses range from scheduled retraining (calendar) to triggered retraining (drift or metric alarms) to continuous learning pipelines. Each adds automation and risk; a retrained model is a new release and deserves regression testing before promotion.",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Insist on segment dashboards, not just averages. 'Overall precision 91%' can hide 'precision 43% for the smallest merchants'. Slice-based monitoring is the production version of boundary testing.",
          },
        ],
        takeaways: [
          "Model drift = measured performance decay in production over time.",
          "Ground-truth lag forces proxy metrics; choose them consciously.",
          "Retraining is a release: regression-test the challenger before promotion.",
        ],
        practice: [
          "Define a proxy ground-truth metric for one AI feature and argue its blind spots.",
          "Design a shadow-deployment comparison: which metrics, for how long, what promotion bar?",
        ],
        quiz: [
          {
            q: "Why is detecting model drift harder than data drift?",
            options: [
              "It isn't",
              "True outcomes (ground truth) often arrive late or not at all",
              "Models hide their logs",
              "GPUs mask the signal",
            ],
            answer: 1,
            explain: "You can measure inputs instantly; correctness often needs delayed real-world outcomes.",
          },
          {
            q: "Averages hiding segment collapse is best caught by…",
            options: ["Bigger GPUs", "Slice-level monitoring dashboards", "Longer training", "Lower temperature"],
            answer: 1,
            explain: "Break metrics down by segment — decay loves to hide in the mean.",
          },
        ],
      },
      {
        id: "concept-drift",
        title: "Concept Drift",
        minutes: 6,
        summary:
          "Concept drift: the relationship between inputs and the right answer itself changes. Same data, different meaning.",
        blocks: [
          {
            kind: "p",
            text: "Data drift moves the inputs; concept drift moves the truth. 'High transaction amount → fraud' held until fraudsters switched to many small transactions — inputs similar, meaning inverted. Spam filters live here permanently: spammers rewrite their playbook weekly. Distinguish carefully: the same dataset can hide either, and both at once.",
          },
          { kind: "h", text: "Flavours" },
          {
            kind: "ul",
            items: [
              "Sudden: overnight rule change (new regulation redefines 'eligible').",
              "Gradual: slow behavioural evolution (language drift in support tickets).",
              "Recurring: seasonal concepts (holiday shopping patterns return yearly).",
            ],
          },
          {
            kind: "p",
            text: "Detection leans on error-rate monitoring and drift detectors on the error signal itself (ADWIN and friends). Responses: adaptive models, ensemble weighting toward recent data, or honest human review gates for fast-moving domains.",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "When a model 'goes stale', run the discriminator test: replay recent production inputs through the model and compare its errors against a fresh sample of human-labelled cases. Rising disagreement = concept drift evidence you can show the team.",
          },
        ],
        takeaways: [
          "Concept drift = the input→outcome relationship changed; inputs may look identical.",
          "Sudden, gradual and recurring forms need different responses.",
          "Error-signal monitoring plus fresh human labels is the detection pair.",
        ],
        practice: [
          "Describe one recurring concept drift in your domain and a calendar-based defence for it.",
          "Design a monthly 'disagreement audit': sample size, labelling process, drift threshold.",
        ],
        quiz: [
          {
            q: "Spammers constantly change tactics while email volume stays similar. That's…",
            options: ["Data drift only", "Concept drift", "Overfitting", "Quantization"],
            answer: 1,
            explain: "The mapping from email content to 'spam' itself keeps changing.",
          },
          {
            q: "Holiday shopping patterns returning every December illustrate…",
            options: ["Sudden drift", "Recurring concept drift", "Label leakage", "Vanishing gradients"],
            answer: 1,
            explain: "Seasonal relationships reappear on a cycle — models must re-learn or remember them.",
          },
        ],
      },
      {
        id: "bias-in-ai",
        title: "Bias in AI Systems",
        minutes: 8,
        summary:
          "AI bias is systematic unfairness baked in at every stage — data, labelling, modelling, deployment. Testers are the natural auditors.",
        blocks: [
          {
            kind: "p",
            text: "Bias enters long before the model: historical decisions that encoded prejudice become 'ground truth' labels (hiring data that reflects past exclusion); sampling that under-represents groups (a skin-cancer dataset of mostly light skin); measurement that proxies identity (postcode as a proxy for race). The model then launders human bias into mathematical authority — 'the algorithm said no'.",
          },
          { kind: "h", text: "Where to look" },
          {
            kind: "ul",
            items: [
              "Representation: who is missing or sparse in the data?",
              "Label quality: are labels equally reliable across groups?",
              "Proxy variables: features that encode protected attributes indirectly.",
              "Feedback loops: who gets audited more, generating more data about them?",
              "Deployment context: the same accuracy gap costs different groups differently.",
            ],
          },
          {
            kind: "p",
            text: "The uncomfortable math: several reasonable fairness definitions are mutually incompatible (equalized odds vs demographic parity can't both hold when base rates differ). Fairness is therefore a product decision with trade-offs — which is precisely what makes it testable against a stated policy.",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Run disaggregated evaluation: compute your key metric per segment (age band, region, language, account age). A 12-point gap is a finding with evidence, not an opinion. Your regression suite should include the gap, not just the average.",
          },
        ],
        takeaways: [
          "Bias is injected at every pipeline stage, not just 'in the algorithm'.",
          "Proxy variables can encode protected attributes without naming them.",
          "Fairness definitions conflict — pick one as a requirement, then test against it.",
        ],
        practice: [
          "For one model, compute the primary metric across 3 segments and document the largest gap.",
          "Find a plausible proxy variable in a dataset you know (e.g. postcode) and argue the risk.",
        ],
        quiz: [
          {
            q: "Training a hiring model on past hiring decisions mainly risks…",
            options: [
              "Overfitting to syntax",
              "Learning historical discrimination as 'merit'",
              "Data drift",
              "Token limits",
            ],
            answer: 1,
            explain: "Historical labels carry historical bias — the model automates the past.",
          },
          {
            q: "Why can't all fairness metrics be satisfied simultaneously?",
            options: [
              "GPUs are too slow",
              "They are mathematically incompatible when group base rates differ",
              "Regulations forbid it",
              "Models can't store them",
            ],
            answer: 1,
            explain: "Proven impossibility results force a choice — a product decision, testable once stated.",
          },
        ],
      },
      {
        id: "explainability",
        title: "Explainability (XAI)",
        minutes: 7,
        summary:
          "When a model says no, can anyone say why? Explainability techniques reconstruct reasons from black boxes — with honest limits.",
        blocks: [
          {
            kind: "p",
            text: "Regulators (GDPR's 'meaningful information about the logic', the EU AI Act's transparency duties) and users both demand reasons. Deep models don't contain human-readable ones, so XAI reconstructs approximations: feature attributions that estimate each input's contribution to this specific decision.",
          },
          { kind: "h", text: "The toolkit" },
          {
            kind: "ul",
            items: [
              "Feature importance (global): which features drive the model on average.",
              "SHAP (local): per-prediction attributions with solid theoretical grounding.",
              "LIME (local): fit a simple surrogate model around one prediction.",
              "Counterfactuals: 'had income been $4k higher, the loan would pass' — often the most actionable explanation.",
              "Attention maps / saliency: where vision-language models 'looked' — suggestive, not proof.",
            ],
          },
          {
            kind: "p",
            text: "Stay honest about limits: explanations are models of the model, and can be unstable (small input changes, different explanations) or manipulated. Treat an explanation as a hypothesis to verify with perturbation tests, not as truth.",
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Test explanations like any output: perturb the top-attributed feature and check the prediction moves as promised; check explanation stability across near-identical inputs. An explanation that doesn't predict the model's behaviour is a bug.",
          },
        ],
        takeaways: [
          "XAI approximates reasons: SHAP/LIME attributions, counterfactuals, saliency.",
          "Explanations are models of models — approximate and sometimes unstable.",
          "Verify explanations empirically: perturbation and stability tests.",
        ],
        practice: [
          "Generate SHAP values for one model prediction; perturb the top feature and confirm impact.",
          "Write a counterfactual explanation for a denied-loan scenario and check it flips the decision.",
        ],
        quiz: [
          {
            q: "SHAP values tell you…",
            options: [
              "The exact internal rule",
              "Each feature's estimated contribution to one prediction",
              "The training data used",
              "The model's accuracy",
            ],
            answer: 1,
            explain: "SHAP distributes the prediction across features — an attribution, not a rule extract.",
          },
          {
            q: "A good test of an explanation is…",
            options: [
              "Asking the model if it's true",
              "Perturbing the highlighted feature and observing the predicted effect",
              "Measuring its length",
              "Comparing fonts",
            ],
            answer: 1,
            explain: "If the explanation claims feature X matters, changing X should move the prediction.",
          },
        ],
      },
      {
        id: "fairness",
        title: "Fairness: Definitions, Trade-offs & Testing",
        minutes: 8,
        summary:
          "Fairness turns ethics into measurable requirements — group metrics, trade-offs, and a test suite to enforce them.",
        blocks: [
          {
            kind: "p",
            text: "Group fairness compares model behaviour across protected segments. Demographic parity: equal positive-outcome rates across groups. Equalized odds: equal true-positive and false-positive rates among those with real outcomes. Calibration: a predicted 70% risk means 70% in every group. Each captures a different intuition of 'fair' — and they collide when groups have different base rates.",
          },
          {
            kind: "table",
            head: ["Metric", "Requires", "Blind spot"],
            rows: [
              ["Demographic parity", "Equal approval rates", "Ignores actual qualification differences"],
              ["Equalized odds", "Equal TPR & FPR", "Needs reliable ground truth per group"],
              ["Calibration", "Predicted prob = true frequency", "Says nothing about who gets harmed"],
            ],
          },
          { kind: "h", text: "A fairness test plan" },
          {
            kind: "ul",
            items: [
              "Define segments and the chosen fairness criterion as a requirement.",
              "Measure the criterion per segment at release; set an acceptable gap.",
              "Add proxy-hunting: ensure features don't silently encode protected attributes.",
              "Monitor the gap in production, not just at release.",
              "Document trade-offs: who gains, who loses, who decided.",
            ],
          },
          {
            kind: "callout",
            tone: "lab",
            title: "Tester's angle",
            text: "Fairness testing is boundary testing across populations. The deliverable is a table: metric × segment × release, with gaps trended over time. When a gap widens, you have a regression — file it like one.",
          },
        ],
        takeaways: [
          "Fairness = measurable group comparisons: parity, equalized odds, calibration.",
          "Criteria conflict mathematically; choosing is a product decision.",
          "Operationalize it: per-segment metrics, gap thresholds, trend monitoring.",
        ],
        practice: [
          "Compute TPR and FPR for two segments of any classifier output you can access; report the gap.",
          "Write a one-paragraph trade-off memo defending a fairness criterion choice for a loan product.",
        ],
        quiz: [
          {
            q: "Equalized odds requires…",
            options: [
              "Identical approval rates for all groups",
              "Equal true-positive and false-positive rates across groups",
              "Identical features per group",
              "Equal model sizes",
            ],
            answer: 1,
            explain: "It equalizes error behaviour conditional on the real outcome.",
          },
          {
            q: "When base rates differ between groups, satisfying demographic parity and equalized odds together is…",
            options: ["Always possible", "Generally impossible (proven trade-off)", "Required by law", "Irrelevant"],
            answer: 1,
            explain: "Impossibility theorems force an explicit, documented choice.",
          },
        ],
      },
    ],
  },
];
