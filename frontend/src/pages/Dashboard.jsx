// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import ProjectList from "../components/projects/ProjectList";
import ProjectModal from "../components/projects/ProjectModal";
import ProjectCard from "../components/projects/ProjectCard";
import ProjectListSkeleton from "../loader/ProjectListSkeleton";
import FilterSearch from "../components/FilterSearch";
import SortOrder from "../components/SortOrder";
import ViewMode from "../components/ViewMode";
import HeaderProject from "../layout/HeaderProject";
import api from "../services/api";
import Swal from "sweetalert2";
import { getProgressColorClass, getStatusProjectColorClass, projectTypes, projectStatuses } from "../utils/helpers";

// Import komponen baru
import ProjectFilters from "../components/ProjectFilters";
import Pagination from "../components/Pagination";

const Dashboard = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest"); 
  const [orderMode, setOrderMode] = useState("manual");
  
  // State untuk filter tipe dan status
  const [selectedType, setSelectedType] = useState("");    // "" artinya semua
  const [selectedStatus, setSelectedStatus] = useState(""); // "" artinya semua
  
  // State untuk pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15; // Tampilkan 15 data per halaman
  const navigate = useNavigate();

  // Sorting & Filtering
  const processedProjects = projects
    .filter((project) => {
      // Filter berdasarkan text
      const matchText = project.title
        .toLowerCase()
        .includes(filterText.toLowerCase());

      // Filter berdasarkan tipe (jika ada pilihan)
      const matchType = !selectedType || project.type === selectedType;

      // Filter berdasarkan status (jika ada pilihan)
      const matchStatus = !selectedStatus || project.status === selectedStatus;

      return matchText && matchType && matchStatus;
    })
    .sort((a, b) => {
      if (orderMode === "manual") {
        return sortOrder === "newest" ? a.order - b.order : b.order - a.order;
      } else {
        const dateA = new Date(a.createdAt || a.startDate || 0);
        const dateB = new Date(b.createdAt || b.startDate || 0);
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      }
    });

  // Hitung total halaman & potong data sesuai halaman
  const totalPages = Math.ceil(processedProjects.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedProjects = processedProjects.slice(startIndex, endIndex);

  // Reset halaman ke 1 saat filter berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [filterText, selectedType, selectedStatus]);

  useEffect(() => {
    fetchProjects();
    const token = localStorage.getItem("token");
    setIsAdmin(!!token);
  }, []);

  const fetchProjects = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get("https://dins-sphere-backend.vercel.app/api/projects", {
        params: {
          type: selectedType,     // pastikan lo kirim param
          status: selectedStatus,
          search: filterText,
          page: currentPage,
          limit: itemsPerPage,
          sortOrder: sortOrder,
        },
      });
      console.log("API Response:", res.data);
      setProjects(res.data || []);
    } catch (err) {
      console.error("Error fetching projects:", err);
    } finally {
      setIsLoading(false);
    }
  };
  
  

  const viewProjectDetail = (id) => {
    navigate(`/projectDetail/${id}`);
  };

  const addProject = async (newProject) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.post("/projects", newProject, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects([res.data, ...projects]);
    } catch (err) {
      console.error("Error adding project:", err);
      if (err.response?.status === 401) {
        handleLogout();
      }
    }
  };

  const handleUpdateProject = async (projectId, formData) => {
    try {
      const token = localStorage.getItem("token");
      const res = await api.put(`/projects/${projectId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(
        projects.map((proj) => (proj._id === projectId ? res.data : proj))
      );
    } catch (err) {
      console.error("Error updating project:", err);
    }
  };

  const handleDelete = async (projectId) => {
    const result = await Swal.fire({
      title: "Hapus Project",
      text: "Apakah Anda yakin ingin menghapus project ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });
    if (!result.isConfirmed) return;
    try {
      const token = localStorage.getItem("token");
      await api.delete(`/projects/${projectId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProjects(projects.filter((project) => project._id !== projectId));
    } catch (err) {
      console.error("Error deleting project:", err);
    }
  };

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsAdmin(false);
      await fetchProjects();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Drag & Drop reorder
  const handleOrderChange = async (newOrder) => {
    try {
      const token = localStorage.getItem("token");
      await api.post(
        "/projects/reorder",
        { order: newOrder },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setOrderMode("manual");
    } catch (error) {
      console.error("Error reordering projects:", error);
      fetchProjects();
    }
  };

  const handleEdit = (project) => {
    setProjectToEdit(project);
    setIsModalOpen(true);
  };

  const handleSave = async (formData) => {
    if (projectToEdit) {
      await handleUpdateProject(projectToEdit._id, formData);
      setProjectToEdit(null);
      setIsModalOpen(false);
    } else {
      await addProject(formData);
      setIsModalOpen(false);
    }
  };

  // Fungsi ganti halaman
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <div className="max-w-8xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header Section */}
        <HeaderProject
          isAdmin={isAdmin}
          setProjectToEdit={setProjectToEdit}
          setIsModalOpen={setIsModalOpen}
          handleLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />

        {/* Project Count Section */}
        <div className="mb-4 mt-2 flex justify-between items-center">
          <div className="px-3 py-1.5 bg-blue-500/20 text-blue-400 border border-blue-500 rounded-lg">
            <span className="font-medium">
              Total Projects: {projects.length}
            </span>
          </div>
        </div>

        {/* Search Filter Section */}
        <div className="mb-4">
          <FilterSearch filterText={filterText} setFilterText={setFilterText} />
        </div>

        {/* Komponen Filter Tipe & Status */}
        <ProjectFilters
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          projectTypes={projectTypes}
          projectStatuses={projectStatuses}
        />

        {/* Controls Section */}
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

        {/* Render Projects */}
        {isLoading ? (
          <ProjectListSkeleton />
        ) : paginatedProjects.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No projects found. Please try refreshing the page.
          </div>
        ) : viewMode === "list" ? (
          <ProjectList
            projects={paginatedProjects}
            getStatusProjectColorClass={getStatusProjectColorClass}
            getProgressColorClass={getProgressColorClass}
            viewProjectDetail={viewProjectDetail}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            isAdmin={isAdmin}
            onOrderChange={handleOrderChange}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {paginatedProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                viewProjectDetail={viewProjectDetail}
              />
            ))}
          </div>
        )}

        {/* Komponen Pagination */}
        {!isLoading && processedProjects.length > 0 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      {/* Project Modal */}
      {isModalOpen && isAdmin && (
        <ProjectModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setProjectToEdit(null);
          }}
          project={projectToEdit}
          onSave={handleSave}
        />
      )}
    </div>
  );
};

export default Dashboard;
