import Link from "next/link";

import DashboardLayout from "@/components/layout/dashboard-layout";
import ExamCard from "@/components/mock-exam/exam-card";
import QuestionsError from "@/components/practice/questions-error";
import Badge from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { QuestionsUnavailableError } from "@/lib/questions";
import { fetchExamCatalog, fetchRecentAttempts, type ExamAttempt } from "@/lib/exams";
import { ArrowRight, History } from "lucide-react";

/** Reads the live question bank and this user's attempts. */
export const dynamic = "force-dynamic";

/** Accent stripes, cycled so consecutive cards stay visually distinct. */
const ACCENTS = ["border-l-green-700", "border-l-emerald-600"];

type BadgeVariant = "default" | "success" | "warning" | "error" | "info";

interface AttemptStatus {
  label: string;
  variant: BadgeVariant;
  detail: string;
  href: string;
  action: string;
}

function attemptStatus(attempt: ExamAttempt): AttemptStatus {
  if (attempt.submittedAt) {
    const pct = attempt.total
      ? Math.round(((attempt.score ?? 0) / attempt.total) * 100)
      : 0;
    const passed = pct >= attempt.passingPct;

    return {
      label: passed ? "Passed" : "Did not pass",
      variant: passed ? "success" : "error",
      detail: `${attempt.score ?? 0}/${attempt.total} · ${pct}%`,
      href: `/mock-exam/${attempt.id}/results`,
      action: "View results",
    };
  }

  // An attempt whose clock ran out while the tab was closed never reached the
  // runner's auto-submit, so it is still open and needs scoring.
  const expired = new Date(attempt.expiresAt).getTime() <= Date.now();

  return {
    label: expired ? "Time expired" : "In progress",
    variant: expired ? "warning" : "info",
    detail: expired ? "Not submitted" : "Resume where you left off",
    href: `/mock-exam/${attempt.id}`,
    action: expired ? "Submit and score" : "Resume",
  };
}

export default async function MockExamPage() {
  let exams;
  let attempts: ExamAttempt[];

  try {
    [exams, attempts] = await Promise.all([
      fetchExamCatalog(),
      fetchRecentAttempts(),
    ]);
  } catch (error) {
    if (error instanceof QuestionsUnavailableError) {
      return <QuestionsError message={error.message} />;
    }
    throw error;
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Mock Board Exams
          </h1>
          <p className="text-slate-600">
            Test your readiness with full-length mock licensure exams under
            PRC-style timed conditions.
          </p>
        </div>

        {exams.length === 0 ? (
          <Card variant="elevated">
            <CardContent standalone>
              <p className="text-slate-600">
                No mock exams are configured yet. Run
                supabase/migrations/0003_mock_exams.sql against your project.
              </p>
            </CardContent>
          </Card>
        ) : (
          exams.map((exam, i) => (
            <ExamCard
              key={exam.id}
              exam={exam}
              accent={ACCENTS[i % ACCENTS.length]}
            />
          ))
        )}

        <section id="past-results" className="scroll-mt-24">
          <Card variant="elevated">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <History className="w-5 h-5 text-slate-700" />
                <CardTitle>Past Results</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {attempts.length === 0 ? (
                <p className="text-slate-600">
                  You have not taken a mock exam yet. Your scores will appear
                  here once you finish one.
                </p>
              ) : (
                attempts.map((attempt) => {
                  const status = attemptStatus(attempt);

                  return (
                    <Link
                      key={attempt.id}
                      href={status.href}
                      className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-slate-200 p-4 hover:bg-slate-50 transition-colors"
                    >
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-medium text-slate-900">
                            {attempt.examName}
                          </p>
                          <Badge variant={status.variant}>{status.label}</Badge>
                        </div>
                        <p className="text-sm text-slate-600 mt-1">
                          {new Date(attempt.startedAt).toLocaleString()} ·{" "}
                          {status.detail}
                        </p>
                      </div>
                      <span className="inline-flex items-center text-sm font-medium text-green-700">
                        {status.action}
                        <ArrowRight className="ml-1 w-4 h-4" />
                      </span>
                    </Link>
                  );
                })
              )}
            </CardContent>
          </Card>
        </section>
      </div>
    </DashboardLayout>
  );
}
