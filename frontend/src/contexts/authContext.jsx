// contexts/AuthContext.js
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import decode from "jwt-decode";
import Swal from "sweetalert2";

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Fungsi untuk decode token dan ambil data user
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
  const token = localStorage.getItem("token");

  // Fungsi logout buat hapus token dan user, lalu redirect ke /login
  const logout = useCallback(() => {
    localStorage.removeItem("token");
    localStorage.removeItem("profile");
    setUser(null);
  }, []);

  // Pas token berubah atau saat mount, decode token dan update state user
  useEffect(() => {
    // Kita gunakan setTimeout supaya UI tidak berkedip pada load cepat
    const initAuth = setTimeout(() => {
      if (token) {
        const currentUser = getUserFromToken();
        setUser(currentUser);
      } else {
        setUser(null);
      }
      setIsInitializing(false);
    }, 300); // Small timeout to prevent flashing on fast connections
    
    return () => clearTimeout(initAuth);
  }, [token]);

  // Cek token expiration dan set timeout buat auto-logout
  useEffect(() => {
    let timer;
    const checkTokenExpiration = () => {
      if (token) {
        try {
          const decoded = decode(token);
          const expiry = decoded.exp * 1000; // Konversi exp ke milidetik
          const now = Date.now();

          if (expiry < now) {
            // Token expired, langsung logout dan redirect
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
            // Set timeout untuk auto-logout ketika token expired
            const timeout = expiry - now;
            timer = setTimeout(() => {
              logout();
              navigate("/login");
              Swal.fire({
                title: "Session Expired",
                text: "Your session has expired. Please login again.",
                icon: "warning",
                confirmButtonText: "OK",
              });
            }, timeout);
          }
        } catch (error) {
          console.error("Error saat ngecek token expiration:", error);
          logout();
          navigate("/login");
        }
      }
    };

    checkTokenExpiration();

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [token, navigate, logout]);

  return (
    <AuthContext.Provider value={{ user, isInitializing, logout }}>
      {children}
    </AuthContext.Provider>
  );
};