import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Plus, LogOut, List, Grid, Search, SortAsc, Filter, ChevronRight, Edit, Trash2, Eye } from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [viewMode, setViewMode] = useState("list"); // default view: list
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    const token = localStorage.getItem("token");
    setIsAdmin(!!token);
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("https://dinssphere-production.up.railway.app/api/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
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
      setProjects([...projects, res.data]);
    } catch (err) {
      console.error("Error adding project:", err);
      if (err.response?.status === 401) {
        handleLogout();
      }
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

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(filterText.toLowerCase())
  );

  // Helper functions for status and progress colors
  const getStatusColorClass = (status) => {
    switch (status) {
      case "Done":
        return "bg-emerald-500 border-emerald-600";
      case "In Progress":
        return "bg-amber-500 border-amber-600";
      case "Paused":
        return "bg-purple-500 border-purple-600";
      case "Backlog":
        return "bg-blue-500 border-blue-600";
      case "Developing":
        return "bg-teal-500 border-teal-600";
      default:
        return "bg-gray-500 border-gray-600";
    }
  };

  const getProgressColorClass = (progress) => {
    if (progress >= 80) return "bg-emerald-500";
    if (progress >= 50) return "bg-amber-500";
    return "bg-rose-500";
  };

  // Function to display compact status for mobile
  const getCompactStatus = (status) => {
    if (status === "In Progress") return "In Progress";
    return status;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <div className="max-w-8xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header Section with enhanced styling */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-gray-700">
          <div className="text-center md:text-left mb-4 md:mb-0">
            <h1 className="text-2xl sm:text-4xl font-extrabold mb-2 bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              DinsSphere InterConnected
            </h1>
            <p className="text-gray-300 text-sm sm:text-lg">
              {isAdmin
                ? "Kelola dan lihat semua Project Kamu"
                : "Lihat semua Project Syaifuddin"}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 justify-center md:justify-end">
            {isAdmin && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="group flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 text-sm"
              >
                <Plus className="w-4 h-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" />
                <span>Tambah Project</span>
              </button>
            )}
            {isAdmin && (
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="group flex items-center px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 text-white font-medium rounded-lg shadow-lg hover:shadow-red-500/30 transition-all duration-300 transform hover:-translate-y-1 text-sm"
              >
                <LogOut className="w-4 h-4 mr-1.5 group-hover:translate-x-1 transition-transform duration-300" />
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              </button>
            )}
          </div>
        </div>

        {/* Enhanced Search / Filter Bar */}
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="w-4 h-4 text-gray-400" />
            </div>
            <input
              type="text"
              className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2"
              placeholder="Cari project berdasarkan judul..."
              value={filterText}
              onChange={(e) => setFilterText(e.target.value)}
            />
          </div>
        </div>

        {/* View Mode Toggle with better styling */}
        <div className="flex justify-end mb-4">
          <div className="inline-flex rounded-md shadow-sm" role="group">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-l-lg border ${
                viewMode === "list"
                  ? "bg-blue-600 text-white border-blue-700"
                  : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center">
                <List className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Table View</span>
                <span className="xs:hidden">Table</span>
              </div>
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-r-lg border ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white border-blue-700"
                  : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
              }`}
            >
              <div className="flex items-center">
                <Grid className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
                <span className="hidden xs:inline">Card View</span>
                <span className="xs:hidden">Card</span>
              </div>
            </button>
          </div>
        </div>

        {/* Render Projects - Modified Table for better mobile display */}
        {viewMode === "list" ? (
          <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
            <table className="w-full text-xs sm:text-sm text-left text-gray-300">
              <thead className="text-xs uppercase bg-gray-700 text-gray-300">
                <tr>
                  <th scope="col" className="py-2 px-3 sm:py-3 sm:px-6">Nama Project</th>
                  <th scope="col" className="py-2 px-2 sm:py-3 sm:px-6 whitespace-nowrap">Status</th>
                  <th scope="col" className="py-2 px-3 sm:py-3 sm:px-6 hidden md:table-cell">Deskripsi</th>
                  <th scope="col" className="py-2 px-2 sm:py-3 sm:px-6 whitespace-nowrap">Progress</th>
                  <th scope="col" className="py-2 px-2 sm:py-3 sm:px-6 text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredProjects.length > 0 ? (
                  filteredProjects.map((project, index) => (
                    <tr 
                      key={project._id} 
                      className={`border-b border-gray-700 ${
                        index % 2 === 0 ? 'bg-gray-800' : 'bg-gray-900'
                      } hover:bg-gray-700 transition-colors duration-150`}
                    >
                      <td className="py-2 px-3 sm:py-4 sm:px-6">
                        <div className="flex items-center space-x-2 sm:space-x-3">
                          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold">
                            {project.title.charAt(0)}
                          </div>
                          <div>
                            <h3 className="font-medium text-white text-xs sm:text-sm">{project.title}</h3>
                            {project.subtitle && (
                              <p className="text-xs text-gray-400 hidden sm:block">
                                {project.subtitle}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="py-2 px-2 sm:py-4 sm:px-6">
                        {/* Desktop status badge */}
                        <span
                          className={`hidden sm:inline-block px-2.5 py-1 rounded-full text-xs font-medium text-white ${getStatusColorClass(
                            project.status
                          )} border`}
                        >
                          {project.status}
                        </span>
                        
                        {/* Mobile status badge with smaller text */}
                        <span
                          className={`sm:hidden inline-block px-2 py-1 rounded-full text-xs font-medium text-white ${getStatusColorClass(
                            project.status
                          )} border whitespace-nowrap`}
                        >
                          {project.status === "In Progress" ? "In Progress" : project.status}
                        </span>
                      </td>
                      <td className="py-2 px-3 sm:py-4 sm:px-6 max-w-xs truncate hidden md:table-cell">
                        {project.description}
                      </td>
                      <td className="py-2 px-2 sm:py-4 sm:px-6">
                        <div className="flex items-center">
                          <div className="w-12 sm:w-24 bg-gray-700 rounded-full h-1.5 sm:h-2.5 mr-1 sm:mr-2">
                            <div
                              className={`h-1.5 sm:h-2.5 rounded-full ${getProgressColorClass(
                                project.progress
                              )}`}
                              style={{ width: `${project.progress}%` }}
                            ></div>
                          </div>
                          <span className="text-xs w-7 sm:w-9 text-right font-medium whitespace-nowrap">
                            {project.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="py-2 px-2 sm:py-4 sm:px-6">
                        <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                          <button className="text-gray-400 hover:text-blue-500 focus:outline-none p-1">
                            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                          </button>
                          {isAdmin && (
                            <>
                              <button className="text-gray-400 hover:text-yellow-500 focus:outline-none p-1">
                                <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                              <button className="text-gray-400 hover:text-rose-500 focus:outline-none p-1">
                                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr className="bg-gray-800 border-b border-gray-700">
                    <td colSpan="5" className="py-6 px-4 sm:py-8 sm:px-6 text-center">
                      <div className="flex flex-col items-center">
                        <SortAsc className="w-8 h-8 sm:w-12 sm:h-12 text-gray-500 mb-2 sm:mb-3" />
                        <p className="text-gray-400 text-sm">Tidak ada project yang ditemukan</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        ) : (
          // Grid View
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {filteredProjects.map((project) => (
              <ProjectCard key={project._id} project={project} />
            ))}
          </div>
        )}
      </div>

      {/* Project Modal */}
      {isModalOpen && isAdmin && (
        <ProjectModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onSave={async (formData) => {
            await addProject(formData);
            setIsModalOpen(false);
          }}
        />
      )}
    </div>
  );
};

export default Dashboard;