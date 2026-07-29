"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import {
  examQuestions,
  EXAM_TIME_SECONDS,
  type ExamQuestion,
} from "@/lib/exam-data";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import {
  ClipboardList,
  Timer,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ChevronLeft,
  ChevronRight,
  Flag,
  RotateCcw,
  TrendingUp,
  Award,
} from "lucide-react";

type ExamPhase = "setup" | "running" | "review" | "results";

const CHAPTER_OPTIONS = [
  "All Chapters",
  "Chapter 1",
  "Chapter 2",
  "Chapter 3",
  "Chapter 4",
  "Chapter 5",
  "Chapter 6",
] as const;

const COUNT_OPTIONS = [10, 20, 30, 40, 60, "All"] as const;

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  if (h > 0)
    return `${h}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
  return `${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}

function difficultyColor(d: ExamQuestion["difficulty"]) {
  return d === "easy"
    ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300"
    : d === "medium"
      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300"
      : "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300";
}

// setup screen
function SetupScreen({
  onStart,
}: {
  onStart: (questions: ExamQuestion[]) => void;
}) {
  const [selectedChapter, setSelectedChapter] =
    useState<string>("All Chapters");
  const [selectedCount, setSelectedCount] = useState<number | "All">(20);

  const filtered =
    selectedChapter === "All Chapters"
      ? examQuestions
      : examQuestions.filter((q) => q.chapter === selectedChapter);

  const finalCount =
    selectedCount === "All"
      ? filtered.length
      : Math.min(selectedCount as number, filtered.length);

  function startExam() {
    // shuffle and slice
    const shuffled = [...filtered].sort(() => Math.random() - 0.5);
    onStart(shuffled.slice(0, finalCount));
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-full px-4 py-12">
      <div className="w-full max-w-lg">
        {/* header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center size-16 rounded-2xl bg-primary/10 mb-4">
            <ClipboardList className="size-8 text-primary" />
          </div>
          <h2 className="text-3xl font-bold text-foreground mb-2">
            Mock Examination
          </h2>
          <p className="text-muted-foreground text-sm leading-relaxed">
            Configure your exam below. You will have{" "}
            <span className="font-semibold text-foreground">120 minutes</span>{" "}
            to complete the selected questions.
          </p>
        </div>

        {/* configuration card */}
        <div className="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col gap-6">
          {/* chapter filter */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Filter by Chapter
            </label>
            <div className="flex flex-wrap gap-2">
              {CHAPTER_OPTIONS.map((ch) => (
                <button
                  key={ch}
                  onClick={() => setSelectedChapter(ch)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium border transition-all",
                    selectedChapter === ch
                      ? "bg-primary text-primary-foreground border-primary shadow"
                      : "bg-muted text-muted-foreground border-border hover:border-primary/50 hover:text-foreground",
                  )}
                >
                  {ch}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              {filtered.length} question{filtered.length !== 1 ? "s" : ""}{" "}
              available in this selection
            </p>
          </div>

          {/* question count */}
          <div>
            <label className="block text-sm font-semibold text-foreground mb-3">
              Number of Questions
            </label>
            <div className="flex flex-wrap gap-2">
              {COUNT_OPTIONS.map((c) => (
                <button
                  key={String(c)}
                  onClick={() => setSelectedCount(c)}
                  className={cn(
                    "px-4 py-1.5 rounded-lg text-xs font-medium border transition-all",
                    selectedCount === c
                      ? "bg-primary text-primary-foreground border-primary shadow"
                      : "bg-muted text-muted-foreground border-border hover:border-primary/50 hover:text-foreground",
                  )}
                >
                  {c === "All" ? `All (${filtered.length})` : c}
                </button>
              ))}
            </div>
          </div>

          {/* timer info */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/60 border border-border">
            <div className="p-2 rounded-lg bg-primary/10">
              <Timer className="size-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground">Time Limit</p>
              <p className="text-xs text-muted-foreground">
                120:00 — {(120 / finalCount).toFixed(1)} min per question
              </p>
            </div>
            <span className="text-lg font-bold text-foreground font-mono">
              120:00
            </span>
          </div>

          {/* start button */}
          <Button
            onClick={startExam}
            size="lg"
            className="w-full font-semibold text-base"
          >
            <ClipboardList data-icon="inline-start" />
            Begin Examination ({finalCount} question
            {finalCount !== 1 ? "s" : ""})
          </Button>
        </div>

        {/* stats row */}
        <div className="mt-4 grid grid-cols-3 gap-3">
          {[
            {
              label: "Total Questions",
              value: examQuestions.length,
            },
            { label: "Chapters", value: 6, icon: TrendingUp },
            { label: "Time Limit", value: "120 min", icon: Timer },
          ].map(({ label, value, icon: Icon }) => (
            <div
              key={label}
              className="bg-card border border-border rounded-xl p-3 text-center"
            >
              <Icon className="size-4 text-muted-foreground mx-auto mb-1" />
              <p className="text-lg font-bold text-foreground">{value}</p>
              <p className="text-xs text-muted-foreground">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// running exam
function RunningExam({
  questions,
  onFinish,
}: {
  questions: ExamQuestion[];
  onFinish: (answers: (number | null)[]) => void;
}) {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(() =>
    Array(questions.length).fill(null),
  );
  const [flagged, setFlagged] = useState<boolean[]>(() =>
    Array(questions.length).fill(false),
  );
  const [timeLeft, setTimeLeft] = useState(EXAM_TIME_SECONDS);
  const [showConfirm, setShowConfirm] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const submitExam = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    onFinish(answers);
  }, [answers, onFinish]);

  // countdown timer
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!);
          onFinish(answers);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [answers, onFinish]);

  const q = questions[current];
  const answered = answers.filter((a) => a !== null).length;
  const timerPct = (timeLeft / EXAM_TIME_SECONDS) * 100;
  const timerWarning = timeLeft < 600; // last 10 minutes

  function selectAnswer(idx: number) {
    setAnswers((prev) => {
      const next = [...prev];
      next[current] = idx;
      return next;
    });
  }

  function toggleFlag() {
    setFlagged((prev) => {
      const next = [...prev];
      next[current] = !next[current];
      return next;
    });
  }

  return (
    <div className="flex flex-col h-full">
      {/* top bar */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-border bg-card/80 backdrop-blur shrink-0">
        <div
          className={cn(
            "flex items-center gap-2 px-3 py-1.5 rounded-lg font-mono font-bold text-sm transition-colors",
            timerWarning
              ? "bg-destructive/10 text-destructive"
              : "bg-muted text-foreground",
          )}
        >
          <Timer className="size-4" />
          {formatTime(timeLeft)}
        </div>
        <div className="flex-1 min-w-0">
          <Progress
            value={(answered / questions.length) * 100}
            className="h-1.5"
          />
        </div>
        <span className="text-xs text-muted-foreground shrink-0">
          {answered}/{questions.length} answered
        </span>
        <Button
          variant="outline"
          size="sm"
          className="shrink-0"
          onClick={() => setShowConfirm(true)}
        >
          Submit
        </Button>
      </div>

      {/* question nav strip */}
      <div className="flex gap-1 flex-wrap px-4 py-2 border-b border-border bg-muted/30 shrink-0">
        {questions.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={cn(
              "size-6 rounded text-xs font-medium transition-all",
              i === current
                ? "bg-primary text-primary-foreground ring-2 ring-primary/30"
                : answers[i] !== null
                  ? "bg-primary/20 text-primary"
                  : "bg-muted text-muted-foreground hover:bg-muted/80",
              flagged[i] && "ring-1 ring-amber-400",
            )}
          >
            {i + 1}
          </button>
        ))}
      </div>

      {/* question body */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-4 py-6">
          {/* meta */}
          <div className="flex items-center gap-2 mb-4 flex-wrap">
            <Badge variant="outline" className="text-xs">
              {q.chapter}
            </Badge>
            <Badge variant="outline" className="text-xs">
              {q.topic}
            </Badge>
            <Badge className={cn("text-xs", difficultyColor(q.difficulty))}>
              {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
            </Badge>
            <span className="ml-auto text-xs text-muted-foreground">
              Question {current + 1} of {questions.length}
            </span>
          </div>

          {/* question text */}
          <p className="text-base font-medium text-foreground leading-relaxed mb-6">
            {q.question}
          </p>

          {/* options */}
          <div className="flex flex-col gap-3 mb-6">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => selectAnswer(i)}
                className={cn(
                  "w-full text-left px-4 py-3 rounded-xl border text-sm font-medium transition-all leading-relaxed",
                  answers[current] === i
                    ? "border-primary bg-primary/10 text-foreground shadow-sm"
                    : "border-border bg-card text-foreground hover:border-primary/40 hover:bg-muted/50",
                )}
              >
                <span
                  className={cn(
                    "inline-flex items-center justify-center size-5 rounded-full text-xs font-bold mr-3 shrink-0",
                    answers[current] === i
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            ))}
          </div>

          {/* footer actions */}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleFlag}
              className={cn(flagged[current] && "text-amber-500")}
            >
              <Flag data-icon="inline-start" />
              {flagged[current] ? "Flagged" : "Flag"}
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrent(Math.max(0, current - 1))}
                disabled={current === 0}
              >
                <ChevronLeft data-icon="inline-start" />
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  setCurrent(Math.min(questions.length - 1, current + 1))
                }
                disabled={current === questions.length - 1}
              >
                Next
                <ChevronRight data-icon="inline-end" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* confirmation overlay */}
      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
          <div className="bg-card border border-border rounded-2xl p-6 shadow-xl w-full max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
                <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="font-bold text-foreground">Submit Examination?</h3>
            </div>
            <p className="text-sm text-muted-foreground mb-1">
              You have answered{" "}
              <strong className="text-foreground">{answered}</strong> of{" "}
              <strong className="text-foreground">{questions.length}</strong>{" "}
              questions.
            </p>
            {questions.length - answered > 0 && (
              <p className="text-sm text-destructive mb-4">
                {questions.length - answered} question
                {questions.length - answered !== 1 ? "s" : ""} left unanswered.
              </p>
            )}
            <div className="flex gap-2 mt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setShowConfirm(false)}
              >
                Continue Exam
              </Button>
              <Button className="flex-1" onClick={submitExam}>
                Submit
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Results Screen ────────────────────────────────────────────────────────────
function ResultsScreen({
  questions,
  answers,
  onRetry,
  onNewExam,
}: {
  questions: ExamQuestion[];
  answers: (number | null)[];
  onRetry: () => void;
  onNewExam: () => void;
}) {
  const [reviewIdx, setReviewIdx] = useState<number | null>(null);

  const correct = answers.filter((a, i) => a === questions[i].answer).length;
  const total = questions.length;
  const pct = Math.round((correct / total) * 100);
  const grade =
    pct >= 85 ? "A" : pct >= 70 ? "B" : pct >= 55 ? "C" : pct >= 40 ? "D" : "F";
  const gradeColor =
    grade === "A"
      ? "text-emerald-600 dark:text-emerald-400"
      : grade === "B"
        ? "text-blue-600 dark:text-blue-400"
        : grade === "C"
          ? "text-amber-600 dark:text-amber-400"
          : grade === "D"
            ? "text-orange-600 dark:text-orange-400"
            : "text-red-600 dark:text-red-400";

  const byChapter = questions.reduce<
    Record<string, { correct: number; total: number }>
  >((acc, q, i) => {
    if (!acc[q.chapter]) acc[q.chapter] = { correct: 0, total: 0 };
    acc[q.chapter].total++;
    if (answers[i] === q.answer) acc[q.chapter].correct++;
    return acc;
  }, {});

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="max-w-2xl mx-auto w-full px-4 py-6 flex flex-col gap-6">
        {/* Score banner */}
        <div className="bg-card border border-border rounded-2xl p-6 text-center shadow-sm">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Award className="size-6 text-primary" />
            <h2 className="text-xl font-bold text-foreground">
              Examination Results
            </h2>
          </div>
          <div className={cn("text-6xl font-black mb-2", gradeColor)}>
            {grade}
          </div>
          <div className="text-4xl font-bold text-foreground mb-1">{pct}%</div>
          <p className="text-muted-foreground text-sm">
            {correct} correct out of {total} questions
          </p>
          <div className="mt-4">
            <Progress value={pct} className="h-3" />
          </div>
        </div>

        {/* Per-chapter breakdown */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-foreground mb-3 flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" />
            Performance by Chapter
          </h3>
          <div className="flex flex-col gap-2">
            {Object.entries(byChapter).map(
              ([chapter, { correct: c, total: t }]) => (
                <div key={chapter} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-20 shrink-0">
                    {chapter}
                  </span>
                  <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${Math.round((c / t) * 100)}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium text-foreground w-12 text-right shrink-0">
                    {c}/{t}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Question review list */}
        <div className="bg-card border border-border rounded-2xl p-4 shadow-sm">
          <h3 className="font-semibold text-foreground mb-3">
            Question Review
          </h3>
          <div className="flex flex-col gap-2">
            {questions.map((q, i) => {
              const isCorrect = answers[i] === q.answer;
              return (
                <div key={q.id}>
                  <button
                    onClick={() => setReviewIdx(reviewIdx === i ? null : i)}
                    className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-muted/50 transition-colors text-left"
                  >
                    {isCorrect ? (
                      <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                    ) : (
                      <XCircle className="size-4 text-red-500 shrink-0" />
                    )}
                    <span className="text-xs font-medium text-muted-foreground w-5 shrink-0">
                      {i + 1}.
                    </span>
                    <span className="text-sm text-foreground flex-1 min-w-0 truncate">
                      {q.question}
                    </span>
                    <Badge
                      className={cn(
                        "text-xs shrink-0",
                        difficultyColor(q.difficulty),
                      )}
                    >
                      {q.difficulty}
                    </Badge>
                  </button>
                  {reviewIdx === i && (
                    <div className="mx-3 mb-2 p-3 rounded-xl bg-muted/50 border border-border text-sm flex flex-col gap-2">
                      <div className="flex flex-col gap-1">
                        {q.options.map((opt, oi) => (
                          <div
                            key={oi}
                            className={cn(
                              "flex items-start gap-2 px-2 py-1 rounded-lg text-xs",
                              oi === q.answer &&
                                "bg-emerald-50 dark:bg-emerald-900/20 text-emerald-800 dark:text-emerald-300 font-medium",
                              oi === answers[i] &&
                                oi !== q.answer &&
                                "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300",
                            )}
                          >
                            <span className="shrink-0">
                              {oi === q.answer
                                ? "✓"
                                : oi === answers[i]
                                  ? "✗"
                                  : "·"}
                            </span>
                            <span>{opt}</span>
                          </div>
                        ))}
                      </div>
                      <p className="text-xs text-muted-foreground border-t border-border pt-2 mt-1">
                        <span className="font-semibold text-foreground">
                          Explanation:{" "}
                        </span>
                        {q.explanation}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3 pb-4">
          <Button variant="outline" className="flex-1" onClick={onRetry}>
            <RotateCcw data-icon="inline-start" />
            Retry Same Questions
          </Button>
          <Button className="flex-1" onClick={onNewExam}>
            <ClipboardList data-icon="inline-start" />
            New Examination
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Main MockExam ─────────────────────────────────────────────────────────────
export function MockExam() {
  const [phase, setPhase] = useState<ExamPhase>("setup");
  const [activeQuestions, setActiveQuestions] = useState<ExamQuestion[]>([]);
  const [finalAnswers, setFinalAnswers] = useState<(number | null)[]>([]);

  function handleStart(questions: ExamQuestion[]) {
    setActiveQuestions(questions);
    setPhase("running");
  }

  function handleFinish(answers: (number | null)[]) {
    setFinalAnswers(answers);
    setPhase("results");
  }

  function handleRetry() {
    setFinalAnswers([]);
    setPhase("running");
  }

  function handleNewExam() {
    setActiveQuestions([]);
    setFinalAnswers([]);
    setPhase("setup");
  }

  if (phase === "setup") return <SetupScreen onStart={handleStart} />;
  if (phase === "running")
    return <RunningExam questions={activeQuestions} onFinish={handleFinish} />;
  if (phase === "results")
    return (
      <ResultsScreen
        questions={activeQuestions}
        answers={finalAnswers}
        onRetry={handleRetry}
        onNewExam={handleNewExam}
      />
    );
  return null;
}
