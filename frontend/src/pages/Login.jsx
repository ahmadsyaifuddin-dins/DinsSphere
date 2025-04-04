import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nuclearCode, setNuclearCode] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
      // const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
        nuclearCode,
      });

      // Simpan token di localStorage untuk otentikasi admin
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard"); // arahkan ke dashboard admin
    } catch (err) {
      console.error(err);
      setError("Email, Password, atau Kode Nuklir salah.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#121212]">
      <div className="bg-[#1E1E2E] p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Login</h2>
        {error && (
          <div className="bg-red-500 text-white p-2 rounded mb-4">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="email">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-2 rounded bg-[#121212] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          {/* Password */}
          <div className="mb-4">
            <label className="block text-gray-300 mb-2" htmlFor="password">
              Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-2 rounded bg-[#121212] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {/* Kode Nuklir */}
          <div className="mb-6">
            <label className="block text-gray-300 mb-2" htmlFor="nuclearCode">
              Kode Nuklir
            </label>
            <input
              type="text"
              id="nuclearCode"
              className="w-full p-2 rounded bg-[#121212] text-white border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3A86FF]"
              value={nuclearCode}
              onChange={(e) => setNuclearCode(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="cursor-pointer w-full py-2 px-4 bg-[#3A86FF] text-white font-semibold rounded hover:bg-blue-500 transition"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
