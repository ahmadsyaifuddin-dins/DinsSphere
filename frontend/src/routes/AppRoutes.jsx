// routes/AppRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/authContext";

// Import semua halaman
import Projects from "../pages/Projects";
import ProjectDetail from "../pages/projectDetail";
import TugasKuliah from "../pages/TugasKuliah";
import DetailTugasKuliah from "../pages/DetailTugasKuliah";
import EditTugasKuliah from "../components/tugas_kuliah/EditTugasKuliah";
import Login from "../pages/Login";
import RegisterFriend from "../pages/RegisterFriend";
import DataUser from "../pages/DataUser";
import DetailUser from "../components/DetailUser/DetailUser";
import Profile from "../pages/Profile";
import ActivityReport from "../pages/ActivityReport";
import DashboardActivity from "../pages/DashboardActivity";
import DashboardUserActivityDetail from "../pages/DashboardUserActivityDetail";
import DeletedUsers from "../pages/DeletedUser";
import EditUser from "../components/DetailUser/EditUser";
import Dashboard from "../pages/Dashboard";

const AppRoutes = () => {
  const { user } = useAuth();

  // Helper untuk route yang membutuhkan autentikasi
  const ProtectedRoute = ({ children, requiredRole = null }) => {
    if (!user) {
      return <Navigate to="/login" />;
    }
    
    if (requiredRole && user.role !== requiredRole) {
      return <Navigate to="/" />;
    }
    
    return children;
  };

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/projects" element={<Projects />} />
      <Route path="/tugasKuliah" element={<TugasKuliah />} />
      <Route path="/login" element={<Login />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/projectDetail/:id" element={<ProjectDetail />} />
      <Route path="/DetailTugasKuliah/:id" element={<DetailTugasKuliah />} />

      {/* Protected Routes */}
      <Route 
        path="/activityReport" 
        element={
          <ProtectedRoute>
            <ActivityReport />
          </ProtectedRoute>
        } 
      />

      <Route 
        path="/editTugasKuliah/:id" 
        element={
          <ProtectedRoute>
            <EditTugasKuliah />
          </ProtectedRoute>
        } 
      />

      {/* Admin Routes */}
      <Route
        path="/dashboardActivity"
        element={
          <ProtectedRoute requiredRole="superadmin">
            <DashboardActivity />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dashboardActivity/user/:userId"
        element={
          <ProtectedRoute requiredRole="superadmin">
            <DashboardUserActivityDetail />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/dataUser"
        element={
          <ProtectedRoute requiredRole="superadmin">
            <DataUser />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/deletedUsers"
        element={
          <ProtectedRoute requiredRole="superadmin">
            <DeletedUsers />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/detailUser/:id"
        element={
          <ProtectedRoute requiredRole="superadmin">
            <DetailUser />
          </ProtectedRoute>
        }
      />

      <Route
        path="/editUser/:id"
        element={
          <ProtectedRoute requiredRole="superadmin">
            <EditUser />
          </ProtectedRoute>
        }
      />
      
      <Route
        path="/registerFriend"
        element={
          <ProtectedRoute requiredRole="superadmin">
            <RegisterFriend />
          </ProtectedRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;