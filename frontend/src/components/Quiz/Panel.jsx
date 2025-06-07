const ProgressBar = ({ progress }) => {
  return (
    <div className="mt-4 mb-6">
      <div className="flex justify-between text-sm text-gray-600 mb-1">
        <span>Progress</span>
        <span>{Math.round(progress)}%</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div 
          className="bg-blue-600 h-2.5 rounded-full" 
          style={{ width: `${progress}%` }}
        ></div>
      </div>
    </div>
  );
};

const Panel = ({ questions, currentQuestionIndex, visitedQuestions, answers, onQuestionSelect,progress,isRealtime = false}) => {
  const getBoxClasses = (index) => {
    let baseClasses = "flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-200 transform";
    
    // Disabled state for unvisited questions in realtime mode
    if (isRealtime && !visitedQuestions.has(index)) {
      return `${baseClasses} bg-gray-200 text-gray-400 cursor-not-allowed`;
    }
    
    // Add cursor pointer only if question is visitable
    if (visitedQuestions.has(index) || !isRealtime) {
      baseClasses += " cursor-pointer hover:scale-105";
    }
    
    if (answers[index] !== undefined) {
      return `${baseClasses} bg-green-500 hover:bg-green-600 text-white shadow-md`;
    }
    if (currentQuestionIndex === index) {
      return `${baseClasses} bg-blue-600 text-white font-bold ring-2 ring-offset-2 ring-blue-400 shadow-lg scale-110`;
    }
    if (visitedQuestions.has(index)) {
      return `${baseClasses} bg-yellow-400 hover:bg-yellow-500 text-gray-800 shadow-sm`;
    }
    return `${baseClasses} bg-gray-300 hover:bg-gray-400 text-gray-700`;
  };

  return (
    <div className="w-full md:w-64 p-6 bg-white rounded-xl shadow-md overflow-y-auto">
      <h3 className="text-xl font-semibold text-gray-800 mb-6 pb-2 border-b border-gray-200">
        Question Navigation
      </h3>
      
      <ProgressBar progress={progress} />
      
      <div className="grid grid-cols-5 md:grid-cols-4 gap-3">
        {questions.map((_, index) => (
          <div
            key={index}
            onClick={() => (visitedQuestions.has(index) || !isRealtime) && onQuestionSelect(index)}
            className={getBoxClasses(index)}
            title={`Question ${index + 1}${
              answers[index] !== undefined ? ' (Answered)' : 
              !visitedQuestions.has(index) && isRealtime ? ' (Locked)' : ''
            }`}
          >
            {index + 1}
          </div>
        ))}
      </div>
      
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 rounded-full bg-blue-600 mr-2"></div>
          <span className="text-sm text-gray-600">Current</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 rounded-full bg-green-500 mr-2"></div>
          <span className="text-sm text-gray-600">Answered</span>
        </div>
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 rounded-full bg-yellow-400 mr-2"></div>
          <span className="text-sm text-gray-600">Visited</span>
        </div>
        <div className="flex items-center">
          <div className="w-4 h-4 rounded-full bg-gray-300 mr-2"></div>
          <span className="text-sm text-gray-600">
            {isRealtime ? 'Locked' : 'Unvisited'}
          </span>
        </div>
        {isRealtime && (
          <div className="mt-3 text-xs text-gray-500">
            <p>Only visited questions can be selected</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Panel;