"use client";

import { useEffect, useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Input from "@/components/ui/input";
import { fetchProfile, saveProfile } from "@/lib/profile";
import { AlertCircle, User } from "lucide-react";

type SaveState =
  | { kind: "idle" }
  | { kind: "saving" }
  | { kind: "saved" }
  | { kind: "failed"; reason: string };

export default function ProfileForm() {
  const [loaded, setLoaded] = useState(false);
  const [unavailable, setUnavailable] = useState<string | null>(null);
  const [fullName, setFullName] = useState("");
  const [targetExamDate, setTargetExamDate] = useState("");
  const [email, setEmail] = useState("");
  const [save, setSave] = useState<SaveState>({ kind: "idle" });

  useEffect(() => {
    let active = true;

    fetchProfile().then((result) => {
      if (!active) return;

      if (result.status === "unavailable") {
        setUnavailable(result.reason);
      } else {
        setFullName(result.profile.fullName);
        setTargetExamDate(result.profile.targetExamDate);
        setEmail(result.profile.email);
      }
      setLoaded(true);
    });

    return () => {
      active = false;
    };
  }, []);

  const handleSave = async () => {
    setSave({ kind: "saving" });
    const result = await saveProfile({ fullName, targetExamDate });
    setSave(
      result.status === "saved"
        ? { kind: "saved" }
        : { kind: "failed", reason: result.reason }
    );
  };

  if (!loaded) {
    return (
      <Card variant="elevated">
        <CardContent standalone>
          <p className="text-slate-500">Loading your profile…</p>
        </CardContent>
      </Card>
    );
  }

  if (unavailable) {
    return (
      <Card variant="elevated" className="border-l-4 border-l-amber-500">
        <CardContent standalone>
          <div className="flex items-start gap-3">
            <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-slate-900 mb-1">
                Profile unavailable
              </h3>
              <p className="text-slate-700">{unavailable}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center space-x-2">
          <User className="w-5 h-5 text-slate-700" />
          <CardTitle>Profile Information</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label
            htmlFor="full-name"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Full Name
          </label>
          <Input
            id="full-name"
            value={fullName}
            placeholder="Your name"
            onChange={(event) => {
              setFullName(event.target.value);
              setSave({ kind: "idle" });
            }}
          />
        </div>

        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Email
          </label>
          <Input id="email" type="email" value={email} disabled readOnly />
          <p className="text-sm text-slate-500 mt-1">
            Managed by your sign-in method.
          </p>
        </div>

        <div>
          <label
            htmlFor="target-exam-date"
            className="block text-sm font-medium text-slate-700 mb-2"
          >
            Target Board Exam Date
          </label>
          <Input
            id="target-exam-date"
            type="date"
            value={targetExamDate}
            onChange={(event) => {
              setTargetExamDate(event.target.value);
              setSave({ kind: "idle" });
            }}
          />
        </div>

        <div className="flex items-center gap-3">
          <Button onClick={handleSave} disabled={save.kind === "saving"}>
            {save.kind === "saving" ? "Saving…" : "Save Changes"}
          </Button>
          {save.kind === "saved" && (
            <span className="text-sm text-emerald-700">Saved.</span>
          )}
          {save.kind === "failed" && (
            <span className="text-sm text-rose-600">
              Could not save: {save.reason}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
