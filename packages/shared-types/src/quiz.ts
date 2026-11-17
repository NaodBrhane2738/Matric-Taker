export interface QuizQuestion {
  id: string;
  chapterId: string;
  questionText: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
  difficulty: 1 | 2 | 3;
}

export interface QuizAttempt {
  id: string;
  userId: string;
  chapterId: string;
  totalQuestions: number;
  correctAnswers: number;
  scorePercentage: number;
  timeSpentSeconds: number;
  passed: boolean; // e.g. >= 75%
  createdAt: string;
}
