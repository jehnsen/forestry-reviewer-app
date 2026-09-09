"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { fetchProfile } from "@/lib/profile";
import {
  LayoutDashboard,
  BookOpen,
  FileText,
  BarChart3,
  Settings,
  TreePine,
  Sparkles,
  CalendarClock,
  X,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

const navigation = [
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Practice Mode", href: "/practice", icon: BookOpen },
  { name: "Mock Exam", href: "/mock-exam", icon: FileText },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  { name: "Settings", href: "/settings", icon: Settings },
];

/**
 * Whole days from today to an ISO yyyy-mm-dd date, or null if unset/unparseable.
 * Both ends are floored to local midnight so the count doesn't drift with the
 * time of day.
 */
function daysUntil(isoDate: string): number | null {
  if (!isoDate) return null;

  const target = new Date(`${isoDate}T00:00:00`);
  if (Number.isNaN(target.getTime())) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}

/** The footer countdown copy, which changes tense once the date passes. */
function examCountdownLabel(days: number | null) {
  if (days === null) return { title: "Set your exam date", detail: "Track your countdown" };
  if (days > 1) return { title: `${days} days to go`, detail: "Until your board exam" };
  if (days === 1) return { title: "Tomorrow", detail: "Your board exam is here" };
  if (days === 0) return { title: "Today", detail: "Good luck, future forester" };
  return { title: "Exam day passed", detail: "Update your date in Settings" };
}

export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [examDays, setExamDays] = useState<number | null>(null);

  useEffect(() => {
    let active = true;

    fetchProfile().then((result) => {
      if (!active || result.status !== "ready") return;
      setExamDays(daysUntil(result.profile.targetExamDate));
    });

    return () => {
      active = false;
    };
  }, []);

  const countdown = examCountdownLabel(examDays);

  return (
    <>
      {/* Backdrop. Blurred rather than a flat black so the page reads underneath. */}
      <div
        onClick={onClose}
        aria-hidden="true"
        className={cn(
          "fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-sm transition-opacity duration-300 lg:hidden",
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        )}
      />

      <aside
        className={cn(
          "fixed top-0 left-0 z-50 flex h-full w-72 flex-col overflow-hidden",
          "bg-[linear-gradient(180deg,#175c45_0%,#12503c_55%,#0d3d2e_100%)]",
          "text-white shadow-2xl shadow-emerald-950/50 transition-transform duration-300 ease-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Ambient canopy glow, and a hairline that separates the rail from content. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -right-16 h-64 w-64 rounded-full bg-emerald-300/20 blur-3xl"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-emerald-400/25 to-transparent"
        />

        <div className="relative flex items-center justify-between px-6 py-6">
          <Link href="/dashboard" className="group flex items-center gap-3">
            <span className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-500/15 ring-1 ring-emerald-400/30 transition-colors group-hover:bg-emerald-500/25">
              <TreePine className="h-5 w-5 text-emerald-300" />
            </span>
            <span className="flex flex-col leading-tight">
              <span className="text-base font-semibold tracking-tight">ForestGuro</span>
              <span className="text-[11px] font-medium uppercase tracking-[0.14em] text-emerald-200/90">
                Board Reviewer
              </span>
            </span>
          </Link>

          <button
            onClick={onClose}
            aria-label="Close navigation"
            className="rounded-lg p-2 text-emerald-50/80 transition-colors hover:bg-white/10 hover:text-white lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="relative flex-1 space-y-1 px-3 py-2">
          {navigation.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");

            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={onClose}
                aria-current={isActive ? "page" : undefined}
                className={cn(
                  "group relative flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200",
                  isActive
                    ? "bg-white/10 text-white shadow-sm ring-1 ring-inset ring-white/15"
                    : "text-emerald-50/80 hover:bg-white/10 hover:text-white"
                )}
              >
                {/* Active marker rail, pinned to the left edge of the item. */}
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-emerald-400 transition-all duration-200",
                    isActive ? "opacity-100" : "scale-y-0 opacity-0"
                  )}
                />
                <item.icon
                  className={cn(
                    "h-[18px] w-[18px] shrink-0 transition-colors",
                    isActive
                      ? "text-emerald-300"
                      : "text-emerald-100/70 group-hover:text-white"
                  )}
                />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        <div className="relative space-y-3 p-4">
          {/* Exam countdown, read from the signed-in user's target date. */}
          <div className="rounded-2xl bg-white/5 p-4 ring-1 ring-inset ring-white/10">
            <div className="flex items-center gap-2 text-emerald-100/90">
              <CalendarClock className="h-4 w-4" />
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em]">
                Board Exam
              </span>
            </div>
            <p className="mt-2 text-lg font-semibold tracking-tight text-white">
              {countdown.title}
            </p>
            <p className="text-xs text-emerald-50/70">{countdown.detail}</p>
          </div>

          <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-emerald-500/5 p-3 ring-1 ring-inset ring-emerald-400/20">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-400/20">
              <Sparkles className="h-4 w-4 text-emerald-300" />
            </span>
            <div className="min-w-0">
              <p className="text-sm font-medium text-white">Board Pass</p>
              <p className="truncate text-xs text-emerald-50/70">Full access unlocked</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
