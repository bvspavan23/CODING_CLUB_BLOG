import axios from "axios";
import { getUserFromStorage } from "../../utils/getUserFromStorage";
import { base_url } from "../../utils/url";
const token = getUserFromStorage();
console.log("TOKEN FROM SERVICES", token);
export const getQuestionsAPI = async () => {
  const response = await axios.get(`${base_url}/admin/questions`,{
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const getPublicQuestionsAPI = async () => {
  const response = await axios.get(`${base_url}/questions`,{
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};
export const getQuestionByIdAPI= async (id) => {
    const response = await axios.get(`${base_url}/admin/questions/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
}
export const getPublicQuestionByIdAPI= async (id) => {
    const response = await axios.get(`${base_url}/questions/${id}`, {
      // headers: {
      //   Authorization: `Bearer ${token}`,
      // },
    });
    return response.data;
}

export const createOrUpdateQuestionsAPI= async (id,formData) => {
  const response = await axios.post(`${base_url}/admin/${id}/add-question`,
    formData,
    {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}

export const deleteQuestionAPI= async (id) => {
    const response = await axios.delete(`${base_url}/admin/delete-question/${id}`,{
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
}

export const updateQuestionAPI= async (id,updatedData) => {
  const response = await axios.put(`${base_url}/admin/update-question/${id}`,updatedData,{
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
}
