import { type ReactNode, useState } from "react";
import { motion } from "motion/react";
import type { Block } from "../data/types";

/* ---------------- custom inline icon set ---------------- */

const S = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

export function Icon({ name, size = 18, className }: { name: string; size?: number; className?: string }) {
  const paths: Record<string, ReactNode> = {
    logo: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="4" />
        <path d="M8 12.5l2.6 2.6L16.5 9" />
      </>
    ),
    book: (
      <>
        <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v15H6.5A2.5 2.5 0 0 0 4 20.5z" />
        <path d="M4 20.5V5.5M8 7h8M8 10.5h5" />
      </>
    ),
    flask: (
      <>
        <path d="M9.5 3h5M10.5 3v5.2L5.4 17a2 2 0 0 0 1.8 3h9.6a2 2 0 0 0 1.8-3l-5.1-8.8V3" />
        <path d="M7.5 14.5h9" />
      </>
    ),
    chip: (
      <>
        <rect x="7" y="7" width="10" height="10" rx="2" />
        <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2 2M18 6l-2 2M6 18l2-2M18 18l-2-2" />
      </>
    ),
    bug: (
      <>
        <path d="M12 8a4 4 0 0 0-4 4v3a4 4 0 0 0 8 0v-3a4 4 0 0 0-4-4z" />
        <path d="M12 4.5V8M8.5 5.5L10 7.5M15.5 5.5L14 7.5M4 13h4M16 13h4M5.5 18l3-1.5M18.5 18l-3-1.5M12 12v7" />
      </>
    ),
    search: (
      <>
        <circle cx="10.5" cy="10.5" r="6.5" />
        <path d="M15.5 15.5L21 21" />
      </>
    ),
    arrow: <path d="M4 12h15M13 6l6 6-6 6" />,
    check: <path d="M4.5 12.5l5 5L19.5 7" />,
    x: <path d="M6 6l12 12M18 6L6 18" />,
    terminal: (
      <>
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M7 9l3 3-3 3M12.5 15H17" />
      </>
    ),
    gauge: (
      <>
        <path d="M4 14a8 8 0 1 1 16 0" />
        <path d="M12 14l3.5-4.5M2.5 14h3M18.5 14h3M12 4.5V7" />
      </>
    ),
    layers: (
      <>
        <path d="M12 3l9 5-9 5-9-5z" />
        <path d="M3.5 12.5L12 17l8.5-4.5M3.5 16.5L12 21l8.5-4.5" />
      </>
    ),
    shield: (
      <>
        <path d="M12 3l7 3v6c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6z" />
        <path d="M9 12l2 2 4-4.5" />
      </>
    ),
    git: (
      <>
        <circle cx="6" cy="6" r="2.5" />
        <circle cx="6" cy="18" r="2.5" />
        <circle cx="18" cy="9" r="2.5" />
        <path d="M6 8.5v7M8.5 7.5c4 1.5 7 1.5 7.5 4" />
      </>
    ),
    copy: (
      <>
        <rect x="8" y="8" width="12" height="12" rx="2" />
        <path d="M16 8V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h2" />
      </>
    ),
    bolt: <path d="M13 2L4.5 13.5H11L9.5 22 19 10h-6.5z" />,
    target: (
      <>
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="4.5" />
        <circle cx="12" cy="12" r="0.5" />
      </>
    ),
    loop: (
      <>
        <path d="M4 9a8 8 0 0 1 14-2.5M20 15a8 8 0 0 1-14 2.5" />
        <path d="M18 3v4h-4M6 21v-4h4" />
      </>
    ),
  };
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} {...S} aria-hidden="true">
      {paths[name] ?? paths.book}
    </svg>
  );
}

/* ---------------- primitives ---------------- */

export function Badge({
  children,
  color,
  soft,
  mono = true,
}: {
  children: ReactNode;
  color?: string;
  soft?: string;
  mono?: boolean;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-0.5 text-[11px] font-medium tracking-wide uppercase ${
        mono ? "font-mono" : ""
      }`}
      style={{
        color: color ?? "var(--color-ink)",
        borderColor: color ? color + "55" : "var(--color-line-2)",
        background: soft ?? "transparent",
        borderRadius: 3,
      }}
    >
      {children}
    </span>
  );
}

export function Reveal({
  children,
  delay = 0,
  y = 22,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.65, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function Kicker({ children, color }: { children: ReactNode; color?: string }) {
  return (
    <p
      className="font-mono text-[12px] font-semibold tracking-[0.22em] uppercase mb-3 flex items-center gap-2.5"
      style={{ color: color ?? "var(--color-ink-3)" }}
    >
      <span className="inline-block h-[2px] w-7" style={{ background: color ?? "var(--color-ink)" }} />
      {children}
    </p>
  );
}

export function Bar({ pct, color, h = 6 }: { pct: number; color: string; h?: number }) {
  return (
    <div className="w-full overflow-hidden bg-ink/10" style={{ height: h, borderRadius: 3 }}>
      <motion.div
        className="h-full"
        style={{ background: color, borderRadius: 3 }}
        initial={{ width: 0 }}
        whileInView={{ width: `${Math.max(0, Math.min(100, pct))}%` }}
        viewport={{ once: true }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  );
}

export function Ring({ pct, color, size = 54 }: { pct: number; color: string; size?: number }) {
  const r = (size - 8) / 2;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(237,242,249,0.14)" strokeWidth="5" />
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth="5"
        strokeLinecap="round"
        strokeDasharray={c}
        initial={{ strokeDashoffset: c }}
        whileInView={{ strokeDashoffset: c - (c * Math.min(100, pct)) / 100 }}
        viewport={{ once: true }}
        transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
      />
    </svg>
  );
}

/* ---------------- code block ---------------- */

export function CodeBlock({ code, title, lang }: { code: string; title?: string; lang?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard unavailable */
    }
  };
  return (
    <div className="my-5 overflow-hidden border border-panel-2 bg-panel" style={{ borderRadius: 6 }}>
      <div className="flex items-center justify-between border-b border-panel-2 px-4 py-2">
        <div className="flex items-center gap-2.5">
          <span className="flex gap-1.5">
            <i className="h-2.5 w-2.5 rounded-full bg-fail/80" />
            <i className="h-2.5 w-2.5 rounded-full bg-[#e8b93d]/80" />
            <i className="h-2.5 w-2.5 rounded-full bg-pass/80" />
          </span>
          <span className="font-mono text-[11px] text-term/50">
            {title ?? lang} · {lang}
          </span>
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 font-mono text-[11px] text-term/60 transition-colors hover:text-glow"
        >
          <Icon name={copied ? "check" : "copy"} size={13} />
          {copied ? "copied" : "copy"}
        </button>
      </div>
      <pre className="overflow-x-auto p-4 font-mono text-[13px] leading-relaxed text-term/90">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ---------------- callout ---------------- */

const TONES: Record<string, { color: string; label: string }> = {
  lab: { color: "var(--color-m3)", label: "Tester's angle" },
  tip: { color: "var(--color-m2)", label: "Tip" },
  warn: { color: "var(--color-m1)", label: "Watch out" },
};

export function Callout({ tone, title, text }: { tone?: string; title?: string; text: string }) {
  const t = TONES[tone ?? "tip"] ?? TONES.tip;
  return (
    <div
      className="my-5 border border-ink/10 bg-card p-4 pl-5"
      style={{ borderRadius: 6, borderLeft: `4px solid ${t.color}` }}
    >
      <p className="mb-1.5 flex items-center gap-2 font-mono text-[11px] font-semibold uppercase tracking-[0.18em]" style={{ color: t.color }}>
        <Icon name={tone === "lab" ? "bug" : tone === "warn" ? "shield" : "bolt"} size={14} />
        {title || t.label}
      </p>
      <p className="text-[15px] leading-relaxed text-ink-2">{text}</p>
    </div>
  );
}

/* ---------------- block renderer ---------------- */

export function RenderBlock({ block, accent }: { block: Block; accent: string }) {
  switch (block.kind) {
    case "p":
      return <p>{block.text}</p>;
    case "h":
      return (
        <h3 className="mt-8 mb-3 flex items-center gap-3 font-display text-[19px] font-bold text-ink">
          <span className="inline-block h-[9px] w-[9px] rotate-45" style={{ background: accent }} />
          {block.text}
        </h3>
      );
    case "ul":
      return (
        <ul className="mb-5 space-y-2.5">
          {block.items.map((it, i) => (
            <li key={i} className="flex gap-3 text-[15.5px] leading-relaxed text-ink-2">
              <span className="mt-[9px] h-[7px] w-[7px] shrink-0 rounded-[2px]" style={{ background: accent }} />
              <span>{it}</span>
            </li>
          ))}
        </ul>
      );
    case "code":
      return <CodeBlock code={block.code} title={block.title} lang={block.lang} />;
    case "callout":
      return <Callout tone={block.tone} title={block.title} text={block.text} />;
    case "table":
      return (
        <div className="my-5 overflow-x-auto border border-ink/12 bg-card" style={{ borderRadius: 6 }}>
          <table className="w-full min-w-[520px] text-left text-[14px]">
            <thead>
              <tr className="border-b border-ink/12 bg-ink text-paper">
                {block.head.map((hh, i) => (
                  <th key={i} className="px-4 py-2.5 font-mono text-[11px] font-semibold uppercase tracking-[0.14em]">
                    {hh}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {block.rows.map((r, ri) => (
                <tr key={ri} className={`border-b border-ink/8 last:border-0 ${ri % 2 ? "bg-ink/[0.025]" : ""}`}>
                  {r.map((c, ci) => (
                    <td key={ci} className={`px-4 py-2.5 leading-relaxed ${ci === 0 ? "font-semibold text-ink" : "text-ink-2"}`}>
                      {c}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    default:
      return null;
  }
}
