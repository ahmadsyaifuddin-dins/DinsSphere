import React, { useState, useEffect } from "react";
import axios from "axios";
import ProjectCard from "../components/ProjectCard";
import ProjectModal from "../components/ProjectModal";
import FilterBar from "../components/FilterBar";

const Dashboard = () => {
  const [projects, setProjects] = useState([]);
  const [filterText, setFilterText] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Ambil data dari API saat komponen dimuat
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/projects");
      setProjects(res.data);
    } catch (err) {
      console.error("Error fetching projects:", err);
    }
  };

  // Fungsi untuk menambah proyek baru
  const addProject = async (newProject) => {
    try {
      const res = await axios.post(
        "http://localhost:5000/api/projects",
        newProject
      );
      setProjects([...projects, res.data]);
    } catch (err) {
      console.error("Error adding project:", err);
    }
  };

  // Filter berdasarkan judul project
  const filteredProjects = projects.filter((project) =>
    project.title.toLowerCase().includes(filterText.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#121212]">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Bagian Header */}
        <div className="flex flex-col justify-between items-start mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-2 ">
              DinsSphere InterConnected
            </h1>
            <p className="text-gray-300">Kelola dan lihat semua proyek Syaifuddin</p>
          </div>
          <button
            onClick={() => setIsModalOpen(true)}
            className="mt-4 sm:mt-5 px-6 py-3 bg-[#3A86FF] text-white font-medium rounded-lg shadow 
                       hover:bg-blue-500 transition transform hover:scale-105"
          >
            Tambah Project
          </button>
        </div>

        {/* Search / Filter Bar */}
        <FilterBar filterText={filterText} onFilterChange={setFilterText} />

        {/* Daftar Project */}
        <div className="mt-6 grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {filteredProjects.map((project) => (
            <ProjectCard key={project._id} project={project} />
          ))}
        </div>
      </div>

      {/* Modal Tambah/Edit Project */}
      {isModalOpen && (
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
