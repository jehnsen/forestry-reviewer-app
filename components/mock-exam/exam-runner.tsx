"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { saveExamAnswer, submitExam } from "@/lib/exam-actions";
import type { ExamAttempt, ExamQuestion } from "@/lib/exams";
import { cn, formatClock } from "@/lib/utils";
import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Clock,
  Loader2,
} from "lucide-react";

interface ExamRunnerProps {
  attempt: ExamAttempt;
  questions: ExamQuestion[];
  /** Answers already saved, so a reload resumes rather than restarts. */
  initialAnswers: Record<string, string>;
}

/** Below this many seconds the clock turns red and starts nagging. */
const WARNING_SECONDS = 300;

function secondsUntil(iso: string) {
  return Math.max(0, Math.round((new Date(iso).getTime() - Date.now()) / 1000));
}

export default function ExamRunner({
  attempt,
  questions,
  initialAnswers,
}: ExamRunnerProps) {
  const router = useRouter();

  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [remaining, setRemaining] = useState(() => secondsUntil(attempt.expiresAt));
  const [submitting, setSubmitting] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [confirmingSubmit, setConfirmingSubmit] = useState(false);

  // Guards the auto-submit path: without it the interval can fire submit twice
  // before the first response lands.
  const submittedRef = useRef(false);

  const finish = useCallback(async () => {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);

    const result = await submitExam(attempt.id);

    if (result.status === "failed") {
      // Let them try again rather than trapping them on a scored-but-unsaved paper.
      submittedRef.current = false;
      setSubmitting(false);
      setSaveError(result.reason);
      return;
    }

    router.replace(`/mock-exam/${attempt.id}/results`);
    router.refresh();
  }, [attempt.id, router]);

  // Drives the countdown, and submits by itself when the clock runs out.
  useEffect(() => {
    const tick = setInterval(() => {
      const left = secondsUntil(attempt.expiresAt);
      setRemaining(left);

      if (left <= 0) {
        clearInterval(tick);
        void finish();
      }
    }, 1000);

    return () => clearInterval(tick);
  }, [attempt.expiresAt, finish]);

  const current = questions[index];
  const answeredCount = Object.keys(answers).length;
  const unanswered = questions.length - answeredCount;

  const handleSelect = async (optionId: string) => {
    if (submitting || !current) return;

    const previous = answers[current.id];

    // Optimistic: the candidate should never wait on the network mid-exam.
    setAnswers((prev) => ({ ...prev, [current.id]: optionId }));
    setSaveError(null);

    const result = await saveExamAnswer({
      attemptId: attempt.id,
      questionId: current.id,
      selectedAnswerId: optionId,
    });

    if (result.status === "failed") {
      setSaveError(result.reason);
      setAnswers((prev) => {
        const reverted = { ...prev };
        if (previous) {
          reverted[current.id] = previous;
        } else {
          delete reverted[current.id];
        }
        return reverted;
      });
    }
  };

  if (!current) {
    return (
      <Card variant="elevated">
        <CardContent standalone>
          <p className="text-slate-600">This exam has no questions to show.</p>
        </CardContent>
      </Card>
    );
  }

  const lowOnTime = remaining <= WARNING_SECONDS;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">
            {attempt.examName}
          </h1>
          <p className="text-slate-600">
            Question {index + 1} of {questions.length} · {answeredCount} answered
          </p>
        </div>

        <div
          className={cn(
            "flex items-center gap-2 rounded-lg px-4 py-2 font-mono text-lg font-semibold tabular-nums",
            lowOnTime
              ? "bg-rose-50 text-rose-700 border border-rose-200"
              : "bg-slate-100 text-slate-900 border border-slate-200"
          )}
          role="timer"
          aria-live="off"
        >
          <Clock className="w-5 h-5" />
          {formatClock(remaining)}
        </div>
      </div>

      {lowOnTime && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 p-3">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-amber-800">
            Under {Math.ceil(remaining / 60)} minute
            {Math.ceil(remaining / 60) === 1 ? "" : "s"} left. The exam submits
            itself when the clock reaches zero.
          </p>
        </div>
      )}

      {/* Navigator: answered questions are filled, the current one outlined. */}
      <div className="flex flex-wrap gap-2">
        {questions.map((question, i) => {
          const isAnswered = Boolean(answers[question.id]);
          const isCurrent = i === index;

          return (
            <button
              key={question.id}
              onClick={() => setIndex(i)}
              aria-label={`Go to question ${i + 1}${isAnswered ? ", answered" : ""}`}
              aria-current={isCurrent ? "true" : undefined}
              className={cn(
                "w-9 h-9 rounded-md text-sm font-medium transition-colors border",
                isCurrent && "ring-2 ring-green-600 ring-offset-1",
                isAnswered
                  ? "bg-green-700 text-white border-green-700"
                  : "bg-white text-slate-600 border-slate-300 hover:bg-slate-50"
              )}
            >
              {i + 1}
            </button>
          );
        })}
      </div>

      <Card variant="elevated">
        <CardContent standalone className="space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="info">{current.subject}</Badge>
            <Badge variant="default">{current.difficulty}</Badge>
          </div>

          <p className="text-lg text-slate-900 leading-relaxed">
            {current.question}
          </p>

          {/* No correct/incorrect styling: feedback comes only after submission. */}
          <div className="space-y-3">
            {current.options.map((option) => {
              const isSelected = answers[current.id] === option.id;

              return (
                <button
                  key={option.id}
                  onClick={() => handleSelect(option.id)}
                  disabled={submitting}
                  className={cn(
                    "w-full text-left rounded-lg border-2 p-4 transition-all disabled:opacity-60",
                    isSelected
                      ? "border-green-700 bg-green-50"
                      : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <span
                      className={cn(
                        "w-8 h-8 rounded-full flex items-center justify-center font-semibold flex-shrink-0",
                        isSelected
                          ? "bg-green-700 text-white"
                          : "bg-slate-200 text-slate-700"
                      )}
                    >
                      {option.id.toUpperCase()}
                    </span>
                    <span className="text-slate-900 pt-1">{option.text}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {saveError && (
            <div
              role="alert"
              className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3"
            >
              <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-rose-700">{saveError}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="outline"
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          disabled={index === 0 || submitting}
        >
          <ChevronLeft className="mr-2 w-4 h-4" />
          Previous
        </Button>

        {index < questions.length - 1 ? (
          <Button
            onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
            disabled={submitting}
          >
            Next
            <ChevronRight className="ml-2 w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={() => setConfirmingSubmit(true)} disabled={submitting}>
            Finish exam
            <CheckCircle2 className="ml-2 w-4 h-4" />
          </Button>
        )}
      </div>

      {index < questions.length - 1 && (
        <div className="text-center">
          <button
            onClick={() => setConfirmingSubmit(true)}
            disabled={submitting}
            className="text-slate-600 hover:text-slate-900 underline underline-offset-2 disabled:opacity-50"
          >
            Finish and submit early
          </button>
        </div>
      )}

      {confirmingSubmit && (
        <Card variant="elevated" className="border-l-4 border-l-amber-500">
          <CardContent standalone className="space-y-4">
            <div>
              <h2 className="font-semibold text-slate-900 mb-1">
                Submit this exam?
              </h2>
              <p className="text-slate-700">
                {unanswered > 0
                  ? `${unanswered} of ${questions.length} question${unanswered === 1 ? " is" : "s are"} still unanswered. Unanswered questions are marked wrong.`
                  : `All ${questions.length} questions are answered.`}{" "}
                You cannot reopen the paper after submitting.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Button onClick={finish} disabled={submitting}>
                {submitting && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
                {submitting ? "Submitting…" : "Yes, submit"}
              </Button>
              <Button
                variant="outline"
                onClick={() => setConfirmingSubmit(false)}
                disabled={submitting}
              >
                Keep working
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
