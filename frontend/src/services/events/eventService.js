import axios from "axios";
import { BASE_URL } from "../../utils/url";
import { getUserFromStorage } from "../../utils/getUserFromStorage";

const token = getUserFromStorage();

export const createEventAPI = async (formData) => {
  const response = await axios.post(
    `${BASE_URL}/events`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

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
export const updateEventAPI = async (eventid, formData) => {
  if (!eventid) {
    throw new Error("Event ID is required for update");
  }

  const response = await axios.patch(
    `${BASE_URL}/events/${eventid}`,
    formData,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};
export const getEventByIdAPI = async (eventid) => {
  const response = await axios.get(`${BASE_URL}/events/${eventid}`);
  return response.data;
};