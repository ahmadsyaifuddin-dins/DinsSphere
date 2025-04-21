// components/Dashboard/Greeting.jsx
"use client";
import React, { useState, useEffect } from "react";

function Greeting({ user }) {
  const firstName = user?.username?.split(" ")[0] || "";
  const [greeting, setGreeting] = useState({ personalGreeting: "", message: "" });

  useEffect(() => {
    // Generate greeting based on time of day
    const generateGreeting = () => {
      const hour = new Date().getHours();
      let timeGreeting = "";
      let message = "";
      
      // Get random message based on time of day - tailored for DinsSphere tugas/projects management
      const morningMessages = [
        "Cek timeline tugas pagi ini! Ada deadline yang perlu dikerjakan?",
        "Mulai hari dengan merencanakan tugas-tugas prioritasmu di DinsSphere!",
        "Jangan lupa update progress project kuliahmu hari ini ya!",
        "Pagi yang produktif! Saatnya organisir tugas kuliah di DinsSphere.",
        "Beberapa tugas menunggumu di dashboard. Sudah siap mengerjakan?",
        "Refresh dulu timelinenya, ada project baru yang masuk semalam!"
      ];
      
      const noonMessages = [
        "Istirahat siang, tapi jangan lupa cek deadline tugas yang mendekat!",
        "Sudah mengerjakan berapa tugas hari ini? Progress kamu terlihat bagus!",
        "Waktunya update status project di tengah hari. Tim sudah menunggu!",
        "Cek notifikasi di DinsSphere, mungkin ada tugas baru dari dosen.",
        "Makan siang sambil review tugas? Multitasking yang sempurna!",
        "Ada beberapa update project yang masuk. Yuk refreshed timeline!"
      ];
      
      const afternoonMessages = [
        "Sore yang produktif! Masih ada waktu menyelesaikan tugas hari ini.",
        "Sudah submit tugas deadline hari ini? DinsSphere menunggu update-mu!",
        "Review progress project sore ini, besok bisa mulai dengan fresh.",
        "Beberapa jam lagi sebelum deadline, cek status tugasmu di dashboard!",
        "Update progress projectmu sebelum pulang, tim akan berterima kasih!",
        "Lihat timeline untuk minggu depan, ada beberapa project yang harus dipersiapkan!"
      ];
      
      const nightMessages = [
        "Planning tugas untuk besok? DinsSphere siap membantumu mengatur!",
        "Jangan begadang terlalu malam, tugasmu sudah terjadwal dengan baik di sini.",
        "Review progress hari ini dan rencanakan besok lebih baik lagi!",
        "Ada notifikasi baru, deadline project mendekat! Cek timeline sekarang.",
        "Malam ini waktunya fokus menyelesaikan tugas prioritas di DinsSphere.",
        "Sambil istirahat, yuk cek jadwal presentasi project minggu depan!"
      ];
      
      // Set time-based greeting
      if (hour >= 5 && hour < 12) {
        timeGreeting = "Pagi";
        message = morningMessages[Math.floor(Math.random() * morningMessages.length)];
      } else if (hour >= 12 && hour < 15) {
        timeGreeting = "Siang";
        message = noonMessages[Math.floor(Math.random() * noonMessages.length)];
      } else if (hour >= 15 && hour < 19) {
        timeGreeting = "Sore";
        message = afternoonMessages[Math.floor(Math.random() * afternoonMessages.length)];
      } else {
        timeGreeting = "Malam";
        message = nightMessages[Math.floor(Math.random() * nightMessages.length)];
      }
      
      const personalGreeting = user ? `Selamat ${timeGreeting}, ${firstName}!` : `Selamat ${timeGreeting}!`;
      setGreeting({ personalGreeting, message });
    };
    
    generateGreeting();
    
    // Optional: update greeting every hour
    const intervalId = setInterval(generateGreeting, 3600000);
    
    return () => clearInterval(intervalId);
  }, [firstName, user]);

  return (
    <div className="mx-auto px-4 max-w-md">
      <h2 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
        {greeting.personalGreeting}
      </h2>
      <p className="text-xs sm:text-sm text-gray-300">
        {greeting.message}
      </p>
    </div>
  );
}

export default Greeting;