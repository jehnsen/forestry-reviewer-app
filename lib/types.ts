export type ForestrySubject =
  | "Silviculture & Forest Ecology"
  | "Forest Resources Management"
  | "Forest Engineering & Surveying"
  | "Wood Science & Forest Products"
  | "Social Forestry & Forest Policy"
  | "Forest Biometrics & Mensuration";

export interface Question {
  id: string;
  /** Matching row id in supabase/seed_questions.sql. */
  seedId?: string;
  subject: ForestrySubject;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswerId: string;
  explanation: string;
  detailedExplanation?: string;
  tips?: string;
}

export interface UserProgress {
  questionsAnswered: number;
  correctAnswers: number;
  accuracy: number;
  weakestSubject: string;
  daysUntilExam: number;
  lastSessionQuestionId?: string;
}

export interface UserAnswer {
  questionId: string;
  selectedAnswerId: string;
  isCorrect: boolean;
  timestamp: Date;
}

export interface StudySession {
  id: string;
  startTime: Date;
  endTime?: Date;
  questionsCompleted: number;
  correctAnswers: number;
}
