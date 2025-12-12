// src/types.ts
export type QuestionStatus =
  | 'unanswered'
  | 'answered'
  | 'marked'
  | 'answeredAndMarked';

export interface Question {
  id: number;
  section: string;
  topic: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  question_text: string;
  context?: string; 
  options: string[];
  correct_answer: string;
  marks_correct: number;
  marks_negative: number;
  answer: string | null;
  status: QuestionStatus;
  answerIndex: number | null; 
  // NEW FIELD: Time spent on this specific question (in seconds)
  timeSpent: number; 
}