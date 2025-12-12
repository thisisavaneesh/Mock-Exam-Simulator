import React from 'react';
import { Question } from '../types';
// KaTeX Imports for Review Modal
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

interface Props {
  question: Question;
  onClose: () => void;
}

// Helper function to format time for display (same as in ResultsPage)
const formatTimeDetail = (secs: number) => {
    if (secs < 60) return `${secs}s`;
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
};

// Helper to format the answer text with Option Letters (A, B, C, D)
const getOptionLetter = (index: number): string => {
    return String.fromCharCode(65 + index); // 65 is ASCII for 'A'
};

// Component to render math (copied from QuestionContent)
const parseText = (text: string) => {
  if (!text) return "";
  const parts = text.split('$');
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      // FIX: Use InlineMath here for KaTeX rendering
      return <InlineMath key={index} math={part} />;
    }
    // FIX: Use span with dangerouslySetInnerHTML to allow HTML/line breaks in context/questions
    return <span key={index} dangerouslySetInnerHTML={{__html: part}} />;
  });
};


const ReviewModal = ({ question, onClose }: Props) => {
  if (!question) return null;
  
  // Accessing timeSpent (requires 'as any' for TypeScript safety)
  const timeSpent = (question as any).timeSpent || 0; 
  const isCorrect = question.answer === question.correct_answer;
  const yourAnswerIndex = (question as any).answerIndex;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl w-full max-w-4xl max-h-full overflow-y-auto transform transition-all duration-300">
        
        {/* Modal Header */}
        <div className="p-4 border-b flex justify-between items-center bg-gray-900 text-white sticky top-0">
          <h2 className="text-xl font-bold">
            Review Question {question.id} 
            <span className="ml-3 text-sm font-normal text-gray-400">
              ({question.section} | Difficulty: {question.difficulty})
            </span>
          </h2>
          <button 
            onClick={onClose}
            className="text-white hover:text-red-400 text-3xl font-light leading-none"
          >
            &times;
          </button>
        </div>

        {/* Modal Content - SPLIT SCREEN for DI/RC */}
        <div className={`p-6 flex ${question.context ? 'flex-row' : 'flex-col'}`}>
          
          {/* LEFT PANEL: Context (Only if context exists) */}
          {question.context && (
            <div className="w-1/2 p-4 overflow-y-auto border-r border-gray-200 bg-gray-50">
              <h3 className="font-bold text-sm text-gray-500 mb-2 uppercase">Data / Passage</h3>
              <div className="prose max-w-none text-gray-800">
                 <div dangerouslySetInnerHTML={{ __html: question.context }} className="prose max-w-none" />
              </div>
            </div>
          )}

          {/* RIGHT PANEL: Question and Options */}
          <div className={`${question.context ? 'w-1/2' : 'w-full'} p-4`}>
            <div className="flex justify-between items-center mb-4 border-b pb-3">
              <h3 className="text-lg font-bold">Question {question.id}</h3>
              {/* FIX: Display STORED TIME */}
              <div className="text-sm font-mono text-gray-700">
                 Time on Question: <span className="font-bold text-red-600">{formatTimeDetail(timeSpent)}</span>
              </div>
            </div>

            {/* Question Text */}
            <div className="text-lg mb-6 leading-relaxed">
              {parseText(question.question_text)}
            </div>

            {/* Options (Disabled) */}
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <div 
                  key={index} 
                  className={`flex items-center p-3 rounded-lg border 
                              ${index === yourAnswerIndex ? 'bg-blue-100 border-blue-500' : // Your selected answer is blue
                                 question.correct_answer === option ? 'bg-green-100 border-green-500' : // Correct answer is green
                                 'bg-white border-gray-200'}
                             `}
                >
                  <div className="relative flex items-center justify-center w-5 h-5 mr-3">
                    <input
                      type="radio"
                      name={`review-q-${question.id}`}
                      // Check if this option was the one selected OR if it is the correct answer (for visual feedback)
                      checked={index === yourAnswerIndex || question.correct_answer === option}
                      disabled={true} 
                      className="peer appearance-none w-5 h-5"
                    />
                    {question.correct_answer === option && (
                        <span className="absolute text-green-700 font-extrabold text-lg">✓</span>
                    )}
                  </div>
                  <span className="text-gray-900 font-medium">
                    ({getOptionLetter(index)}) {parseText(option)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analysis Footer */}
        <div className="p-4 border-t bg-gray-100 sticky bottom-0">
          <h3 className="font-bold text-lg mb-2">Result:</h3>
          <div className="flex gap-4">
            <span className={`px-4 py-2 rounded-full font-bold text-sm ${
                question.answer === null 
                  ? 'bg-gray-200 text-gray-700' 
                  : isCorrect
                  ? 'bg-green-100 text-green-700' 
                  : 'bg-red-100 text-red-700'
            }`}>
              {question.answer === null ? 'SKIPPED' : (isCorrect ? 'CORRECT' : 'INCORRECT')}
            </span>
            
            <span className="px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 font-bold text-sm">
              Marks: {question.answer === null ? '0' : (isCorrect ? `+${question.marks_correct}` : question.marks_negative)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReviewModal;