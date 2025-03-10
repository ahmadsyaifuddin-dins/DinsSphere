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
import api from "../services/api";
import Swal from "sweetalert2";
import DetailTugasKuliah from "./DetailTugasKuliah";
import ProjectListSkeleton from "../loader/ProjectListSkeleton";
import { getProgressColorClass, getStatusColorClass, mataKuliahOptions } from "../utils/helpers";

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
    .filter(
      (task) =>
        task.namaTugas.toLowerCase().includes(filterText.toLowerCase()) ||
        task.mataKuliah.toLowerCase().includes(filterText.toLowerCase()) ||
        task.deskripsiTugas.toLowerCase().includes(filterText.toLowerCase())
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
          <ProjectListSkeleton />
        ) : processedTasks.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            Coming Soon on 8 or 14 Apr 2025!
          </div>
        ) : // <div className="text-center py-8 text-gray-400">No tasks found. Try refreshing.</div>
        viewMode === "list" ? (
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
