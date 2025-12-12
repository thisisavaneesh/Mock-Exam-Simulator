interface Props {
  handleSaveAndNext: () => void;
  handleMarkForReview: () => void;
  handleClearResponse: () => void;
}

const Footer = ({ handleSaveAndNext, handleMarkForReview, handleClearResponse }: Props) => {
  return (
    <footer className="bg-gray-800 text-white p-4 flex justify-between">
      <div>
        <button
          onClick={handleMarkForReview}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mr-2"
        >
          Mark for Review & Next
        </button>
        <button
          onClick={handleClearResponse}
          className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
        >
          Clear Response
        </button>
      </div>
      <div>
        <button
          onClick={handleSaveAndNext}
          className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        >
          Save & Next
        </button>
      </div>
    </footer>
  );
};

export default Footer;