// App.jsx
import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "./contexts/authContext";
import decode from "jwt-decode";
import Swal from "sweetalert2";

import Dashboard from "./pages/Dashboard";
import DashboardTugasKuliah from "./pages/DashboardTugasKuliah";
import Login from "./pages/Login";
import ProjectDetail from "./pages/projectDetail";
import DetailTugasKuliah from "./pages/DetailTugasKuliah";
import EditTugasKuliah from "./components/tugas_kuliah/EditTugasKuliah";
import Navbar from "./components/Navbar";
import MusicPlayer from "./components/tugas_kuliah/MusicPlayer";
import RegisterFriend from "./pages/RegisterFriend";
import DataUser from "./pages/DataUser";
import DetailUser from "./components/DetailUser/DetailUser";
import Profile from "./pages/Profile";
import ActivityReport from "./pages/ActivityReport";
import DashboardActivity from "./pages/DashboardActivity";
import DashboardUserActivityDetail from "./pages/DashboardUserActivityDetail";

function App() {
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const checkTokenExpiration = async () => {
      if (token) {
        try {
          const decoded = decode(token);
          const expiry = decoded.exp * 1000;
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
            // Set timer for auto-logout
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
  }, [navigate, logout, token]);

  return (
    <>
      <Navbar />
      <MusicPlayer />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboardTugasKuliah" element={<DashboardTugasKuliah />} />
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
          element={user ? <Profile /> : <Navigate to="/login" />} 
        />
        <Route
          path="/login"
          element={!user ? <Login /> : <Navigate to="/dashboard" />}
        />
        <Route 
          path="/activityReport" 
          element={user ? <ActivityReport /> : <Navigate to="/login" />} 
        />
        <Route 
          path="/dataUser" 
          element={user?.role === "superadmin" ? <DataUser /> : <Navigate to="/" />} 
        />
        <Route 
          path="/detailUser/:id" 
          element={user?.role === "superadmin" ? <DetailUser /> : <Navigate to="/" />} 
        />
        <Route
          path="/registerFriend"
          element={
            user?.role === "superadmin" ? (
              <RegisterFriend />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route path="/editTugasKuliah/:id" element={user ? <EditTugasKuliah /> : <Navigate to="/login" />} />
        <Route path="/projectDetail/:id" element={<ProjectDetail />} />
        <Route path="/DetailTugasKuliah/:id" element={<DetailTugasKuliah />} />
      </Routes>
    </>
  );
}

export default App;