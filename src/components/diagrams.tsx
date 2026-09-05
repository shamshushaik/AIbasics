import { useEffect, useMemo, useState } from "react";
import type { ComponentType } from "react";
import type { DiagramName } from "../data/types";
import { usePrefersReducedMotion } from "../lib/store";

/* shared bits ---------------------------------------------------------- */

const CHIP_COLORS = ["#22d3ee", "#ff7a29", "#f472b6", "#7ee2a8", "#60a5fa", "#e8b93d"];

function Panel({ children, caption }: { children: React.ReactNode; caption: string }) {
  return (
    <figure className="my-6 overflow-hidden border border-line-2 bg-panel" style={{ borderRadius: 8 }}>
      <div className="flex items-center justify-between border-b border-line-2 px-4 py-2">
        <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.2em] text-term/50">
          <span className="inline-block h-2 w-2 rotate-45 bg-glow" /> interactive diagram
        </span>
        <span className="font-mono text-[10px] text-term/30">poke it</span>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
      <figcaption className="border-t border-line-2 bg-panel-2 px-4 py-2.5 font-mono text-[11.5px] leading-relaxed text-term/45">
        {caption}
      </figcaption>
    </figure>
  );
}

function Slider({
  label, value, min, max, step = 1, onChange, fmt,
}: {
  label: string; value: number; min: number; max: number; step?: number;
  onChange: (v: number) => void; fmt?: (v: number) => string;
}) {
  return (
    <label className="flex items-center gap-3 font-mono text-[11.5px] text-term/70">
      <span className="w-24 shrink-0 uppercase tracking-wider">{label}</span>
      <input
        type="range" min={min} max={max} step={step} value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="h-1 flex-1 cursor-pointer appearance-none rounded-full bg-line-2 accent-[#7ee2a8]"
      />
      <span className="w-14 text-right tabular-nums text-glow">{fmt ? fmt(value) : value}</span>
    </label>
  );
}

/* 1. token stream ------------------------------------------------------- */

const SAMPLE = "Software testing gets a brain transplant!";
const TOKENS: { t: string; id: number }[] = [
  { t: "Software", id: 26076 }, { t: " testing", id: 12309 }, { t: " gets", id: 2186 },
  { t: " a", id: 264 }, { t: " brain", id: 6315 }, { t: " trans", id: 1296 },
  { t: "plant", id: 5308 }, { t: "!", id: 0 },
];

function TokenVizInner() {
  const [showIds, setShowIds] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  return (
    <div>
      <div className="flex flex-wrap items-center gap-1.5">
        {TOKENS.map((tok, i) => (
          <button
            key={i}
            onMouseEnter={() => setHover(i)}
            onMouseLeave={() => setHover(null)}
            className="border px-2.5 py-1.5 font-mono text-[13px] transition-all duration-200"
            style={{
              borderColor: `${CHIP_COLORS[i % CHIP_COLORS.length]}55`,
              background: `${CHIP_COLORS[i % CHIP_COLORS.length]}${hover === i ? "33" : "14"}`,
              color: CHIP_COLORS[i % CHIP_COLORS.length],
              borderRadius: 5,
              transform: hover === i ? "translateY(-3px)" : "none",
            }}
          >
            “{tok.t}”{showIds && <span className="ml-1.5 opacity-60">#{tok.id}</span>}
          </button>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-4 font-mono text-[11.5px] text-term/55">
        <button
          onClick={() => setShowIds((s) => !s)}
          className="border border-line-2 px-3 py-1.5 transition-colors hover:border-glow hover:text-glow"
          style={{ borderRadius: 5 }}
        >
          {showIds ? "hide token ids" : "show token ids"}
        </button>
        <span>
          {TOKENS.length} tokens · {SAMPLE.length} chars · ≈ {(SAMPLE.length / TOKENS.length).toFixed(1)} chars/token
        </span>
      </div>
      <p className="mt-3 font-mono text-[11.5px] leading-relaxed text-term/40">
        ▸ the model never sees “transplant” — it sees <span className="text-m2">trans</span> +{" "}
        <span className="text-m3">plant</span>. Billing, context limits and weird number behaviour all start here.
      </p>
    </div>
  );
}

/* 2. neural network ------------------------------------------------------ */

const LAYERS = [3, 4, 4, 2];
const W = 560;
const H = 190;

function nodePos(l: number, n: number, count: number) {
  const x = 50 + l * ((W - 100) / (LAYERS.length - 1));
  const y = H / 2 + (n - (count - 1) / 2) * 44;
  return { x, y };
}

function NeuralNetInner() {
  const reduced = usePrefersReducedMotion();
  const [hot, setHot] = useState<{ l: number; n: number } | null>(null);
  const edges = useMemo(() => {
    const out: { x1: number; y1: number; x2: number; y2: number; l: number; n: number }[] = [];
    for (let l = 0; l < LAYERS.length - 1; l++)
      for (let a = 0; a < LAYERS[l]; a++)
        for (let b = 0; b < LAYERS[l + 1]; b++) {
          const p1 = nodePos(l, a, LAYERS[l]);
          const p2 = nodePos(l + 1, b, LAYERS[l + 1]);
          out.push({ x1: p1.x, y1: p1.y, x2: p2.x, y2: p2.y, l: l + 1, n: b });
        }
    return out;
  }, []);

  return (
    <div>
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full">
        {edges.map((e, i) => {
          const active = hot && e.l === hot.l && e.n === hot.n;
          return (
            <line key={i} x1={e.x1} y1={e.y1} x2={e.x2} y2={e.y2}
              stroke={active ? "#7ee2a8" : "rgba(230,237,243,0.12)"}
              strokeWidth={active ? 1.8 : 1}
              className="transition-all duration-200"
            />
          );
        })}
        {!reduced &&
          [0, 1, 2, 3, 4].map((i) => {
            const e = edges[(i * 7) % edges.length];
            return (
              <circle key={`p${i}`} r="2.4" fill="#7ee2a8" opacity="0.9">
                <animateMotion dur={`${2 + (i % 3)}s`} repeatCount="indefinite" begin={`${i * 0.5}s`}
                  path={`M ${e.x1} ${e.y1} L ${e.x2} ${e.y2}`} />
              </circle>
            );
          })}
        {LAYERS.map((count, l) =>
          Array.from({ length: count }).map((_, n) => {
            const { x, y } = nodePos(l, n, count);
            const isHot = hot && hot.l === l && hot.n === n;
            return (
              <circle key={`${l}-${n}`} cx={x} cy={y} r={isHot ? 11 : 9}
                fill={isHot ? "#7ee2a8" : "#1a212c"}
                stroke={["#22d3ee", "#ff7a29", "#f472b6", "#60a5fa"][l]}
                strokeWidth="2"
                className="cursor-pointer transition-all duration-200"
                onMouseEnter={() => setHot({ l, n })}
                onMouseLeave={() => setHot(null)}
              />
            );
          })
        )}
      </svg>
      <p className="mt-1 font-mono text-[11.5px] leading-relaxed text-term/40">
        ▸ hover a neuron: every edge feeding it is a learned weight. The whole “intelligence” is ~{edges.length}× these weights,
        tuned by backprop until errors shrink. Pulses = signals flowing forward.
      </p>
    </div>
  );
}

/* 3. train / test split --------------------------------------------------- */

function SplitVizInner() {
  const [trainPct, setTrainPct] = useState(70);
  const [mode, setMode] = useState<"holdout" | "kfold">("holdout");
  const [fold, setFold] = useState(0);
  const reduced = usePrefersReducedMotion();
  const valPct = Math.round((100 - trainPct) / 2);
  const testPct = 100 - trainPct - valPct;

  useEffect(() => {
    if (mode !== "kfold" || reduced) return;
    const id = setInterval(() => setFold((f) => (f + 1) % 5), 1400);
    return () => clearInterval(id);
  }, [mode, reduced]);

  return (
    <div>
      <div className="mb-4 flex gap-2 font-mono text-[11px]">
        {(["holdout", "kfold"] as const).map((m) => (
          <button key={m} onClick={() => setMode(m)}
            className={`border px-3 py-1.5 uppercase tracking-wider transition-colors ${
              mode === m ? "border-glow bg-glow/10 text-glow" : "border-line-2 text-term/50 hover:text-term"
            }`} style={{ borderRadius: 5 }}>
            {m === "holdout" ? "single holdout" : "5-fold CV"}
          </button>
        ))}
      </div>

      {mode === "holdout" ? (
        <div>
          <div className="flex h-12 w-full overflow-hidden border border-line-2" style={{ borderRadius: 6 }}>
            <div className="grid place-items-center font-mono text-[11px] font-semibold text-[#071008] transition-all duration-500"
              style={{ width: `${trainPct}%`, background: "#7ee2a8" }}>
              train {trainPct}%
            </div>
            <div className="grid place-items-center font-mono text-[11px] font-semibold text-[#102027] transition-all duration-500"
              style={{ width: `${valPct}%`, background: "#22d3ee" }}>
              val {valPct}%
            </div>
            <div className="grid place-items-center font-mono text-[11px] font-semibold text-[#250a14] transition-all duration-500"
              style={{ width: `${testPct}%`, background: "#f472b6" }}>
              test {testPct}%
            </div>
          </div>
          <div className="mt-3"><Slider label="train size" value={trainPct} min={50} max={90} onChange={setTrainPct} fmt={(v) => `${v}%`} /></div>
          <p className="mt-3 font-mono text-[11.5px] text-term/40">
            ▸ the model never trains on the pink slice. That slice is the only honest grade it will ever get.
          </p>
        </div>
      ) : (
        <div>
          <div className="space-y-1.5">
            {Array.from({ length: 5 }).map((_, k) => (
              <div key={k} className="flex h-8 w-full overflow-hidden border border-line-2" style={{ borderRadius: 5 }}>
                {[0, 1, 2, 3, 4].map((f) => (
                  <div key={f}
                    className="grid flex-1 place-items-center font-mono text-[10px] font-semibold transition-all duration-500"
                    style={{
                      background: fold === f ? "#f472b6" : "#7ee2a8",
                      color: fold === f ? "#250a14" : "#071008",
                      opacity: fold === f ? 1 : 0.75,
                    }}>
                    {fold === f ? "val" : ""}
                  </div>
                ))}
              </div>
            ))}
          </div>
          <p className="mt-3 font-mono text-[11.5px] text-term/40">
            ▸ five trainings, each fifth of the data serves once as validation (pink). Average the five scores — one lucky split can't flatter you.
          </p>
        </div>
      )}
    </div>
  );
}

/* 4. confusion matrix ------------------------------------------------------ */

function ConfusionVizInner() {
  const [tp, setTp] = useState(90);
  const [fp, setFp] = useState(30);
  const [fn, setFn] = useState(10);
  const [tn, setTn] = useState(870);
  const acc = (tp + tn) / (tp + fp + fn + tn);
  const prec = tp + fp === 0 ? 0 : tp / (tp + fp);
  const rec = tp + fn === 0 ? 0 : tp / (tp + fn);
  const f1 = prec + rec === 0 ? 0 : (2 * prec * rec) / (prec + rec);
  const max = Math.max(tp, fp, fn, tn, 1);

  const Cell = ({ v, label, color, dark }: { v: number; label: string; color: string; dark: boolean }) => (
    <div className="relative grid place-items-center overflow-hidden border border-line-2 p-3" style={{ borderRadius: 6, minHeight: 74 }}>
      <div className="absolute inset-0 transition-all duration-500" style={{ background: color, opacity: 0.12 + 0.55 * (v / max) }} />
      <div className="relative text-center">
        <div className={`font-mono text-xl font-bold tabular-nums ${dark ? "text-[#0b0e13]" : "text-term"}`}>{v}</div>
        <div className={`font-mono text-[10px] uppercase tracking-wider ${dark ? "text-[#0b0e13]/70" : "text-term/50"}`}>{label}</div>
      </div>
    </div>
  );

  return (
    <div>
      <div className="grid grid-cols-2 gap-2">
        <Cell v={tp} label="true positive · caught the flake" color="#7ee2a8" dark />
        <Cell v={fp} label="false positive · cried wolf" color="#e8b93d" dark />
        <Cell v={fn} label="false negative · missed it" color="#fb7185" dark />
        <Cell v={tn} label="true negative · correctly quiet" color="#22d3ee" dark />
      </div>
      <div className="mt-4 space-y-2.5">
        <Slider label="TP" value={tp} min={0} max={200} onChange={setTp} />
        <Slider label="FP" value={fp} min={0} max={200} onChange={setFp} />
        <Slider label="FN" value={fn} min={0} max={200} onChange={setFn} />
        <Slider label="TN" value={tn} min={0} max={1000} step={10} onChange={setTn} />
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {[["accuracy", acc], ["precision", prec], ["recall", rec], ["f1", f1]].map(([k, v]) => (
          <div key={k as string} className="border border-line-2 bg-panel-2 px-3 py-2 text-center" style={{ borderRadius: 6 }}>
            <div className="font-mono text-lg font-bold tabular-nums text-glow">{((v as number) * 100).toFixed(1)}%</div>
            <div className="font-mono text-[10px] uppercase tracking-wider text-term/45">{k as string}</div>
          </div>
        ))}
      </div>
      <p className="mt-3 font-mono text-[11.5px] text-term/40">
        ▸ try it: drag FP up — precision collapses while accuracy barely moves. That's why “99% accurate” can be useless.
      </p>
    </div>
  );
}

/* 5. temperature sampler ---------------------------------------------------- */

const VOCAB = [
  { w: "The", logit: 2.4 }, { w: "A", logit: 1.6 }, { w: "Our", logit: 1.0 },
  { w: "Some", logit: 0.2 }, { w: "Every", logit: -1.4 },
];

function softmax(t: number) {
  const s = VOCAB.map((v) => Math.exp(v.logit / t));
  const sum = s.reduce((a, b) => a + b, 0);
  return s.map((x) => x / sum);
}

function TemperatureVizInner() {
  const [temp, setTemp] = useState(0.7);
  const [seq, setSeq] = useState<string[]>(["The"]);
  const probs = softmax(temp);

  const sample = () => {
    const r = Math.random();
    let acc = 0;
    for (let i = 0; i < probs.length; i++) {
      acc += probs[i];
      if (r <= acc) { setSeq((s) => [...s.slice(-11), VOCAB[i].w]); return; }
    }
    setSeq((s) => [...s.slice(-11), VOCAB[VOCAB.length - 1].w]);
  };

  return (
    <div>
      <Slider label="temperature" value={temp} min={0.05} max={1.5} step={0.05} onChange={setTemp} fmt={(v) => v.toFixed(2)} />
      <div className="mt-4 flex h-36 items-end justify-center gap-3 sm:gap-6">
        {VOCAB.map((v, i) => (
          <div key={v.w} className="flex w-14 flex-col items-center gap-1.5 sm:w-16">
            <span className="font-mono text-[11px] tabular-nums text-glow">{(probs[i] * 100).toFixed(0)}%</span>
            <div className="w-full transition-all duration-300" style={{
              height: `${8 + probs[i] * 100}%`,
              background: CHIP_COLORS[i],
              borderRadius: "4px 4px 0 0",
              opacity: 0.9,
            }} />
            <span className="font-mono text-[11px] text-term/70">{v.w}</span>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <button onClick={sample}
          className="border border-glow bg-glow/10 px-4 py-2 font-mono text-[12px] font-semibold text-glow transition-all hover:bg-glow hover:text-[#071008]"
          style={{ borderRadius: 6 }}>
          sample a token ▸
        </button>
        <button onClick={() => setSeq(["The"])}
          className="border border-line-2 px-3 py-2 font-mono text-[11px] text-term/50 transition-colors hover:text-term"
          style={{ borderRadius: 6 }}>
          reset
        </button>
      </div>
      <p className="mt-3 min-h-10 border border-line-2 bg-panel-2 px-3 py-2 font-mono text-[13px] leading-relaxed text-term/80" style={{ borderRadius: 6 }}>
        {seq.join(" ")}
        {seq.length > 1 && <span className="ml-1 text-term/30">← temp {temp.toFixed(2)} wrote this</span>}
      </p>
      <p className="mt-2 font-mono text-[11.5px] text-term/40">
        ▸ low temperature → the favourite wins almost always. Crank it up and the long tail gets a vote. Same model, different dice.
      </p>
    </div>
  );
}

/* 6. context window budget --------------------------------------------------- */

function ContextVizInner() {
  const [windowK, setWindowK] = useState(32);
  const [historyK, setHistoryK] = useState(6);
  const [docsK, setDocsK] = useState(9);
  const win = windowK * 1000;
  const segs = [
    { label: "system", k: 1.2, color: "#60a5fa" },
    { label: "few-shot", k: 2.0, color: "#e8b93d" },
    { label: "history", k: historyK, color: "#22d3ee" },
    { label: "retrieved docs", k: docsK, color: "#f472b6" },
    { label: "your question", k: 0.4, color: "#7ee2a8" },
  ];
  const answerReserve = 1.0;
  const usedK = segs.reduce((a, s) => a + s.k, 0);
  const totalK = usedK + answerReserve;
  const over = totalK > windowK;
  const pct = Math.min(100, Math.round((totalK / windowK) * 100));

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2 font-mono text-[11px]">
        <span className="uppercase tracking-wider text-term/45">window:</span>
        {[8, 32, 128].map((k) => (
          <button key={k} onClick={() => setWindowK(k)}
            className={`border px-3 py-1.5 transition-colors ${windowK === k ? "border-glow bg-glow/10 text-glow" : "border-line-2 text-term/50 hover:text-term"}`}
            style={{ borderRadius: 5 }}>
            {k}k
          </button>
        ))}
      </div>
      <div className="space-y-2.5">
        <Slider label="history" value={historyK} min={0} max={40} onChange={setHistoryK} fmt={(v) => `${v}k`} />
        <Slider label="docs" value={docsK} min={0} max={40} onChange={setDocsK} fmt={(v) => `${v}k`} />
      </div>
      <div className="mt-4 h-14 w-full overflow-hidden border border-line-2 bg-panel-2" style={{ borderRadius: 6 }}>
        <div className="flex h-full" style={{ width: `${Math.min(100, (totalK / windowK) * 100)}%` }}>
          {segs.map((s) => (
            <div key={s.label} title={`${s.label}: ${s.k}k`}
              className="grid h-full place-items-center overflow-hidden font-mono text-[10px] font-semibold text-[#0b0e13] transition-all duration-500"
              style={{ width: `${(s.k / totalK) * 100}%`, background: s.color }}>
              {s.k >= 1.5 ? s.label : ""}
            </div>
          ))}
          <div className="grid h-full flex-1 place-items-center font-mono text-[10px] text-term/60"
            style={{ background: "repeating-linear-gradient(45deg,#1c2532,#1c2532 6px,#232e40 6px,#232e40 12px)" }}>
            answer
          </div>
        </div>
      </div>
      <p className={`mt-3 font-mono text-[12px] ${over ? "text-fail" : "text-term/50"}`}>
        {over
          ? `▸ overflow! ${totalK.toFixed(1)}k requested vs ${windowK}k window — something gets silently truncated (guess what the model forgets).`
          : `▸ ${pct}% of the ${windowK}k window committed. The striped tail is the answer's room to breathe.`}
      </p>
    </div>
  );
}

/* 7. attention heat ----------------------------------------------------------- */

const WORDS = ["The", "tester", "approved", "the", "build", "it"];
const HEAT = [
  [0.5, 0.2, 0.1, 0.1, 0.05, 0.05],
  [0.1, 0.4, 0.2, 0.05, 0.15, 0.1],
  [0.05, 0.5, 0.2, 0.05, 0.15, 0.05],
  [0.05, 0.1, 0.15, 0.3, 0.3, 0.1],
  [0.05, 0.2, 0.25, 0.1, 0.3, 0.1],
  [0.05, 0.1, 0.1, 0.05, 0.6, 0.1],
];

function AttentionVizInner() {
  const [row, setRow] = useState(5);
  return (
    <div className="sm:flex sm:gap-6">
      <div className="mb-4 flex flex-wrap gap-1.5 sm:mb-0 sm:w-44 sm:flex-col">
        {WORDS.map((w, i) => (
          <button key={w} onMouseEnter={() => setRow(i)} onClick={() => setRow(i)}
            className={`border px-3 py-1.5 font-mono text-[12px] transition-all ${
              row === i ? "border-glow bg-glow/10 text-glow" : "border-line-2 text-term/55 hover:text-term"
            }`} style={{ borderRadius: 5 }}>
            {w}
          </button>
        ))}
      </div>
      <div className="flex-1">
        <div className="grid grid-cols-6 gap-1">
          {WORDS.map((w, c) => (
            <div key={`h-${w}`} className="pb-1 text-center font-mono text-[10px] text-term/40">{w}</div>
          ))}
          {WORDS.map((_, r) =>
            WORDS.map((__, c) => {
              const v = HEAT[row][c] * (r === row ? 1 : 0.35);
              return (
                <div key={`${r}-${c}`}
                  className="grid h-10 place-items-center font-mono text-[10px] tabular-nums transition-all duration-300 sm:h-11"
                  style={{
                    background: `rgba(126,226,168,${r === row ? v : v * 0.25})`,
                    color: v > 0.4 && r === row ? "#071008" : "rgba(230,237,243,0.5)",
                    borderRadius: 4,
                  }}>
                  {r === row ? (HEAT[row][c] * 100).toFixed(0) : ""}
                </div>
              );
            })
          )}
        </div>
        <p className="mt-3 font-mono text-[11.5px] leading-relaxed text-term/40">
          ▸ row = the word asking “who am I about?”. Hover <span className="text-glow">it</span>: 60% of its meaning is borrowed
          from <span className="text-glow">build</span>. That weighted borrowing, at every position, is the entire trick.
        </p>
      </div>
    </div>
  );
}

/* 8. pipeline flow --------------------------------------------------------------- */

const STAGES = [
  { name: "Data", note: "collection, cleaning, labelling — where 80% of defects are born" },
  { name: "Train", note: "the famous part: weights tuned on the training split" },
  { name: "Validate", note: "tune hyperparameters on the held-out validation slice" },
  { name: "Test", note: "the sealed set, graded exactly once — the honest number" },
  { name: "Deploy", note: "release + monitoring; drift starts the moment it ships" },
];

function PipelineVizInner() {
  const [sel, setSel] = useState(0);
  return (
    <div>
      <div className="flex items-center gap-1 overflow-x-auto pb-1">
        {STAGES.map((s, i) => (
          <div key={s.name} className="flex items-center">
            <button onClick={() => setSel(i)}
              className={`shrink-0 border px-3 py-2.5 font-mono text-[11.5px] font-semibold uppercase tracking-wider transition-all sm:px-4 ${
                sel === i ? "border-glow bg-glow/15 text-glow" : "border-line-2 bg-panel-2 text-term/55 hover:text-term"
              }`} style={{ borderRadius: 6 }}>
              {s.name}
            </button>
            {i < STAGES.length - 1 && (
              <svg width="34" height="10" className="shrink-0">
                <line x1="0" y1="5" x2="26" y2="5" stroke="#7ee2a8" strokeWidth="2" className="dash-flow" />
                <path d="M26 1 L33 5 L26 9" fill="none" stroke="#7ee2a8" strokeWidth="2" />
              </svg>
            )}
          </div>
        ))}
      </div>
      <div className="mt-3 border border-line-2 bg-panel-2 px-4 py-3" style={{ borderRadius: 6 }}>
        <p className="font-mono text-[12.5px] leading-relaxed text-term/75">
          <span className="mr-2 font-bold text-glow">{STAGES[sel].name} ▸</span>
          {STAGES[sel].note}
        </p>
      </div>
      <div className="mt-3 flex items-center gap-2 font-mono text-[11px] text-term/40">
        <svg width="20" height="20"><circle cx="10" cy="10" r="7" fill="none" stroke="#fb7185" strokeWidth="2" className="dash-flow" /></svg>
        <span>monitor → retrain loops back to Data. Each arrow is a contract testers should probe.</span>
      </div>
    </div>
  );
}

/* registry ------------------------------------------------------------------- */

export const DIAGRAMS: Record<DiagramName, { El: ComponentType; caption: string }> = {
  tokens: { El: TokenVizInner, caption: "Tokenization: text is chopped into vocabulary pieces. Tokens — not characters — are what you're billed for and what the window counts." },
  neural: { El: NeuralNetInner, caption: "A 3-4-4-2 network. Hover any neuron to see the weights feeding it; pulses are forward-pass signals." },
  split: { El: SplitVizInner, caption: "Holdout vs k-fold: the model is only ever graded on data it never trained on." },
  confusion: { El: ConfusionVizInner, caption: "Drag the four counts and watch precision/recall trade off while accuracy barely flinches." },
  temperature: { El: TemperatureVizInner, caption: "Softmax(logits ÷ T): temperature rescales how boldly the sampler gambles. Sample a few tokens at T=1.4." },
  context: { El: ContextVizInner, caption: "The window is a budget: system + examples + history + docs + question + answer must all fit — or something gets truncated." },
  attention: { El: AttentionVizInner, caption: "Attention weights for each query word. 'it' borrows most of its meaning from 'build' — coreference resolved by weighted averaging." },
  pipeline: { El: PipelineVizInner, caption: "Data → Train → Validate → Test → Deploy → monitor → retrain. Click a stage; every arrow is a testable contract." },
};

export function Diagram({ name }: { name: DiagramName }) {
  const d = DIAGRAMS[name];
  return (
    <Panel caption={d.caption}>
      <d.El />
    </Panel>
  );
}
