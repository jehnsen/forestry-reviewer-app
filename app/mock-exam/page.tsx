import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { Clock, FileText, Target } from "lucide-react";

export default function MockExamPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Mock Board Exams</h1>
          <p className="text-slate-600">
            Test your readiness with full-length mock licensure exams under PRC-style timed conditions.
          </p>
        </div>

        <Card variant="elevated" className="border-l-4 border-l-green-700">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Full Board Simulation — Day 1</CardTitle>
              <Badge variant="info">170 Questions</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2 text-slate-600">
                <Clock className="w-5 h-5" />
                <span className="text-sm">3 hours 10 minutes</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <FileText className="w-5 h-5" />
                <span className="text-sm">170 questions</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <Target className="w-5 h-5" />
                <span className="text-sm">Passing: 80%</span>
              </div>
            </div>
            <p className="text-slate-600">
              Covers Silviculture &amp; Forest Ecology, Forest Resources Management, and Forest Biometrics &amp; Mensuration.
            </p>
            <div className="flex space-x-3">
              <Button>Start Mock Exam</Button>
              <Button variant="outline">View Past Results</Button>
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated" className="border-l-4 border-l-emerald-600">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Full Board Simulation — Day 2</CardTitle>
              <Badge variant="success">165 Questions</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2 text-slate-600">
                <Clock className="w-5 h-5" />
                <span className="text-sm">3 hours 5 minutes</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <FileText className="w-5 h-5" />
                <span className="text-sm">165 questions</span>
              </div>
              <div className="flex items-center space-x-2 text-slate-600">
                <Target className="w-5 h-5" />
                <span className="text-sm">Passing: 80%</span>
              </div>
            </div>
            <p className="text-slate-600">
              Covers Forest Engineering &amp; Surveying, Wood Science &amp; Forest Products, and Social Forestry &amp; Forest Policy.
            </p>
            <div className="flex space-x-3">
              <Button>Start Mock Exam</Button>
              <Button variant="outline">View Past Results</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
