"use client";

import { useEffect, useState } from "react";

import { AlertCircle, Loader2 } from "lucide-react";

interface ExplanationPanelProps {
  questionId: string;
  /** Present when the row already carries one; absent means not yet generated. */
  explanation?: string;
  detailedExplanation?: string;
  tips?: string;
  /**
   * Whether to request generation when none exists. Practice always does;
   * exam review does it only for questions the candidate got wrong, so a
   * 30-question paper does not trigger 30 API calls at once.
   */
  autoGenerate?: boolean;
}

interface Generated {
  explanation: string;
  detailedExplanation: string | null;
  tips: string | null;
}

export default function ExplanationPanel({
  questionId,
  explanation,
  detailedExplanation,
  tips,
  autoGenerate = true,
}: ExplanationPanelProps) {
  const [generated, setGenerated] = useState<Generated | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasStored = Boolean(explanation);

  const request = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/questions/${questionId}/explanation`, {
        method: "POST",
      });
      const body = await response.json();

      if (!response.ok) {
        setError(body.error ?? "Could not load an explanation.");
      } else {
        setGenerated(body as Generated);
      }
    } catch {
      setError("Could not reach the explanation service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (hasStored || generated || loading || error || !autoGenerate) return;
    void request();
    // Runs once per question: the guard above stops it repeating.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionId, hasStored, autoGenerate]);

  const body = hasStored
    ? {
        explanation: explanation as string,
        detailedExplanation: detailedExplanation ?? null,
        tips: tips ?? null,
      }
    : generated;

  if (!body) {
    if (loading) {
      return (
        <div className="flex items-center gap-2 text-slate-600">
          <Loader2 className="w-4 h-4 animate-spin" />
          <span>Writing the explanation for this question…</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex items-start gap-2">
          <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-slate-700">{error}</p>
            <button
              onClick={request}
              className="text-green-700 hover:text-green-800 underline underline-offset-2 mt-1"
            >
              Try again
            </button>
          </div>
        </div>
      );
    }

    return (
      <button
        onClick={request}
        className="text-green-700 hover:text-green-800 underline underline-offset-2"
      >
        Show the explanation for this question
      </button>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-slate-700">{body.explanation}</p>

      {body.detailedExplanation && (
        <p className="text-slate-700 whitespace-pre-line">
          {body.detailedExplanation}
        </p>
      )}

      {body.tips && (
        <p className="text-sm text-slate-600 italic">Tip: {body.tips}</p>
      )}
    </div>
  );
}
