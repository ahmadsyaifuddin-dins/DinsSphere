// RegisterFriend.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Swal from "sweetalert2";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faUserTag,
  faEnvelope,
  faLock,
  faShieldAlt,
  faUserFriends,
  faSpinner,
} from "@fortawesome/free-solid-svg-icons";
import InputField from "../components/RegisterFriend/InputField"; // Import komponen yang sudah dipisah

const RegisterFriend = () => {
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    nuclearCode: "",
    role: "friend",
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
      const res = await api.post("/auth/register", formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire({
        icon: "success",
        title: "Friend Registered!",
        text: "New friend has been successfully added",
        background: "#1F2937",
        color: "#F3F4F6",
        confirmButtonColor: "#3B82F6",
      });
      setFormData({
        name: "",
        username: "",
        email: "",
        password: "",
        nuclearCode: "",
        role: "friend",
      });
      navigate("/dataUser");
    } catch (err) {
      console.error("Registration error:", err);
      Swal.fire({
        icon: "error",
        title: "Registration Failed",
        text: err.response?.data?.error || "Please try again later.",
        background: "#1F2937",
        color: "#F3F4F6",
        confirmButtonColor: "#3B82F6",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex justify-center items-center p-4">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              Register Friend
            </h2>
            <p className="text-blue-100 opacity-80 mt-1">
            Menambahkan teman yang terpercaya ke DinsSphere InterConnected
            </p>
          </div>
          <div className="bg-white rounded-full p-3 shadow-lg">
            <FontAwesomeIcon
              icon={faUserFriends}
              className="text-blue-600 text-xl"
            />
          </div>
        </div>

        {/* Form Section */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Perhatikan penambahan prop 'key' */}
            <InputField
              key="name"
              icon={faUser}
              type="text"
              name="name"
              label="Nama Lengkap"
              placeholder="Masukan nama lengkap"
              value={formData.name}
              onChange={handleChange}
            />
            <InputField
              key="username"
              icon={faUserTag}
              type="text"
              name="username"
              label="Username"
              placeholder="Pilih Username, contoh absolute1"
              value={formData.username}
              onChange={handleChange}
            />
            <InputField
              key="email"
              icon={faEnvelope}
              type="email"
              name="email"
              label="Email Address"
              placeholder="Enter email address"
              value={formData.email}
              onChange={handleChange}
            />
            <InputField
              key="password"
              icon={faLock}
              type="password"
              name="password"
              label="Password"
              placeholder="Create a strong password"
              value={formData.password}
              onChange={handleChange}
            />
            <InputField
              key="nuclearCode"
              icon={faShieldAlt}
              type="text"
              name="nuclearCode"
              label="Nuclear Code"
              placeholder="Masukan Nuclear Code"
              value={formData.nuclearCode}
              onChange={handleChange}
            />

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white py-3 px-4 rounded-lg font-medium mt-4 transition duration-300 flex items-center justify-center"
            >
              {isSubmitting ? (
                <>
                  <FontAwesomeIcon icon={faSpinner} spin className="mr-2" />
                  Registering...
                </>
              ) : (
                <>
                  <FontAwesomeIcon icon={faUserFriends} className="mr-2" />
                  Register Friend
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/dataUser")}
              className="text-blue-400 hover:text-blue-300 text-sm transition duration-300"
            >
              Back to Data User
            </button>
          </div>
        </div>

        {/* Footer Note */}
        <div className="bg-gray-900 p-4 text-center text-gray-400 text-sm">
          <p>Semua teman harus mematuhi protokol keamanan</p>
        </div>
      </div>
    </div>
  );
};

export default RegisterFriend;