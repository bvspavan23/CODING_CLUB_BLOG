import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getJoinsByQuizAPI } from '../../services/quizzes/JoinServices';
import { FaTrophy } from 'react-icons/fa';           
import { BsStars } from 'react-icons/bs';             
import { FaRegClock } from 'react-icons/fa';          
import { FaUser } from 'react-icons/fa';              
import { FaCheckCircle } from 'react-icons/fa';       


const Leaderboard = () => {
  const { QuizId } = useParams();
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchParticipants = async () => {
      try {
        const response = await getJoinsByQuizAPI(QuizId);
        const data = response.joins || [];
        
        const sortedData = [...data].sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          return new Date(a.updatedAt) - new Date(b.updatedAt);
        });
        setParticipants(sortedData);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchParticipants();
  }, [QuizId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-500"></div>
        <p className="mt-4 text-lg text-gray-600">Loading leaderboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg shadow-sm">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">Error loading leaderboard: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getRankColor = (index) => {
    switch(index) {
      case 0: return 'from-yellow-400 to-yellow-500';
      case 1: return 'from-gray-400 to-gray-500';
      case 2: return 'from-amber-600 to-amber-700';
      default: return 'from-indigo-400 to-indigo-600';
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
          Quiz Leaderboard
        </h1>
        <p className="max-w-xl mt-5 mx-auto text-xl text-gray-500">
          Top performers for this quiz competition
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200">
        {/* Header */}
        <div className="grid grid-cols-12 gap-4 bg-gradient-to-r from-indigo-700 to-purple-800 text-white p-5 items-center">
          <div className="col-span-1 text-center font-bold text-sm uppercase tracking-wider">Rank</div>
          <div className="col-span-5 flex items-center font-bold text-sm uppercase tracking-wider">
            <FaUser className="h-5 w-5 mr-2" />
            Participant
          </div>
          <div className="col-span-3 flex items-center justify-center font-bold text-sm uppercase tracking-wider">
            <BsStars className="h-5 w-5 mr-2" />
            Score
          </div>
          <div className="col-span-3 flex items-center justify-center font-bold text-sm uppercase tracking-wider">
            <FaRegClock className="h-5 w-5 mr-2" />
            Submission Time
          </div>
        </div>
        
        {/* Empty state */}
        {participants.length === 0 ? (
          <div className="p-10 text-center">
            <FaTrophy className="mx-auto h-16 w-16 text-gray-300" />
            <h3 className="mt-2 text-lg font-medium text-gray-900">No participants yet</h3>
            <p className="mt-1 text-gray-500">Be the first to take this quiz and top the leaderboard!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {participants.map((participant, index) => (
              <div
                key={participant._id}
                className={`grid grid-cols-12 gap-4 p-5 items-center transition-all duration-200
                  ${index < 3 ? 'bg-gradient-to-r bg-opacity-10' : 'hover:bg-gray-50'}`}
              >
                {/* Rank */}
                <div className="col-span-1 flex justify-center">
                  <div className={`flex items-center justify-center h-10 w-10 rounded-full bg-gradient-to-r ${getRankColor(index)} text-white font-bold`}>
                    {index + 1}
                    {index < 3 && (
                      <span className="ml-1">
                        {index === 0 && '🥇'}
                        {index === 1 && '🥈'}
                        {index === 2 && '🥉'}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Participant */}
                <div className="col-span-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center">
                      <FaUser className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">{participant.name}</div>
                      {/* <div className="text-sm text-gray-500">#{participant.userId?.slice(-6) || 'N/A'}</div> */}
                    </div>
                  </div>
                </div>
                
                {/* Score */}
                <div className="col-span-3 flex justify-center">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold 
                    ${index < 3 ? 'bg-indigo-100 text-indigo-800' : 'bg-gray-100 text-gray-800'}`}>
                    {participant.score} pts
                  </span>
                </div>
                
                {/* Submission Time */}
                <div className="col-span-3 flex justify-center">
                  <div className="text-center">
                    {participant.isSubmitted ? (
                      <>
                        <div className="flex items-center justify-center text-sm text-gray-900">
                          <FaCheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          {formatDate(participant.updatedAt)}
                        </div>
                        <div className="text-xs text-gray-500">
                          {Math.floor((new Date() - new Date(participant.updatedAt)) / (1000 * 60))} mins ago
                        </div>
                      </>
                    ) : (
                      <span className="text-sm text-gray-500">Not submitted</span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      {participants.length > 0 && (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-indigo-500 rounded-md p-3">
                  <FaTrophy className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Top Score</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {participants[0]?.score || 0}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-purple-500 rounded-md p-3">
                  <FaUser className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Participants</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {participants.length}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0 bg-green-500 rounded-md p-3">
                  <BsStars className="h-6 w-6 text-white" />
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dt className="text-sm font-medium text-gray-500 truncate">Average Score</dt>
                  <dd className="flex items-baseline">
                    <div className="text-2xl font-semibold text-gray-900">
                      {Math.round(participants.reduce((acc, curr) => acc + curr.score, 0) / participants.length * 10) / 10 || 0}
                    </div>
                  </dd>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leaderboard;