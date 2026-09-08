import Link from "next/link";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { mockUserProgress } from "@/lib/mock-data";
import {
  TrendingUp,
  Target,
  Calendar,
  AlertCircle,
  ArrowRight,
  BookOpen,
  Award,
} from "lucide-react";

export default function DashboardPage() {
  const progress = mockUserProgress;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="bg-gradient-to-r from-green-700 to-green-800 rounded-lg p-6 lg:p-8 text-white shadow-lg">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-2">
              <h1 className="text-2xl lg:text-3xl font-bold">
                Good morning, Mateo! 🌲
              </h1>
              <p className="text-green-100 text-lg">
                You have {progress.daysUntilExam} days until the Forester Licensure Exam. Keep going!
              </p>
            </div>
            <div className="mt-4 lg:mt-0">
              <Link href="/practice">
                <Button variant="secondary" size="lg" className="w-full lg:w-auto">
                  Continue Reviewing
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>

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
              <p className="text-sm text-slate-500 mt-1">
                Target: 80%+
              </p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Days Until Exam
                </CardTitle>
                <Calendar className="w-5 h-5 text-amber-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                {progress.daysUntilExam}
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Board exam: Nov 8, 2026
              </p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">
                  Study Streak
                </CardTitle>
                <Award className="w-5 h-5 text-green-600" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">
                7 days
              </div>
              <p className="text-sm text-slate-500 mt-1">
                Keep it going!
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card variant="elevated" className="lg:col-span-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Your Progress</CardTitle>
                <Badge variant="info">On Track</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Overall Progress</span>
                  <span className="text-sm font-semibold text-green-700">76%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-3">
                  <div
                    className="bg-green-700 h-3 rounded-full transition-all"
                    style={{ width: "76%" }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-slate-100">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Forest Biometrics &amp; Mensuration</span>
                    <span className="text-sm font-medium text-slate-700">68%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-amber-500 h-2 rounded-full"
                      style={{ width: "68%" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Silviculture &amp; Forest Ecology</span>
                    <span className="text-sm font-medium text-slate-700">82%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{ width: "82%" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Wood Science &amp; Forest Products</span>
                    <span className="text-sm font-medium text-slate-700">79%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-green-600 h-2 rounded-full"
                      style={{ width: "79%" }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Social Forestry &amp; Policy</span>
                    <span className="text-sm font-medium text-slate-700">85%</span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className="bg-emerald-600 h-2 rounded-full"
                      style={{ width: "85%" }}
                    />
                  </div>
                </div>
              </div>
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
              <div>
                <p className="text-sm text-slate-600 mb-2">Weakest Subject:</p>
                <p className="text-lg font-semibold text-slate-900">
                  {progress.weakestSubject}
                </p>
                <Badge variant="warning" className="mt-2">68% Accuracy</Badge>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <p className="text-sm text-slate-600 mb-3">Recommended Actions:</p>
                <ul className="space-y-2 text-sm text-slate-700">
                  <li className="flex items-start">
                    <TrendingUp className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Practice 20 more mensuration items</span>
                  </li>
                  <li className="flex items-start">
                    <TrendingUp className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Review volume and basal area formulas</span>
                  </li>
                  <li className="flex items-start">
                    <TrendingUp className="w-4 h-4 mr-2 text-green-600 flex-shrink-0 mt-0.5" />
                    <span>Complete mock board exam #2</span>
                  </li>
                </ul>
              </div>

              <Link href="/practice?subject=mensuration">
                <Button variant="outline" className="w-full mt-4">
                  Practice This Subject
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card variant="elevated" className="hover:shadow-lg transition-shadow cursor-pointer group">
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
                  Answer board-style questions with instant AI feedback and worked solutions.
                </p>
                <Button variant="ghost" className="group-hover:bg-slate-100">
                  Start Practicing
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </CardContent>
            </Link>
          </Card>

          <Card variant="elevated" className="hover:shadow-lg transition-shadow cursor-pointer group">
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
                  Take a full-length mock board exam under PRC-style timed conditions.
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
