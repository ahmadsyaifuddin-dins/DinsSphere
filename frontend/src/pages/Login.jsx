import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { Shield, Mail, Lock, Key, AlertTriangle } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nuclearCode, setNuclearCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await axios.post(`${API_BASE_URL}/api/auth/login`, {
        email,
        password,
        nuclearCode,
      });

      // Store token in localStorage for admin authentication
      localStorage.setItem("token", res.data.token);
      navigate("/"); // Redirect to dashboard
    } catch (err) {
      console.error(err);
      // If there's an error response from the server, use the message from the server
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Email, Password, atau Kode Nuklir salah.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-md border border-gray-700">
        <div className="flex items-center justify-center mb-6">
          <Shield className="text-blue-500 mr-2" size={28} />
          <h2 className="text-3xl font-bold text-white text-center">DinsSphere</h2>
        </div>
        
        <p className="text-gray-400 text-center mb-8 text-sm">
          Restricted access. admin Created accounts only.
        </p>
        
        {error && (
          <div className="bg-red-900 text-white p-3 rounded-lg mb-6 flex items-center">
            <AlertTriangle size={18} className="mr-2 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium" htmlFor="email">
              Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Mail size={18} className="text-gray-500" />
              </div>
              <input
                type="email"
                id="email"
                className="w-full pl-10 p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your-email@example.com"
                required
              />
            </div>
          </div>
          
          {/* Password */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium" htmlFor="password">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock size={18} className="text-gray-500" />
              </div>
              <input
                type="password"
                id="password"
                className="w-full pl-10 p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                required
              />
            </div>
          </div>
          
          {/* Nuclear Code */}
          <div>
            <label className="block text-gray-300 mb-2 font-medium" htmlFor="nuclearCode">
              Kode Nuklir
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Key size={18} className="text-gray-500" />
              </div>
              <input
                type="text"
                id="nuclearCode"
                className="w-full pl-10 p-3 rounded-lg bg-gray-900 text-white border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={nuclearCode}
                onChange={(e) => setNuclearCode(e.target.value)}
                placeholder="Enter your nuclear code"
                required
              />
            </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className={`w-full cursor-pointer py-3 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-500 transition duration-300 flex items-center justify-center ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
            ) : (
              "Login Secure"
            )}
          </button>
        </form>
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>This system is restricted to accounts created by admin only.</p>
          <p className="mt-1">Created and managed by admin.</p>
        </div>
      </div>
    </div>
  );
};

export default Login;