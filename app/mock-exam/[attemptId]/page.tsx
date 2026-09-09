import { notFound, redirect } from "next/navigation";

import DashboardLayout from "@/components/layout/dashboard-layout";
import ExamRunner from "@/components/mock-exam/exam-runner";
import QuestionsError from "@/components/practice/questions-error";
import { QuestionsUnavailableError } from "@/lib/questions";
import {
  fetchAttempt,
  fetchAttemptAnswers,
  fetchExamQuestions,
} from "@/lib/exams";

/** Per-user, time-sensitive: never prerender or cache this. */
export const dynamic = "force-dynamic";

export default async function ExamAttemptPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  const attempt = await fetchAttempt(attemptId);

  // RLS hides other people's attempts, so "not found" covers both a bad id and
  // someone else's paper.
  if (!attempt) notFound();

  // A finished paper is read-only; the results page is the only view of it.
  if (attempt.submittedAt) {
    redirect(`/mock-exam/${attemptId}/results`);
  }

  let questions;
  let initialAnswers;

  try {
    [questions, initialAnswers] = await Promise.all([
      fetchExamQuestions(attempt.questionIds),
      fetchAttemptAnswers(attempt.id),
    ]);
  } catch (error) {
    if (error instanceof QuestionsUnavailableError) {
      return <QuestionsError message={error.message} />;
    }
    throw error;
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <ExamRunner
          attempt={attempt}
          questions={questions}
          initialAnswers={initialAnswers}
        />
      </div>
    </DashboardLayout>
  );
}
