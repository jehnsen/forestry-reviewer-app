"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { fetchProfile } from "@/lib/profile";
import { ArrowRight, Sparkles } from "lucide-react";

/** Time-of-day greeting, so the banner doesn't read the same at 7am and 11pm. */
function greetingFor(date: Date) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

/** Just the first name — "Good morning, Juan" rather than the full legal name. */
function firstNameOf(fullName: string) {
  return fullName.trim().split(/\s+/)[0] ?? "";
}

export default function WelcomeBanner({
  totalQuestions,
}: {
  totalQuestions: number;
}) {
  // Resolved on the client so the greeting follows the reader's own clock.
  const [greeting, setGreeting] = useState("Welcome back");
  const [firstName, setFirstName] = useState("");

  useEffect(() => {
    setGreeting(greetingFor(new Date()));

    let active = true;

    fetchProfile().then((result) => {
      if (!active || result.status !== "ready") return;
      setFirstName(firstNameOf(result.profile.fullName));
    });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="relative overflow-hidden rounded-2xl bg-[linear-gradient(135deg,#17694d_0%,#1b7a58_45%,#125340_100%)] p-6 text-white shadow-xl shadow-emerald-950/25 lg:p-8">
      {/* Canopy glow and a faint contour grid, echoing the sidebar's treatment. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 -top-24 h-72 w-72 rounded-full bg-emerald-300/25 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-[0.07] [background-image:radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] [background-size:22px_22px]"
      />

      <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="space-y-3">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-400/15 px-3 py-1 text-xs font-medium text-emerald-50 ring-1 ring-inset ring-emerald-400/25">
            <Sparkles className="h-3.5 w-3.5" />
            Board Reviewer
          </span>

          <h1 className="text-2xl font-bold tracking-tight lg:text-4xl">
            {greeting}
            {firstName && <>, {firstName}</>}
          </h1>

          <p className="max-w-2xl text-emerald-50/85 lg:text-lg">
            <span className="font-semibold text-white">{totalQuestions}</span>{" "}
            board questions across the four board papers. Pick up where you left
            off.
          </p>
        </div>

        <Link href="/practice" className="shrink-0">
          <span className="group inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-6 py-3.5 font-semibold text-emerald-800 shadow-lg shadow-emerald-950/20 transition-all hover:bg-emerald-50 hover:shadow-xl lg:w-auto">
            Continue Reviewing
            <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-0.5" />
          </span>
        </Link>
      </div>
    </section>
  );
}
