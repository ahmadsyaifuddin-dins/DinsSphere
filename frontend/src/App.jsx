// App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import decode from "jwt-decode";
import Swal from "sweetalert2";

import Projects from "./pages/Projects";
import ProjectDetail from "./pages/projectDetail";
import TugasKuliah from "./pages/TugasKuliah";
import DetailTugasKuliah from "./pages/DetailTugasKuliah";
import EditTugasKuliah from "./components/tugas_kuliah/EditTugasKuliah";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import MusicPlayer from "./components/tugas_kuliah/MusicPlayer";
import RegisterFriend from "./pages/RegisterFriend";
import DataUser from "./pages/DataUser";
import DetailUser from "./components/DetailUser/DetailUser";
import Profile from "./pages/Profile";
import ActivityReport from "./pages/ActivityReport";
import DashboardActivity from "./pages/DashboardActivity";
import DashboardUserActivityDetail from "./pages/DashboardUserActivityDetail";
import DeletedUsers from "./pages/DeletedUser";

// Fungsi buat ambil user dari token
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

function App() {
  const navigate = useNavigate();
  
  // Tambahkan state loading
  const [loading, setLoading] = useState(true);
  // Ambil user langsung dari token pake jwt-decode
  const [user, setUser] = useState(null);
  const token = localStorage.getItem("token");

  // Fungsi logout sederhana
  const logout = () => {
    localStorage.removeItem("token");
    // Kalau masih ada profile, bisa hapus juga
    localStorage.removeItem("profile");
    setUser(null);
  };

  // Saat mount atau token berubah, decode token dan update state user
  useEffect(() => {
    const currentUser = getUserFromToken();
    setUser(currentUser);
    setLoading(false);
  }, [token]);

  useEffect(() => {
    const checkTokenExpiration = async () => {
      if (token) {
        try {
          const decoded = decode(token);
          const expiry = decoded.exp * 1000; // konversi ke milidetik
          const now = new Date().getTime();

          if (expiry < now) {
            // Token expired
            await Swal.fire({
              title: "Session Expired",
              text: "Session kamu sudah expired. Klik OK untuk login ulang.",
              icon: "warning",
              confirmButtonText: "OK",
            });
            logout(); // Call logout function
            navigate("/login");
          } else {
            // Set timer untuk auto-logout
            const timeout = expiry - now;
            const timer = setTimeout(() => {
              logout();
              navigate("/login");
              Swal.fire({
                title: "Session Expired",
                text: "Your session has expired. Please login again.",
                icon: "warning",
                confirmButtonText: "OK",
              });
            }, timeout);

            return () => clearTimeout(timer);
          }
        } catch (error) {
          logout();
          navigate("/login");
        }
      }
    };

    checkTokenExpiration();
  }, [navigate, token]);

  // Selama loading, bisa tampilkan spinner atau komponen loader sederhana
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <MusicPlayer />
      <Routes>
        <Route path="/" element={<Projects />} />
        <Route path="/projects" element={<Projects />} />
        <Route path="/tugasKuliah" element={<TugasKuliah />} />
        <Route 
          path="/dashboardActivity" 
          element={user?.role === "superadmin" ? <DashboardActivity /> : <Navigate to="/" />} 
        />
        <Route
          path="/dashboardActivity/user/:userId"
          element={user?.role === "superadmin" ? <DashboardUserActivityDetail /> : <Navigate to="/" />}
        />
        <Route 
          path="/profile" 
          element={<Profile />}  
        />
        <Route path="/login" element={<Login />} />
        <Route 
          path="/activityReport" 
          element={user ? <ActivityReport /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/dataUser" 
          element={user?.role === "superadmin" ? <DataUser /> : <Navigate to="/" />} 
        />
        <Route 
          path="/deletedUsers"
          element={user?.role === "superadmin" ? <DeletedUsers /> : <Navigate to="/" />}
        />
        <Route 
          path="/detailUser/:id" 
          element={user?.role === "superadmin" ? <DetailUser /> : <Navigate to="/" />} 
        />
        <Route 
          path="/registerFriend"
          element={user?.role === "superadmin" ? <RegisterFriend /> : <Navigate to="/" />}
        />
        <Route 
          path="/editTugasKuliah/:id" 
          element={user ? <EditTugasKuliah /> : <Navigate to="/login" />} 
        />
        <Route path="/projectDetail/:id" element={<ProjectDetail />} />
        <Route path="/DetailTugasKuliah/:id" element={<DetailTugasKuliah />} />
      </Routes>
    </>
  );
}

export default App;
