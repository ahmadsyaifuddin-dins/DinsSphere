import React, { useEffect, useState } from "react";

// Format tanggal dengan tampilan lokal (WITA)
const formatDateLocal = (date) =>
  date
    ? new Date(date).toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Tidak tersedia";

// Fungsi untuk menghitung perbedaan waktu dengan akurasi lebih tinggi
const computeTimeDifference = (from, to) => {
  // Pastikan kita bekerja dengan objek Date
  const fromDate = new Date(from);
  const toDate = new Date(to);
  
  // Hitung selisih dalam milidetik
  const diffMs = toDate.getTime() - fromDate.getTime();
  
  // Konversi ke hari, jam, menit dengan perhitungan yang lebih akurat
  const totalMinutes = Math.floor(Math.abs(diffMs) / (1000 * 60));
  const days = Math.floor(totalMinutes / (60 * 24));
  const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
  const minutes = totalMinutes % 60;
  
  return { diffMs, days, hours, minutes };
};

const TaskDates = ({ task }) => {
  // Inisialisasi perhitungan waktu
  const [timeDiff, setTimeDiff] = useState(() => {
    if (task.tanggalSelesai) {
      // Jika tugas sudah selesai, hitung perbedaan antara tanggal selesai dan deadline
      return computeTimeDifference(task.tanggalSelesai, task.tanggalDeadline);
    } else {
      // Jika belum selesai, hitung dari waktu sekarang ke deadline
      return computeTimeDifference(new Date(), task.tanggalDeadline);
    }
  });

  // Effect untuk memperbarui perhitungan setiap menit
  useEffect(() => {
    const interval = setInterval(() => {
      if (task.tanggalSelesai) {
        setTimeDiff(computeTimeDifference(task.tanggalSelesai, task.tanggalDeadline));
      } else {
        setTimeDiff(computeTimeDifference(new Date(), task.tanggalDeadline));
      }
    }, 60000); // Update setiap menit
    
    return () => clearInterval(interval);
  }, [task.tanggalDeadline, task.tanggalSelesai]);

  const { diffMs, days, hours, minutes } = timeDiff;
  let timeDisplay = "";

  // Debug info - bisa dihapus setelah masalah teratasi
  console.log("Tanggal Selesai:", task.tanggalSelesai);
  console.log("Tanggal Deadline:", task.tanggalDeadline);
  console.log("Selisih Waktu:", { diffMs, days, hours, minutes });

  if (task.tanggalSelesai) {
    const toleranceMs = 5 * 60 * 1000; // toleransi 5 menit
    
    if (Math.abs(diffMs) <= toleranceMs) {
      timeDisplay = "Tepat waktu";
    } else if (diffMs > 0) {
      // Jika deadline > tanggal selesai, berarti terselesaikan lebih awal
      timeDisplay = `Terselesaikan lebih awal ${days > 0 ? days + " hari " : ""}${
        hours > 0 ? hours + " jam " : ""
      }${minutes > 0 ? minutes + " menit" : ""}`.trim();
    } else {
      // Jika tanggal selesai > deadline → terlambat
      timeDisplay = `Terlambat ${days > 0 ? days + " hari " : ""}${
        hours > 0 ? hours + " jam " : ""
      }${minutes > 0 ? minutes + " menit" : ""}`.trim();
    }
  } else {
    // Belum selesai
    if (diffMs > 0) {
      if (days === 0 && hours === 0 && minutes === 0) {
        timeDisplay = "Hari ini!";
      } else {
        timeDisplay = `${days > 0 ? days + " hari " : ""}${
          hours > 0 ? hours + " jam " : ""
        }${minutes > 0 ? minutes + " menit" : ""} lagi`;
      }
    } else {
      timeDisplay = `Terlambat ${days > 0 ? days + " hari " : ""}${
        hours > 0 ? hours + " jam " : ""
      }${minutes > 0 ? minutes + " menit" : ""}`.trim();
    }
  }

  // Menentukan background color berdasarkan perhitungan
  let bgClass = "";
  if (task.tanggalSelesai) {
    bgClass =
      Math.abs(diffMs) <= 5 * 60 * 1000
        ? "bg-yellow-900/30 border-yellow-700"
        : diffMs > 0
        ? "bg-green-900/30 border-green-700"
        : "bg-red-900/30 border-red-700";
  } else {
    bgClass =
      diffMs > 0
        ? days < 3
          ? "bg-red-900/30 border-red-700"
          : days < 7
          ? "bg-yellow-900/30 border-yellow-700"
          : "bg-green-900/30 border-green-700"
        : "bg-red-900/30 border-red-700";
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-4">
        <div className="text-gray-400 text-sm mb-1">Tanggal Diberikan</div>
        <div className="text-white font-semibold">{formatDateLocal(task.tanggalDiberikan)}</div>
      </div>
      <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-4">
        <div className="text-gray-400 text-sm mb-1">Deadline</div>
        <div className="text-white font-semibold">{formatDateLocal(task.tanggalDeadline)}</div>
      </div>
      <div className={`${bgClass} border rounded-xl p-4`}>
        <div className="text-gray-300 text-sm mb-1">Sisa Waktu</div>
        <div className="text-white font-bold text-lg">{timeDisplay}</div>
      </div>
    </div>
  );
};

export default TaskDates;