// src/components/Header.tsx
interface Props {
  timeLeft: number;
  onSubmit: () => void; // New Prop
}

const Header = ({ timeLeft, onSubmit }: Props) => {
  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const m = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${h}:${m}:${s}`;
  };

  return (
    <header className="bg-gray-900 text-white p-4 flex justify-between items-center shadow-md">
      <div>
        <h1 className="text-xl font-bold tracking-wide">Mock Exam Simulator</h1>
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-gray-800 px-4 py-2 rounded">
          <span className="font-mono text-xl">{formatTime(timeLeft)}</span>
        </div>
        <button 
          onClick={onSubmit}
          className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-6 rounded transition-colors"
        >
          Submit Test
        </button>
      </div>
    </header>
  );
};

export default Header;