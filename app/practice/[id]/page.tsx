import Link from "next/link";

import DashboardLayout from "@/components/layout/dashboard-layout";
import QuestionView from "@/components/practice/question-view";
import QuestionsError from "@/components/practice/questions-error";
import Button from "@/components/ui/button";
import {
  QuestionsUnavailableError,
  fetchQuestionById,
  fetchQuestionOrder,
} from "@/lib/questions";

/**
 * Questions are read on the server with the service role key, so the browser
 * never receives database credentials and the strict RLS policy on
 * public.questions can stay in place without requiring a login.
 */
/**
 * Read fresh on every request: questions live in Supabase and can change
 * without a redeploy, so this page must not be statically prerendered.
 */
export const dynamic = "force-dynamic";

export default async function PracticeQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  let question;
  let order: string[];

  try {
    [question, order] = await Promise.all([
      fetchQuestionById(id),
      fetchQuestionOrder(),
    ]);
  } catch (error) {
    if (error instanceof QuestionsUnavailableError) {
      return <QuestionsError message={error.message} />;
    }
    throw error;
  }

  if (!question) {
    return (
      <DashboardLayout>
        <div className="text-center py-20">
          <h1 className="text-2xl font-bold text-slate-900">Question not found</h1>
          <p className="mt-2 text-slate-600">
            No active question matches the id &ldquo;{id}&rdquo;.
          </p>
          <Link href="/practice">
            <Button className="mt-4">Back to Practice</Button>
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const index = order.indexOf(question.id);

  return (
    <QuestionView
      question={question}
      position={index + 1}
      totalQuestions={order.length}
      previousQuestionId={index > 0 ? order[index - 1] : null}
      nextQuestionId={index < order.length - 1 ? order[index + 1] : null}
    />
  );
}
