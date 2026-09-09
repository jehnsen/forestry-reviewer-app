import { notFound, redirect } from "next/navigation";

import DashboardLayout from "@/components/layout/dashboard-layout";
import ExamResults from "@/components/mock-exam/exam-results";
import QuestionsError from "@/components/practice/questions-error";
import { QuestionsUnavailableError } from "@/lib/questions";
import { fetchAttempt, fetchAttemptReview } from "@/lib/exams";

/** Per-user data behind RLS: never prerender or cache this. */
export const dynamic = "force-dynamic";

export default async function ExamResultsPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  const attempt = await fetchAttempt(attemptId);

  if (!attempt) notFound();

  // The answer key is on this page, so an unfinished paper must not reach it —
  // send them back to the runner instead.
  if (!attempt.submittedAt) {
    redirect(`/mock-exam/${attemptId}`);
  }

  let items;

  try {
    items = await fetchAttemptReview(attempt);
  } catch (error) {
    if (error instanceof QuestionsUnavailableError) {
      return <QuestionsError message={error.message} />;
    }
    throw error;
  }

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto">
        <ExamResults attempt={attempt} items={items} />
      </div>
    </DashboardLayout>
  );
}
