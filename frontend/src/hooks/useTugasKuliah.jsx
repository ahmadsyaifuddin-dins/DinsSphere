// hooks/useTugasKuliah.js
import { useState, useEffect } from "react";
import axios from "axios";
import api from "../services/api";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../config";
import { useAuth } from "../contexts/authContext";
import {
  filterByProgress,
  filterByDueDate,
} from "../utils/helpers";

export const useTugasKuliah = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingViewCounts, setIsLoadingViewCounts] = useState(true);
  const [tugasKuliah, setTugasKuliah] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [viewMode, setViewMode] = useState("grid");
  const [tugasToEdit, setTugasToEdit] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest");
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
  
  const { user, isInitializing } = useAuth();
  const isAdmin = !!user;

  // Handle window resize and set view mode
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      setWindowWidth(width);
      
      if (width < 768) {
        setViewMode("grid");
      } else {
        setViewMode("list");
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Fetch data and log page visit
  useEffect(() => {
    const logPageVisit = async () => {
      try {
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
        fetchViewCounts(res.data);
      }
    } catch (err) {
      console.error("Error fetching tasks:", err);
    } finally {
      setIsLoading(false);
    }
  };

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

  const viewTaskDetail = (id) => {
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

  // Process tasks with filtering and sorting
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
        return sortOrder === "newest" ? a.order - b.order : b.order - a.order;
      } else {
        const dateA = new Date(a.createdAt || a.tanggalDiberikan || 0);
        const dateB = new Date(b.createdAt || b.tanggalDiberikan || 0);
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      }
    });

  return {
    // States
    isLoading,
    isLoadingViewCounts,
    isInitializing,
    isModalOpen,
    viewMode,
    filterText,
    filters,
    sortOrder,
    tugasToEdit,
    processedTasks,
    tugasKuliah,
    isAdmin,
    
    // State setters
    setIsModalOpen,
    setViewMode,
    setFilterText,
    setFilters,
    setSortOrder,
    setTugasToEdit,
    
    // Action handlers
    viewTaskDetail,
    handleDelete,
    handleEdit,
    handleSave,
    handleOrderChange,
    applyFilters,
  };
};