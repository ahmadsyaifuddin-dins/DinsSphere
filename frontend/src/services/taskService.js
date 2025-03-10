// services/taskService.js
import axios from "axios";

const API_URL = "http://localhost:5000/api/tasks";

export const getTask = (id) => {
  return axios.get(`${API_URL}/${id}`);
};

export const deleteTask = (id, token) => {
  return axios.delete(`${API_URL}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const toggleTaskCompletion = (id, updatedData) => {
  return axios.patch(`${API_URL}/${id}/complete`, updatedData);
};
