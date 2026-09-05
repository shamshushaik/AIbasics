import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { getLesson, neighbors, navigate, TOTAL, type Progress } from "../lib/store";
import { Badge, Icon, RenderBlock, Bar } from "./ui";

export function LessonPage({ id, progress }: { id: string; progress: Progress }) {
  const lesson = getLesson(id);
  const { prev, next } = neighbors(id);

  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [id]);

  if (!lesson) {
    return (
      <main className="mx-auto max-w-3xl px-5 py-32 text-center">
        <p className="font-mono text-[13px] uppercase tracking-[0.2em] text-fail">404 · spec not found</p>
        <h1 className="mt-3 font-display text-4xl font-extrabold">No lesson with id “{id}”.</h1>
        <button onClick={() => navigate("/curriculum")} className="mt-6 border-2 border-ink bg-ink px-5 py-3 font-mono text-[13px] font-bold uppercase tracking-[0.12em] text-paper" style={{ borderRadius: 8 }}>
          back to curriculum
        </button>
      </main>
    );
  }

  const done = progress.completed.includes(lesson.id);
  const quizBest = progress.quiz[lesson.id];

  return (
    <main className="relative">
      {/* header */}
      <header className="relative overflow-hidden border-b-2 border-ink">
        <div className="grid-paper noise absolute inset-0" />
        <div className="relative mx-auto max-w-4xl px-5 pb-12 pt-10 lg:px-8">
          {/* breadcrumbs */}
          <nav className="flex flex-wrap items-center gap-2 font-mono text-[12px] uppercase tracking-[0.14em] text-ink-3">
            <button onClick={() => navigate("/")} className="link-slide hover:text-ink">overview</button>
            <span>/</span>
            <button onClick={() => navigate(`/curriculum?m=${lesson.moduleNum}`)} className="link-slide hover:text-ink" style={{ color: lesson.accent }}>
              module {lesson.moduleCode} · {lesson.moduleTitle}
            </button>
            <span>/</span>
            <span className="text-ink-2 normal-case">{lesson.sectionTitle}</span>
          </nav>

          <div className="relative mt-6">
            <span className="pointer-events-none absolute -right-2 -top-10 select-none font-display text-[130px] font-extrabold leading-none text-outline sm:text-[180px]">
              {String(lesson.number).padStart(2, "0")}
            </span>
            <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55 }}>
              <div className="flex flex-wrap items-center gap-2.5">
                <Badge color={lesson.accent} soft={lesson.accentSoft}>lesson {String(lesson.number).padStart(2, "0")} / {TOTAL}</Badge>
                <Badge>◔ {lesson.minutes} min read</Badge>
                {quizBest && (
                  <Badge color={quizBest.score === quizBest.total ? "var(--color-pass)" : "var(--color-m1)"}>
                    quiz best {quizBest.score}/{quizBest.total}
                  </Badge>
                )}
              </div>
              <h1 className="relative mt-4 max-w-2xl font-display text-4xl font-extrabold leading-[1.04] tracking-tight sm:text-5xl">
                {lesson.title}
              </h1>
              <p className="relative mt-4 max-w-2xl text-[17px] leading-relaxed text-ink-2">{lesson.summary}</p>
              <div className="relative mt-7 flex flex-wrap items-center gap-4">
                <button
                  onClick={() => progress.toggleComplete(lesson.id)}
                  className={`group flex items-center gap-2.5 border-2 px-5 py-2.5 font-mono text-[12.5px] font-bold uppercase tracking-[0.12em] transition-all ${
                    done ? "border-pass bg-pass text-paper" : "border-ink bg-card text-ink hover:-translate-y-0.5 hover:shadow-press-sm"
                  }`}
                  style={{ borderRadius: 8 }}
                >
                  <Icon name="check" size={15} />
                  {done ? "marked complete" : "mark complete"}
                </button>
                <div className="flex items-center gap-2 font-mono text-[11.5px] text-ink-3">
                  <span className="inline-block h-2 w-2 rounded-full" style={{ background: done ? "var(--color-pass)" : "var(--color-line-2)" }} />
                  status saved locally
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      {/* body */}
      <article className="mx-auto max-w-4xl px-5 py-12 lg:px-8">
        <div className="prose-lesson">
          {lesson.blocks.map((b, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 + i * 0.03, duration: 0.45 }}>
              <RenderBlock block={b} accent={lesson.accent} />
            </motion.div>
          ))}
        </div>

        {/* takeaways */}
        <section className="mt-12 border-2 border-ink bg-card p-6 sm:p-7" style={{ borderRadius: 12 }}>
          <h2 className="flex items-center gap-3 font-display text-[22px] font-extrabold">
            <span className="grid h-9 w-9 place-items-center bg-ink text-glow" style={{ borderRadius: 7 }}><Icon name="bolt" size={18} /></span>
            Key takeaways
          </h2>
          <ol className="mt-5 space-y-3.5">
            {lesson.takeaways.map((t, i) => (
              <li key={i} className="flex gap-4 text-[15.5px] leading-relaxed text-ink-2">
                <span className="font-mono text-[13px] font-bold" style={{ color: lesson.accent }}>{String(i + 1).padStart(2, "0")}</span>
                {t}
              </li>
            ))}
          </ol>
        </section>

        {/* lab tasks */}
        <LabTasks lessonId={lesson.id} tasks={lesson.practice} accent={lesson.accent} progress={progress} />

        {/* quiz */}
        <Quiz lessonId={lesson.id} quiz={lesson.quiz} accent={lesson.accent} progress={progress} />

        {/* prev / next */}
        <nav className="mt-14 grid gap-3 sm:grid-cols-2">
          <button
            onClick={() => (prev ? navigate(`/lesson/${prev.id}`) : navigate("/curriculum"))}
            className="group flex items-center gap-4 border-2 border-ink/20 bg-card p-5 text-left transition-all hover:border-ink hover:shadow-press-sm"
            style={{ borderRadius: 10 }}
          >
            <span className="text-ink-3 transition-transform group-hover:-translate-x-1"><Icon name="arrow" size={20} /></span>
            <span className="min-w-0">
              <span className="block font-mono text-[11px] uppercase tracking-[0.16em] text-ink-3">{prev ? `lesson ${String(prev.number).padStart(3, "0")}` : "syllabus"}</span>
              <span className="block truncate text-[15px] font-bold text-ink">{prev ? prev.title : "back to curriculum"}</span>
            </span>
          </button>
          <button
            onClick={() => next && navigate(`/lesson/${next.id}`)}
            disabled={!next}
            className={`group flex items-center justify-end gap-4 border-2 p-5 text-right transition-all sm:col-start-2 ${next ? "border-ink bg-ink text-paper hover:shadow-press" : "cursor-not-allowed border-ink/15 bg-card/60 text-ink-3"}`}
            style={{ borderRadius: 10 }}
          >
            <span className="min-w-0">
              <span className="block font-mono text-[11px] uppercase tracking-[0.16em] opacity-60">{next ? `lesson ${String(next.number).padStart(3, "0")}` : "end of curriculum"}</span>
              <span className="block truncate text-[15px] font-bold">{next ? next.title : "you made it 🎉"}</span>
            </span>
            {next && <span className="transition-transform group-hover:translate-x-1" style={{ color: "var(--color-glow)" }}><Icon name="arrow" size={20} /></span>}
          </button>
        </nav>
      </article>
    </main>
  );
}

/* ---------------- lab tasks ---------------- */

function LabTasks({ lessonId, tasks, accent, progress }: { lessonId: string; tasks: string[]; accent: string; progress: Progress }) {
  const checked = progress.practice[lessonId] ?? [];
  return (
    <section className="mt-10 border border-ink/15 bg-panel p-6 text-term sm:p-7" style={{ borderRadius: 12 }}>
      <h2 className="flex items-center gap-3 font-display text-[22px] font-extrabold text-paper">
        <span className="grid h-9 w-9 place-items-center text-glow" style={{ borderRadius: 7, border: "1.5px solid var(--color-glow)" }}><Icon name="flask" size={18} /></span>
        Lab — try it yourself
        <span className="ml-auto font-mono text-[12px] font-normal text-term/50">{checked.length}/{tasks.length} done</span>
      </h2>
      <div className="mt-5 space-y-2.5">
        {tasks.map((t, i) => {
          const on = checked.includes(i);
          return (
            <button
              key={i}
              onClick={() => progress.togglePractice(lessonId, i)}
              className={`flex w-full items-start gap-3.5 border px-4 py-3.5 text-left transition-all duration-200 ${on ? "border-glow/50 bg-glow/10" : "border-panel-2 bg-panel-2/60 hover:border-term/30"}`}
              style={{ borderRadius: 8 }}
            >
              <span className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center border-2 font-mono text-[11px] font-bold transition-colors ${on ? "border-glow bg-glow text-ink" : "border-term/35 text-term/60"}`} style={{ borderRadius: 5 }}>
                {on ? <Icon name="check" size={12} /> : i + 1}
              </span>
              <span className={`text-[14.5px] leading-relaxed ${on ? "text-term/50 line-through decoration-glow/40" : "text-term/90"}`}>{t}</span>
            </button>
          );
        })}
      </div>
      <p className="mt-4 font-mono text-[11.5px] text-term/40">
        ▸ ticks persist in your browser — run these against a real model for maximum retention.
        <span className="ml-1 inline-block h-2 w-2 align-middle" style={{ background: accent }} />
      </p>
    </section>
  );
}

/* ---------------- quiz ---------------- */

function Quiz({ lessonId, quiz, accent, progress }: { lessonId: string; quiz: import("../data/types").Quiz[]; accent: string; progress: Progress }) {
  const [picks, setPicks] = useState<Record<number, number>>({});
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setPicks({});
    setFinished(false);
  }, [lessonId]);

  const score = useMemo(
    () => quiz.reduce((a, qq, i) => a + (picks[i] === qq.answer ? 1 : 0), 0),
    [picks, quiz]
  );
  const allPicked = quiz.every((_, i) => picks[i] !== undefined);

  const submit = () => {
    setFinished(true);
    progress.setQuiz(lessonId, score, quiz.length);
  };

  return (
    <section className="mt-10 border-2 border-ink bg-card p-6 sm:p-7" style={{ borderRadius: 12 }}>
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="flex items-center gap-3 font-display text-[22px] font-extrabold">
          <span className="grid h-9 w-9 place-items-center text-paper" style={{ borderRadius: 7, background: accent }}><Icon name="target" size={18} /></span>
          Check your understanding
        </h2>
        {finished && (
          <motion.p
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`font-mono text-[14px] font-bold ${score === quiz.length ? "text-pass" : score >= quiz.length / 2 ? "text-m1" : "text-fail"}`}
          >
            {score}/{quiz.length} {score === quiz.length ? "· PASS — clean run ✓" : score >= quiz.length / 2 ? "· partial pass — review below" : "· FAIL — re-read & retry"}
          </motion.p>
        )}
      </div>

      <div className="mt-6 space-y-7">
        {quiz.map((qq, qi) => {
          const pick = picks[qi];
          return (
            <div key={qi}>
              <p className="font-semibold text-[16px] text-ink">
                <span className="mr-2 font-mono text-[13px]" style={{ color: accent }}>Q{qi + 1}.</span>
                {qq.q}
              </p>
              <div className="mt-3.5 grid gap-2">
                {qq.options.map((opt, oi) => {
                  const isPick = pick === oi;
                  const isAnswer = oi === qq.answer;
                  let cls = "border-ink/15 bg-paper hover:border-ink";
                  if (finished) {
                    if (isAnswer) cls = "border-pass bg-pass/10 text-ink";
                    else if (isPick) cls = "border-fail bg-fail/10 text-ink";
                    else cls = "border-ink/10 bg-paper opacity-60";
                  } else if (isPick) {
                    cls = "border-ink bg-ink text-paper";
                  }
                  return (
                    <button
                      key={oi}
                      disabled={finished}
                      onClick={() => setPicks((p) => ({ ...p, [qi]: oi }))}
                      className={`flex items-center gap-3 border-2 px-4 py-3 text-left text-[14.5px] transition-all duration-200 ${cls} ${!finished ? "hover:-translate-y-[1px]" : ""}`}
                      style={{ borderRadius: 8 }}
                    >
                      <span className={`grid h-6 w-6 shrink-0 place-items-center font-mono text-[11px] font-bold ${isPick && !finished ? "bg-paper text-ink" : "border border-current opacity-70"}`} style={{ borderRadius: 5 }}>
                        {"ABC"[oi]}
                      </span>
                      <span className="flex-1">{opt}</span>
                      <AnimatePresence>
                        {finished && isAnswer && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-pass"><Icon name="check" size={17} /></motion.span>}
                        {finished && isPick && !isAnswer && <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-fail"><Icon name="x" size={16} /></motion.span>}
                      </AnimatePresence>
                    </button>
                  );
                })}
              </div>
              <AnimatePresence>
                {finished && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="overflow-hidden border-l-[3px] pl-3.5 pt-2.5 text-[13.5px] leading-relaxed text-ink-2"
                    style={{ borderColor: accent, marginTop: 10 }}
                  >
                    <span className="font-mono text-[11px] font-bold uppercase tracking-[0.14em]" style={{ color: accent }}>why · </span>
                    {qq.explain}
                  </motion.p>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>

      <div className="mt-7 flex flex-wrap items-center gap-4">
        {!finished ? (
          <button
            onClick={submit}
            disabled={!allPicked}
            className={`flex items-center gap-2.5 border-2 px-6 py-3 font-mono text-[12.5px] font-bold uppercase tracking-[0.12em] transition-all ${
              allPicked ? "border-ink bg-ink text-paper hover:-translate-y-0.5 hover:shadow-press-sm" : "cursor-not-allowed border-ink/20 text-ink-3"
            }`}
            style={{ borderRadius: 8 }}
          >
            <Icon name="bolt" size={15} />
            run assertions ({Object.keys(picks).length}/{quiz.length})
          </button>
        ) : (
          <button
            onClick={() => {
              setPicks({});
              setFinished(false);
            }}
            className="flex items-center gap-2.5 border-2 border-ink bg-card px-6 py-3 font-mono text-[12.5px] font-bold uppercase tracking-[0.12em] text-ink transition-all hover:-translate-y-0.5 hover:shadow-press-sm"
            style={{ borderRadius: 8 }}
          >
            <Icon name="loop" size={15} />
            retry — beat your best
          </button>
        )}
        {!finished && !allPicked && (
          <span className="font-mono text-[12px] text-ink-3">answer all questions to run the suite</span>
        )}
        {finished && (
          <span className="flex-1">
            <Bar pct={(score / quiz.length) * 100} color={score === quiz.length ? "var(--color-pass)" : "var(--color-m1)"} h={6} />
          </span>
        )}
      </div>
    </section>
  );
}
