// TugasKuliah.jsx
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
import AuthOverlay from "../components/tugas_kuliah/AuthOverlay";
import { useAuth } from "../contexts/authContext"; // Import useAuth hook

const TugasKuliah = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingViewCounts, setIsLoadingViewCounts] = useState(true); // Add this state for view counts
  const [tugasKuliah, setTugasKuliah] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
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
  
  // Use Auth Context instead of managing auth state manually
  const { user, isInitializing } = useAuth();
  const isAdmin = !!user; // User is admin if they are logged in

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
    const logPageVisit = async () => {
      try {
        // Only log if user is authenticated
        if (user) {
          const token = localStorage.getItem("token");
          await api.post(
            "/activities",
            {
              type: "PAGE_VIEW",
              path: "/tugasKuliah",
              details: { info: "User visited tugas kuliah page" },
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
        }
      } catch (error) {
        console.error("Failed to log page visit:", error);
      }
    };

    // Wait for auth initialization before fetching data
    if (!isInitializing) {
      fetchTugasKuliah();
      logPageVisit();
    }
  }, [isInitializing, user]);

  const fetchTugasKuliah = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      if (token) {
        const res = await axios.get(`${API_BASE_URL}/api/tasks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTugasKuliah(res.data);
        
        // Start loading view counts after tasks are loaded
        fetchViewCounts(res.data);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Add the fetchViewCounts function
  const fetchViewCounts = async (tasks) => {
    setIsLoadingViewCounts(true);
    try {
      const updatedTasks = await Promise.all(
        tasks.map(async (task) => {
          try {
            const response = await axios.get(
              `${API_BASE_URL}/api/viewTasks/${task._id}`
            );
            return { ...task, viewCount: response.data.count || 0 };
          } catch (error) {
            console.error("Error fetching view count for task", task._id, error);
            return { ...task, viewCount: 0 };
          }
        })
      );
      setTugasKuliah(updatedTasks);
    } catch (error) {
      console.error("Error in fetchViewCounts:", error);
    } finally {
      setIsLoadingViewCounts(false);
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
    if (user) {
      const token = localStorage.getItem("token");
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
  if (isInitializing) {
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
      <AuthOverlay isAdmin={isAdmin} />

      <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
        <div className="max-w-8xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8">
          <HeaderTugasKuliah
            isAdmin={isAdmin}
            setTugasToEdit={setTugasToEdit}
            setIsModalOpen={setIsModalOpen}
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
                : "Gak ada Tugas!"}
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
              isLoadingViewCounts={isLoadingViewCounts}
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
                  isLoadingViewCounts={isLoadingViewCounts}
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

export default TugasKuliah;