import React, { useState, useEffect } from "react";
import axios from "axios";
import HeaderTugasKuliah from "../layout/HeaderTugasKuliah";
import FilterSearch from "../components/FilterSearch";
import SortOrder from "../components/SortOrder";
import ViewMode from "../components/ViewMode";
import TugasKuliahList from "../components/tasks/TugasKuliahList";
import TugasKuliahCard from "../components/tasks/TugasKuliahCard";
import TugasKuliahModal from "../components/tasks/TugasKuliahModal";

import { useNavigate } from "react-router-dom";

const DashboardTugasKuliah = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [tugasKuliah, setTugasKuliah] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // "list" atau "grid"
  const [tugasToEdit, setTugasToEdit] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" atau "oldest"
  const [orderMode, setOrderMode] = useState("manual");
  const navigate = useNavigate();

  // Tambahin properti icon untuk tiap Mata Kuliah
  const mataKuliahOptions = [
    { value: "FTI2006 Etika Profesi", label: "Etika Profesi", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEj8_3o93ELYEGvrnRZoe0pZa-Fwzs71vnSOeth5vyVkyMghqgmiq5pW4s49PwJxEtvJNUHC2MLPaElx2Daka9l_78puO9zNRZBYKt7syatoHanPqXpcL47lglnK2U1KkXFvEsBebzkHqobV/s700/ilustrasi+Kode+Etik+%2528sumber-+pelajaran.co.id%2529.jpg" },
    { value: "MGU1007 Fiqih", label: "Fiqih", icon: "https://www.sinarbarualgensindo.com/wp-content/uploads/2020/06/IMG-20200612-WA0030.jpg" },
    { value: "TIF3601 Jaringan Syaraf Tiruan", label: "Jaringan Syaraf Tiruan", icon: "https://www.unite.ai/wp-content/uploads/2019/08/artificial-neural-network-3501528_1280.png" },
    { value: "TIF3602 Riset Operasi", label: "Riset Operasi", icon: "https://github.com/ahmad-syaifuddin/image-flow/blob/main/riset-operasi.png?raw=true" },
    { value: "TIF3603 Sistem Penunjang Keputusan", label: "Sistem Penunjang Keputusan", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgOE-HwaJq1mw9ftv0ymXQtYgy68wXNA6VLIC6MrZ8YrF71EbOtGRwIRtO8V7RmHcZPZRPWoqCuI3ZQ6NDksSbyR8BOVjwFPiLsNoPQLYkHVvE8ihFDiRNRykyMvvf65X0BDD7c77jBq_w/s1600/Sistem+Pendukung+Keputusan+(SPK).jpg" },
    { value: "TIF3604 Keamanan Sistem Komputer", label: "Keamanan Sistem Komputer", icon: "https://mohsai.com/wp-content/uploads/2023/07/Apa-itu-Keamanan-Jaringan-Macam-dan-Contohnya-keamanan-jariangan-adalah-1536x864.jpg" },
    { value: "TIF3605 Manajemen Perangkat Lunak", label: "Manajemen Perangkat Lunak", icon: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiVwLf7P1LyGO11oeNaIgTYEWdFg6piiykL_EnXIQMZhk-RkEDPH9LTML31EZRKJlbgyB1opgl-80KoToZMpZ-hj-6Mbk2C6eoyE3SYKzNDHyfRneofNw0nLcuxR9TxnH-kpgsTe0YwKYU/s320/Manajemen+Proyek+Konsep+1.jpg" },
    { value: "TIF3606 Testing & Implementasi di Bidang TI", label: "Testing & Implementasi di Bidang TI", icon: "https://matheusrumetna.com/wp-content/uploads/2020/09/testing-sistem.png" },
    { value: "TIF3607 Metodologi & Penelitian di Bidang TI", label: "Metodologi & Penelitian di Bidang TI", icon: "https://d1e4pidl3fu268.cloudfront.net/0d9f11d4-bfd3-4da5-9e47-2cf846004b6c/6676678542_quantitativedescriptiveresearchquantitativeresearchdesigncliparthd.crop_844x633_8,0.preview.png" },
    { value: "TIF3609 Pengolahan Citra", label: "Pengolahan Citra", icon: "https://elearning2.be.bisa.ai/course/media/2022-08-14_140142_course.png" },
  ];

  useEffect(() => {
    fetchTugasKuliah();
    const token = localStorage.getItem("token");
    setIsAdmin(!!token);
  }, []);

  const fetchTugasKuliah = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("https://dins-sphere-backend.vercel.app/api/tasks");
      setTugasKuliah(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const processedTasks = tugasKuliah
  .filter((task) =>
    (task.namaTugas.toLowerCase().includes(filterText.toLowerCase()) ||
      task.mataKuliah.toLowerCase().includes(filterText.toLowerCase()) ||
      task.deskripsiTugas.toLowerCase().includes(filterText.toLowerCase())
    )
  )
  .sort((a, b) => {
    if (orderMode === "manual") {
      // Manual mode: gunakan field order (pastikan field order di-update saat drag)
      return sortOrder === "newest" ? a.order - b.order : b.order - a.order;
    } else {
      // Auto mode: urutkan berdasarkan tanggal terbaru
      const dateA = new Date(a.createdAt || a.tanggalDiberikan || 0);
      const dateB = new Date(b.createdAt || b.tanggalDiberikan || 0);
      return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
    }
  });

  const viewTaskDetail = (id) => {
    navigate(`/DetailTugasKuliah/${id}`);
    console.log("View detail for task id:", id);
    // Detail task bisa diimplementasikan sesuai kebutuhan
  };

  const addTugasKuliah = async (newTask) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("https://dins-sphere-backend.vercel.app/api/tasks", newTask, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTugasKuliah([res.data, ...tugasKuliah]);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const updateTugasKuliah = async (id, formData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.put(`https://dins-sphere-backend.vercel.app/api/tasks/${id}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTugasKuliah(
        tugasKuliah.map((task) => (task._id === id ? res.data : task))
      );
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus tugas ini?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`https://dins-sphere-backend.vercel.app/api/tasks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTugasKuliah(tugasKuliah.filter((task) => task._id !== id));
    } catch (err) {
      console.error("Error deleting task:", err);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsAdmin(false);
      await fetchTugasKuliah();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleOrderChange = async (newOrder) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post("https://dins-sphere-backend.vercel.app/api/tasks/order", newOrder, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrderMode("manual");
    } catch (err) {
      console.error("Error reordering tasks:", err);
      fetchTugasKuliah();
    }
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case "Belum Dikerjakan":
        return "bg-red-500/20 text-red-400 border-red-600";
      case "Sedang dikerjain...":
        return "bg-blue-500/20 text-blue-400 border-blue-500";
      case "Selesai":
        return "bg-green-500/20 text-green-400 border-green-600";
      case "Tertunda":
        return "bg-purple-500/20 text-purple-400 border-purple-500";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-600";
    }
  };

  const getProgressColorClass = (progress) => {
    if (progress >= 80) return "bg-emerald-500";
    if (progress >= 50) return "bg-amber-500";
    return "bg-rose-500";
  };

  const handleEdit = (task) => {
    setTugasToEdit(task);
    setIsModalOpen(true);
  };

  const handleSave = async (formData) => {
    if (tugasToEdit) {
      await updateTugasKuliah(tugasToEdit._id, formData);
      setTugasToEdit(null);
      setIsModalOpen(false);
    } else {
      await addTugasKuliah(formData);
      setIsModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <div className="max-w-8xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8">
        <HeaderTugasKuliah
          isAdmin={isAdmin}
          setTugasToEdit={setTugasToEdit}
          setIsModalOpen={setIsModalOpen}
          handleLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />

        {/* Tugas Count */}
        <div className="mb-4 mt-2 flex justify-between items-center">
          <div className="px-3 py-1.5 bg-blue-500/20 text-blue-400 border border-blue-500 rounded-lg">
            <span className="font-medium">Total Tugas: {tugasKuliah.length}</span>
          </div>
        </div>

        {/* Filter & Controls */}
        <div className="mb-4">
          <FilterSearch filterText={filterText} setFilterText={setFilterText} />
        </div>
        <div className="flex justify-between items-center mb-4">
          <SortOrder
            sortOrder={sortOrder}
            setSortOrder={(val) => {
              setSortOrder(val);
              setOrderMode("manual");
            }}
          />
          <ViewMode viewMode={viewMode} setViewMode={setViewMode} />
        </div>

        {/* Render Tasks */}
        {isLoading ? (
          <div className="text-center py-8 text-gray-400">Loading tasks...</div>
        ) : processedTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400">Coming Soon on 10 Maret 2025!</div>
          // <div className="text-center py-8 text-gray-400">No tasks found. Try refreshing.</div>
        ) : viewMode === "list" ? (
          <TugasKuliahList
            tasks={processedTasks}
            getStatusColorClass={getStatusColorClass}
            getProgressColorClass={getProgressColorClass}
            viewTaskDetail={viewTaskDetail}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            isAdmin={isAdmin}
            onOrderChange={handleOrderChange}
            mataKuliahOptions={mataKuliahOptions}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Kalau ada grid view, implement TaskCard */}
            {processedTasks.map((task) => (
              <TugasKuliahCard key={task._id} task={task} viewTaskDetail={viewTaskDetail} />
            ))}
          </div>
        )}
      </div>

      {/* Tugas Modal */}
      {isModalOpen && isAdmin && (
        <TugasKuliahModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setTugasToEdit(null);
          }}
          task={tugasToEdit}
          onSave={handleSave}
          mataKuliahOptions={mataKuliahOptions}
        />
      )}
    </div>
  );
};

export default DashboardTugasKuliah;
