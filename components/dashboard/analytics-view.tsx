"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { fetchProgress, type ProgressResult } from "@/lib/progress";
import { AlertCircle, BarChart3 } from "lucide-react";

/** The PRC passing benchmark this app targets. */
const PASSING_THRESHOLD = 80;

function barColor(accuracy: number) {
  if (accuracy >= PASSING_THRESHOLD) return "bg-emerald-600";
  if (accuracy >= 70) return "bg-amber-500";
  return "bg-rose-500";
}

export default function AnalyticsView() {
  const [result, setResult] = useState<ProgressResult | null>(null);

  useEffect(() => {
    let active = true;
    fetchProgress().then((r) => {
      if (active) setResult(r);
    });
    return () => {
      active = false;
    };
  }, []);

  if (!result) {
    return (
      <Card variant="elevated">
        <CardContent standalone>
          <p className="text-slate-500">Loading your analytics…</p>
        </CardContent>
      </Card>
    );
  }

  if (result.status === "unavailable") {
    return (
      <Card variant="elevated" className="border-l-4 border-l-amber-500">
        <CardContent standalone>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">
                Analytics unavailable
              </h3>
              <p className="text-slate-700">{result.reason}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { progress } = result;

  if (progress.questionsAnswered === 0) {
    return (
      <Card variant="elevated" className="border-l-4 border-l-green-700">
        <CardContent standalone>
          <div className="flex items-start gap-3">
            <BarChart3 className="w-6 h-6 text-green-700 flex-shrink-0 mt-0.5" />
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  Nothing to analyse yet
                </h3>
                <p className="text-slate-700">
                  Your accuracy, subject breakdown, and weakest areas appear here
                  once you start answering questions.
                </p>
              </div>
              <Link href="/practice">
                <Button>Start Practicing</Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const atOrAbove = progress.bySubject.filter(
    (s) => s.accuracy >= PASSING_THRESHOLD
  ).length;

  return (
    <div className="space-y-8">
      <div className="grid md:grid-cols-3 gap-6">
        <Card variant="elevated">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              Overall Accuracy
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {progress.accuracy}%
            </div>
            <p className="text-sm text-slate-500 mt-1">
              Passing target: {PASSING_THRESHOLD}%
            </p>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              Questions Answered
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {progress.questionsAnswered}
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {progress.correctAnswers} correct
            </p>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium text-slate-600">
              Subjects at Target
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {atOrAbove}
              <span className="text-lg text-slate-400">
                {" "}
                / {progress.bySubject.length}
              </span>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              At {PASSING_THRESHOLD}% or above
            </p>
          </CardContent>
        </Card>
      </div>

      <Card variant="elevated">
        <CardHeader>
          <CardTitle>Board Subject Performance</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {progress.bySubject.map((subject) => (
              <div key={subject.subject}>
                <div className="flex items-center justify-between mb-2 gap-3">
                  <span className="font-medium text-slate-900">
                    {subject.subject}
                  </span>
                  <span className="text-sm font-semibold text-slate-700 flex-shrink-0">
                    {subject.accuracy}%{" "}
                    <span className="text-slate-400 font-normal">
                      ({subject.correct}/{subject.answered})
                    </span>
                  </span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${barColor(subject.accuracy)}`}
                    style={{ width: `${subject.accuracy}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          {progress.bySubject.length < 6 && (
            <p className="mt-6 text-sm text-slate-500">
              Only subjects you have practiced are shown. Answer questions in the
              remaining {6 - progress.bySubject.length} subject
              {6 - progress.bySubject.length === 1 ? "" : "s"} to complete this
              picture.
            </p>
          )}
        </CardContent>
      </Card>

      {progress.weakestSubject && (
        <Card variant="elevated" className="border-l-4 border-l-amber-500">
          <CardHeader>
            <CardTitle>Where to Focus</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-slate-700">
              Your lowest accuracy is in{" "}
              <span className="font-semibold text-slate-900">
                {progress.weakestSubject}
              </span>
              . Concentrating there will move your overall score the most.
            </p>
            <Badge variant="warning">
              {
                progress.bySubject.find(
                  (s) => s.subject === progress.weakestSubject
                )?.accuracy
              }
              % accuracy
            </Badge>
            <div>
              <Link href="/practice">
                <Button variant="outline">Practice This Subject</Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
