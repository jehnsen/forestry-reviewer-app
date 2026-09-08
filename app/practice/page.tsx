"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import DashboardLayout from "@/components/layout/dashboard-layout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Button from "@/components/ui/button";
import Badge from "@/components/ui/badge";
import { mockQuestions } from "@/lib/mock-data";
import { ArrowRight, BookOpen, Target } from "lucide-react";

export default function PracticeModePage() {
  const router = useRouter();
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null);

  const subjects = Array.from(new Set(mockQuestions.map(q => q.subject)));

  const handleStartPractice = () => {
    const firstQuestion = mockQuestions[0];
    router.push(`/practice/${firstQuestion.id}`);
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Practice Mode</h1>
          <p className="text-slate-600">
            Select a board subject to focus on, or practice all six together.
          </p>
        </div>

        <Card variant="elevated" className="bg-gradient-to-r from-green-50 to-green-100 border-green-200">
          <CardContent standalone>
            <div className="flex items-start space-x-4">
              <div className="w-12 h-12 bg-green-700 rounded-lg flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-slate-900 mb-2">
                  Continue Your Last Session
                </h3>
                <p className="text-slate-700 mb-4">
                  You were practicing Social Forestry &amp; Forest Policy. Pick up where
                  you left off.
                </p>
                <Button onClick={handleStartPractice}>
                  Continue Practice
                  <ArrowRight className="ml-2 w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <div>
          <h2 className="text-xl font-semibold text-slate-900 mb-4">
            Or Choose a Board Subject
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            {subjects.map((subject) => {
              const questionsCount = mockQuestions.filter(q => q.subject === subject).length;
              const isSelected = selectedSubject === subject;

              return (
                <Card
                  key={subject}
                  variant={isSelected ? "elevated" : "default"}
                  className={`cursor-pointer transition-all hover:shadow-lg ${
                    isSelected ? "border-2 border-green-700" : ""
                  }`}
                  onClick={() => setSelectedSubject(subject)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{subject}</CardTitle>
                      <Badge variant="info">{questionsCount} questions</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="text-sm text-slate-600">
                        Your accuracy: {Math.floor(Math.random() * 20) + 70}%
                      </div>
                      {isSelected && (
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            const firstQuestionOfSubject = mockQuestions.find(q => q.subject === subject);
                            if (firstQuestionOfSubject) {
                              router.push(`/practice/${firstQuestionOfSubject.id}`);
                            }
                          }}
                        >
                          Start
                          <ArrowRight className="ml-1 w-3 h-3" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <Card variant="elevated" className="border-l-4 border-l-emerald-500">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Target className="w-5 h-5 text-emerald-600" />
              <CardTitle>Practice All Six Subjects</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-slate-600 mb-4">
              Get a mix of questions from all six board subjects to simulate the actual licensure exam.
            </p>
            <Button variant="outline" onClick={handleStartPractice}>
              Start Mixed Practice
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
