import { Suspense } from "react";

import AuthBackground from "@/components/auth/auth-background";
import LoginForm from "@/components/auth/login-form";
import { Card, CardContent } from "@/components/ui/card";

export const metadata = {
  title: "Sign in — ForestGuro",
};

export default function LoginPage() {
  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
      <AuthBackground />

      <Card
        variant="elevated"
        className="relative w-full max-w-md border-white/60 bg-white/95 shadow-2xl shadow-emerald-950/40 backdrop-blur-xl"
      >
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
