import axios from "axios";
import { getUserFromStorage } from "../../utils/getUserFromStorage";
import { base_url } from "../../utils/url";
const token = getUserFromStorage();
console.log("TOKEN FROM SERVICES", token);
export const getQuizesAPI = async () => {
  const response = await axios.get(`${base_url}/admin/quizes`,{
    // headers: {
    //   Authorization: `Bearer ${token}`,
    // },
  });
  // console.log("QUIZES FROM QUIZ SERVICES", response.data);
  return response.data;
};
export const getQuizByIdAPI= async (id) => {
  // console.log("ID FROM SERVICES::::::::::::::", id);
  
    const response = await axios.get(`${base_url}/admin/quizes/${id}`, {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    });
    return response.data;
}

export const createQuizAPI= async (formData) => {
  const response = await axios.post(`${base_url}/admin/create-quiz`,
    formData,
    {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export const deleteQuizAPI= async (id) => {
    const response = await axios.delete(`${base_url}/admin/delete-quiz/${id}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
}

export const updateQuizAPI= async (id,updatedData) => {
  const response = await axios.put(`${base_url}/admin/update-quiz/${id}`,updatedData,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
