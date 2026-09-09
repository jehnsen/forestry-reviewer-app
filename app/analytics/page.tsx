import DashboardLayout from "@/components/layout/dashboard-layout";
import AnalyticsView from "@/components/dashboard/analytics-view";

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Analytics</h1>
          <p className="text-slate-600">
            Track your progress across the four board papers and find where to
            focus.
          </p>
        </div>

        <AnalyticsView />
      </div>
    </DashboardLayout>
  );
}
