import axios from "axios";
import { BASE_URL } from "../../utils/url";
import { getUserFromStorage } from "../../utils/getUserFromStorage";

const token = getUserFromStorage();

export const EventAPI = async (formData) => {
  const response = await axios.post(`${BASE_URL}/edit/addeve`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  // Return a promise
  return response.data;
};
export const registerEventAPI = async (formData) => {
  const response = await axios.post(`${BASE_URL}/student/reg`, formData,{
    headers: {
      "Content-Type": "application/json",
    },
  });  

  //Return a promise
  return response.data
}
export const deleteEventAPI = async (id) => {
  const response = await axios.delete(`${BASE_URL}/events/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  // Return a promise
  return response.data;
};


export const updateEventAPI = async (eventname, formData) => {
  try {
    const response = await axios.put(`${BASE_URL}/events/${encodeURIComponent(eventname)}`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error in updateEventAPI:", error);
    throw error;
  }
};