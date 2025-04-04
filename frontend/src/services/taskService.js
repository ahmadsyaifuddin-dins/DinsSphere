// services/taskService.js
import axios from "axios";
import { API_BASE_URL } from "../config";

export const getTask = (id) => {
  return axios.get(`${API_BASE_URL}/api/tasks/${id}`);
};

export const deleteTask = (id, token) => {
  return axios.delete(`${API_BASE_URL}/api/tasks/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

export const toggleTaskCompletion = (id, updatedData) => {
  return axios.patch(`${API_BASE_URL}/api/tasks/${id}/complete`, updatedData);
};
