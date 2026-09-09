"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { fetchProfile } from "@/lib/profile";
import { getBrowserClient } from "@/lib/supabase/client";
import { LogOut } from "lucide-react";

/** Initials from the name if there is one, otherwise from the email. */
function initialsFor(fullName: string, email: string) {
  const words = fullName.trim().split(/\s+/).filter(Boolean);

  if (words.length >= 2) {
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  }
  if (words.length === 1) {
    return words[0].slice(0, 2).toUpperCase();
  }
  return email.slice(0, 2).toUpperCase() || "??";
}

export default function UserMenu() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  useEffect(() => {
    let active = true;

    fetchProfile().then((result) => {
      if (!active || result.status !== "ready") return;
      setFullName(result.profile.fullName);
      setEmail(result.profile.email);
    });

    return () => {
      active = false;
    };
  }, []);

  const handleSignOut = async () => {
    setSigningOut(true);

    try {
      await getBrowserClient().auth.signOut();
    } catch {
      // Nothing useful to do: clearing the session below is what matters, and
      // middleware will bounce the next request to /login regardless.
    }

    router.replace("/login");
    router.refresh();
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="text-right hidden sm:block">
        <p className="text-sm font-medium text-slate-900">
          {fullName || email || "Your account"}
        </p>
        {fullName && email && (
          <p className="text-xs text-slate-500">{email}</p>
        )}
      </div>

      <div className="w-10 h-10 rounded-full bg-green-700 flex items-center justify-center text-white font-semibold">
        {initialsFor(fullName, email)}
      </div>

      <button
        onClick={handleSignOut}
        disabled={signingOut}
        title="Sign out"
        aria-label="Sign out"
        className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors disabled:opacity-50"
      >
        <LogOut className="w-5 h-5" />
      </button>
    </div>
  );
}
