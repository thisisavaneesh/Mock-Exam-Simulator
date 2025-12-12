// src/components/QuestionContent.tsx

import { Question } from '../types';
import 'katex/dist/katex.min.css';
import { InlineMath } from 'react-katex';

interface Props {
  question: Question;
  onAnswerSelect: (answer: string, index: number) => void;
  // REMOVE: We are removing this prop as running timer should not be passed to Review Modal.
  // questionTimeElapsed: number; 
}

const parseText = (text: string) => {
  if (!text) return "";
  const parts = text.split('$');
  return parts.map((part, index) => {
    if (index % 2 === 1) {
      return <InlineMath key={index} math={part} />;
    }
    return part;
  });
};

const getOptionLetter = (index: number): string => {
    return String.fromCharCode(65 + index); 
};

// Removed questionTimeElapsed from component definition
const QuestionContent = ({ question, onAnswerSelect }: Props) => { 
  
  // RENDER OPTION 1: DI/RC Layout (Split Screen)
  if (question.context) {
    return (
      <main className="flex flex-1 h-full overflow-hidden">
        {/* LEFT PANEL: The Data/Passage */}
        <div className="w-1/2 p-6 overflow-y-auto border-r-2 border-gray-300 bg-gray-50">
          <h3 className="font-bold text-gray-500 mb-2 uppercase text-sm">Data / Passage</h3>
          <div className="prose max-w-none text-gray-800">
             <div 
                dangerouslySetInnerHTML={{ __html: question.context }} 
                className="prose max-w-none"
             />
          </div>
        </div>

        {/* RIGHT PANEL: The Question */}
        <div className="w-1/2 p-6 overflow-y-auto">
           {/* REMOVED: Running timer display from here, it should only be in the main header */}
          <h2 className="text-xl font-bold mb-6 text-blue-900">
            Question {question.id}
          </h2>
          <div className="text-lg mb-6">{parseText(question.question_text)}</div>
          
          <div className="space-y-3">
            {question.options.map((option, index) => (
              <label 
                key={index} 
                className={`flex items-center p-3 rounded-lg border cursor-pointer transition-colors ${
                  question.answer === option 
                    ? 'bg-blue-50 border-blue-500' 
                    : 'hover:bg-gray-50 border-gray-200'
                }`}
              >
                <div className="relative flex items-center justify-center w-5 h-5 mr-3">
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    className="peer appearance-none w-5 h-5 border-2 border-gray-400 rounded-full checked:border-blue-600 checked:border-4 transition-all"
                    onChange={() => onAnswerSelect(option, index)} 
                    checked={question.answer === option}
                  />
                </div>
                <span className="text-gray-700 font-medium">
                  ({getOptionLetter(index)}) {parseText(option)}
                </span>
              </label>
            ))}
          </div>
        </div>
      </main>
    );
  }

  // RENDER OPTION 2: Normal Layout (Full Width)
  return (
    <main className="flex-1 p-6 overflow-y-auto">
      <div className="flex justify-between items-center mb-6 border-b pb-3"> {/* New line */}
          <h2 className="text-xl font-bold text-blue-900">Question {question.id}</h2>
          {/* REMOVED: Running timer display from here */}
      </div>
      
      <div className="text-lg mb-6 leading-relaxed">
        {parseText(question.question_text)}
      </div>
      
      <div className="space-y-3 max-w-3xl">
        {question.options.map((option, index) => (
          <label 
            key={index} 
            className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
              question.answer === option 
                ? 'bg-blue-50 border-blue-500' 
                : 'hover:bg-gray-50 border-gray-200'
            }`}
          >
            <div className="relative flex items-center justify-center w-5 h-5 mr-4">
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                className="peer appearance-none w-5 h-5 border-2 border-gray-400 rounded-full checked:border-blue-600 checked:border-4 transition-all"
                onChange={() => onAnswerSelect(option, index)} 
                checked={question.answer === option}
              />
            </div>
            <span className="text-gray-700 font-medium text-lg">
                ({getOptionLetter(index)}) {parseText(option)}
            </span>
          </label>
        ))}
      </div>
    </main>
  );
};

export default QuestionContent;