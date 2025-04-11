import React, { createContext, useState, useEffect, useContext } from "react";
import axios from "axios";
import decode from "jwt-decode";
import { API_BASE_URL } from "../config";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem("token"));
  const [authVersion, setAuthVersion] = useState(0); // Force re-renders when auth changes

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const currentToken = token;
      
      if (currentToken) {
        try {
          const decoded = decode(currentToken);
          const userId = decoded._id;

          // Get user data from backend
          const response = await axios.get(
            `${API_BASE_URL}/api/users/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${currentToken}`
              }
            }
          );
          setUser(response.data);
        } catch (error) {
          console.error("Error fetching user:", error);
          // Clear everything on error
          setUser(null);
          localStorage.removeItem("token");
          setToken(null);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    };

    fetchUser();
  }, [token, authVersion]);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/api/login`,
        { email, password }
      );
      const newToken = response.data.token;
      localStorage.setItem("token", newToken);
      setToken(newToken);
      setAuthVersion(prev => prev + 1); // Increment version to force re-render
      return true;
    } catch (error) {
      console.error("Login failed:", error);
      return false;
    }
  };

  // Logout function with forced re-render
  const logout = () => {
    // Clear everything
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
    setAuthVersion(prev => prev + 1); // Increment version to force re-render
    
    // Add small delay to ensure state updates have time to propagate
    setTimeout(() => {
      console.log("Logout complete, user state:", null);
    }, 100);
  };

  const contextValue = {
    user,
    loading,
    login,
    logout,
    token,
    authVersion,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook for easier context access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};