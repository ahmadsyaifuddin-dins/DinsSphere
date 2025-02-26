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
  const [viewMode, setViewMode] = useState("list"); // default view: list
  const [projectToEdit, setProjectToEdit] = useState(null);
  const [sortOrder, setSortOrder] = useState("newest"); // default: newest first
  const navigate = useNavigate();

  // Apply filter and sort to projects
  const processedProjects = projects
    .filter((project) =>
      project.title.toLowerCase().includes(filterText.toLowerCase())
    )
    .sort((a, b) => {
      // Sort by creation date or start date
      const dateA = new Date(a.createdAt || a.startDate || 0);
      const dateB = new Date(b.createdAt || b.startDate || 0);
      
      // For newest first (descending order)
      if (sortOrder === "newest") {
        return dateB - dateA;
      } 
      // For oldest first (ascending order)
      else {
        return dateA - dateB;
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
      // const res = await axios.get("http://localhost:5000/api/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const viewProjectDetail = (id) => {
    // Navigasi ke halaman detail project
    navigate(`/projectDetail/${id}`);
  };

  const addProject = async (newProject) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "https://dinssphere-production.up.railway.app/api/projects",
        newProject,
        {
          // const res = await axios.post("http://localhost:5000/api/projects", newProject, {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProjects([res.data, ...projects]); // Add new project to the beginning of the array
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
        {
          // const res = await axios.put(`http://localhost:5000/api/projects/${projectId}`, formData, {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setProjects(
        projects.map((proj) => (proj._id === projectId ? res.data : proj))
      );
    } catch (err) {
      console.error("Error updating project:", err);
    }
  };

  const handleDelete = async (projectId) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus project ini?")) {
      return; // jika user membatalkan, keluar dari fungsi
    }

    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `https://dinssphere-production.up.railway.app/api/projects/${projectId}`,
        {
          // await axios.delete(`http://localhost:5000/api/projects/${projectId}`, {
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

  // Helper functions for colors with enhanced visual appeal
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

        {/* Search Filter Section */}
        <div className="mb-4">
          <FilterSearch 
            filterText={filterText} 
            setFilterText={setFilterText} 
          />
        </div>
        
        {/* Controls Section - View Mode and Sort Order in same row */}
        <div className="flex justify-between items-center mb-4">
          {/* Sort Order on the left */}
          <SortOrder 
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
          
          {/* View Mode Toggle on the right */}
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
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {processedProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
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