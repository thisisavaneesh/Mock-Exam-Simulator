import { Question } from '../types';

interface Props {
  questions: Question[];
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
}

const QuestionPalette = ({ questions, setCurrentQuestionIndex }: Props) => {
  const getStatusColor = (status: Question['status']) => {
    switch (status) {
      case 'answered':
        return 'bg-green-500';
      case 'marked':
        return 'bg-purple-500';
      case 'answeredAndMarked':
        return 'bg-green-500 relative';
      default:
        return 'bg-gray-400';
    }
  };

  return (
    <aside className="w-64 bg-gray-200 p-4 h-full overflow-y-auto">
      <h2 className="text-lg font-bold mb-4">Question Palette</h2>
      <div className="grid grid-cols-5 gap-2">
        {questions.map((question, index) => (
          <div
            key={question.id}
            className={`text-white text-center p-2 rounded cursor-pointer ${getStatusColor(question.status)}`}
            onClick={() => setCurrentQuestionIndex(index)}
          >
            {/* FIX: Display Sequence Number (index + 1) instead of ID */}
            {index + 1}
            
            {question.status === 'answeredAndMarked' && (
              <div className="absolute top-0 right-0 h-2 w-2 bg-purple-500 rounded-full"></div>
            )}
          </div>
        ))}
      </div>
    </aside>
  );
};

export default QuestionPalette;