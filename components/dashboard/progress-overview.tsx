"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { fetchProgress, type ProgressResult } from "@/lib/progress";
import {
  AlertCircle,
  ArrowRight,
  BookOpen,
  Target,
  TrendingUp,
} from "lucide-react";

/** Colour the bar by how close the subject is to the 80% passing benchmark. */
function barColor(accuracy: number) {
  if (accuracy >= 80) return "bg-emerald-600";
  if (accuracy >= 70) return "bg-amber-500";
  return "bg-rose-500";
}

export default function ProgressOverview({
  totalQuestions,
}: {
  totalQuestions: number;
}) {
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
          <p className="text-slate-500">Loading your progress…</p>
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
                Progress tracking unavailable
              </h3>
              <p className="text-slate-700">{result.reason}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const { progress } = result;

  // A visitor who has not answered anything yet gets an invitation, not zeroes.
  if (progress.questionsAnswered === 0) {
    return (
      <Card variant="elevated" className="border-l-4 border-l-green-700">
        <CardContent standalone>
          <div className="flex items-start gap-3">
            <BookOpen className="w-6 h-6 text-green-700 flex-shrink-0 mt-0.5" />
            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-slate-900 mb-1">
                  No practice yet
                </h3>
                <p className="text-slate-700">
                  Answer your first question and your accuracy by board subject
                  will appear here. There are {totalQuestions} questions waiting.
                </p>
              </div>
              <Link href="/practice">
                <Button>
                  Start Practicing
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card variant="elevated">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">
                Questions Answered
              </CardTitle>
              <BookOpen className="w-5 h-5 text-green-600" />
            </div>
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
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">
                Current Accuracy
              </CardTitle>
              <Target className="w-5 h-5 text-emerald-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-emerald-600">
              {progress.accuracy}%
            </div>
            <p className="text-sm text-slate-500 mt-1">Target: 80%+</p>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">
                Subjects Practiced
              </CardTitle>
              <TrendingUp className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {progress.bySubject.length}
              <span className="text-lg text-slate-400"> / 6</span>
            </div>
            <p className="text-sm text-slate-500 mt-1">Board subjects</p>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium text-slate-600">
                Question Bank
              </CardTitle>
              <Target className="w-5 h-5 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900">
              {totalQuestions}
            </div>
            <p className="text-sm text-slate-500 mt-1">Available to practice</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid lg:grid-cols-3 gap-6 items-start">
        <Card variant="elevated" className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Accuracy by Subject</CardTitle>
              <Badge variant={progress.accuracy >= 80 ? "success" : "info"}>
                {progress.accuracy >= 80 ? "On Track" : "Keep Going"}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {progress.bySubject.map((subject) => (
              <div key={subject.subject}>
                <div className="flex items-center justify-between mb-2 gap-3">
                  <span className="text-sm text-slate-600">
                    {subject.subject}
                  </span>
                  <span className="text-sm font-medium text-slate-700 flex-shrink-0">
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
          </CardContent>
        </Card>

        <Card variant="elevated" className="border-l-4 border-l-amber-500">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-amber-600" />
              <CardTitle>Focus Area</CardTitle>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {progress.weakestSubject ? (
              <div>
                <p className="text-sm text-slate-600 mb-2">Weakest subject:</p>
                <p className="text-lg font-semibold text-slate-900">
                  {progress.weakestSubject}
                </p>
                <Badge variant="warning" className="mt-2">
                  {
                    progress.bySubject.find(
                      (s) => s.subject === progress.weakestSubject
                    )?.accuracy
                  }
                  % accuracy
                </Badge>
              </div>
            ) : (
              <p className="text-slate-600">
                Answer a few more questions in each subject and your weakest area
                will show up here.
              </p>
            )}

            <Link href="/practice">
              <Button variant="outline" className="w-full">
                Practice Now
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
