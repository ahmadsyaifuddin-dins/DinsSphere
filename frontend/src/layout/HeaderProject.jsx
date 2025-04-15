import React from "react";
import { Plus, LogOut, PlusIcon, FilePlus } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCode } from "@fortawesome/free-solid-svg-icons";

const HeaderProject = ({
  isAdmin,
  setProjectToEdit,
  setIsModalOpen,
  handleLogout,
  isLoggingOut,
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-gray-700">
      <div className="text-center md:text-left mb-4 md:mb-0">
        <h1 className="flex items-center justify-center md:justify-start text-2xl sm:text-4xl font-extrabold font-['Oxanium'] tracking-tight">
          {/* Icon with its own color */}
          <FontAwesomeIcon icon={faCode} className="mr-3 text-indigo-400" />
          
          {/* Text with gradient */}
          <span className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Projects
          </span>
        </h1>
        <p className="text-gray-300 text-sm sm:text-lg">
          {isAdmin
            ? "Kelola dan lihat semua Project Kamu"
            : "Lihat semua Project Ahmad Syaifuddin"}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-3 justify-center md:justify-end">
        {isAdmin && (
          <button
            onClick={() => {
              setProjectToEdit(null);
              setIsModalOpen(true);
            }}
            className="group flex items-center px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 transform hover:-translate-y-1 text-sm cursor-pointer"
          >
            <FilePlus className="w-4 h-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" />
            <span>Tambah Project</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default HeaderProject;