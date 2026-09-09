import Link from "next/link";

import DashboardLayout from "@/components/layout/dashboard-layout";
import ProgressOverview from "@/components/dashboard/progress-overview";
import WelcomeBanner from "@/components/dashboard/welcome-banner";
import QuestionsError from "@/components/practice/questions-error";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button";
import { QuestionsUnavailableError, fetchQuestionOrder } from "@/lib/questions";
import { ArrowRight, BookOpen, Target } from "lucide-react";

/** Reflects the live question bank, so it must not be prerendered. */
export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  let totalQuestions: number;

  try {
    totalQuestions = (await fetchQuestionOrder()).length;
  } catch (error) {
    if (error instanceof QuestionsUnavailableError) {
      return <QuestionsError message={error.message} />;
    }
    throw error;
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <WelcomeBanner totalQuestions={totalQuestions} />

        <ProgressOverview totalQuestions={totalQuestions} />

        <div className="grid md:grid-cols-2 gap-6">
          <Card
            variant="elevated"
            className="hover:shadow-lg transition-shadow group"
          >
            <Link href="/practice">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-200 transition-colors">
                    <BookOpen className="w-6 h-6 text-green-700" />
                  </div>
                  <div>
                    <CardTitle>Practice Mode</CardTitle>
                    <p className="text-sm text-slate-600 mt-1">
                      Continue where you left off
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  Answer board-style questions with instant feedback and worked
                  solutions.
                </p>
                <Button variant="ghost" className="group-hover:bg-slate-100">
                  Start Practicing
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card
            variant="elevated"
            className="hover:shadow-lg transition-shadow group"
          >
            <Link href="/mock-exam">
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center group-hover:bg-emerald-200 transition-colors">
                    <Target className="w-6 h-6 text-emerald-700" />
                  </div>
                  <div>
                    <CardTitle>Mock Board Exam</CardTitle>
                    <p className="text-sm text-slate-600 mt-1">
                      Test your board readiness
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600 mb-4">
                  Take a full-length mock board exam under PRC-style timed
                  conditions.
                </p>
                <Button variant="ghost" className="group-hover:bg-slate-100">
                  Take Mock Board Exam
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Link>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
