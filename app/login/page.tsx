import { Suspense } from "react";

import LoginForm from "@/components/auth/login-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Sign in — ForestGuro",
};

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <Card variant="elevated" className="w-full max-w-md">
        <CardContent standalone>
          {/* useSearchParams in the form opts this route out of static rendering. */}
          <Suspense
            fallback={<p className="text-slate-500 text-center">Loading…</p>}
          >
            <LoginForm />
          </Suspense>
        </CardContent>
      </Card>
    </div>
  );
}
