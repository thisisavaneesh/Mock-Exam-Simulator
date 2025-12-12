declare module "react-katex" {
  import * as React from "react";

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


export interface BlockMathProps {
    math: string;
    // other props you might use
    errorColor?: string;
}
  
export interface InlineMathProps {
    math: string;
    // other props you might use
    errorColor?: string;
}

  export class BlockMath extends React.Component<BlockMathProps> {}
  export class InlineMath extends React.Component<InlineMathProps> {}
}