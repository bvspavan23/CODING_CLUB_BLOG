import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { deleteQuizAction } from "../../redux/slice/quizSlice";
import { deleteQuizAPI } from "../../services/quizzes/QuizServices";

const Quiz = ({id,name,quizCode,startDate,endDate,startTime,endTime,maxPoints,duration = 30}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDelete = async (quizId) => {
    if (window.confirm("Are you sure you want to delete this quiz?")) {
      try {
        await deleteQuizAPI(quizId);
        dispatch(deleteQuizAction(quizId));
      } catch (error) {
        console.error("Error deleting quiz:", error);
      }
    }
  };

  const handleUpdate = () => {
    navigate(`/quiz/update/${id}`);
  };

  const handleStart = () => {
    navigate(`/manage/quiz/${id}`);
  };

  const handleViewLeaderboard = () => {
    navigate(`/quizzes/leaderboard/${quizCode}`);
  };

  const formatDateTime = (dateString, timeString) => {
    if (!dateString) return "N/A";
    
    try {
      const date = new Date(dateString);
      const formattedDate = format(date, "MMM dd, yyyy");
      return timeString ? `${formattedDate} at ${timeString}` : formattedDate;
    } catch (error) {
      console.error("Error formatting date:", error);
      return "Invalid date";
    }
  };

  // Check if the quiz is active (between start and end dates)
  const isQuizActive = () => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);
    return now >= start && now <= end;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="p-6">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-2xl font-bold text-gray-800 mb-1">{name}</h3>
            <p className="text-gray-500 text-sm">Code: {quizCode}</p>
          </div>
          <div className="flex space-x-2">
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
              isQuizActive() 
                ? "bg-green-100 text-green-800" 
                : "bg-blue-100 text-blue-800"
            }`}>
              {isQuizActive() ? "Live" : "Upcoming"}
            </span>
          </div>
        </div>

        <div className="mt-5 grid grid-cols-2 gap-4">
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 font-medium">Max Points</p>
            <p className="text-lg font-bold text-gray-800">{maxPoints} pts</p>
          </div>
          <div className="bg-gray-50 p-3 rounded-lg">
            <p className="text-xs text-gray-500 font-medium">Duration</p>
            <p className="text-lg font-bold text-gray-800">{duration} mins</p>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="text-xs text-gray-500">Starts</p>
              <p className="text-sm font-medium">{formatDateTime(startDate, startTime)}</p>
            </div>
          </div>
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <div>
              <p className="text-xs text-gray-500">Ends</p>
              <p className="text-sm font-medium">{formatDateTime(endDate, endTime)}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button
            onClick={handleStart}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
          >
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Manage Quiz
          </button>
          
          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={handleUpdate}
              className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg transition-colors duration-300 text-sm"
            >
              Edit
            </button>
            <button
              onClick={handleViewLeaderboard}
              className="bg-purple-500 hover:bg-purple-600 text-white py-2 px-4 rounded-lg transition-colors duration-300 text-sm"
            >
              Leaderboard
            </button>
            <button
              onClick={() => handleDelete(id)}
              className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors duration-300 text-sm"
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;