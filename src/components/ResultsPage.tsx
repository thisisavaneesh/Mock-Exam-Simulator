// src/components/ResultsPage.tsx
import React from 'react';
import { Question } from '../types';
// REQUIRED IMPORTS for KaTeX rendering in tables
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

interface Props {
  questions: Question[];
  results: {
    score: number;
    correct: number;
    incorrect: number;
    unattempted: number;
    timeTaken: number; // Received from App
  };
  onReviewQuestion: (question: Question) => void;
}

// Helper to render math (copied from QuestionContent)
const parseText = (text: string) => {
  if (!text) return "";
  const parts = text.split('$');
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <InlineMath key={index} math={part} />;
    }
    // We allow basic HTML rendering here (for DI tables that might be included in answer/option)
    return <span key={index} dangerouslySetInnerHTML={{__html: part}} />;
  });
};


const ResultsPage = ({ questions, results, onReviewQuestion }: Props) => {
  // --- Analytics Calculations ---
  const totalAttempted = results.correct + results.incorrect;
  
  const accuracy = totalAttempted > 0 
    ? ((results.correct / totalAttempted) * 100).toFixed(2) 
    : '0.00';

  const avgTimeSeconds = questions.length > 0 
    ? Math.round(results.timeTaken / questions.length) 
    : 0;

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };
  
  const formatTimeDetail = (secs: number) => {
    if (secs < 60) return `${secs}s`;
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}m ${s}s`;
  };

  // Helper to format the answer text with Option Letters (A, B, C, D)
  const getOptionDisplay = (question: Question) => {
    const correctIndex = question.options.findIndex(opt => opt === question.correct_answer);
    const correctLetter = correctIndex !== -1 ? String.fromCharCode(65 + correctIndex) : '';

    const yourLetter = (question as any).answerIndex !== null 
      ? String.fromCharCode(65 + (question as any).answerIndex) 
      : '';

    // Final Display logic uses raw strings (not rendered components)
    const yourAnswerText = question.answer ? `(${yourLetter}) ${question.answer}` : 'Not Attempted';
    const correctAnswerText = correctLetter ? `(${correctLetter}) ${question.correct_answer}` : question.correct_answer;

    return { yourAnswerText, correctAnswerText };
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-blue-800">Performance Analysis</h1>
      
      {/* Summary Cards (Performance Analysis) */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md text-center border-t-4 border-blue-500">
          <h2 className="text-gray-500 font-bold uppercase text-sm">Total Score</h2>
          <p className="text-4xl font-extrabold text-blue-600 mt-2">{results.score}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center border-t-4 border-green-500">
          <h2 className="text-gray-500 font-bold uppercase text-sm">Accuracy</h2>
          <p className="text-4xl font-extrabold text-green-600 mt-2">{accuracy}%</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center border-t-4 border-purple-500">
          <h2 className="text-gray-500 font-bold uppercase text-sm">Avg Time/Ques</h2>
          <p className="text-3xl font-bold text-purple-600 mt-2">{formatTime(avgTimeSeconds)}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center border-t-4 border-green-400">
          <h2 className="text-gray-500 font-bold uppercase text-sm">Correct</h2>
          <p className="text-4xl font-bold text-gray-800 mt-2">{results.correct}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md text-center border-t-4 border-red-400">
          <h2 className="text-gray-500 font-bold uppercase text-sm">Wrong</h2>
          <p className="text-4xl font-bold text-gray-800 mt-2">{results.incorrect}</p>
        </div>
      </div>

      {/* Detailed Review Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <h2 className="text-2xl font-bold p-6 border-b bg-gray-100">Question Review</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                <th className="py-3 px-6 text-left">Q.No</th>
                <th className="py-3 px-6 text-left">Your Answer</th>
                <th className="py-3 px-6 text-left">Correct Answer</th>
                <th className="py-3 px-6 text-center">Time Spent</th>
                <th className="py-3 px-6 text-center">Result</th>
                <th className="py-3 px-6 text-center">Marks</th>
                <th className="py-3 px-6 text-center">Action</th>
              </tr>
            </thead>
            <tbody className="text-gray-600 text-sm font-light">
              {questions.map((q) => {
                const isCorrect = q.answer === q.correct_answer;
                const isUnattempted = q.answer === null;
                const { yourAnswerText, correctAnswerText } = getOptionDisplay(q);
                
                const timeSpent = (q as any).timeSpent || 0; 

                return (
                  <tr key={q.id} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left whitespace-nowrap font-medium">{q.id}</td>
                    
                    {/* UPDATED: Run raw text through parseText for KaTeX rendering */}
                    <td className={`py-3 px-6 text-left font-bold ${isCorrect ? 'text-green-600' : isUnattempted ? 'text-gray-400' : 'text-red-600'}`}>
                      {parseText(yourAnswerText)} 
                    </td>
                    
                    {/* UPDATED: Run raw text through parseText for KaTeX rendering */}
                    <td className="py-3 px-6 text-left">{parseText(correctAnswerText)}</td>
                    
                    <td className="py-3 px-6 text-center font-mono">
                       {formatTimeDetail(timeSpent)} 
                    </td>
                    
                    <td className="py-3 px-6 text-center">
                      {isUnattempted ? (
                        <span className="bg-gray-200 text-gray-600 py-1 px-3 rounded-full text-xs">Skipped</span>
                      ) : isCorrect ? (
                        <span className="bg-green-200 text-green-600 py-1 px-3 rounded-full text-xs">Correct</span>
                      ) : (
                        <span className="bg-red-200 text-red-600 py-1 px-3 rounded-full text-xs">Wrong</span>
                      )}
                    </td>
                    <td className="py-3 px-6 text-center font-bold">
                      {isUnattempted ? 0 : isCorrect ? `+${q.marks_correct}` : q.marks_negative}
                    </td>
                    
                    {/* ACTION COLUMN (Review Button) */}
                    <td className="py-3 px-6 text-center">
                      <button 
                        onClick={() => onReviewQuestion(q)}
                        className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-1 px-3 rounded text-xs transition duration-150"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
