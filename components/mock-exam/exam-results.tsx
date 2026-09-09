import Link from "next/link";

import ExplanationPanel from "@/components/practice/explanation-panel";
import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ExamAttempt, ExamReviewItem } from "@/lib/exams";
import type { ForestrySubject } from "@/lib/types";
import { cn, formatDuration } from "@/lib/utils";
import { ArrowLeft, Check, Minus, X } from "lucide-react";

interface SubjectBreakdown {
  subject: ForestrySubject;
  correct: number;
  total: number;
}

/** Same 80% benchmark the bars on the dashboard use. */
function barColor(accuracy: number) {
  if (accuracy >= 80) return "bg-emerald-600";
  if (accuracy >= 70) return "bg-amber-500";
  return "bg-rose-500";
}

function breakdownFor(items: ExamReviewItem[]): SubjectBreakdown[] {
  const bySubject = new Map<ForestrySubject, SubjectBreakdown>();

  for (const item of items) {
    const subject = item.question.subject;
    const entry = bySubject.get(subject) ?? { subject, correct: 0, total: 0 };

    entry.total += 1;
    if (item.isCorrect) entry.correct += 1;
    bySubject.set(subject, entry);
  }

  return [...bySubject.values()].sort((a, b) =>
    a.subject.localeCompare(b.subject)
  );
}

export default function ExamResults({
  attempt,
  items,
}: {
  attempt: ExamAttempt;
  items: ExamReviewItem[];
}) {
  const score = attempt.score ?? 0;
  const pct = attempt.total ? Math.round((score / attempt.total) * 100) : 0;
  const passed = pct >= attempt.passingPct;
  const breakdown = breakdownFor(items);

  const elapsedSeconds = attempt.submittedAt
    ? Math.round(
        (new Date(attempt.submittedAt).getTime() -
          new Date(attempt.startedAt).getTime()) /
          1000
      )
    : 0;

  return (
    <div className="space-y-8">
      <div>
        <Link
          href="/mock-exam"
          className="inline-flex items-center text-slate-600 hover:text-slate-900 mb-4"
        >
          <ArrowLeft className="mr-1 w-4 h-4" />
          Back to mock exams
        </Link>
        <h1 className="text-3xl font-bold text-slate-900">
          {attempt.examName} — Results
        </h1>
      </div>

      <Card
        variant="elevated"
        className={cn(
          "border-l-4",
          passed ? "border-l-emerald-600" : "border-l-rose-500"
        )}
      >
        <CardContent standalone className="space-y-4">
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="text-5xl font-bold text-slate-900">{pct}%</span>
            <span className="text-lg text-slate-600">
              {score} of {attempt.total} correct
            </span>
            <Badge variant={passed ? "success" : "error"}>
              {passed ? "Passed" : "Did not pass"}
            </Badge>
          </div>

          <p className="text-slate-600">
            Passing mark is {attempt.passingPct}%. Finished in{" "}
            {formatDuration(elapsedSeconds)}.
          </p>
        </CardContent>
      </Card>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>By subject</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {breakdown.map((entry) => {
            const subjectPct = entry.total
              ? Math.round((entry.correct / entry.total) * 100)
              : 0;

            return (
              <div key={entry.subject}>
                <div className="flex justify-between mb-1">
                  <span className="text-sm font-medium text-slate-900">
                    {entry.subject}
                  </span>
                  <span className="text-sm text-slate-600">
                    {subjectPct}%{" "}
                    <span className="text-slate-400">
                      ({entry.correct}/{entry.total})
                    </span>
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${barColor(subjectPct)}`}
                    style={{ width: `${subjectPct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-slate-900">Review</h2>

        {items.map((item, index) => {
          const { question } = item;
          const skipped = item.selectedAnswerId === null;

          return (
            <Card key={question.id} variant="elevated">
              <CardContent standalone className="space-y-4">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-medium text-slate-500">
                    Question {index + 1}
                  </span>
                  <Badge variant="info">{question.subject}</Badge>
                  <Badge
                    variant={
                      item.isCorrect ? "success" : skipped ? "warning" : "error"
                    }
                  >
                    {item.isCorrect
                      ? "Correct"
                      : skipped
                        ? "Not answered"
                        : "Incorrect"}
                  </Badge>
                </div>

                <p className="text-slate-900 leading-relaxed">
                  {question.question}
                </p>

                <div className="space-y-2">
                  {question.options.map((option) => {
                    const isCorrect = option.id === question.correctAnswerId;
                    const isChosen = option.id === item.selectedAnswerId;

                    return (
                      <div
                        key={option.id}
                        className={cn(
                          "flex items-start gap-3 rounded-lg border-2 p-3",
                          isCorrect && "border-emerald-600 bg-emerald-50",
                          !isCorrect && isChosen && "border-rose-500 bg-rose-50",
                          !isCorrect && !isChosen && "border-slate-200"
                        )}
                      >
                        <span
                          className={cn(
                            "w-7 h-7 rounded-full flex items-center justify-center text-sm font-semibold flex-shrink-0",
                            isCorrect && "bg-emerald-600 text-white",
                            !isCorrect && isChosen && "bg-rose-600 text-white",
                            !isCorrect && !isChosen && "bg-slate-200 text-slate-700"
                          )}
                        >
                          {option.id.toUpperCase()}
                        </span>
                        <span className="text-slate-900 pt-0.5 flex-1">
                          {option.text}
                        </span>
                        {isCorrect && (
                          <Check className="w-5 h-5 text-emerald-700 flex-shrink-0 mt-1" />
                        )}
                        {!isCorrect && isChosen && (
                          <X className="w-5 h-5 text-rose-600 flex-shrink-0 mt-1" />
                        )}
                      </div>
                    );
                  })}
                </div>

                {skipped && (
                  <p className="flex items-center gap-2 text-sm text-amber-700">
                    <Minus className="w-4 h-4" />
                    You left this one blank.
                  </p>
                )}

                <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 space-y-2">
                  <p className="text-sm font-semibold text-slate-900">
                    Explanation
                  </p>
                  {/* Generated on demand for the ones they missed. A correct
                      answer shows its explanation only if the bank already has
                      one, so reviewing a 30-question paper cannot fire 30
                      OpenAI calls at once. */}
                  <ExplanationPanel
                    questionId={question.id}
                    explanation={question.explanation}
                    detailedExplanation={question.detailedExplanation}
                    tips={question.tips}
                    autoGenerate={!item.isCorrect}
                  />
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-3">
        <Link href="/mock-exam">
          <Button>Take another mock exam</Button>
        </Link>
        <Link href="/practice">
          <Button variant="outline">Back to practice</Button>
        </Link>
      </div>
    </div>
  );
}
