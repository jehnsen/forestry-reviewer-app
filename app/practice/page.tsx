import DashboardLayout from "@/components/layout/dashboard-layout";
import QuestionsError from "@/components/practice/questions-error";
import SubjectPicker, {
  type SubjectSummary,
} from "@/components/practice/subject-picker";
import { QuestionsUnavailableError, fetchQuestions } from "@/lib/questions";

/**
 * Read fresh on every request: questions live in Supabase and can change
 * without a redeploy, so this page must not be statically prerendered.
 */
export const dynamic = "force-dynamic";

export default async function PracticeModePage() {
  let questions;

  try {
    questions = await fetchQuestions();
  } catch (error) {
    if (error instanceof QuestionsUnavailableError) {
      return <QuestionsError message={error.message} />;
    }
    throw error;
  }

  // Preserve the order questions were fetched in, so the first id of each
  // subject matches where a session would actually start.
  const summaries = new Map<string, SubjectSummary>();
  for (const question of questions) {
    const existing = summaries.get(question.subject);
    if (existing) {
      existing.questionCount += 1;
    } else {
      summaries.set(question.subject, {
        subject: question.subject,
        questionCount: 1,
        firstQuestionId: question.id,
      });
    }
  }

  return (
    <DashboardLayout>
      <SubjectPicker
        subjects={Array.from(summaries.values())}
        firstQuestionId={questions[0].id}
      />
    </DashboardLayout>
  );
}
