import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Plus, LogOut } from "lucide-react";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import FilterBar from "../components/FilterBar";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchProjects();
    // Check if user is admin
    const token = localStorage.getItem("token");
    setIsAdmin(!!token);
  }, []);

  const fetchProjects = async () => {
    try {
      // Fetch projects without token for guest view
      const res = await axios.get("http://localhost:5000/api/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  const addProject = async (newProject) => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.post(
        "http://localhost:5000/api/projects",
        newProject,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
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
      
      // Clear all auth-related data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Update admin status
      setIsAdmin(false);
      
      // Stay on dashboard as guest
      await fetchProjects(); // Refresh projects as guest
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col justify-between mb-8">
          <div className="text-center sm:text-left mb-6 sm:mb-0">
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-3 bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
              DinsSphere InterConnected
            </h1>
            <p className="text-gray-300 text-lg">
              {isAdmin 
                ? "Kelola dan lihat semua Project Kamu"
                : "Lihat semua Project Syaifuddin"}
            </p>
          </div>
          
          <div className="flex items-center space-x-4 mt-4">
            {isAdmin && (
              <button
                onClick={() => setIsModalOpen(true)}
                className="group flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white font-medium rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-600 transition-all duration-200 transform hover:-translate-y-1"
              >
                <Plus className="w-5 h-5 mr-2 group-hover:rotate-90 transition-transform duration-200" />
                <span>Tambah Project</span>
              </button>
            )}
            
            {isAdmin ? (
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="group flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-medium rounded-lg shadow-lg hover:from-red-700 hover:to-red-600 transition-all duration-200 transform hover:-translate-y-1"
              >
                <LogOut className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-200" />
                <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
              </button>
            ) : null}
          </div>
        </div>

        {/* Search / Filter Bar */}
        <FilterBar filterText={filterText} onFilterChange={setFilterText} />

        {/* Projects Grid */}
        <div className="mt-8 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
              <ProjectCard 
                key={project._id} 
                project={project}
                isAdmin={isAdmin} 
                onEdit={fetchProjects} 
              />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-lg">
                {filterText ? "No projects found matching your search" : "No projects added yet"}
              </p>
            </div>
          )}
        </div>
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