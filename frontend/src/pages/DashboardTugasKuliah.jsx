import React, { useState, useEffect } from "react";
import axios from "axios";
import HeaderTugasKuliah from "../layout/HeaderTugasKuliah";
import FilterPanel from "../components/tugas_kuliah/Filtering/FilterPanel";
import SortOrder from "../components/SortOrder";
import ViewMode from "../components/ViewMode";
import TugasKuliahList from "../components/tugas_kuliah/TugasKuliahList";
import TugasKuliahCard from "../components/tugas_kuliah/TugasKuliahCard";
import TugasKuliahModal from "../components/tugas_kuliah/TugasKuliahModal";

import { useNavigate } from "react-router-dom";
import api from "../services/api";
import Swal from "sweetalert2";
import { getProgressColorClass, getStatusColorClass, mataKuliahOptions } from "../utils/helpers";
import TugasListSkeleton from "../loader/TugasListSkeleton";
import { API_BASE_URL } from "../config";

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
  const [filters, setFilters] = useState({
    status: '',
    mataKuliah: '',
    progress: '',
    dueDate: '',
    tingkatKesulitan: ''  // Ubah dari prioritas ke tingkatKesulitan
  });
  const navigate = useNavigate();

  useEffect(() => {
    fetchTugasKuliah();
    const token = localStorage.getItem("token");
    setIsAdmin(!!token);
  }, []);

  const fetchTugasKuliah = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get(`${API_BASE_URL}/api/tasks`);
      setTugasKuliah(res.data);
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Fungsi helper untuk filter berdasarkan progress - FIXED untuk nilai numerik
  const filterByProgress = (task, progressFilter) => {
    if (!progressFilter) return true;
    
    // Task progress ada di property 'progress' bukan 'progressPercentage'
    const progress = parseInt(task.progress || 0);
    
    if (progressFilter === '0') return progress === 0;
    if (progressFilter === '100') return progress === 100;
    
    const [min, max] = progressFilter.split('-').map(Number);
    return progress >= min && progress <= max;
  };

  // Fungsi helper untuk filter berdasarkan due date
  const filterByDueDate = (task, dueDateFilter) => {
    if (!dueDateFilter) return true;
    
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const lusa = new Date(today.setDate(today.getDate() + 2));
    
    const nextWeekStart = new Date(today);
    nextWeekStart.setDate(today.getDate() - today.getDay() + 7);
    
    const nextWeekEnd = new Date(nextWeekStart);
    nextWeekEnd.setDate(nextWeekStart.getDate() + 6);
    
    const thisWeekStart = new Date(today);
    thisWeekStart.setDate(today.getDate() - today.getDay());
    
    const thisWeekEnd = new Date(thisWeekStart);
    thisWeekEnd.setDate(thisWeekStart.getDate() + 6);
    
    const thisMonthStart = new Date(today.getFullYear(), today.getMonth(), 1);
    const thisMonthEnd = new Date(today.getFullYear(), today.getMonth() + 1, 0);

    const nextMonthStart = new Date(today.getFullYear(), today.getMonth() + 1, 1);
    const nextMonthEnd = new Date(today.getFullYear(), today.getMonth() + 2, 0);

    const twoMonthsStart = new Date(today.getFullYear(), today.getMonth() + 2, 1);
    const twoMonthsEnd = new Date(today.getFullYear(), today.getMonth() + 3, 0);

    const threeMonthsStart = new Date(today.getFullYear(), today.getMonth() + 3, 1);
    const threeMonthsEnd = new Date(today.getFullYear(), today.getMonth() + 4, 0);
    
    // Pastikan dueDate ada sebelum mencoba mengkonversinya
    if (!task.tanggalDeadline) return false;
    
    const dueDate = new Date(task.tanggalDeadline);
    dueDate.setHours(0, 0, 0, 0);
    
    switch (dueDateFilter) {
      case 'today':
        return dueDate.getTime() === today.getTime();
      case 'tomorrow':
        return dueDate.getTime() === tomorrow.getTime();
      case 'lusa':
        return dueDate.getTime() === lusa.getTime();
      case 'thisWeek':
        return dueDate >= thisWeekStart && dueDate <= thisWeekEnd;
      case 'nextWeek':
        return dueDate >= nextWeekStart && dueDate <= nextWeekEnd;
      case 'thisMonth':
        return dueDate >= thisMonthStart && dueDate <= thisMonthEnd;
      case 'nextMonth':
        return dueDate >= nextMonthStart && dueDate <= nextMonthEnd;
      case 'twoMonths':
        return dueDate >= twoMonthsStart && dueDate <= twoMonthsEnd;
      case 'threeMonths':
        return dueDate >= threeMonthsStart && dueDate <= threeMonthsEnd;
      case 'overdue':
        return dueDate < today;
      default:
        return true;
    }
  };

  const processedTasks = tugasKuliah
    .filter(task => {
      const textMatch = 
        task.namaTugas.toLowerCase().includes(filterText.toLowerCase()) ||
        task.mataKuliah.toLowerCase().includes(filterText.toLowerCase()) ||
        (task.deskripsiTugas && task.deskripsiTugas.toLowerCase().includes(filterText.toLowerCase()));
      
      const statusMatch = !filters.status || task.statusTugas === filters.status;
      const mataKuliahMatch = !filters.mataKuliah || task.mataKuliah === filters.mataKuliah;
      const tingkatKesulitanMatch = !filters.tingkatKesulitan || task.tingkatKesulitan === filters.tingkatKesulitan;
      const progressMatch = filterByProgress(task, filters.progress);
      const dueDateMatch = filterByDueDate(task, filters.dueDate);
      
      return textMatch && statusMatch && mataKuliahMatch && progressMatch && dueDateMatch && tingkatKesulitanMatch;
    })
    .sort((a, b) => {
      if (orderMode === "manual") {
        // Manual mode: gunakan field order
        return sortOrder === "newest" ? a.order - b.order : b.order - a.order;
      } else {
        // Auto mode: urutkan berdasarkan tanggal
        const dateA = new Date(a.createdAt || a.tanggalDiberikan || 0);
        const dateB = new Date(b.createdAt || b.tanggalDiberikan || 0);
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      }
    });

  const viewTaskDetail = (id) => {
    navigate(`/DetailTugasKuliah/${id}`);
    console.log("View detail for task id:", id);
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

  // Fungsi untuk menerapkan filter
  const applyFilters = (newFilters) => {
    // Logic tambahan jika diperlukan saat filter diterapkan
    console.log("Filters applied:", newFilters);
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

        {/* Filter Panel Component */}
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
            {filterText || Object.values(filters).some(value => value !== '') 
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
  );
};

export default DashboardTugasKuliah;