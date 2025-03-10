import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import { exportTaskToPDF } from "../utils/pdfExport";
import {
  getStatusBadgeClass,
  getProgressColorClass,
  getRemainingDays,
} from "../utils/helpers";
import {
  getTask,
  deleteTask,
  toggleTaskCompletion,
} from "../services/taskService";
import Swal from "sweetalert2";
import { Save } from "lucide-react";

const DetailTugasKuliah = () => {
  const [isAdmin, setIsAdmin] = useState(!!localStorage.getItem("token"));
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewCount, setViewCount] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const fetchTaskAndViews = async () => {
      try {
        // Fetch task details
        const taskRes = await axios.get(
          `https://dins-sphere-backend.vercel.app/api/tasks/${id}`
        );

        if (isMounted) {
          setTask(taskRes.data);
          setLoading(false);

          // Hanya fetch view count tanpa update
          // Ini hanya untuk menampilkan, supaya tidak memicu pemanggilan ganda
          const viewRes = await axios.get(
            `https://dins-sphere-backend.vercel.app/api/viewTasks/${id}`
          );
          setViewCount(viewRes.data.count || 0);
        }
      } catch (err) {
        if (isMounted) {
          setError("Error fetching task details");
          setLoading(false);
          console.error(err);
        }
      }
    };

    // Fetch task dan view count
    fetchTaskAndViews();

    // Function untuk update view count hanya sekali per session
    const updateViewCount = async () => {
      // Cek localStorage untuk melihat apakah proyek ini sudah dilihat
      const viewedKey = `viewed_task_${id}`;
      const hasViewed = localStorage.getItem(viewedKey);

      if (!hasViewed) {
        try {
          // Update view count sekali saja
          await axios.post(
            `https://dins-sphere-backend.vercel.app/api/viewTasks/${id}`
          );
          // Tandai sebagai sudah dilihat
          localStorage.setItem(viewedKey, "true");

          // Refresh view count setelah update
          if (isMounted) {
            const viewRes = await axios.get(
              `https://dins-sphere-backend.vercel.app/api/viewTasks/${id}`
            );
            setViewCount(viewRes.data.count || 0);
          }
        } catch (err) {
          console.error("Error updating view count:", err);
        }
      }
    };

    // Update view count terpisah dari fetching data
    updateViewCount();

    // Cleanup function untuk mencegah memory leak
    return () => {
      isMounted = false;
    };
  }, [id]); // Hanya bergantung pada id

  // Fetch detail tugas
  useEffect(() => {
    const fetchTaskDetail = async () => {
      try {
        setLoading(true);
        const response = await getTask(id);
        setTask(response.data);
      } catch (err) {
        console.error("Error fetching task detail:", err);
        setError("Gagal mengambil detail tugas");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetail();
  }, [id]);

  const handleDeleteTask = async () => {
    const result = await Swal.fire({
      title: "Hapus Tugas",
      text: "Apakah Anda yakin ingin menghapus tugas ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await deleteTask(id, token);
        navigate("/dashboardTugasKuliah");
      } catch (error) {
        console.error("Gagal menghapus tugas:", error);
        alert("Gagal menghapus tugas");
      }
    }
  };

  const handleToggleCompletion = async () => {
    // Optimistic update
    const previousState = { ...task };
    const optimisticTask = {
      ...task,
      tanggalSelesai: task.tanggalSelesai ? null : new Date().toISOString(),
      statusTugas: task.tanggalSelesai ? "Belum Dikerjakan" : "Selesai",
    };
    setTask(optimisticTask);

    try {
      const updatedData = {
        tanggalSelesai: optimisticTask.tanggalSelesai,
        statusTugas: optimisticTask.statusTugas,
      };
      await toggleTaskCompletion(id, updatedData);
    } catch (error) {
      console.error("Gagal memperbarui status tugas:", error);
      alert("Gagal memperbarui status tugas");
      // Revert optimistic update
      setTask(previousState);
    }
  };

  const handleShareTask = () => {
    if (navigator.share) {
      navigator
        .share({
          title: task.namaTugas,
          text: task.deskripsiTugas,
          url: window.location.href,
        })
        .catch((error) => console.error("Error sharing:", error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link tugas telah disalin ke clipboard");
    }
  };

  const handlePrintTask = () => window.print();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 border-l-transparent border-r-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-300 font-medium">
            Memuat detail tugas...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-red-900/30 border border-red-500 rounded-xl p-6 max-w-md text-center">
          {/* SVG error icon */}
          <h2 className="text-xl font-bold text-red-500 mb-2">Error</h2>
          <p className="text-gray-300">{error}</p>
          <Link
            to="/dashboardTugasKuliah"
            className="mt-4 inline-block px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition duration-300"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-gray-800/50 border border-gray-700 rounded-xl p-6 max-w-md text-center">
          {/* SVG not found icon */}
          <h2 className="text-xl font-bold text-gray-300 mb-2">
            Tidak Ditemukan
          </h2>
          <p className="text-gray-400">Detail tugas tidak ditemukan.</p>
          <Link
            to="/dashboardTugasKuliah"
            className="mt-4 inline-block px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-300 rounded-lg transition duration-300"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  const remainingDays = getRemainingDays(task.tanggalDeadline);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Back navigation */}
        <Link
          to="/dashboardTugasKuliah"
          className="inline-flex items-center mb-6 px-4 py-2 bg-gray-800/50 hover:bg-gray-700 rounded-lg backdrop-blur-sm transition duration-300 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          <span>Kembali ke Dashboard</span>
        </Link>

        {/* Main card */}
        <div className="bg-gray-800/60 border border-gray-700 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm">
          {/* Header with course name and difficulty - Improved UI */}
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 px-4 sm:px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
                {task.namaTugas}
              </h1>
              <div className="text-base sm:text-lg text-gray-300 flex items-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2 text-blue-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
                {task.mataKuliah}
              </div>
            </div>

            <div className="mt-4 md:mt-0 flex flex-col md:items-end">
              <div className="flex items-center">
                <span className="text-gray-400 mr-2 text-sm sm:text-base">
                  Tingkat Kesulitan:
                </span>
                <div className="flex">
                  {[1, 2, 3, 4, 5].map((star) => {
                    // Determine the star level based on task.tingkatKesulitan
                    const starLevel =
                      task.tingkatKesulitan === "Damai"
                        ? 1
                        : task.tingkatKesulitan === "Mudah"
                        ? 2
                        : task.tingkatKesulitan === "Sedang"
                        ? 3
                        : task.tingkatKesulitan === "Sulit"
                        ? 4
                        : task.tingkatKesulitan === "Ngeri ☠️"
                        ? 5
                        : 0;

                    // Check if current star should be filled
                    const isFilled = star <= starLevel;

                    return (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={isFilled ? "currentColor" : "none"}
                        stroke={isFilled ? "none" : "currentColor"}
                        strokeWidth="1.5"
                        className={`w-5 h-5 ${
                          isFilled ? "text-yellow-400" : "text-gray-600"
                        } transition-colors`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    );
                  })}
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-gray-300 font-medium text-sm px-3 py-1 bg-gray-700/50 rounded-full">
                  {task.tingkatKesulitan}
                </span>
                <span
                  className={`${getStatusBadgeClass(
                    task.statusTugas
                  )} text-white text-sm font-medium px-3 py-1 rounded-full shadow-sm`}
                >
                  {task.statusTugas}
                </span>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            {/* Progress bar */}
            <div className="mb-6">
              <div className="flex justify-between mb-2">
                <span className="text-gray-300">Progress</span>
                <span className="font-semibold text-white">
                  {task.progress}%
                </span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${getProgressColorClass(
                    task.progress
                  )}`}
                  style={{ width: `${task.progress}%` }}
                ></div>
              </div>
            </div>

            {/* Key dates and countdown */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-4">
                <div className="text-gray-400 text-sm mb-1">
                  Tanggal Diberikan
                </div>
                <div className="text-white font-semibold">
                  {task.tanggalDiberikan
                    ? new Date(task.tanggalDiberikan).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )
                    : "Tidak tersedia"}
                </div>
              </div>

              <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-4">
                <div className="text-gray-400 text-sm mb-1">Deadline</div>
                <div className="text-white font-semibold">
                  {task.tanggalDeadline
                    ? new Date(task.tanggalDeadline).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        }
                      )
                    : "Tidak tersedia"}
                </div>
              </div>

              <div
                className={`${
                  remainingDays && remainingDays < 3
                    ? "bg-red-900/30 border-red-700"
                    : remainingDays && remainingDays < 7
                    ? "bg-yellow-900/30 border-yellow-700"
                    : "bg-green-900/30 border-green-700"
                } border rounded-xl p-4`}
              >
                <div className="text-gray-300 text-sm mb-1">Sisa Waktu</div>
                <div className="text-white font-bold text-lg">
                  {remainingDays !== null
                    ? remainingDays > 0
                      ? `${remainingDays} hari lagi`
                      : remainingDays === 0
                      ? "Hari ini!"
                      : `Terlambat ${Math.abs(remainingDays)} hari`
                    : "Tidak tersedia"}
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-3">
                Deskripsi Tugas
              </h2>
              <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-5 text-gray-300 leading-relaxed whitespace-pre-line">
                {task.deskripsiTugas || "Tidak ada deskripsi"}
              </div>
            </div>

            {/* Completion details */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-3">
                Status Penyelesaian
              </h2>
              <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-4 md:p-5">
                <div className="flex flex-col sm:flex-row sm:items-center mb-3">
                  <div className="flex items-center mb-2 sm:mb-0">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        task.tanggalSelesai ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    <span className="text-gray-300">Status:</span>
                  </div>
                  <span className="ml-0 sm:ml-2 font-medium text-white">
                    {task.tanggalSelesai ? "Selesai" : "Belum selesai"}
                  </span>
                </div>
                {task.tanggalSelesai && (
                  <div className="flex flex-col sm:flex-row sm:items-center">
                    <div className="flex items-center mb-2 sm:mb-0">
                      <div className="w-3 h-3 rounded-full mr-2 bg-green-500"></div>
                      <span className="text-gray-300">Diselesaikan pada:</span>
                    </div>
                    <span className="ml-0 sm:ml-2 font-medium text-white break-words">
                      {new Date(task.tanggalSelesai).toLocaleDateString(
                        "id-ID",
                        {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                          hour: "2-digit",
                          minute: "2-digit",
                        }
                      )}
                    </span>
                  </div>
                )}
              </div>
            </div>

            {/* Image if available */}
            {task.gambaranTugas && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-3">
                  Gambaran Tugas
                </h2>
                <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-2 overflow-hidden">
                  <img
                    src={task.gambaranTugas}
                    alt={task.namaTugas}
                    className="w-full h-auto rounded-lg object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
            {isAdmin && (
              <>
              <Link
                to={`/editTugasKuliah/${id}`}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium flex items-center justify-center transition-all duration-300 shadow-lg shadow-blue-900/20"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
                Edit Tugas
              </Link>

              <button
                className="cursor-pointer flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-medium flex items-center justify-center transition-all duration-300 shadow-lg shadow-green-900/20"
                onClick={handleToggleCompletion}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
                {task.tanggalSelesai
                  ? "Tandai Belum Selesai"
                  : "Tandai Selesai"}
              </button>

              <button
                className="cursor-pointer flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl font-medium flex items-center justify-center transition-all duration-300 shadow-lg shadow-red-900/20"
                onClick={handleDeleteTask}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                    clipRule="evenodd"
                  />
                </svg>
                Hapus Tugas
              </button>
                </>
            )}
            </div>

            {/* Notes section */}
            <div className="mt-8 bg-gray-700/30 border border-gray-600 rounded-xl p-5">
              <h2 className="text-xl font-semibold text-white mb-3">Catatan</h2>
              <div className="space-y-2">
                <div className="relative">
                  <textarea
                    className="w-full bg-gray-800/80 rounded-lg border border-gray-700 p-4 text-white placeholder-gray-500 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
                    placeholder="Tambahkan catatan tentang tugas ini..."
                    rows="3"
                  ></textarea>
                  <button
                    className="cursor-pointer absolute right-3 bottom-3 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all duration-300"
                    onClick={() => alert("Simpan catatan belum berfungsi")}
                  >
                    <Save className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>

            {/* Related tasks section */}
            <div className="mt-8">
              <h2 className="text-xl font-semibold text-white mb-3">
                Tugas Terkait
              </h2>
              <p className="text-gray-400 text-sm">
                Fitur ini masih dalam tahap pengembangan
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-4 hover:bg-gray-700/50 transition-all duration-300 cursor-not-allowed opacity-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-medium">
                        Tugas Pendahuluan
                      </h3>
                      <p className="text-gray-400 text-sm">
                        Mata Kuliah yang Sama
                      </p>
                    </div>
                    <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
                      Selesai
                    </span>
                  </div>
                </div>

                <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-4 hover:bg-gray-700/50 transition-all duration-300 cursor-not-allowed opacity-50">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-white font-medium">Tugas Lanjutan</h3>
                      <p className="text-gray-400 text-sm">
                        Mata Kuliah yang Sama
                      </p>
                    </div>
                    <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                      Sedang dikerjakan...
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="bg-gray-800/80 border-t border-gray-700 px-6 py-4 flex justify-between items-center">
            <div className="text-gray-400 text-sm">
              ID Tugas: <span className="text-gray-300">{id}</span>
            </div>
            <div className="flex space-x-2">
              <button
                className="cursor-pointer text-gray-400 hover:text-white transition-colors duration-300"
                onClick={handleShareTask}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
              </button>
              <button
                className="cursor-pointer text-gray-400 hover:text-white transition-colors duration-300"
                onClick={handlePrintTask}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M5 4v3H4a2 2 0 00-2 2v3a2 2 0 002 2h1v2a2 2 0 002 2h6a2 2 0 002-2v-2h1a2 2 0 002-2V9a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
              <button
                className="cursor-pointer text-gray-400 hover:text-white transition-colors duration-300"
                onClick={() => exportTaskToPDF(task)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailTugasKuliah;
