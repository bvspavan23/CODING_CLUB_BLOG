import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import Card from "./Card";
import { getQuizByIdAPI } from "../../services/quizzes/QuizServices";
import {createOrUpdateQuestionsAPI,getQuestionByIdAPI} from "../../services/quizzes/QuestionServices";
import { useParams } from "react-router-dom";
import ChatBot from "./ChatBot";

const ManageQuiz = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showChatBot, setShowChatBot] = useState(false);

  const handleQuestionGenerated = (generatedText) => {
    try {
      const newQuestion = {
        id: Date.now(),
        question: generatedText.split('\n')[0] || "New generated question",
        points: 1,
        options: ["", "", "", ""],
        correctAnswer: [],
      };
      setQuestions([...questions, newQuestion]);
    } catch (error) {
      setError("Failed to parse generated question");
    }
  };

  useEffect(() => {
    const loadQuizAndQuestions = async () => {
      try {
        setIsLoading(true);
        
        const quizResponse = await getQuizByIdAPI(id);
        if (!quizResponse) {
          throw new Error("Quiz not found");
        }
        setQuiz(quizResponse);

        const hasQuestions = quizResponse.questions && quizResponse.questions.length > 0;

        if (hasQuestions) {
          const questionDetails = await Promise.all(
            quizResponse.questions.map(questionId => 
              getQuestionByIdAPI(questionId)
            )
          );
          
          const formattedQuestions = questionDetails.map((q, i) => {
            return {
              id: q.id,
              question: q.question || "",
              points: q.points || 1,
              options: q.options && q.options.length > 0 
                ? [...q.options, "", "", ""].slice(0, 4)
                : ["", "", "", ""],
              correctAnswer: q.correctAnswer || []
            };
          });
          
          setQuestions(formattedQuestions);
        } else {
          setQuestions([
            {
              id: Date.now(),
              question: "",
              points: 1,
              options: ["", "", "", ""],
              correctAnswer: [],
            },
          ]);
        }
      } catch (err) {
        setError(err.message || "Failed to load quiz");
      } finally {
        setIsLoading(false);
      }
    };

    loadQuizAndQuestions();
  }, [id]);

  const addNewQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question: "",
      points: 1,
      options: ["", "", "", ""],
      correctAnswer: [],
    };
    setQuestions([...questions, newQuestion]);
  };

  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].question = value
      .replace(/<p>/g, '')
      .replace(/<\/p>/g, '\n')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<[^>]*>/g, '');
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value
      .replace(/<p>/g, '')
      .replace(/<\/p>/g, '\n')
      .replace(/<br\s*\/?>/g, '\n')
      .replace(/<[^>]*>/g, '');
    setQuestions(updatedQuestions);
  };

  const handleCorrectAnswerToggle = (qIndex, oIndex) => {
    const updatedQuestions = [...questions];
    const correctAnswers = updatedQuestions[qIndex].correctAnswer;
    const answerIndex = correctAnswers.indexOf(oIndex);
    
    if (answerIndex === -1) {
      correctAnswers.push(oIndex);
    } else {
      correctAnswers.splice(answerIndex, 1);
    }
    
    setQuestions(updatedQuestions);
  };

  const handlePointsChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].points = parseInt(value) || 1;
    setQuestions(updatedQuestions);
  };

  const handleDeleteQuestion = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions.splice(index, 1);
    setQuestions(updatedQuestions.length > 0 ? updatedQuestions : [{
      id: Date.now(),
      question: "",
      points: 1,
      options: ["", "", "", ""],
      correctAnswer: [],
    }]);
  };

  const handleSubmit = async () => {
    if (!quiz) {
      setError("Quiz not found. Cannot submit questions.");
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const questionsToSubmit = questions.map((q, index) => {
        const cleanQuestion = q.question
          .replace(/<p>/g, '')
          .replace(/<\/p>/g, '\n')
          .replace(/<br\s*\/?>/g, '\n')
          .replace(/<[^>]*>/g, '')
          .trim();
          
        const filteredOptions = q.options.map(opt => 
          opt.replace(/<p>/g, '')
            .replace(/<\/p>/g, '\n')
            .replace(/<br\s*\/?>/g, '\n')
            .replace(/<[^>]*>/g, '')
            .trim()
        ).filter(opt => opt !== '');
          
        if (!cleanQuestion) {
          throw new Error(`Question #${index + 1} text cannot be empty`);
        }
        
        if (filteredOptions.length < 2) {
          throw new Error(`Question #${index + 1} needs at least 2 non-empty options`);
        }
        
        if (q.correctAnswer.length < 1) {
          throw new Error(`Question #${index + 1} needs at least 1 correct answer`);
        }
        
        return {
          ...(q.id && q.id.length === 24 ? { id: q.id } : {}),
          question: cleanQuestion,
          points: Number(q.points) || 1,
          options: filteredOptions,
          correctAnswer: q.correctAnswer.map(index => Number(index)),
        };
      });

      const response = await createOrUpdateQuestionsAPI(id, questionsToSubmit);
      
      if (response) {
        alert("Questions saved successfully!");
        
        const quizResponse = await getQuizByIdAPI(id);
        setQuiz(quizResponse);
        
        const questionDetails = await Promise.all(
          quizResponse.questions.map(questionId => 
            getQuestionByIdAPI(questionId)
        ));
        
        const formattedQuestions = questionDetails.map(q => ({
          id: q.id,
          question: q.question,
          points: q.points,
          options: q.options.length >= 4 ? [...q.options] : [...q.options, "", "", ""].slice(0, 4),
          correctAnswer: q.correctAnswer
        }));
        
        setQuestions(formattedQuestions);
      }
    } catch (error) {
      setError(error.message || "Failed to save questions");
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading && !quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading quiz information...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Error</h2>
          <p className="text-red-500 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-all"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-xl shadow-lg p-8 mb-8 border border-gray-100">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">{quiz?.name}</h1>
            <p className="text-gray-600">Manage your quiz questions</p>
          </div>
          <div className="flex space-x-4">
            <button
              onClick={addNewQuestion}
              disabled={isLoading}
              className={`px-5 py-2.5 rounded-lg text-white font-medium flex items-center ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition-all shadow-md`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Question
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-5 py-2.5 rounded-lg text-white font-medium flex items-center ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } transition-all shadow-md`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {isLoading ? "Saving..." : "Save All"}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        <div className="space-y-8">
          {questions.map((q, index) => (
            <Card
              key={q.id}
              question={q.question}
              options={q.options}
              points={q.points}
              correctAnswers={q.correctAnswer}
              onQuestionChange={(value) => handleQuestionChange(index, value)}
              onOptionChange={(oIndex, value) =>
                handleOptionChange(index, oIndex, value)
              }
              onCorrectAnswerToggle={(oIndex) =>
                handleCorrectAnswerToggle(index, oIndex)
              }
              onPointsChange={(e) => handlePointsChange(index, e.target.value)}
              onDelete={() => handleDeleteQuestion(index)}
            />
          ))}
        </div>

        {questions.length > 0 && (
          <div className="mt-8 flex justify-end space-x-4">
            <button
              onClick={addNewQuestion}
              disabled={isLoading}
              className={`px-5 py-2.5 rounded-lg text-white font-medium flex items-center ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              } transition-all shadow-md`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add Another Question
            </button>
            <button
              onClick={handleSubmit}
              disabled={isLoading}
              className={`px-5 py-2.5 rounded-lg text-white font-medium flex items-center ${
                isLoading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } transition-all shadow-md`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
              {isLoading ? "Saving..." : "Save All Questions"}
            </button>
          </div>
        )}
      </div>

      {showChatBot && (
        <ChatBot 
          onQuestionGenerated={handleQuestionGenerated} 
          onClose={() => setShowChatBot(false)}
        />
      )}

{!showChatBot && (
  <button
    onClick={() => setShowChatBot(true)}
    className="fixed bottom-8 right-8 bg-gradient-to-r from-[#4f5bd5] to-[#962fbf] text-white p-4 rounded-full shadow-xl hover:shadow-2xl transition-all z-40 flex items-center justify-center"
    title="AI Question Generator"
  >
    <div className="flex items-center">
      <span className="text-2xl mr-2">🤖</span>
      <span className="hidden md:inline font-medium">Ask Botpapi</span>
    </div>
  </button>
)}
    </div>
  );
};

export default ManageQuiz;