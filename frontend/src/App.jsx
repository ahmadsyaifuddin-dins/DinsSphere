import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DashboardTugasKuliah from './pages/DashboardTugasKuliah';
import Login from './pages/Login';
import ProjectDetail from './pages/projectDetail';
import DetailTugasKuliah from './pages/DetailTugasKuliah';
import EditTugasKuliah from './components/tugas_kuliah/EditTugasKuliah';
import Navbar from "./components/Navbar";
import MusicPlayer from './components/tugas_kuliah/MusicPlayer';
import Swal from 'sweetalert2';

function App() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate(); // pakai useNavigate bukan useHistory

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const tokenData = JSON.parse(atob(token.split(".")[1])); // Decode token (ingat, ini cuma JWT tanpa verifikasi signature)
      const expiry = tokenData.exp * 1000; // exp dalam detik, jadi diubah ke ms
      const now = new Date().getTime();
      
      if (expiry < now) {
        // Token udah expired, logout
        localStorage.removeItem("token");
        navigate("/login");
      } else {
        // Set timeout buat auto logout
        const timeout = expiry - now;
        const timer = setTimeout(async () => {
          localStorage.removeItem("token");
          const result = await Swal.fire({
            title: "Session Expired",
            text: "Session kamu udah expired. Klik OK untuk login ulang.",
            icon: "warning",
            confirmButtonText: "OK",
          });
          if (result.isConfirmed) {
            navigate("/login");
          }
          navigate("/login");
        }, timeout);
  
        // Cleanup timer kalo component unmount
        return () => clearTimeout(timer);
      }
    }
  }, [navigate]);
  
  return (
    <>
      <Navbar /> 
      <MusicPlayer />
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboardTugasKuliah" element={<DashboardTugasKuliah />} />
        <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
        <Route path="/editTugasKuliah/:id" element={<EditTugasKuliah />} />
        <Route path="/projectDetail/:id" element={<ProjectDetail />} />
        <Route path="/DetailTugasKuliah/:id" element={<DetailTugasKuliah />} />
      </Routes>
    </>
  );
}

export default App;
