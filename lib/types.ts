/**
 * The four papers of the PRC Forester Licensure Examination, as listed on the
 * Professional Regulatory Board programme. These are display names read from
 * public.subjects, not a database enum — the taxonomy lives in a table now.
 */
export type ForestrySubject =
  | "Forest Ecosystem"
  | "Forest Governance and Social Forestry"
  | "Forest Utilization Engineering"
  | "Forest Production Management";

export interface Question {
  id: string;
  subject: ForestrySubject;
  /** Slug of the topic within the paper, e.g. "dendrology". */
  topicId?: string;
  difficulty: "Easy" | "Medium" | "Hard";
  question: string;
  options: {
    id: string;
    text: string;
  }[];
  correctAnswerId: string;
  /** Absent until the first user answers and OpenAI generates one. */
  explanation?: string;
  detailedExplanation?: string;
  tips?: string;
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
