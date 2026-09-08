import Link from "next/link";

import DashboardLayout from "@/components/layout/dashboard-layout";
import Button from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { AlertTriangle } from "lucide-react";

/**
 * Shown when questions cannot be loaded from Supabase. States the real reason
 * rather than silently falling back to sample data, so a misconfigured project
 * is obvious instead of looking like a working app with fewer questions.
 */
export default function QuestionsError({ message }: { message: string }) {
  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <Card variant="elevated" className="border-l-4 border-l-amber-500">
          <CardContent standalone>
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
              <div className="space-y-3">
                <h1 className="text-lg font-semibold text-slate-900">
                  Questions could not be loaded
                </h1>
                <p className="text-slate-700">{message}</p>
                <div className="rounded-lg bg-slate-50 border border-slate-200 p-4 text-sm text-slate-600">
                  <p className="font-medium text-slate-700 mb-1">Common causes</p>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      Supabase environment variables are missing from{" "}
                      <code className="text-slate-800">.env.local</code>
                    </li>
                    <li>
                      <code className="text-slate-800">supabase/schema.sql</code> or{" "}
                      <code className="text-slate-800">
                        supabase/seed_questions.sql
                      </code>{" "}
                      has not been run
                    </li>
                    <li>The Supabase project is paused or unreachable</li>
                  </ul>
                </div>
                <Link href="/dashboard">
                  <Button variant="outline">Back to Dashboard</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
