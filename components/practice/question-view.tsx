"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import Input from "@/components/ui/input";
import ExplanationPanel from "@/components/practice/explanation-panel";
import { recordAnswer } from "@/lib/answers";
import type { Question } from "@/lib/types";
import { cn } from "@/lib/utils";
import {
  CheckCircle,
  XCircle,
  Flag,
  ArrowRight,
  ArrowLeft,
  Lightbulb,
  Send,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";

type AnswerState = "unanswered" | "correct" | "incorrect";

export interface QuestionViewProps {
  question: Question;
  /** 1-based position of this question within the full set. */
  position: number;
  totalQuestions: number;
  previousQuestionId: string | null;
  nextQuestionId: string | null;
}

export default function QuestionView({
  question,
  position,
  totalQuestions,
  previousQuestionId,
  nextQuestionId,
}: QuestionViewProps) {
  const router = useRouter();

  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("unanswered");
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  /** answer is null while that turn is still in flight. */
  const [aiResponses, setAiResponses] = useState<
    Array<{ question: string; answer: string | null }>
  >([]);
  const [aiPending, setAiPending] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);
  const [saveNotice, setSaveNotice] = useState<string | null>(null);

  const handleAnswerSelect = (optionId: string) => {
    if (answerState === "unanswered") {
      setSelectedAnswerId(optionId);
    }
  };

  const handleSubmitAnswer = () => {
    if (!selectedAnswerId) return;

    const isCorrect = selectedAnswerId === question.correctAnswerId;
    setAnswerState(isCorrect ? "correct" : "incorrect");
    setShowExplanation(true);

    // Fire-and-forget: a failed write must never block the study session.
    void recordAnswer({
      questionId: question.id,
      selectedAnswerId,
    }).then((result) => {
      setSaveNotice(result.status === "skipped" ? result.reason : null);
    });
  };

  const handleNextQuestion = () => {
    if (nextQuestionId) {
      router.push(`/practice/${nextQuestionId}`);
    } else {
      router.push("/practice");
    }
  };

  const handlePrevQuestion = () => {
    if (previousQuestionId) {
      router.push(`/practice/${previousQuestionId}`);
    }
  };

  const handleAskAI = async () => {
    const asked = aiQuestion.trim();
    if (!asked || aiPending) return;

    // Sent before the reply lands so the transcript reads in order; the answer
    // is filled in on this same turn once it arrives.
    const turnIndex = aiResponses.length;
    setAiResponses((prev) => [...prev, { question: asked, answer: null }]);
    setAiQuestion("");
    setAiPending(true);
    setAiError(null);

    // Prior turns only — the question just pushed has no answer yet.
    const history = aiResponses.flatMap((turn) =>
      turn.answer
        ? [
            { role: "user" as const, content: turn.question },
            { role: "assistant" as const, content: turn.answer },
          ]
        : []
    );

    try {
      const response = await fetch(`/api/questions/${question.id}/tutor`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: asked, history }),
      });
      const body = await response.json();

      if (!response.ok) {
        setAiError(body.error ?? "The tutor could not be reached.");
        // Drop the orphaned turn so a failed ask does not sit there unanswered.
        setAiResponses((prev) => prev.filter((_, i) => i !== turnIndex));
        setAiQuestion(asked);
      } else {
        setAiResponses((prev) =>
          prev.map((turn, i) => (i === turnIndex ? { ...turn, answer: body.answer } : turn))
        );
      }
    } catch {
      setAiError("Could not reach the tutor.");
      setAiResponses((prev) => prev.filter((_, i) => i !== turnIndex));
      setAiQuestion(asked);
    } finally {
      setAiPending(false);
    }
  };

  const difficultyColors = {
    Easy: "success",
    Medium: "warning",
    Hard: "error",
  } as const;

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-y-3 gap-x-4">
          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => router.push("/practice")}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div className="text-sm text-slate-600 whitespace-nowrap">
              Question {position} of {totalQuestions}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={difficultyColors[question.difficulty]}>
              {question.difficulty}
            </Badge>
            <Badge variant="info">{question.subject}</Badge>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 items-start">
          <div className="space-y-6">
            <Card variant="elevated">
              <CardContent standalone>
                <h2 className="text-xl font-semibold text-slate-900 mb-6 leading-snug">
                  {question.question}
                </h2>

                <div className="space-y-3">
                  {question.options.map((option) => {
                    const isSelected = selectedAnswerId === option.id;
                    const isCorrect = option.id === question.correctAnswerId;
                    const showResult = answerState !== "unanswered";

                    let borderColor = "border-slate-300";
                    let bgColor = "bg-white hover:bg-slate-50";
                    let Icon = null;

                    if (showResult && isCorrect) {
                      borderColor = "border-emerald-500 bg-emerald-50";
                      bgColor = "bg-emerald-50";
                      Icon = <CheckCircle className="w-6 h-6 text-emerald-600" />;
                    } else if (showResult && isSelected && !isCorrect) {
                      borderColor = "border-rose-500 bg-rose-50";
                      bgColor = "bg-rose-50";
                      Icon = <XCircle className="w-6 h-6 text-rose-600" />;
                    } else if (isSelected) {
                      borderColor = "border-green-700 bg-green-50";
                      bgColor = "bg-green-50 ring-2 ring-green-200";
                    }

                    return (
                      <button
                        key={option.id}
                        onClick={() => handleAnswerSelect(option.id)}
                        disabled={answerState !== "unanswered"}
                        className={cn(
                          "w-full text-left p-4 rounded-lg border-2 transition-all",
                          borderColor,
                          bgColor,
                          answerState === "unanswered" && "cursor-pointer",
                          answerState !== "unanswered" && "cursor-default"
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3 flex-1">
                            <div
                              className={cn(
                                "w-8 h-8 rounded-full flex items-center justify-center font-semibold flex-shrink-0",
                                isSelected && answerState === "unanswered" && "bg-green-700 text-white",
                                !isSelected && answerState === "unanswered" && "bg-slate-200 text-slate-700",
                                showResult && isCorrect && "bg-emerald-600 text-white",
                                showResult && isSelected && !isCorrect && "bg-rose-600 text-white",
                                showResult && !isSelected && !isCorrect && "bg-slate-200 text-slate-700"
                              )}
                            >
                              {option.id.toUpperCase()}
                            </div>
                            <span className="text-slate-900 font-medium leading-relaxed">
                              {option.text}
                            </span>
                          </div>
                          {Icon && <span className="ml-3 flex-shrink-0">{Icon}</span>}
                        </div>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center space-x-3 mt-6 pt-6 border-t border-slate-200">
                  {answerState === "unanswered" ? (
                    <>
                      <Button
                        onClick={handleSubmitAnswer}
                        disabled={!selectedAnswerId}
                        className="flex-1"
                      >
                        Submit Answer
                      </Button>
                      <Button variant="outline" size="sm">
                        <Flag className="w-4 h-4 mr-2" />
                        Flag
                      </Button>
                    </>
                  ) : (
                    <>
                      {previousQuestionId && (
                        <Button variant="outline" onClick={handlePrevQuestion}>
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Previous
                        </Button>
                      )}
                      <Button onClick={handleNextQuestion} className="flex-1">
                        {nextQuestionId ? "Next Question" : "Finish Session"}
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            {answerState === "unanswered" && !showHint && (
              <Card variant="elevated" className="bg-green-50 border-green-200">
                <CardContent standalone>
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="w-6 h-6 text-green-700 flex-shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <h3 className="font-semibold text-slate-900 mb-2">
                        Need a hint?
                      </h3>
                      <p className="text-sm text-slate-700 mb-3">
                        Get a nudge toward the right formula or provision without
                        revealing the answer.
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setShowHint(true)}
                      >
                        Show Hint
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {answerState === "unanswered" && showHint && question.tips && (
              <Card variant="elevated" className="bg-amber-50 border-amber-200">
                <CardContent standalone>
                  <div className="flex items-start space-x-3">
                    <Lightbulb className="w-6 h-6 text-amber-700 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="font-semibold text-slate-900 mb-2">Hint</h3>
                      <p className="text-slate-700">{question.tips}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {saveNotice && answerState !== "unanswered" && (
              <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                <span className="font-medium">Progress not saved.</span>{" "}
                {saveNotice}
              </div>
            )}

            {answerState === "correct" && (
              <Card variant="elevated" className="bg-emerald-50 border-emerald-200">
                <CardContent standalone>
                  <div className="flex items-start space-x-3">
                    <CheckCircle className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-semibold text-emerald-900 mb-1">
                        Correct! Well done!
                      </h3>
                      <p className="text-emerald-800">
                        That is one more board item you can rely on.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {answerState === "incorrect" && (
              <Card variant="elevated" className="bg-rose-50 border-rose-200">
                <CardContent standalone>
                  <div className="flex items-start space-x-3">
                    <XCircle className="w-6 h-6 text-rose-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h3 className="text-lg font-semibold text-rose-900 mb-1">
                        Not quite right
                      </h3>
                      <p className="text-rose-800">
                        Worth reviewing now rather than on board exam day. Here is why.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {showExplanation && (
              <Card variant="elevated">
                <CardContent standalone>
                  <h3 className="font-semibold text-slate-900 mb-3 flex items-center">
                    <Sparkles className="w-5 h-5 mr-2 text-green-600" />
                    Explanation
                  </h3>
                  <ExplanationPanel
                    questionId={question.id}
                    explanation={question.explanation}
                    detailedExplanation={question.detailedExplanation}
                    tips={question.tips}
                  />
                </CardContent>
              </Card>
            )}

            {showExplanation && (
              <Card variant="elevated" className="border-2 border-green-200">
                <CardContent standalone>
                  <div className="flex items-center space-x-2 mb-4">
                    <Sparkles className="w-5 h-5 text-green-700" />
                    <h3 className="font-semibold text-slate-900">
                      Ask Your Forestry Tutor
                    </h3>
                  </div>

                  {aiResponses.length > 0 && (
                    <div className="space-y-4 mb-4 max-h-64 overflow-y-auto">
                      {aiResponses.map((response, index) => (
                        <div key={index} className="space-y-2">
                          <div className="bg-green-100 rounded-lg p-3 ml-8">
                            <p className="text-sm text-slate-800 font-medium">
                              {response.question}
                            </p>
                          </div>
                          <div className="bg-slate-100 rounded-lg p-3 mr-8">
                            {response.answer === null ? (
                              <p className="text-sm text-slate-500 flex items-center gap-2">
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Thinking…
                              </p>
                            ) : (
                              <p className="text-sm text-slate-700 whitespace-pre-line">
                                {response.answer}
                              </p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {aiError && (
                    <div
                      role="alert"
                      className="mb-3 flex items-start gap-2 rounded-lg border border-rose-200 bg-rose-50 p-3"
                    >
                      <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-rose-700">{aiError}</p>
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Input
                      placeholder="Ask a follow-up question..."
                      value={aiQuestion}
                      onChange={(e) => setAiQuestion(e.target.value)}
                      disabled={aiPending}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") void handleAskAI();
                      }}
                    />
                    <Button
                      onClick={() => void handleAskAI()}
                      disabled={!aiQuestion.trim() || aiPending}
                    >
                      {aiPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Send className="w-4 h-4" />
                      )}
                    </Button>
                  </div>

                  {aiResponses.length === 0 && (
                    <div className="mt-3 space-y-1">
                      <p className="text-xs text-slate-500">Try asking:</p>
                      <div className="flex flex-wrap gap-2">
                        {[
                          "Why is this the answer?",
                          "Give me a similar board item.",
                          "How do I remember this formula?",
                        ].map((suggestion) => (
                          <button
                            key={suggestion}
                            onClick={() => setAiQuestion(suggestion)}
                            className="text-xs bg-slate-100 hover:bg-slate-200 px-3 py-1 rounded-full text-slate-700 transition-colors"
                          >
                            {suggestion}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
