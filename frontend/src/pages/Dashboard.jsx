"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "../contexts/authContext";

import GoogleGeminiEffect from "../components/Dashboard/GoogleGeminiEffect";
import ActivityReport from "./ActivityReport";
import Greeting from "../components/Dashboard/Greeting";

function Dashboard() {
  const { user } = useAuth();
  const firstName = user?.username?.split(" ")[0] || "";
  
  useEffect(() => {
    console.log("Logged in user:", user);
  }, [user]);
  
  const titleText = user ? `${firstName} TerKoneksi` : "TerKoneksi";
  
  // State untuk animasi SVG paths
  const [pathLengths, setPathLengths] = useState([0, 0, 0, 0, 0]);

  useEffect(() => {
    // Timeout untuk memulai animasi setelah load
    const timer = setTimeout(() => {
      setPathLengths([1, 1, 1, 1, 1]);
    }, 500);

    // Listener scroll buat update animasi interaktif
    const handleScroll = () => {
      const scrollPos = window.scrollY;
      const windowHeight = window.innerHeight;
      const scrollPercentage = Math.min(scrollPos / (windowHeight * 0.5), 1);

      if (scrollPercentage > 0.1) {
        setPathLengths([
          Math.min(scrollPercentage * 1.5, 1),
          Math.min((scrollPercentage - 0.1) * 1.5, 1),
          Math.min((scrollPercentage - 0.2) * 1.5, 1),
          Math.min((scrollPercentage - 0.3) * 1.5, 1),
          Math.min((scrollPercentage - 0.4) * 1.5, 1),
        ]);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="relative w-full min-h-screen bg-slate-950 text-white overflow-hidden">
      {/* Bagian Hero */}
      <section className="relative h-screen flex flex-col items-center justify-center">
        {/* Title/main effect - sekarang di atas */}
        <div className="relative w-full z-10">
          <GoogleGeminiEffect
            pathLengths={pathLengths}
            title={titleText}
            description="Stay connected, stay real – DinsSphere nyatuin kita semua."
          />
        </div>
        
        {/* Greeting - sekarang di bawah titleText */}
        <div className="mt-3 z-20 text-center">
          <Greeting user={user} />
        </div>
      </section>

      {/* Konten Dashboard lainnya bisa diletakkan di sini */}

      {/* Section untuk Activity Report */}
      <section className="bg-slate-950 py-8">
        <ActivityReport />
      </section>
    </div>
  );
}

export default Dashboard;