import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import ProjectDetail from './pages/projectDetail';
import Navbar from "./components/Navbar"; // Import the new Navbar component

function App() {
  const token = localStorage.getItem("token");

  return (
    <BrowserRouter>
      <Navbar /> 
        <Routes>
          {/* Halaman default untuk guest: tampilkan Dashboard */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/dashboard" element={<Dashboard />} />
          {/* Halaman login hanya untuk admin, jika sudah login, redirect ke Dashboard */}
          <Route path="/login" element={!token ? <Login /> : <Navigate to="/dashboard" />} />
          <Route path="/projectDetail/:id" element={<ProjectDetail />} />
        </Routes>
    </BrowserRouter>
  );
}

export default App;
