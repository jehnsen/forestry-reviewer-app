"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import Badge from "@/components/ui/badge";
import Button from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { startExam } from "@/lib/exam-actions";
import type { ExamSummary } from "@/lib/exams";
import { formatDuration } from "@/lib/utils";
import {
  AlertCircle,
  Clock,
  FileText,
  Loader2,
  Target,
} from "lucide-react";

export default function ExamCard({
  exam,
  accent,
}: {
  exam: ExamSummary;
  accent: string;
}) {
  const router = useRouter();
  const [starting, setStarting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // The bank cannot fill the full-length paper yet; say so rather than quietly
  // handing out a short exam that looks like the real thing.
  const isShortened = exam.questionCount < exam.targetQuestions;

  const handleStart = async () => {
    setStarting(true);
    setError(null);

    const result = await startExam(exam.id);

    if (result.status === "failed") {
      setError(result.reason);
      setStarting(false);
      return;
    }

    router.push(`/mock-exam/${result.attemptId}`);
  };

  return (
    <Card variant="elevated" className={`border-l-4 ${accent}`}>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-2">
          <CardTitle>{exam.name}</CardTitle>
          <Badge variant={isShortened ? "warning" : "info"}>
            {exam.questionCount} Questions
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2 text-slate-600">
            <Clock className="w-5 h-5" />
            <span className="text-sm">{formatDuration(exam.durationSeconds)}</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-600">
            <FileText className="w-5 h-5" />
            <span className="text-sm">{exam.questionCount} questions</span>
          </div>
          <div className="flex items-center space-x-2 text-slate-600">
            <Target className="w-5 h-5" />
            <span className="text-sm">Passing: {exam.passingPct}%</span>
          </div>
        </div>

        {exam.description && <p className="text-slate-600">{exam.description}</p>}

        {isShortened && (
          <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-3">
            Shortened paper: the bank holds {exam.questionCount} questions for
            these subjects, against a full-length target of{" "}
            {exam.targetQuestions}. It grows automatically as questions are
            added.
          </p>
        )}

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-rose-700">{error}</p>
          </div>
        )}

        <div className="flex flex-wrap gap-3">
          <Button onClick={handleStart} disabled={starting}>
            {starting && <Loader2 className="mr-2 w-4 h-4 animate-spin" />}
            {starting ? "Preparing…" : "Start Mock Exam"}
          </Button>
          <Link href="#past-results">
            <Button variant="outline">View Past Results</Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
