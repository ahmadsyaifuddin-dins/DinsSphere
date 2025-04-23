import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import decode from "jwt-decode";
import Swal from "sweetalert2";

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

const getUserFromToken = () => {
  const token = localStorage.getItem("token");
  if (token) {
    try {
      return decode(token);
    } catch (error) {
      console.error("Gagal decode token:", error);
      return null;
    }
  }
  return null;
};

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [isInitializing, setIsInitializing] = useState(true);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem("token"));

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    setUser(null);
    setToken(null);
  }, []);

  // Inisialisasi auth & user
  useEffect(() => {
    const initAuth = setTimeout(() => {
      if (token) {
        setUser(getUserFromToken());
      } else {
        setUser(null);
      }
      setIsInitializing(false);
    }, 300);
    return () => clearTimeout(initAuth);
  }, [token]);

  // Auto-update token kalau ada perubahan di localStorage (login/logout di tab lain)
  useEffect(() => {
    const handleStorage = (e) => {
      if (e.key === "token") setToken(e.newValue);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // Cek expiry token & auto-logout
  useEffect(() => {
    let timer;
    if (token) {
      try {
        const decoded = decode(token);
        const expiry = decoded.exp * 1000;
        const now = Date.now();
        if (expiry < now) {
          Swal.fire({
            title: "Session Expired",
            text: "Session kamu sudah expired. Klik OK untuk login ulang.",
            icon: "warning",
            confirmButtonText: "OK",
          }).then(() => {
            logout();
            navigate("/login");
          });
        } else {
          timer = setTimeout(() => {
            logout();
            navigate("/login");
            Swal.fire({
              title: "Session Expired",
              text: "Session kamu sudah expired. Silakan login lagi.",
              icon: "warning",
              confirmButtonText: "OK",
            });
          }, expiry - now);
        }
      } catch (error) {
        console.error("Error cek token expiration:", error);
        logout();
        navigate("/login");
      }
    }
    return () => clearTimeout(timer);
  }, [token, logout, navigate]);

  return (
    <AuthContext.Provider value={{ user, token, isInitializing, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
