import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { jsPDF } from "jspdf";
import "jspdf-autotable"; // optional, kalau butuh auto table

const DetailTugasKuliah = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleDeleteTask = async () => {
    if (window.confirm("Apakah Anda yakin ingin menghapus tugas ini?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`https://dins-sphere-backend.vercel.app/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        // Redirect ke dashboard
        navigate("/dashboardTugasKuliah");
      } catch (error) {
        console.error("Gagal menghapus tugas:", error);
        alert("Gagal menghapus tugas");
      }
    }
  };

  const handleToggleCompletion = async () => {
    try {
      // Toggle status dan tanggal selesai
      const updatedData = {
        tanggalSelesai: task.tanggalSelesai ? null : new Date().toISOString(),
        statusTugas: task.tanggalSelesai ? "Belum Dikerjakan" : "Selesai",
      };
  
      const response = await axios.patch(
        `https://dins-sphere-backend.vercel.app/api/tasks/${id}/complete`,
        updatedData
      );
      setTask(response.data);
    } catch (error) {
      console.error("Gagal memperbarui status tugas:", error);
      alert("Gagal memperbarui status tugas");
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
      // Fallback: copy link ke clipboard atau tampilkan modal dengan link
      navigator.clipboard.writeText(window.location.href);
      alert("Link tugas telah disalin ke clipboard");
    }
  };

  const handlePrintTask = () => {
  window.print();
  };

  const handleExportTask = () => {
    const doc = new jsPDF();
    const marginLeft = 14;
    const pageWidth = doc.internal.pageSize.getWidth();
  
    // Buat header dengan background warna biru
    doc.setFillColor(33, 150, 243); // Warna biru
    doc.rect(0, 0, pageWidth, 30, "F"); // Header rectangle
  
    // Judul di header
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(255, 255, 255);
    doc.text("Detail Tugas", pageWidth / 2, 20, { align: "center" });
  
    // Reset pengaturan font buat konten
    doc.setFont("helvetica", "normal");
    doc.setFontSize(12);
    doc.setTextColor(33, 33, 33);
  
    let currentY = 40;
  
    // Tambah detail tugas
    doc.text(`Nama Tugas: ${task.namaTugas}`, marginLeft, currentY);
    currentY += 8;
    doc.text(`Mata Kuliah: ${task.mataKuliah}`, marginLeft, currentY);
    currentY += 8;
    doc.text(`Status: ${task.statusTugas}`, marginLeft, currentY);
    currentY += 8;
    doc.text(`Progress: ${task.progress}%`, marginLeft, currentY);
    currentY += 10;
  
    // Tampilkan deadline kalau ada
    if (task.tanggalDeadline) {
      const deadline = new Date(task.tanggalDeadline);
      const deadlineString = deadline.toLocaleString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
      doc.text(`Deadline: ${deadlineString}`, marginLeft, currentY);
      currentY += 10;
    }
  
    // Tambah bagian deskripsi dengan judul bold dan box text
    doc.setFont("helvetica", "bold");
    doc.text("Deskripsi Tugas:", marginLeft, currentY);
    currentY += 6;
    doc.setFont("helvetica", "normal");
    const deskripsi = task.deskripsiTugas || "Tidak ada deskripsi";
    const splittedText = doc.splitTextToSize(deskripsi, pageWidth - marginLeft * 2);
    doc.text(splittedText, marginLeft, currentY);
    currentY += splittedText.length * 7;
  
    // Tambah garis horizontal sebagai pemisah
    doc.setDrawColor(200);
    doc.setLineWidth(0.5);
    doc.line(marginLeft, currentY + 5, pageWidth - marginLeft, currentY + 5);
  
    // Footer dengan tanggal export
    const exportDate = new Date().toLocaleString("id-ID");
    doc.setFontSize(10);
    doc.text(`Di-export pada: ${exportDate}`, marginLeft, doc.internal.pageSize.getHeight() - 10);
  
    // Save file PDF dengan nama tugas
    doc.save(`${task.namaTugas}.pdf`);
  };

  useEffect(() => {
    const fetchTaskDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `https://dins-sphere-backend.vercel.app/api/tasks/${id}`
        );
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

  // Status badge with appropriate colors
  const getStatusBadge = (status) => {
    const statusConfig = {
      "Belum Dikerjakan": "bg-red-500",
      "Sedang Dikerjakan": "bg-yellow-500",
      Selesai: "bg-green-500",
      "Menunggu Review": "bg-blue-500",
      Revisi: "bg-purple-500",
    };

    const bgColor = statusConfig[status] || "bg-gray-500";

    return (
      <span
        className={`${bgColor} text-white text-xs font-medium px-3 py-1 rounded-full`}
      >
        {status}
      </span>
    );
  };

  // Progress bar with appropriate colors based on percentage
  const getProgressColorClass = (progress) => {
    if (progress < 30) return "bg-red-500";
    if (progress < 70) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Calculate remaining days
  const getRemainingDays = (deadline) => {
    if (!deadline) return null;

    const today = new Date();
    const deadlineDate = new Date(deadline);
    const diffTime = deadlineDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return diffDays;
  };

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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-red-500 mx-auto mb-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clipRule="evenodd"
            />
          </svg>
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
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-12 w-12 text-gray-500 mx-auto mb-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM7 9a1 1 0 000 2h6a1 1 0 100-2H7z"
              clipRule="evenodd"
            />
          </svg>
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
          {/* Header with course name and difficulty */}
          <div className="bg-gray-700/50 border-b border-gray-600 px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-1">
                {task.namaTugas}
              </h1>
              <div className="text-lg text-gray-300">{task.mataKuliah}</div>
            </div>
            <div className="mt-4 md:mt-0 flex flex-col md:items-end">
              <div className="flex items-center">
                <span className="text-gray-400 mr-2">Tingkat Kesulitan:</span>
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
                        stroke="currentColor"
                        className={`w-5 h-5 ${
                          isFilled ? "text-yellow-500" : "text-gray-500"
                        }`}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                        />
                      </svg>
                    );
                  })}
                </div>
              </div>
              <div className="mt-2">
                <span className="text-gray-400 mr-2">
                  {task.tingkatKesulitan}
                </span>
                <span className="text-gray-400 mr-2">|</span>
                {getStatusBadge(task.statusTugas)}
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
              <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-5">
                <div className="flex items-center mb-3">
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${
                      task.tanggalSelesai ? "bg-green-500" : "bg-gray-500"
                    }`}
                  ></div>
                  <span className="text-gray-300">Status:</span>
                  <span className="ml-2 font-medium text-white">
                    {task.tanggalSelesai ? "Selesai" : "Belum selesai"}
                  </span>
                </div>
                {task.tanggalSelesai && (
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2 bg-green-500"></div>
                    <span className="text-gray-300">Diselesaikan pada:</span>
                    <span className="ml-2 font-medium text-white">
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
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M7.707 10.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V6h1a2 2 0 012 2v7a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h1v5.586l-1.293-1.293zM9 4a1 1 0 012 0v2H9V4z" />
                    </svg>
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
                onClick={handleExportTask}
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
