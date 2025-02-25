import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  
  // Check if user is admin on component mount
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user") || "{}");
    setIsAdmin(!!localStorage.getItem("token")); // Set admin status based on token existence
  }, []);
  
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Clear all auth-related data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      
      // Update admin status
      setIsAdmin(false);
      
      // Refresh the current page to update UI state
      window.location.reload();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // LogOut icon component
  const LogOut = ({ className }) => (
    <svg 
      xmlns="http://www.w3.org/2000/svg" 
      className={className} 
      fill="none" 
      viewBox="0 0 24 24" 
      stroke="currentColor"
    >
      <path 
        strokeLinecap="round" 
        strokeLinejoin="round" 
        strokeWidth={2} 
        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
      />
    </svg>
  );

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      const sidebar = document.getElementById('sidebar');
      const hamburger = document.getElementById('hamburger-button');
      
      if (isOpen && sidebar && !sidebar.contains(event.target) && !hamburger.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  return (
    <>
      {/* Header Mobile: Tampilan hamburger di layar kecil */}
      <div className="bg-[#1E1E2E] p-4 sm:hidden flex justify-between items-center">
        <h1 className="text-xl font-bold text-white">DinsSphere</h1>
        <button 
          id="hamburger-button"
          onClick={() => setIsOpen(!isOpen)} 
          className="text-white focus:outline-none"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {isOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile overlay when sidebar is open */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 sm:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar: Untuk layar kecil, tampil sebagai overlay; untuk layar besar, tampil statis */}
      <aside
        id="sidebar"
        className={`bg-[#1E1E2E] text-[#F4F4F8] w-64 min-h-screen p-6 fixed sm:relative top-0 left-0 z-50 transition-all duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"
        } sm:translate-x-0 flex flex-col`}
      >
        {/* Tombol tutup hanya untuk mobile */}
        <div className="sm:hidden flex justify-end mb-4">
          <button onClick={() => setIsOpen(false)} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Header Sidebar */}
        <div className="mb-10">
          <h1 className="text-2xl font-bold">DinsSphere</h1>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col space-y-4">
          <Link 
            to="/dashboard" 
            className="text-lg hover:text-[#3A86FF] transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Dashboard
          </Link>
          <Link 
            to="/projects" 
            className="text-lg hover:text-[#3A86FF] transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Projects
          </Link>
          <Link 
            to="/settings" 
            className="text-lg hover:text-[#3A86FF] transition-colors"
            onClick={() => setIsOpen(false)}
          >
            Settings
          </Link>
        </nav>

        {/* Tombol Logout */}
        <div className="mt-auto pt-10">
          {isAdmin && (
            <button
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="group flex items-center px-6 py-3 bg-gradient-to-r from-red-600 to-red-500 text-white font-medium rounded-lg shadow-lg hover:from-red-700 hover:to-red-600 transition-all duration-200 transform hover:-translate-y-1"
            >
              <LogOut className="w-5 h-5 mr-2 group-hover:translate-x-1 transition-transform duration-200" />
              <span>{isLoggingOut ? "Logging out..." : "Logout"}</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;