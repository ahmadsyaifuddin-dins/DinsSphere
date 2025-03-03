import React from "react";
import { Plus, LogOut } from "lucide-react";

const HeaderProject = ({ 
  isAdmin, 
  setProjectToEdit, 
  setIsModalOpen, 
  handleLogout, 
  isLoggingOut 
}) => {
  return (
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
            onClick={() => {
              setProjectToEdit(null);
              setIsModalOpen(true);
            }}
            className="group flex items-center px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-lg shadow-lg hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 text-sm cursor-pointer"
          >
            <Plus className="w-4 h-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" />
            <span>Tambah Project</span>
          </button>
        )}
        {isAdmin && (
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="group flex items-center px-4 py-2 bg-gradient-to-r from-rose-600 to-red-600 text-white font-medium rounded-lg shadow-lg hover:shadow-red-500/30 transition-all duration-300 transform hover:-translate-y-1 text-sm cursor-pointer"
          >
            <LogOut className="w-4 h-4 mr-1.5 group-hover:translate-x-1 transition-transform duration-300" />
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          </button>
        )}
      </div>
    </div>
  );
};

export default HeaderProject;