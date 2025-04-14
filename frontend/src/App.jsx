// App.jsx
import React, { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";
import AppRoutes from "./routes/AppRoutes";
import LoadingSpinner from "./components/common/LoadingSpinner";
import Navbar from "./components/Navbar";
import MusicPlayer from "./components/tugas_kuliah/MusicPlayer";
import { AuthProvider, useAuth } from "./contexts/authContext";

function AppContent() {
  const { isInitializing } = useAuth();

  if (isInitializing) {
    return <LoadingSpinner />;
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