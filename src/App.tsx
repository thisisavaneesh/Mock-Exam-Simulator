import { useState, useEffect, useRef } from 'react';
import Header from './components/Header';
import QuestionPalette from './components/QuestionPalette';
import QuestionContent from './components/QuestionContent';
import Footer from './components/Footer';
import SetupScreen from './components/SetupScreen';
import ResultsPage from './components/ResultsPage';
import { Question } from './types';
// NOTE: defaultQuestionsData is removed in the full, corrected version
import ReviewModal from './components/ReviewModal';
// ... (rest of the file remains the same)
function App() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const [timeLeft, setTimeLeft] = useState(0); 
  const [totalDuration, setTotalDuration] = useState(0);

  // NEW STATE: Timer for the currently visible question
  const [questionTimer, setQuestionTimer] = useState(0); 
  // NEW REF: To manage the question timer interval ID
  const questionTimerRef = useRef<NodeJS.Timeout | null>(null); 
  // REF for Global Timer
  const globalTimerRef = useRef<NodeJS.Timeout | null>(null);

  const [testStarted, setTestStarted] = useState(false);
  const [testFinished, setTestFinished] = useState(false);
  const [results, setResults] = useState({
    score: 0,
    correct: 0,
    incorrect: 0,
    unattempted: 0,
    timeTaken: 0,
  });
  
  const [reviewingQuestion, setReviewingQuestion] = useState<Question | null>(null);

  const currentQuestion = questions[currentQuestionIndex];

  // ====================================================
  // CORE LOGIC FUNCTIONS
  // ====================================================

  const recordTimeAndStopTimer = () => {
    if (questionTimerRef.current) {
      clearInterval(questionTimerRef.current);
      questionTimerRef.current = null;
    }

    if (questions.length > 0) {
      setQuestions(prevQuestions => {
        const newQuestions = [...prevQuestions];
        // Record the elapsed time for the question we are leaving
        newQuestions[currentQuestionIndex].timeSpent += questionTimer; 
        return newQuestions;
      });
    }
  };

  const startQuestionTimer = () => {
    setQuestionTimer(0); 
    
    questionTimerRef.current = setInterval(() => {
      setQuestionTimer(prev => prev + 1);
    }, 1000);
  };

  const switchQuestion = (newIndex: number) => {
    if (newIndex >= 0 && newIndex < questions.length) {
      recordTimeAndStopTimer(); 
      setCurrentQuestionIndex(newIndex);
      startQuestionTimer(); 
    }
  };
  
  const handleAnswerSelect = (answer: string, index: number) => {
    const newQuestions = [...questions];
    const currentQuestion = newQuestions[currentQuestionIndex];
    currentQuestion.answer = answer;
    currentQuestion.answerIndex = index; // Store index

    if (currentQuestion.status === 'unanswered' || currentQuestion.status === 'marked') {
       currentQuestion.status = 'answered';
    }
    setQuestions(newQuestions);
  };
  
  const handleSubmitTest = () => {
    recordTimeAndStopTimer(); 
    
    // Clear global timer
    if (globalTimerRef.current) clearInterval(globalTimerRef.current);

    let score = 0;
    let correct = 0;
    let incorrect = 0;
    let unattempted = 0;

    questions.forEach((q) => {
      if (!q.answer) {
        unattempted++;
      } else if (q.answer === q.correct_answer) {
        score += q.marks_correct;
        correct++;
      } else {
        score += q.marks_negative;
        incorrect++;
      }
    });
    
    const timeSpent = totalDuration - timeLeft;
    setResults({ score, correct, incorrect, unattempted, timeTaken: timeSpent });
    setTestFinished(true);
  };
  
  // MODIFIED onStartTest: Now requires customQuestions and does NOT use default data
  const onStartTest = (
    difficulty: 'Easy' | 'Medium' | 'Hard' | 'Mixed', 
    durationInSeconds: number,
    customQuestions: Question[] | null
  ) => {
    
    // Safety check for mandatory input
    if (!customQuestions || customQuestions.length === 0) {
        // This should be handled by SetupScreen validation, but is a final safety net.
        return; 
    }
    
    const sourceData = customQuestions;

    // 2. Normalize Data (Add status, timeSpent, answerIndex fields)
    const allQuestions: Question[] = (sourceData as any[]).map((q) => ({
      ...q,
      answer: null,
      status: 'unanswered',
      timeSpent: 0, 
      answerIndex: null, // Initialize new fields
    }));

    // 3. Filter by Difficulty
    let filteredQuestions: Question[] = [];
    if (difficulty === 'Mixed') {
      filteredQuestions = allQuestions; 
    } else {
      filteredQuestions = allQuestions.filter((q) => q.difficulty === difficulty);
    }
    
    if(filteredQuestions.length === 0) {
        alert(`No questions found for difficulty: ${difficulty}. Please check your JSON data.`);
        return;
    }

    setQuestions(filteredQuestions);
    setTotalDuration(durationInSeconds);
    setTimeLeft(durationInSeconds);
    setTestStarted(true);
    
    startQuestionTimer();
  };
  
  const handleSaveAndNext = () => {
    const newQuestions = [...questions];
    const currentQuestion = newQuestions[currentQuestionIndex];
    
    if (currentQuestion.answer) {
      currentQuestion.status = 'answered';
    } else if (currentQuestion.status === 'answered') {
       // Keep it answered
    } else {
       currentQuestion.status = 'unanswered';
    }
    
    setQuestions(newQuestions);

    if (currentQuestionIndex < questions.length - 1) {
      switchQuestion(currentQuestionIndex + 1);
    } else {
      if(confirm("You have reached the last question. Do you want to submit the test?")) {
        handleSubmitTest();
      }
    }
  };

  const handleMarkForReview = () => {
    const newQuestions = [...questions];
    const currentQuestion = newQuestions[currentQuestionIndex];

    if (currentQuestion.answer) {
      currentQuestion.status = 'answeredAndMarked';
    } else {
      currentQuestion.status = 'marked';
    }
    
    setQuestions(newQuestions);
    
    if (currentQuestionIndex < questions.length - 1) {
      switchQuestion(currentQuestionIndex + 1);
    }
  };

  const handleClearResponse = () => {
    const newQuestions = [...questions];
    const currentQuestion = newQuestions[currentQuestionIndex];

    currentQuestion.status = 'unanswered';
    currentQuestion.answer = null;
    currentQuestion.answerIndex = null;  

    setQuestions(newQuestions);
  };
  
  // Global Timer useEffect
  useEffect(() => {
    if (!testStarted || testFinished) {
      if (globalTimerRef.current) clearInterval(globalTimerRef.current);
      if (questionTimerRef.current) clearInterval(questionTimerRef.current);
      return;
    }
    
    if (timeLeft <= 0) {
      handleSubmitTest();
      return;
    }

    globalTimerRef.current = setInterval(() => {
      setTimeLeft((prevTime) => prevTime - 1);
    }, 1000);

    return () => {
      if (globalTimerRef.current) clearInterval(globalTimerRef.current);
    };
  }, [timeLeft, testStarted, testFinished]);

  const handlePaletteClick = (index: number) => {
      if (index !== currentQuestionIndex) {
          switchQuestion(index);
      }
  };

  if (!testStarted) {
    return <SetupScreen onStartTest={onStartTest} />;
  }

  if (testFinished) {
    return (
        <>
            <ResultsPage 
              questions={questions} 
              results={results} 
              onReviewQuestion={(q) => setReviewingQuestion(q)}
            />
            {reviewingQuestion && (
              <ReviewModal 
                question={reviewingQuestion} 
                onClose={() => setReviewingQuestion(null)} 
              />
            )}
        </>
    );
  }
  
  // FINAL FIX: Check if currentQuestion exists before rendering the main components
  if (!currentQuestion) {
      return (
          <div className="flex items-center justify-center h-screen text-2xl text-gray-500">
              Loading Questions...
          </div>
      );
  }


  return (
    <div className="flex flex-col h-screen font-sans">
      <Header timeLeft={timeLeft} onSubmit={() => {
          if(confirm("Are you sure you want to submit the test?")) {
            handleSubmitTest();
          }
      }} />
      <div className="flex flex-1 overflow-hidden">
        <QuestionContent
          question={currentQuestion}
          onAnswerSelect={handleAnswerSelect}
        />
        <QuestionPalette
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          setCurrentQuestionIndex={handlePaletteClick}
        />
      </div>
      <Footer
        handleSaveAndNext={handleSaveAndNext}
        handleMarkForReview={handleMarkForReview}
        handleClearResponse={handleClearResponse}
      />
      {reviewingQuestion && (
        <ReviewModal 
          question={reviewingQuestion} 
          onClose={() => setReviewingQuestion(null)} 
        />
      )}
    </div>
  );
}

export default App;