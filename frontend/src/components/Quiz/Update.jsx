import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getQuizByIdAPI, updateQuizAPI } from '../../services/quizzes/QuizServices';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const Update = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [errors, setErrors] = useState({});
  const [showRealtimeInfo, setShowRealtimeInfo] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    startdate: new Date(),
    enddate: new Date(),
    starttime: '',
    endtime: '',
    maxpoints: 0,
    duration: 30,
    isRealtime: false
  });

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const response = await getQuizByIdAPI(id);
        const quiz = response;
        const startDate = new Date(quiz.startdate);
        const endDate = new Date(quiz.enddate);
        
        // Format time strings (assuming they come as HH:MM:SS)
        const formatTime = (timeString) => {
          if (!timeString) return '';
          return timeString.split(':').slice(0, 2).join(':');
        };

        setFormData({
          name: quiz.name,
          startdate: startDate,
          enddate: endDate,
          starttime: formatTime(quiz.starttime),
          endtime: formatTime(quiz.endtime),
          maxpoints: quiz.maxpoints,
          duration: quiz.duration,
          isRealtime: quiz.isRealtime
        });
      } catch (error) {
        toast.error(error.response?.data?.message || error.message || 'Failed to fetch quiz');
        console.error('Error fetching quiz:', error);
        // navigate('/admin/quizzes');
      } finally {
        setFetching(false);
      }
    };

    fetchQuiz();
  }, [id, navigate]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const handleDateChange = (date, field) => {
    setFormData({
      ...formData,
      [field]: date
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Quiz name is required';
    if (!formData.startdate) newErrors.startdate = 'Start date is required';
    if (!formData.enddate) newErrors.enddate = 'End date is required';
    if (!formData.starttime) newErrors.starttime = 'Start time is required';
    if (!formData.endtime) newErrors.endtime = 'End time is required';
    if (formData.maxpoints <= 0) newErrors.maxpoints = 'Max points must be greater than 0';
    if (formData.duration <= 0) newErrors.duration = 'Duration must be greater than 0';
    
    if (formData.startdate && formData.enddate && formData.startdate > formData.enddate) {
      newErrors.dateRange = 'End date must be after start date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      // Format dates to ISO string before sending
      const payload = {
        ...formData,
        startdate: formData.startdate.toISOString().split('T')[0],
        enddate: formData.enddate.toISOString().split('T')[0],
        duration: parseInt(formData.duration),
        isRealtime: formData.isRealtime
      };

      const response = await updateQuizAPI(id, payload);
      toast.success(response.message || 'Quiz updated successfully!');
      navigate('/admin/quizzes');
    } catch (error) {
      toast.error(error.response?.data?.message || error.message || 'Failed to update quiz');
      console.error('Error updating quiz:', error);
    } finally {
      setLoading(false);
    }
  };

  if (fetching) {
    return (
      <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-[50px] flex justify-center items-center">
        <p>Loading quiz data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-[50px]">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Edit Quiz</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
            Quiz Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-500' : 'border-gray-300'}`}
            placeholder="Enter quiz name"
          />
          {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
        </div>

        <div className="mb-4">
          <div className="flex items-center">
            <input
              type="checkbox"
              id="isRealtime"
              name="isRealtime"
              checked={formData.isRealtime}
              onChange={handleChange}
              className="mr-2"
            />
            <label htmlFor="isRealtime" className="text-gray-700 text-sm font-bold">
              Realtime Quiz
            </label>
            <button
              type="button"
              onClick={() => setShowRealtimeInfo(!showRealtimeInfo)}
              className="ml-2 text-blue-500 text-xs underline focus:outline-none"
            >
              What is a realtime quiz?
            </button>
          </div>
          
          {showRealtimeInfo && (
            <div className="mt-2 p-3 bg-blue-50 border border-blue-200 rounded-md text-sm text-gray-700">
              <p className="font-semibold">About Realtime Quizzes:</p>
              <ul className="list-disc pl-5 mt-1">
                <li>Questions are displayed to all participants simultaneously</li>
                <li>Participants answer questions in real-time</li>
                <li>Admin controls the flow of questions</li>
                <li>Live results and leaderboard updates</li>
                <li>Ideal for live events and classroom settings</li>
              </ul>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Start Date
            </label>
            <DatePicker
              selected={formData.startdate}
              onChange={(date) => handleDateChange(date, 'startdate')}
              className={`w-full px-3 py-2 border rounded-md ${errors.startdate ? 'border-red-500' : 'border-gray-300'}`}
              minDate={new Date()}
            />
            {errors.startdate && <p className="text-red-500 text-xs mt-1">{errors.startdate}</p>}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2">
              End Date
            </label>
            <DatePicker
              selected={formData.enddate}
              onChange={(date) => handleDateChange(date, 'enddate')}
              className={`w-full px-3 py-2 border rounded-md ${errors.enddate ? 'border-red-500' : 'border-gray-300'}`}
              minDate={formData.startdate}
            />
            {errors.enddate && <p className="text-red-500 text-xs mt-1">{errors.enddate}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="starttime">
              Start Time
            </label>
            <input
              type="time"
              id="starttime"
              name="starttime"
              value={formData.starttime}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.starttime ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.starttime && <p className="text-red-500 text-xs mt-1">{errors.starttime}</p>}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="endtime">
              End Time
            </label>
            <input
              type="time"
              id="endtime"
              name="endtime"
              value={formData.endtime}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.endtime ? 'border-red-500' : 'border-gray-300'}`}
            />
            {errors.endtime && <p className="text-red-500 text-xs mt-1">{errors.endtime}</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="maxpoints">
              Maximum Points
            </label>
            <input
              type="number"
              id="maxpoints"
              name="maxpoints"
              min="1"
              value={formData.maxpoints}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.maxpoints ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter maximum points"
            />
            {errors.maxpoints && <p className="text-red-500 text-xs mt-1">{errors.maxpoints}</p>}
          </div>
          <div>
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="duration">
              Duration (minutes)
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              min="1"
              value={formData.duration}
              onChange={handleChange}
              className={`w-full px-3 py-2 border rounded-md ${errors.duration ? 'border-red-500' : 'border-gray-300'}`}
              placeholder="Enter duration in minutes"
            />
            {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
          </div>
        </div>

        {errors.dateRange && (
          <div className="mb-4 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
            {errors.dateRange}
          </div>
        )}

        <div className="flex items-center justify-between">
          <button
            type="button"
            onClick={() => navigate('/admin/quizzes')}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Quiz'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Update;