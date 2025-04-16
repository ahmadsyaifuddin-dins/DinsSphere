"use client";
import React, { useState, useEffect } from "react";
import GoogleGeminiEffect from "../components/Dashboard/GoogleGeminiEffect";
import ActivityReport from "./ActivityReport";

function Dashboard() {
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
      <section className="relative h-screen flex items-center justify-center">
        <GoogleGeminiEffect
          pathLengths={pathLengths}
          title="TerKoneksi"
          description="Stay connected, stay real – DinsSphere nyatuin kita semua."
        />
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
