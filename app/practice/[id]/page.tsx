"use client";

import { useState, use } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import Input from "@/components/ui/input";
import { mockQuestions } from "@/lib/mock-data";
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
} from "lucide-react";

type AnswerState = "unanswered" | "correct" | "incorrect";

export default function PracticeQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const router = useRouter();

  const question = mockQuestions.find((q) => q.id === resolvedParams.id);
  const currentIndex = mockQuestions.findIndex((q) => q.id === resolvedParams.id);
  const nextQuestion = mockQuestions[currentIndex + 1];
  const prevQuestion = mockQuestions[currentIndex - 1];

  const [selectedAnswerId, setSelectedAnswerId] = useState<string | null>(null);
  const [answerState, setAnswerState] = useState<AnswerState>("unanswered");
  const [showHint, setShowHint] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("");
  const [aiResponses, setAiResponses] = useState<Array<{ question: string; answer: string }>>([]);

  if (!question) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-slate-900">Question not found</h1>
          <Button onClick={() => router.push("/practice")} className="mt-4">
            Back to Practice
          </Button>
        </div>
      </DashboardLayout>
    );
  }

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
  };

  const handleNextQuestion = () => {
    if (nextQuestion) {
      router.push(`/practice/${nextQuestion.id}`);
    } else {
      router.push("/practice");
    }
  };

  const handlePrevQuestion = () => {
    if (prevQuestion) {
      router.push(`/practice/${prevQuestion.id}`);
    }
  };

  const handleAskAI = () => {
    if (!aiQuestion.trim()) return;

    const mockResponse = `Good question — this comes up a lot in ${question.subject}. ${
      aiQuestion.toLowerCase().includes("why")
        ? "The reasoning traces back to the principle in the explanation above."
        : "Here is the breakdown, step by step."
    } On the board exam this concept is usually tested as a straight application, so anchor on the formula or provision rather than memorizing the specific numbers. Want me to walk through a similar item?`;

    setAiResponses([...aiResponses, { question: aiQuestion, answer: mockResponse }]);
    setAiQuestion("");
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
              Question {currentIndex + 1} of {mockQuestions.length}
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
                      {prevQuestion && (
                        <Button variant="outline" onClick={handlePrevQuestion}>
                          <ArrowLeft className="w-4 h-4 mr-2" />
                          Previous
                        </Button>
                      )}
                      <Button onClick={handleNextQuestion} className="flex-1">
                        {nextQuestion ? "Next Question" : "Finish Session"}
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
                  <div className="prose prose-sm max-w-none">
                    <p className="text-slate-700 mb-4">{question.explanation}</p>
                    {question.detailedExplanation && (
                      <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                        <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                          {question.detailedExplanation}
                        </p>
                      </div>
                    )}
                  </div>
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
                            <p className="text-sm text-slate-700">
                              {response.answer}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex space-x-2">
                    <Input
                      placeholder="Ask a follow-up question..."
                      value={aiQuestion}
                      onChange={(e) => setAiQuestion(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleAskAI()}
                    />
                    <Button onClick={handleAskAI} disabled={!aiQuestion.trim()}>
                      <Send className="w-4 h-4" />
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
