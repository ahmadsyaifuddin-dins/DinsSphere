import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

import ProjectCard from "../components/ProjectCard";
import ProjectList from "../components/ProjectList";
import ProjectModal from "../components/ProjectModal";
import FilterSearch from "../components/FilterSearch";
import SortOrder from "../components/SortOrder";
import ViewMode from "../components/ViewMode";
import Header from "../layout/Header";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewMode, setViewMode] = useState("list");
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest"); // "newest" atau "oldest"
  const [orderMode, setOrderMode] = useState("manual"); // pakai mode manual sebagai default
  const navigate = useNavigate();

  // Sorting: gunakan manual order (field order) dan toggle berdasarkan sortOrder
  const processedProjects = projects
    .filter((project) =>
      project.title.toLowerCase().includes(filterText.toLowerCase())
    )
    .sort((a, b) => {
      if (orderMode === "manual") {
        return sortOrder === "newest" ? a.order - b.order : b.order - a.order;
      } else {
        // fallback kalau diperlukan
        const dateA = new Date(a.createdAt || a.startDate || 0);
        const dateB = new Date(b.createdAt || b.startDate || 0);
        return sortOrder === "newest" ? dateB - dateA : dateA - dateB;
      }
    });

  useEffect(() => {
    fetchProjects();
    const token = localStorage.getItem("token");
    setIsAdmin(!!token);
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get(
        "https://dinssphere-production.up.railway.app/api/projects"
      );
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const viewProjectDetail = (id) => {
    navigate(`/projectDetail/${id}`);
  };

  const addProject = async (newProject) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://dinssphere-production.up.railway.app/api/projects",
        newProject,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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
      const res = await axios.put(
        `https://dinssphere-production.up.railway.app/api/projects/${projectId}`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setProjects(
        projects.map((proj) => (proj._id === projectId ? res.data : proj))
      );
    } catch (err) {
      console.error("Error updating project:", err);
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus project ini?"))
      return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://dinssphere-production.up.railway.app/api/projects/${projectId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
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

  // Fungsi untuk handle drag & drop reorder
  const handleOrderChange = async (newOrder) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "https://dinssphere-production.up.railway.app/api/projects/reorder",
        { order: newOrder },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Tetap di mode manual karena urutan diupdate secara drag & drop
      setOrderMode("manual");
    } catch (error) {
      console.error("Error reordering projects:", error);
      fetchProjects();
    }
  };

  // Helper functions buat UI
  const getStatusColorClass = (status) => {
    switch (status) {
      case "Done":
        return "bg-emerald-500/20 text-emerald-400 border-emerald-600";
      case "In Progress":
        return "bg-blue-500/20 text-blue-400 border-blue-500";
      case "Paused":
        return "bg-red-500/20 text-red-400 border-red-500";
      case "Backlog":
        return "bg-purple-500/20 text-purple-400 border-purple-500";
      case "Developing":
        return "bg-teal-500/20 text-teal-400 border-teal-600";
      case "Cancelled":
        return "bg-red-500/20 text-red-400 border-red-600";
      case "Planning":
        return "bg-indigo-500/20 text-indigo-400 border-indigo-600";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-600";
    }
  };

  const getProgressColorClass = (progress) => {
    if (progress >= 80) return "bg-emerald-500";
    if (progress >= 50) return "bg-amber-500";
    return "bg-rose-500";
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

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <div className="max-w-8xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header Section */}
        <Header
          isAdmin={isAdmin}
          setProjectToEdit={setProjectToEdit}
          setIsModalOpen={setIsModalOpen}
          handleLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />

        {/* Project Count Section */}
        <div className="mb-4 mt-2 flex justify-between items-center">
          <div className="px-3 py-1.5 bg-blue-500/20 text-blue-400 border border-blue-500 rounded-lg">
            <span className="font-medium">Total Projects: {projects.length}</span>
          </div>
        </div>

        {/* Search Filter Section */}
        <div className="mb-4">
          <FilterSearch filterText={filterText} setFilterText={setFilterText} />
        </div>

        {/* Controls Section */}
        <div className="flex justify-between items-center mb-4">
          {/* Sort Order */}
          <SortOrder
            sortOrder={sortOrder}
            setSortOrder={(val) => {
              setSortOrder(val);
              // Tetap gunakan mode manual; toggle sort hanya membalik urutan
              setOrderMode("manual");
            }}
          />
          <ViewMode viewMode={viewMode} setViewMode={setViewMode} />
        </div>

        {/* Render Projects */}
        {viewMode === "list" ? (
          <ProjectList
            projects={processedProjects}
            getStatusColorClass={getStatusColorClass}
            getProgressColorClass={getProgressColorClass}
            viewProjectDetail={viewProjectDetail}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
            isAdmin={isAdmin}
            onOrderChange={handleOrderChange}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {processedProjects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                viewProjectDetail={viewProjectDetail}
              />
            ))}
          </div>
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
