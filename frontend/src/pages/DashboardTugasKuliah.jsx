// DashboardTugasKuliah.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import HeaderTugasKuliah from "../layout/HeaderTugasKuliah";
import FilterPanel from "../components/tugas_kuliah/Filtering/FilterPanel";
import SortOrder from "../components/tugas_kuliah/Filtering/SortOrder";
import ViewMode from "../components/tugas_kuliah/Filtering/ViewMode";
import TugasKuliahList from "../components/tugas_kuliah/TugasKuliahList";
import TugasKuliahCard from "../components/tugas_kuliah/TugasKuliahCard";
import TugasKuliahModal from "../components/tugas_kuliah/TugasKuliahModal";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Swal from "sweetalert2";
import {
  getProgressColorClass,
  getStatusColorClass,
  mataKuliahOptions,
  filterByProgress,
  filterByDueDate,
} from "../utils/helpers";
import TugasListSkeleton from "../loader/TugasListSkeleton";
import { API_BASE_URL } from "../config";
// import MusicPlayer from "../components/tugas_kuliah/MusicPlayer";

const DashboardTugasKuliah = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false); // New state to track auth check completion
  const [tugasKuliah, setTugasKuliah] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // Default to grid for mobile
  const [tugasToEdit, setTugasToEdit] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" atau "oldest"
  const [orderMode, setOrderMode] = useState("manual");
  const [filters, setFilters] = useState({
    status: "",
    mataKuliah: "",
    progress: "",
    dueDate: "",
    tingkatKesulitan: "",
  });
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  const navigate = useNavigate();

  // Set initial view mode based on screen size and handle window resize
  useEffect(() => {
    // Function to update view mode based on window width
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      
      // Set view mode based on screen size: grid for mobile, list for tablet and up
      if (width < 768) { // Common breakpoint for tablet is 768px
        setViewMode("grid");
      } else {
        setViewMode("list");
      }
    };

    // Add event listener for window resize
    window.addEventListener('resize', handleResize);
    
    // Set initial view mode
    handleResize();

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token");
      setIsAdmin(!!token);
      setAuthChecked(true); // Mark auth check as complete
    };

    const logDashboardVisit = async () => {
      try {
        const token = localStorage.getItem("token");
        if (token) {
          await api.post(
            "/activities",
            {
              type: "PAGE_VIEW",
              path: "/dashboardTugasKuliah",
              details: { info: "User visited dashboard tugas kuliah" },
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      } catch (error) {
        console.error("Failed to log dashboard visit:", error);
      }
    };

    // Check authentication first
    checkAuth();
    // Then fetch data and log visit
    fetchTugasKuliah();
    logDashboardVisit();
  }, []);

  const fetchTugasKuliah = async () => {
    try {
      const token = localStorage.getItem("token");
      setIsLoading(true);
      if (token) {
        const res = await axios.get(`${API_BASE_URL}/api/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTugasKuliah(res.data);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Proses filtering dan sorting
  const processedTasks = tugasKuliah
    .filter((task) => {
      const textMatch =
        task.namaTugas.toLowerCase().includes(filterText.toLowerCase()) ||
        task.mataKuliah.toLowerCase().includes(filterText.toLowerCase()) ||
        (task.deskripsiTugas &&
          task.deskripsiTugas.toLowerCase().includes(filterText.toLowerCase()));

      const statusMatch =
        !filters.status || task.statusTugas === filters.status;
      const mataKuliahMatch =
        !filters.mataKuliah || task.mataKuliah === filters.mataKuliah;
      const tingkatKesulitanMatch =
        !filters.tingkatKesulitan ||
        task.tingkatKesulitan === filters.tingkatKesulitan;
      const progressMatch = filterByProgress(task, filters.progress);
      const dueDateMatch = filterByDueDate(task, filters.dueDate);

      return (
        textMatch &&
        statusMatch &&
        mataKuliahMatch &&
        progressMatch &&
        dueDateMatch &&
        tingkatKesulitanMatch
      );
    })
    .sort((a, b) => {
      if (orderMode === "manual") {
        // Manual: gunakan field order
        return sortOrder === "newest" ? a.order - b.order : b.order - a.order;
      } else {
        // Auto: sorting berdasarkan tanggal
        const dateA = new Date(a.createdAt || a.tanggalDiberikan || 0);
        const dateB = new Date(b.createdAt || b.tanggalDiberikan || 0);
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      }
    });
  const viewTaskDetail = (id) => {
    // Log detail view activity
    const token = localStorage.getItem("token");
    if (token) {
      api
        .post(
          "/activities",
          {
            type: "TASK_VIEW",
            path: `/DetailTugasKuliah/${id}`,
            taskId: id,
            details: { info: "User viewed task details" },
          },
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        )
        .catch((err) => console.error("Failed to log task view:", err));
    }

    navigate(`/DetailTugasKuliah/${id}`);
  };

  const addTugasKuliah = async (newTask) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post("/tasks", newTask, {
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
      const res = await api.put(`/tasks/${id}`, formData, {
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
    const result = await Swal.fire({
      title: "Hapus Tugas",
      text: "Apakah Anda yakin ingin menghapus tugas ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });
    if (!result.isConfirmed) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/tasks/${id}`, {
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
      await api.post("/tasks/order", newOrder, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrderMode("manual");
    } catch (err) {
      console.error("Error reordering tasks:", err);
      fetchTugasKuliah();
    }
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

  const applyFilters = (newFilters) => {
    console.log("Filters applied:", newFilters);
  };

  // Show loading state until authentication check is complete
  if (!authChecked) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 flex items-center justify-center">
        <div className="animate-pulse">
          <svg className="animate-spin h-12 w-12 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Jika user belum login, tampilkan overlay peringatan */}
      {!isAdmin && (
        <div className="fixed inset-0 flex items-center justify-center z-20 bg-black/5 backdrop-blur-xs backdrop-brightness-75">
          <div className="bg-gradient-to-br from-white to-gray-100 p-8 rounded-xl shadow-2xl text-center max-w-md w-full border border-gray-200 transform transition-all animate-fadeIn">
            <div className="mb-4">
              <div className="h-20 w-20 mx-auto rounded-full bg-yellow-500 flex items-center justify-center">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-12 w-12 text-black"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-red-700">
              Halaman Eksklusif!
            </h2>
            <p className="mb-2 text-gray-600">
              Sepertinya kamu penasaran dengan apa yang ada di dalam, ya?
            </p>
            <p className="mb-6 text-gray-600">
              Sayangnya, halaman ini hanya bisa diakses oleh orang-orang
              kepercayaan Udin.
            </p>
            <button
              className="cursor-pointer w-full bg-blue-950 text-white py-3 px-6 rounded-lg hover:bg-slate-950 transition-all transform hover:scale-105 font-medium shadow-md"
              onClick={() => navigate("/login")}
            >
              Masuk Sekarang
            </button>
            <p className="mt-4 text-xs text-gray-500">
              Jika kamu termasuk orang kepercayaan Udins, silakan masuk untuk
              melihat konten.
            </p>
          </div>
        </div>
      )}
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
              <span className="font-medium">
                Total Tugas: {tugasKuliah.length}
              </span>
            </div>
            <div className="px-3 py-1.5 bg-green-500/20 text-green-400 border border-green-500 rounded-lg">
              <span className="font-medium">
                Hasil Filter: {processedTasks.length}
              </span>
            </div>
          </div>

          {/* Filter Panel */}
          <FilterPanel
            filterText={filterText}
            setFilterText={setFilterText}
            mataKuliahOptions={mataKuliahOptions}
            filters={filters}
            setFilters={setFilters}
            applyFilters={applyFilters}
          />

          {/* Sort & View Controls */}
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
            <TugasListSkeleton />
          ) : processedTasks.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              {filterText ||
              Object.values(filters).some((value) => value !== "")
                ? "Tidak ada tugas yang sesuai dengan filter. Coba ubah filter Anda."
                : "Coming Soon on 8 or 14 Apr 2025!"}
            </div>
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
              {processedTasks.map((task) => (
                <TugasKuliahCard
                  key={task._id}
                  task={task}
                  viewTaskDetail={viewTaskDetail}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  isAdmin={isAdmin}
                />
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
    </div>
  );
};

export default DashboardTugasKuliah;