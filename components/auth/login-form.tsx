"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { getBrowserClient } from "@/lib/supabase/client";
import { AlertCircle, MailCheck, TreePine } from "lucide-react";

type Mode = "sign-in" | "sign-up";

/** Supabase's own default minimum. Stated up front rather than after a failure. */
const MIN_PASSWORD_LENGTH = 6;

/**
 * Only same-origin paths are followed after login. An absolute URL here would
 * turn ?next= into an open redirect.
 */
function safeNext(raw: string | null) {
  if (!raw || !raw.startsWith("/") || raw.startsWith("//")) return "/dashboard";
  return raw;
}

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const next = safeNext(searchParams.get("next"));

  const [mode, setMode] = useState<Mode>("sign-in");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmationSent, setConfirmationSent] = useState(false);

  const switchMode = (to: Mode) => {
    setMode(to);
    setError(null);
    setPassword("");
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);

    if (mode === "sign-up" && password.length < MIN_PASSWORD_LENGTH) {
      setError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
      return;
    }

    setSubmitting(true);

    let supabase;
    try {
      supabase = getBrowserClient();
    } catch (configError) {
      setError(
        configError instanceof Error
          ? configError.message
          : "Supabase is not configured."
      );
      setSubmitting(false);
      return;
    }

    if (mode === "sign-in") {
      const { error: signInError } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      setSubmitting(false);

      if (signInError) {
        setError(signInError.message);
        return;
      }
    } else {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email: email.trim(),
        password,
        options: {
          // Read by the on_auth_user_created trigger, which seeds profiles.full_name.
          data: { full_name: fullName.trim() || null },
        },
      });

      setSubmitting(false);

      if (signUpError) {
        setError(signUpError.message);
        return;
      }

      // No session means the project requires email confirmation first.
      if (!data.session) {
        setConfirmationSent(true);
        return;
      }
    }

    // refresh() so Server Components re-read the now-present auth cookie.
    router.replace(next);
    router.refresh();
  };

  if (confirmationSent) {
    return (
      <div className="text-center space-y-4">
        <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center mx-auto">
          <MailCheck className="w-7 h-7 text-emerald-700" />
        </div>
        <h1 className="text-2xl font-bold text-slate-900">Check your inbox</h1>
        <p className="text-slate-600">
          We sent a confirmation link to{" "}
          <span className="font-medium text-slate-900">{email}</span>. Open it to
          activate your account, then sign in.
        </p>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => {
            setConfirmationSent(false);
            switchMode("sign-in");
          }}
        >
          Back to sign in
        </Button>
      </div>
    );
  }

  const isSignUp = mode === "sign-up";

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <Link href="/" className="inline-flex items-center space-x-2">
          <TreePine className="w-8 h-8 text-green-700" />
          <span className="text-xl font-bold text-slate-900">ForestGuro</span>
        </Link>
        <h1 className="text-2xl font-bold text-slate-900">
          {isSignUp ? "Create your account" : "Sign in to your account"}
        </h1>
        <p className="text-slate-600">
          {isSignUp
            ? "Your progress and weak subjects are saved to your account."
            : "Pick up your review where you left off."}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {isSignUp && (
          <div>
            <label
              htmlFor="full-name"
              className="block text-sm font-medium text-slate-700 mb-2"
            >
              Full Name
            </label>
            <Input
              id="full-name"
              autoComplete="name"
              placeholder="Juan dela Cruz"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
          </div>
        )}

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Email
          </label>
          <Input
            id="email"
            type="email"
            required
            autoComplete="email"
            placeholder="you@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Password
          </label>
          <Input
            id="password"
            type="password"
            required
            autoComplete={isSignUp ? "new-password" : "current-password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {isSignUp && (
            <p className="text-sm text-slate-500 mt-1">
              At least {MIN_PASSWORD_LENGTH} characters.
            </p>
          )}
        </div>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3"
          >
            <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-rose-700">{error}</p>
          </div>
        )}

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting
            ? isSignUp
              ? "Creating account…"
              : "Signing in…"
            : isSignUp
              ? "Create account"
              : "Sign in"}
        </Button>
      </form>

      <p className="text-center text-slate-600">
        {isSignUp ? "Already have an account?" : "New to ForestGuro?"}{" "}
        <button
          type="button"
          onClick={() => switchMode(isSignUp ? "sign-in" : "sign-up")}
          className="font-medium text-green-700 hover:text-green-800 underline underline-offset-2"
        >
          {isSignUp ? "Sign in" : "Create an account"}
        </button>
      </p>
    </div>
  );
}
