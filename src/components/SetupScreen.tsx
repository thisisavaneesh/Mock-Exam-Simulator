import React, { useState } from 'react';
import { Question } from '../types';

interface Props {
  // Updated to accept custom questions array
  onStartTest: (
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed', 
    durationInSeconds: number, 
    customQuestions: Question[] | null
  ) => void;
}

const SetupScreen = ({ onStartTest }: Props) => {
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | 'Mixed'>('Mixed');
  const [minutes, setMinutes] = useState<number>(120);
  const [jsonInput, setJsonInput] = useState<string>(''); // State for JSON input
  const [error, setError] = useState<string | null>(null);

  const handleStart = () => {
    const durationInSeconds = minutes * 60;
    
    // NEW MANDATORY CHECK 1: Time
    if(durationInSeconds <= 0) {
        setError("Please enter a valid time (in minutes).");
        return;
    }
    
    // NEW MANDATORY CHECK 2: JSON Input
    if (!jsonInput.trim()) {
        setError("Question JSON is mandatory. Please paste the questions to start the exam.");
        return;
    }

    let parsedQuestions: Question[] | null = null;

    // Logic: Try to parse the mandatory JSON input
    try {
        parsedQuestions = JSON.parse(jsonInput);
        if (!Array.isArray(parsedQuestions)) {
          throw new Error("JSON must be an array of questions.");
        }
        // Basic validation: Check if first item has an ID and question_text
        if (parsedQuestions.length === 0 || !parsedQuestions[0].question_text) {
           throw new Error("Empty array or invalid question format. Missing 'question_text'.");
        }
        setError(null);
    } catch (e: any) {
        setError("Invalid JSON: " + e.message);
        return; // Stop if JSON is bad
    }

    // Pass data to App.tsx
    onStartTest(difficulty, durationInSeconds, parsedQuestions);
  };

  // Updated Placeholder Text for Math and DI
  const placeholderText = `[
  {
    "id": 1,
    "section": "Quantitative Aptitude",
    "topic": "Fractions",
    "difficulty": "Easy",
    "context": null,
    "question_text": "Find the value of $\\sqrt{4} + \\frac{1}{2}$.",
    "options": ["2.5", "3", "4", "4.5"],
    "correct_answer": "2.5",
    "marks_correct": 4,
    "marks_negative": -1
  },
  {
    "id": 2,
    "section": "Data Interpretation",
    "topic": "Table Chart",
    "difficulty": "Medium",
    "context": "<p><strong>Data:</strong> Sales in 2024</p><table style='width:100%; border:1px solid #ccc; border-collapse:collapse;'><thead><tr><th style='border:1px solid #ccc; padding:5px;'>Month</th><th>Units</th></tr></thead><tbody><tr><td style='border:1px solid #ccc; padding:5px;'>Jan</td><td>100</td></tr><tr><td style='border:1px solid #ccc; padding:5px;'>Feb</td><td>150</td></tr></tbody></table>",
    "question_text": "What is the total sales in January and February?",
    "options": ["200", "250", "300", "350"],
    "correct_answer": "250",
    "marks_correct": 4,
    "marks_negative": -1
  }
]`;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-900">Mock Exam Setup</h1>
        
        {/* Step 1: Input Questions */}
        <div className="mb-6">
          <label className="block text-gray-700 font-bold mb-2">
            Step 1: Paste Questions JSON (REQUIRED)
            {/* REMOVED: Optional message */}
          </label>
          <textarea
            className="w-full border border-gray-300 rounded p-2 h-40 font-mono text-sm focus:outline-none focus:border-blue-500"
            placeholder={placeholderText}
            value={jsonInput}
            onChange={(e) => {
              setJsonInput(e.target.value);
              setError(null); // Clear error on change
            }}
          />
          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          {/* Step 2: Difficulty */}
          <div>
            <label htmlFor="difficulty" className="block text-gray-700 font-bold mb-2">Step 2: Difficulty</label>
            <select
              id="difficulty"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as 'Easy' | 'Medium' | 'Hard' | 'Mixed')}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
            >
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
              <option value="Mixed">Mixed</option>
            </select>
          </div>

          {/* Step 3: Time */}
          <div>
            <label htmlFor="time" className="block text-gray-700 font-bold mb-2">Step 3: Time (Mins)</label>
            <input
              type="number"
              id="time"
              value={minutes}
              onChange={(e) => setMinutes(parseInt(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded p-2 focus:outline-none focus:border-blue-500"
              min="1"
            />
          </div>
        </div>

        <button
          onClick={handleStart}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded transition duration-200"
        >
          Start Exam
        </button>
      </div>
    </div>
  );
};

export default SetupScreen;