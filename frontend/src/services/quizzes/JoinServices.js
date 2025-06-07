import axios from "axios";
import { base_url } from "../../utils/url";
import { getUserFromStorage } from "../../utils/getUserFromStorage";
const token = getUserFromStorage();

export const joinAPI = async (data) => {
  try {
    const response = await axios.post(`${base_url}/join-quiz`, data, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error in joinAPI:', error.response?.data || error.message);
    throw error;
  }
};
export const getjoinByIDAPI = async (id) => {
  try {
    const response = await axios.get(`${base_url}/join/${id}`);
    return response.data;
  } catch (error) {
    console.error('Error in joinAPI:', error.response?.data || error.message);
    throw error;
  }
};
export const submitAPI = async (submissionData) => {
  try {
    const response = await axios.post(`${base_url}/submit-quiz`, submissionData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error in submitAPI:', error.response?.data || error.message);
    throw error;
  }
};
export const submitQuizAPI = async (submissionData) => {
  try {
    const response = await axios.post(`${base_url}/submit-quiz-all`, submissionData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error in submitAPI:', error.response?.data || error.message);
    throw error;
  }
};
export const getJoinsByQuizAPI = async (QuizId) => {
  try {
    const response = await axios.get(`${base_url}/leaderboard/${QuizId}`,{
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error in getJoinsByQuizAPI:', error.response?.data || error.message);
    throw error;
  }
};