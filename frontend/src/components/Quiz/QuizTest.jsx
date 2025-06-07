import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getQuizByIdAPI } from "../../services/quizzes/QuizServices";
import { getPublicQuestionByIdAPI } from "../../services/quizzes/QuestionServices";
import Panel from "./Panel";
import Question from "./Question";
import { submitAPI, submitQuizAPI } from "../../services/quizzes/JoinServices";
import { io } from "socket.io-client";

const QuizTest = () => {
  const { id, joinId, roomId } = useParams();
  const navigate = useNavigate();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [visitedQuestions, setVisitedQuestions] = useState(new Set());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [socket, setSocket] = useState(null);
  const [isRealtime, setIsRealtime] = useState(false);
  const [quizStarted, setQuizStarted] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    const fetchQuizAndQuestions = async () => {
      try {
        const quizResponse = await getQuizByIdAPI(id);
        console.log("QUIZ RESPONSE", quizResponse);
        setIsRealtime(quizResponse.isRealtime);
        setQuiz(quizResponse);

        if (!quizResponse.isRealtime) {
          const questionIds = quizResponse.questions;
          const questionsPromises = questionIds.map((questionId) =>
            getPublicQuestionByIdAPI(questionId)
          );
          const questionsResponses = await Promise.all(questionsPromises);
          const questionsData = questionsResponses.map((res) => res);
          setQuestions(questionsData);
          setVisitedQuestions(new Set([0]));
        } else {
          const socketInstance = io("https://cc-blog-backend.onrender.com");
          console.log(
            "Participant socket connected:",
            socketInstance.connected,
            socketInstance.id
          );
          setSocket(socketInstance);

          socketInstance.on("connect", () => {
            console.log("Participant connected to socket server");
          });

          socketInstance.on("connect_error", (err) => {
            console.error("Participant connection error:", err);
          });

          socketInstance.emit("join-room", {
            name: `Participant-${joinId}`,
            roomId: roomId,
          });

          socketInstance.on("show-question", ({ index, question }) => {
            console.log("RECIEVED QUESTION:", index, question);
            if (!question) {
              console.error("Received empty question");
              return;
            }
            setCurrentQuestionIndex(index);
            setQuestions((prev) => {
              const newQuestions = [...prev];
              newQuestions[index] = {
                ...question,
              };
              return newQuestions;
            });
            setVisitedQuestions((prev) => new Set(prev).add(index));
            setQuizStarted(true);
          });

          socketInstance.on("quiz-ended", () => {
            console.log("QUIZ ENDED");
            setIsSubmitted(true);
            setTimeout(() => {
              navigate(`/quiz/end`);
            }, 3000); 
          });
        }

        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchQuizAndQuestions();

    return () => {
      if (socket) socket.disconnect();
    };
  }, [id, joinId]);

  const handleQuestionSelect = (index) => {
    if (!isRealtime || quizStarted) {
      setCurrentQuestionIndex(index);
      setVisitedQuestions((prev) => new Set(prev).add(index));
    }
  };

  const handleAnswerChange = (e) => {
    const { value } = e.target;
    setAnswers((prev) => ({
      ...prev,
      [currentQuestionIndex]: parseInt(value),
    }));
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0 && (!isRealtime || quizStarted)) {
      setCurrentQuestionIndex((prev) => prev - 1);
      setVisitedQuestions((prev) =>
        new Set(prev).add(currentQuestionIndex - 1)
      );
    }
  };

  const handleNext = async () => {
    if (
      currentQuestionIndex < questions.length - 1 &&
      (!isRealtime || quizStarted)
    ) {
      // Save current answer before moving to next question
      if (answers[currentQuestionIndex] !== undefined) {
        try {
          setIsSubmitting(true);
          const currentAnswer = {
            questionId: quiz.questions[currentQuestionIndex],
            chosenOptions: [answers[currentQuestionIndex]],
          };

          await submitAPI({
            joinId: joinId,
            answers: [currentAnswer],
          });

          // Only proceed to next question after successful save
          setCurrentQuestionIndex((prev) => prev + 1);
          setVisitedQuestions((prev) =>
            new Set(prev).add(currentQuestionIndex + 1)
          );
        } catch (error) {
          console.error("Error saving answer:", error);
          setError("Failed to save your answer. Please try again.");
        } finally {
          setIsSubmitting(false);
        }
      } else {
        // If no answer selected, just move to next question
        setCurrentQuestionIndex((prev) => prev + 1);
        setVisitedQuestions((prev) =>
          new Set(prev).add(currentQuestionIndex + 1)
        );
      }
    }
  };

  const handleSaveAnswer = async () => {
    if (answers[currentQuestionIndex] === undefined) return;

    setIsSubmitting(true);
    try {
      const currentAnswer = {
        questionId: quiz.questions[currentQuestionIndex],
        chosenOptions: [answers[currentQuestionIndex]],
      };

      const response = await submitAPI({
        joinId: joinId,
        answers: [currentAnswer],
      });

      // Show success feedback to user
      console.log("Answer saved successfully", response);
      // You could add a toast notification here if you want
    } catch (error) {
      console.error("Error saving answer:", error);
      setError("Failed to save your answer. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const questionIds = quiz.questions;
      const formattedAnswers = questionIds.map((questionId, index) => ({
        questionId: questionId,
        chosenOptions: answers[index] !== undefined ? [answers[index]] : [],
      }));

      const submissionData = {
        joinId: joinId,
        answers: formattedAnswers,
      };

      const response = await submitQuizAPI(submissionData);

      // For both normal and realtime quizzes, navigate to /quiz/end
      setIsSubmitted(true);
      setTimeout(() => {
        navigate(`/quiz/end`);
      }, 2000); // Show submitted message for 2 seconds before navigating
    } catch (error) {
      console.error("Submission error:", error);
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading)
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

  if (isSubmitted) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-8 max-w-md mx-auto bg-white rounded-xl shadow-md text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Quiz Submitted!
          </h2>
          <p className="text-gray-600">
            Your answers have been submitted successfully.
          </p>
          <div className="mt-6">
            <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          </div>
        </div>
      </div>
    );
  }
  if (error)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-red-600 mb-4">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );

  if (!quiz)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Quiz Not Found
          </h2>
          <p className="text-gray-600">
            The requested quiz could not be found.
          </p>
        </div>
      </div>
    );

  if (isRealtime && !quizStarted)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md text-center">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Waiting for Quiz to Start
          </h2>
          <p className="text-gray-600">
            Please wait for the host to begin the quiz.
          </p>
          <div className="mt-6 w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    );

  if (questions.length === 0)
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="p-6 max-w-md mx-auto bg-white rounded-xl shadow-md">
          <h2 className="text-xl font-bold text-gray-800 mb-4">No Questions</h2>
          <p className="text-gray-600">
            This quiz doesn't contain any questions yet.
          </p>
        </div>
      </div>
    );

  return (
    <div className="flex flex-col md:flex-row h-screen bg-gray-100">
      {(!isRealtime || quizStarted) && (
        <div className="w-full md:w-1/4 lg:w-1/5 bg-white shadow-md p-4">
          <div className="mb-6">
            <h1 className="text-xl font-bold text-gray-800 truncate">
              {quiz.title}
            </h1>
            <p className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          <Panel
            questions={questions}
            currentQuestionIndex={currentQuestionIndex}
            visitedQuestions={visitedQuestions}
            answers={answers}
            onQuestionSelect={handleQuestionSelect}
            progress={(Object.keys(answers).length / questions.length) * 100}
            isRealtime={isRealtime}
          />
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-6">
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm p-6">
          <Question
            question={questions[currentQuestionIndex]}
            questionNumber={currentQuestionIndex + 1}
            selectedAnswer={answers[currentQuestionIndex]}
            onAnswerChange={handleAnswerChange}
            onPrevious={handlePrevious}
            onNext={handleNext}
            onSubmit={handleSubmit}
            isFirst={currentQuestionIndex === 0}
            isLast={currentQuestionIndex === questions.length - 1}
            isSubmitting={isSubmitting}
            isRealtime={isRealtime}
            onSaveAnswer={handleSaveAnswer}
          />
        </div>
      </div>
    </div>
  );
};

export default QuizTest;
