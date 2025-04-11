import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Swal from "sweetalert2";

const RegisterFriend = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    nuclearCode: "",
    role: "friend", // role default fixed sebagai "friend"
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const token = localStorage.getItem("token");
      // Pastikan token valid dan sesuai peran (SuperAdmin) sebelum akses register endpoint
      const res = await api.post("/auth/register", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Success", "User registered successfully!", "success");
      // Reset form atau langsung redirect ke halaman lain, misal dashboard
      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
        nuclearCode: "",
        role: "friend",
      });
      navigate("/dashboard");
    } catch (err) {
      console.error("Registration error:", err);
      Swal.fire(
        "Error",
        err.response?.data?.error || "Registration failed. Please try again.",
        "error"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Register New Friend
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Nuclear Code</label>
            <input
              type="text"
              name="nuclearCode"
              value={formData.nuclearCode}
              onChange={handleChange}
              required
              className="w-full border rounded px-3 py-2"
            />
          </div>
          {/* Button Register */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 transition duration-200"
          >
            {isSubmitting ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegisterFriend;
