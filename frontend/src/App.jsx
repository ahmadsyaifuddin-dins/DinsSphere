// App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import Navbar from "./components/Navigation/Navbar";
import MusicPlayer from "./components/tugas_kuliah/MusicPlayer";
import { AuthProvider, useAuth } from "./contexts/authContext";
import LoadingSpinnerUniversal from "./components/common/LoadingSpinnerUniversal";

function AppContent() {
  const { isInitializing } = useAuth();

  if (isInitializing) {
    return <LoadingSpinnerUniversal />;
  }

  return (
    <>
      <Navbar />
      <MusicPlayer />
      <AppRoutes />
    </>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;