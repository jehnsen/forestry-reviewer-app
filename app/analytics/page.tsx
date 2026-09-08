import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Badge from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Calendar } from "lucide-react";

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Analytics</h1>
          <p className="text-slate-600">
            Track your progress across the six board subjects and find where to focus.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          <Card variant="elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">
                7-Day Average
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-end justify-between">
                <div>
                  <div className="text-3xl font-bold text-slate-900">78%</div>
                  <div className="flex items-center space-x-1 mt-1">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span className="text-sm text-emerald-600">+5%</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">
                Questions This Week
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">87</div>
              <p className="text-sm text-slate-500 mt-1">Target: 100</p>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">
                Study Time
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-slate-900">12.5h</div>
              <p className="text-sm text-slate-500 mt-1">This week</p>
            </CardContent>
          </Card>
        </div>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Board Subject Performance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {[
                { subject: "Social Forestry & Forest Policy", accuracy: 85, trend: "up" },
                { subject: "Silviculture & Forest Ecology", accuracy: 82, trend: "up" },
                { subject: "Wood Science & Forest Products", accuracy: 79, trend: "neutral" },
                { subject: "Forest Resources Management", accuracy: 76, trend: "up" },
                { subject: "Forest Engineering & Surveying", accuracy: 71, trend: "neutral" },
                { subject: "Forest Biometrics & Mensuration", accuracy: 66, trend: "down" },
              ].map((item) => (
                <div key={item.subject}>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      <span className="font-medium text-slate-900">{item.subject}</span>
                      {item.trend === "up" && (
                        <TrendingUp className="w-4 h-4 text-emerald-600" />
                      )}
                      {item.trend === "down" && (
                        <TrendingDown className="w-4 h-4 text-rose-600" />
                      )}
                    </div>
                    <span className="text-sm font-semibold text-slate-700">
                      {item.accuracy}%
                    </span>
                  </div>
                  <div className="w-full bg-slate-200 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full ${
                        item.accuracy >= 80
                          ? "bg-emerald-600"
                          : item.accuracy >= 70
                          ? "bg-amber-500"
                          : "bg-rose-500"
                      }`}
                      style={{ width: `${item.accuracy}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card variant="elevated">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Calendar className="w-5 h-5 mr-2 text-green-600" />
              Study Streak
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <div className="text-5xl font-bold text-green-700 mb-2">7</div>
              <p className="text-slate-600">Days in a row</p>
              <Badge variant="success" className="mt-4">Keep it up!</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
