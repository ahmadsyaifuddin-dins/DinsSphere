import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import DashboardTugasKuliah from './pages/DashboardTugasKuliah';
import Login from './pages/Login';
import ProjectDetail from './pages/projectDetail';
import DetailTugasKuliah from './pages/DetailTugasKuliah';
import EditTugasKuliah from './components/tugas_kuliah/EditTugasKuliah';
import Navbar from "./components/Navbar";

function App() {
  const token = localStorage.getItem("token");

  return (
    <>
      <Navbar /> 
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
