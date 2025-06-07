const Question = ({question,questionNumber,selectedAnswer,onAnswerChange,onPrevious,onNext,onSubmit,isFirst,isLast,isSubmitting = false,isRealtime = false,onSaveAnswer}) => {
  if (!question) return <div>Loading question...</div>;

  return (
    <div className="w-[80%] max-w-[800px] mx-auto p-8 bg-gray-50 rounded-xl shadow-md overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-sm mb-5">
        <h3 className="text-gray-800 mb-4">Question {questionNumber}</h3>
        <div className="text-lg mb-4 whitespace-pre-wrap">
          {question.question}
        </div>
        <p className="text-sm text-gray-500 font-bold">
          Points: {question.points}
        </p>
      </div>

      <div className="my-5">
        {question.options.map((option, index) => (
          <div key={index} className="my-3">
            <label
              htmlFor={`option-${index}`}
              className={`
                block whitespace-pre-wrap items-center p-4 cursor-pointer text-base
                transition-all duration-300 shadow-sm gap-3 rounded-lg
                ${
                  selectedAnswer === index
                    ? "bg-blue-50 border-blue-500"
                    : "bg-white border-gray-200"
                }
                border-2 hover:border-blue-500 hover:shadow-md
                ${isSubmitting ? "pointer-events-none opacity-80" : ""}
              `}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`
                  w-5 h-5 rounded-full border-2 flex-shrink-0 flex items-center justify-center
                  ${
                    selectedAnswer === index
                      ? "border-blue-500 bg-blue-500"
                      : "border-gray-400 bg-white"
                  }
                `}
                >
                  {selectedAnswer === index && (
                    <span className="block w-2.5 h-2.5 rounded-full bg-white" />
                  )}
                </div>
                <span>{option}</span>
              </div>
              <input
                type="radio"
                id={`option-${index}`}
                name="answer"
                value={index}
                checked={selectedAnswer === index}
                onChange={onAnswerChange}
                className="hidden"
                disabled={isSubmitting}
              />
            </label>
          </div>
        ))}
      </div>

      {!isRealtime && (
        <div className="flex justify-between mt-8">
          {!isFirst && (
            <button
              onClick={onPrevious}
              disabled={isSubmitting}
              className={`px-6 py-3 bg-gray-100 text-gray-800 border-none rounded-md
                       cursor-pointer text-base font-medium transition-all duration-300
                       hover:bg-gray-200
                       ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              ← Previous Question
            </button>
          )}

          <div className="flex gap-4 ml-auto">
            {/* Add Save Answer button before navigation buttons */}
            <button
              onClick={onSaveAnswer}
              disabled={isSubmitting || selectedAnswer === undefined}
              className={`px-6 py-3 bg-blue-500 text-white border-none rounded-md
                       cursor-pointer text-base font-medium transition-all duration-300
                       hover:bg-blue-700
                       ${isSubmitting || selectedAnswer === undefined ? "opacity-50 cursor-not-allowed" : ""}`}
            >
              Save Answer
            </button>

            {!isLast ? (
              <button
                onClick={onNext}
                disabled={isSubmitting}
                className={`px-6 py-3 bg-blue-500 text-white border-none rounded-md
                         cursor-pointer text-base font-medium transition-all duration-300
                         hover:bg-blue-700
                         ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                Next Question →
              </button>
            ) : (
              <button
                onClick={onSubmit}
                disabled={isSubmitting}
                className={`px-6 py-3 bg-green-500 text-white border-none rounded-md
                         cursor-pointer text-base font-medium transition-all duration-300
                         hover:bg-green-700
                         ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  "Submit Quiz"
                )}
              </button>
            )}
          </div>
        </div>
      )}

      {isRealtime && (
        <div className="flex justify-end mt-8">
          <button
            onClick={onSaveAnswer}
            disabled={isSubmitting || selectedAnswer === undefined}
            className={`px-6 py-3 bg-blue-500 text-white border-none rounded-md
                     cursor-pointer text-base font-medium transition-all duration-300
                     hover:bg-blue-700
                     ${isSubmitting || selectedAnswer === undefined ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Saving...
              </span>
            ) : (
              'Save Answer'
            )}
          </button>
        </div>
      )}
    </div>
  );
};
export default Question;