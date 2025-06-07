import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getQuizesAPI } from '../../services/quizzes/QuizServices';
import { joinAPI } from '../../services/quizzes/JoinServices';
import { io } from 'socket.io-client';

const JoinRoom=()=>{
  const [quizCode, setQuizCode] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [socket, setSocket] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    return () => {
      if (socket) {
        socket.disconnect();
      }
    };
  }, [socket]);
  const handleJoin = async () => {
    if (!name || !quizCode) {
      setError("Name and quiz code are required");
      return;
    }
    setLoading(true);
    setError('');
    try {
      const response = await getQuizesAPI();
      if (!response.quizzes || !Array.isArray(response.quizzes)) {
        throw new Error("Invalid quizzes data format");
      }
      const validQuiz = response.quizzes.find(
        quiz => quiz.quizcode.trim().toLowerCase() === quizCode.trim().toLowerCase()
      );
      if (!validQuiz) {
        setError("Please enter a correct quiz code");
        return;
      }
      const joinResponse = await joinAPI({
        name,
        quizCode: validQuiz.quizcode 
      });
      const joinId = joinResponse.joinData._id;
      if (joinResponse && joinResponse.joinData) {
        const newSocket = io('https://cc-blog-backend.onrender.com');
        setSocket(newSocket);
        newSocket.emit('join-room', {
          name: name,
          roomId: validQuiz.id
        });
        newSocket.on('user-joined', (data) => {
          console.log(`${data.name} has ${data.action} the room`);
        });
        
        newSocket.on('user-left', (data) => {
          console.log(`${data.name} has ${data.action} the room`);
        });
        
        newSocket.on('room-users', (users) => {
          console.log('Current room users:', users);
        });
        
        newSocket.on('show-question', (data) => {
          console.log('Current question:', data);
        });
        
        newSocket.on('submission-status', (data) => {
          console.log('Submission status:', data);
        });
        
        navigate(`/quizzes/${validQuiz.id}/${joinId}/${validQuiz.quizcode}`, { 
          state: { 
            joinData: joinResponse.joinData,
            quizData: validQuiz,
          } 
        });
      }
    } catch (err) {
      console.error("Error joining room:", err);
      setError(err.response?.data?.message || "Failed to join quiz. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center space-y-4 bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-gray-800">Join Quiz</h2>
        
        {error && (
          <div className="text-red-500 text-sm p-2 bg-red-50 rounded-md w-64 text-center">
            {error}
          </div>
        )}

        <div className="w-64">
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="Enter Your Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
        </div>

        <div className="w-64">
          <label htmlFor="quizCode" className="block text-sm font-medium text-gray-700 mb-1">
            Quiz Code
          </label>
          <input
            id="quizCode"
            type="text"
            placeholder="Enter Quiz Code"
            value={quizCode}
            onChange={(e) => setQuizCode(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
          />
        </div>

        <button
          onClick={handleJoin}
          disabled={loading}
          className={`px-6 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition w-64 ${
            loading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {loading ? 'Joining...' : 'Join Quiz'}
        </button>
      </div>
    </div>
  );
};

export default JoinRoom;