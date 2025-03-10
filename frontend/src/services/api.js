// src/services/api.js
import axios from "axios";
import Swal from "sweetalert2"; // Import SweetAlert2

const api = axios.create({
  baseURL: "https://dins-sphere-backend.vercel.app/api", // atau endpoint API lo
});

// Interceptor buat nge-handle error 403
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response && error.response.status === 403) {
      const result = await Swal.fire({
        title: "Session Expired",
        text: "Session kamu udah expired. Klik OK untuk login ulang.",
        icon: "warning",
        confirmButtonText: "OK",
        showCancelButton: true,
        cancelButtonText: "Cancel",
      });
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
