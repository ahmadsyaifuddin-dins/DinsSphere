import React, { useEffect, useState } from "react";

const TaskDates = ({ task }) => {
  // Format tanggal dengan toLocaleString untuk UTC
  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Tidak tersedia";

  // Fungsi untuk menghitung selisih waktu antara dua tanggal
  const computeTimeDifference = (from, to) => {
    const diffMs = to - from;
    const totalMinutes = Math.floor(Math.abs(diffMs) / (1000 * 60));
    const days = Math.floor(totalMinutes / (60 * 24));
    const hours = Math.floor((totalMinutes % (60 * 24)) / 60);
    const minutes = totalMinutes % 60;
    return { diffMs, days, hours, minutes };
  };

  // State untuk menyimpan perhitungan selisih waktu
  const [timeDiff, setTimeDiff] = useState(() => {
    if (task.tanggalSelesai) {
      // Kalau tugas sudah selesai, hitung selisih dari tanggal selesai ke deadline
      return computeTimeDifference(new Date(task.tanggalSelesai), new Date(task.tanggalDeadline));
    } else {
      // Kalau belum selesai, hitung selisih dari waktu sekarang ke deadline
      return computeTimeDifference(new Date(), new Date(task.tanggalDeadline));
    }
  });

  useEffect(() => {
    // Update tiap menit
    const interval = setInterval(() => {
      if (task.tanggalSelesai) {
        setTimeDiff(computeTimeDifference(new Date(task.tanggalSelesai), new Date(task.tanggalDeadline)));
      } else {
        setTimeDiff(computeTimeDifference(new Date(), new Date(task.tanggalDeadline)));
      }
    }, 60000);
    return () => clearInterval(interval);
  }, [task.tanggalDeadline, task.tanggalSelesai]);

  const { diffMs, days, hours, minutes } = timeDiff;
  let timeDisplay = "";

  if (task.tanggalSelesai) {
    // Kalau tugas sudah selesai, bandingkan tanggal selesai dengan deadline
    const toleranceMs = 5 * 60 * 1000;
    if (Math.abs(diffMs) <= toleranceMs) {
      timeDisplay = "Tepat waktu";
    } else if (diffMs > 0) {
      timeDisplay = `Terselesaikan lebih awal ${days > 0 ? days + " hari " : ""}${
        hours > 0 ? hours + " jam " : ""
      }${minutes >= 0 ? minutes + " menit" : ""}`.trim();
    } else {
      timeDisplay = `Terlambat ${days > 0 ? days + " hari " : ""}${
        hours > 0 ? hours + " jam " : ""
      }${minutes >= 0 ? minutes + " menit" : ""}`.trim();
    }
  } else {
    // Kalau tugas belum selesai, hitung sisa waktu dari now ke deadline
    if (diffMs > 0) {
      if (days === 0 && hours === 0 && minutes === 0) {
        timeDisplay = "Hari ini!";
      } else {
        timeDisplay = `${days > 0 ? days + " hari " : ""}${
          hours > 0 ? hours + " jam " : ""
        }${minutes >= 0 ? minutes + " menit" : ""} lagi`;
      }
    } else {
      timeDisplay = `Terlambat ${days > 0 ? days + " hari " : ""}${
        hours > 0 ? hours + " jam " : ""
      }${minutes >= 0 ? minutes + " menit" : ""}`.trim();
    }
  }

  // Atur background berdasarkan hasil perhitungan
  let bgClass = "";
  if (task.tanggalSelesai) {
    bgClass = Math.abs(diffMs) <= 5 * 60 * 1000
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
        <div className="text-white font-semibold">{formatDate(task.tanggalDiberikan)}</div>
      </div>
      <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-4">
        <div className="text-gray-400 text-sm mb-1">Deadline</div>
        <div className="text-white font-semibold">{formatDate(task.tanggalDeadline)}</div>
      </div>
      <div className={`${bgClass} border rounded-xl p-4`}>
        <div className="text-gray-300 text-sm mb-1">Sisa Waktu</div>
        <div className="text-white font-bold text-lg">{timeDisplay}</div>
      </div>
    </div>
  );
};

export default TaskDates;