import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import Panel from "../Quiz/Panel";
import Question from "../Quiz/Question";
import { getQuizByIdAPI } from "../../services/quizzes/QuizServices";
import { getPublicQuestionByIdAPI } from "../../services/quizzes/QuestionServices";

const HostQuiz = () => {
  const { roomId, id } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(-1);
  const [quizMembers, setQuizMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [quizEnded, setQuizEnded] = useState(false);

  useEffect(() => {
    const fetchQuizAndInitialize = async () => {
      try {
        // Fetch quiz details
        const quizResponse = await getQuizByIdAPI(id);
        setQuiz(quizResponse);

        // Fetch all questions
        const questionIds = quizResponse.questions;
        const questionsPromises = questionIds.map((questionId) =>
          getPublicQuestionByIdAPI(questionId)
        );
        const questionsResponses = await Promise.all(questionsPromises);
        const questionsData = questionsResponses.map((res, index) => ({
          ...res,
          questionNumber: index + 1,
        }));
        setQuestions(questionsData);

        // Initialize socket connection
        const socketInstance = io("https://cc-blog-backend.onrender.com");
        console.log("Host socket connected:", socketInstance.connected, socketInstance.id);
        setSocket(socketInstance);

        socketInstance.on("connect", () => {
          console.log("Host connected to socket server");
        });

        socketInstance.on("connect_error", (err) => {
          console.error("Host connection error:", err);
        });

        // Join as host
        socketInstance.emit("join-room", { name: "Host", roomId }, (response) => {
          console.log("Participant join-room acknowledgement:", response);
        });

        // Initialize questions on server
        socketInstance.emit("init-questions", {
          roomId,
          questions: questionsData,
        });

        // Listen for participants joining
        socketInstance.on("room-users", (users) => {
          setQuizMembers(users.filter((user) => user.name !== "Host"));
        });

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuizAndInitialize();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [id, roomId]);

  const handleStartQuiz = () => {
    console.log("Host starting quiz...");
    if (socket) {
      socket.emit("start-quiz", { roomId }, (response) => {
        console.log("start-quiz acknowledgement:", response);
      });
      setCurrentQuestionIndex(0);
      
      // Force emit the first question
      socket.emit("show-question", {
        index: 0,
        question: questions[0]
      });
    }
  };

  const handleNextQuestion = () => {
    if (socket && currentQuestionIndex < questions.length - 1) {
      socket.emit("next-question", { roomId });
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (socket && currentQuestionIndex > 0) {
      socket.emit("prev-question", { roomId });
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleEndQuiz = () => {
    if (socket) {
      socket.emit("end-quiz", { roomId }, (response) => {
        console.log("Quiz ended successfully", response);
        setQuizEnded(true);
        setTimeout(() => {
          navigate(`/quiz/host/results/${id}/${roomId}`);
        }, 3000);
      });
    }
  };

  const handleQuestionSelect = (index) => {
    if (socket && index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
      socket.emit("show-question", {
        index,
        question: questions[index]
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-lg font-medium text-gray-700">
            Loading quiz...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Quiz Not Found
          </h2>
          <p className="text-gray-600">
            The requested quiz could not be loaded.
          </p>
        </div>
      </div>
    );
  }

  if (quizEnded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Quiz Ended Successfully!
          </h2>
          <p className="text-gray-600">
            Participants are being redirected to results.
          </p>
          <div className="mt-6">
            <div className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {/* Side Panel */}
      <div className="w-full md:w-1/4 lg:w-1/5 bg-white shadow-md p-4">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-800 truncate">
            {quiz.title}
          </h1>
          <p className="text-sm text-gray-500">
            {currentQuestionIndex >= 0
              ? `Question ${currentQuestionIndex + 1} of ${questions.length}`
              : "Quiz not started"}
          </p>
          <p className="text-sm text-gray-500 mt-2">
            {quizMembers.length} participants joined
          </p>
        </div>

        <Panel
          questions={questions}
          currentQuestionIndex={currentQuestionIndex}
          visitedQuestions={
            new Set(
              Array.from({ length: currentQuestionIndex + 1 }, (_, i) => i)
            )
          }
          answers={{}}
          onQuestionSelect={handleQuestionSelect}
          progress={
            currentQuestionIndex >= 0
              ? ((currentQuestionIndex + 1) / questions.length) * 100
              : 0
          }
        />

        <div className="mt-6 space-y-3">
          {currentQuestionIndex === -1 ? (
            <button
              onClick={handleStartQuiz}
              className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
            >
              Start Quiz
            </button>
          ) : (
            <>
              <button
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex <= 0}
                className={`w-full px-4 py-2 rounded-lg transition ${
                  currentQuestionIndex <= 0
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                Previous Question
              </button>
              <button
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex >= questions.length - 1}
                className={`w-full px-4 py-2 rounded-lg transition ${
                  currentQuestionIndex >= questions.length - 1
                    ? "bg-gray-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700 text-white"
                }`}
              >
                Next Question
              </button>
              {currentQuestionIndex === questions.length - 1 && (
                <button
                  onClick={handleEndQuiz}
                  className="w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                >
                  End Quiz
                </button>
              )}
            </>
          )}
        </div>
      </div>

      {/* Main Question Area */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6">
          {currentQuestionIndex >= 0 ? (
            <Question
              question={questions[currentQuestionIndex]}
              questionNumber={currentQuestionIndex + 1}
              selectedAnswer={null}
              onAnswerChange={() => {}}
              onPrevious={handlePreviousQuestion}
              onNext={handleNextQuestion}
              onSubmit={() => {}}
              isFirst={currentQuestionIndex === 0}
              isLast={currentQuestionIndex === questions.length - 1}
              isSubmitting={false}
              isHost={true}
            />
          ) : (
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">
                Ready to Start the Quiz?
              </h2>
              <p className="text-gray-600 mb-6">
                {quizMembers.length} participants are waiting. Click "Start
                Quiz" when ready.
              </p>
              <button
                onClick={handleStartQuiz}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition text-lg font-medium"
              >
                Start Quiz
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HostQuiz;