// src/services/taskService.js
import axios from "axios";
import { API_BASE_URL } from "../config";

// helper ambil header auth otomatis
function getAuthHeader() {
  const token = localStorage.getItem("token"); // pastikan key-nya sama waktu simpan pas login
  return { Authorization: `Bearer ${token}` };
}

export const getTask = (id) => {
  return axios.get(`${API_BASE_URL}/api/tasks/${id}`, {
    headers: getAuthHeader(),
  });
};

export const updateTask = (id, payload) => {
  return axios.put(`${API_BASE_URL}/api/tasks/${id}`, payload, {
    headers: getAuthHeader(),
  });
};

export const deleteTask = (id) => {
  return axios.delete(`${API_BASE_URL}/api/tasks/${id}`, {
    headers: getAuthHeader(),
  });
};

export const toggleTaskCompletion = (id, updatedData) => {
  return axios.patch(
    `${API_BASE_URL}/api/tasks/${id}/complete`,
    updatedData,
    { headers: getAuthHeader() }
  );
};
