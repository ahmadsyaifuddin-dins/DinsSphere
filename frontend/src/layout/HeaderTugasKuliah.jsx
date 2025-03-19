import React from "react";
import { LogOut, BookPlus } from "lucide-react";

const HeaderTugasKuliah = ({
  isAdmin,
  setIsModalOpen,
  handleLogout,
  isLoggingOut
}) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 pb-4 border-b border-gray-700">
      <div className="text-center md:text-left mb-4 md:mb-0">
        <div>
          {/* Text with direct shimmer effect */}
          <h1 className="text-2xl sm:text-4xl font-extrabold mb-3 font-['Oxanium'] tracking-tight relative">
            <span className="relative inline-block">
              {/* Base text layer */}
              <span className="text-transparent">DinsSphere InterConnected</span>
              
              {/* Shimmer effect directly on text */}
              <span className="absolute inset-0 bg-gradient-to-r from-green-400 via-teal-500 to-cyan-500 bg-clip-text text-transparent">DinsSphere InterConnected</span>
              
              {/* Moving highlight overlay */}
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">DinsSphere InterConnected</span>
            </span>
          </h1>
        </div>
        
        <p className="text-gray-300 text-sm sm:text-lg mt-2">
          {isAdmin
            ? "Kelola semua Tugas Kuliah Semester 6"
            : "Lihat semua Tugas Kuliah Semester 6"}
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-3 justify-center md:justify-end">
        {isAdmin && (
          <button
            onClick={() => setIsModalOpen(true)}
            className="group flex items-center px-4 py-2 bg-gradient-to-r from-green-600/80 to-teal-600/80 text-white font-medium rounded-lg shadow-lg hover:shadow-green-500/30 transition-all duration-300 transform hover:-translate-y-1 text-sm cursor-pointer backdrop-blur-sm"
          >
            <BookPlus className="w-4 h-4 mr-1.5 transition-transform duration-500 group-hover:animate-pulse group-hover:rotate-45 group-hover:scale-110" />
            <span className="transition-opacity duration-500 group-hover:opacity-100">
              Tambah Tugas Kuliah
            </span>
          </button>
        )}
        
        {isAdmin && (
          <button
            onClick={handleLogout}
            disabled={isLoggingOut}
            className="group flex items-center px-4 py-2 bg-gradient-to-r from-rose-600/80 to-red-600/80 text-white font-medium rounded-lg shadow-lg hover:shadow-red-500/30 transition-all duration-300 transform hover:-translate-y-1 text-sm cursor-pointer backdrop-blur-sm"
          >
            <LogOut className="w-4 h-4 mr-1.5 group-hover:translate-x-1 transition-transform duration-300" />
            <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
          </button>
        )}
      </div>

      {/* Animation styles */}
      <style jsx global>{`
        @keyframes shimmer {
          0% { background-position: -200% 0; }
          100% { background-position: 200% 0; }
        }
        .animate-shimmer {
          animation: shimmer 3s linear infinite;
        }
        
        @keyframes shine {
          0% { left: -100%; }
          100% { left: 100%; }
        }
        .animate-shine {
          animation: shine 2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default HeaderTugasKuliah;