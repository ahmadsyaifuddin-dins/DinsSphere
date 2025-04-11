// src/services/api.js
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2
import { API_BASE_URL } from "../config";

const api = axios.create({
  baseURL: `${API_BASE_URL}/api`, // atau endpoint API lo
});

// Interceptor buat nge-handle error 403 dan 401

export default api;
