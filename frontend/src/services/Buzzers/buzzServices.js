import axios from "axios";
import { BASE_URL } from "../../utils/url";
export const getBuzzRooms = async () => {
  const response = await axios.get(`${BASE_URL}/buzzes`);
  return response.data;
};

export const createBuzzRoom = async (name) => {
  const response = await axios.post(`${BASE_URL}/create-buzz`, {
    name
  });
  return response.data;
};

export const deleteBuzzRoom = async (roomId) => {
  const response = await axios.delete(`${BASE_URL}/buzzes/delete/${roomId}`);
  return response.data;
};
