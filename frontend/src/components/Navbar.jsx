// Navbar.jsx
import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCode,
  faBriefcase,
  faGraduationCap,
  faDatabase,
  faUser,
  faAngleUp,
  faAngleDown,
  faSpinner,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "../contexts/authContext";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDataMenuOpen, setIsDataMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  // Gunakan AuthContext untuk mendapatkan data user dan fungsi logout
  const { user, logout } = useAuth();
  
  // State untuk cek role dan login langsung dari AuthContext
  const isSuperAdmin = user?.role === "superadmin";
  const isLoggedIn = Boolean(user);

  // Reset menu ketika route berubah
  useEffect(() => {
    setIsMenuOpen(false);
    setIsDataMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    document.body.classList.toggle("open");
    setIsMenuOpen(!isMenuOpen);
  };
  
  // Handle logout
  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  const menuVariants = {
    closed: {
      x: "-100%",
      borderTopRightRadius: "100%",
      borderBottomRightRadius: "100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 60,
      },
    },
    open: {
      x: 0,
      borderTopRightRadius: "0%",
      borderBottomRightRadius: "0%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 50,
        staggerChildren: 0.2,
        delayChildren: 0.2,
      },
    },
  };

  const linkVariants = {
    closed: { opacity: 0, y: -20 },
    open: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20,
      },
    },
  };

  return (
    <div className="navbar-container">
      {/* Toggle button */}
      <button
        className="fixed z-50 top-2 left-2 md:left-6 bg-transparent border-none cursor-pointer p-2 focus:outline-none"
        onClick={toggleMenu}
        aria-label="Toggle menu"
      >
        <div className="relative w-6 h-6">
          <motion.span
            className="absolute left-0 top-0 h-0.5 w-6 bg-white rounded-sm"
            animate={{
              rotate: isMenuOpen ? 45 : 0,
              y: isMenuOpen ? 10 : 0,
              width: isMenuOpen ? 24 : 8,
            }}
            transition={{ duration: 0.5 }}
          />
          <motion.span
            className="absolute left-0 top-[10px] h-0.5 w-6 bg-white rounded-sm"
            animate={{
              opacity: isMenuOpen ? 0 : 1,
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="absolute right-0 top-[20px] h-0.5 w-6 bg-white rounded-sm"
            animate={{
              rotate: isMenuOpen ? -45 : 0,
              y: isMenuOpen ? -10 : 0,
              width: isMenuOpen ? 24 : 8,
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </button>

      {/* Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed top-0 left-0 w-64 h-full bg-gray-900 bg-opacity-95 z-40 overflow-y-auto"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <nav className="flex flex-col h-full">
              {/* Logo - fixed at top */}
              <div className="sticky top-0 bg-gray-900 bg-opacity-95 pt-4 pb-2 z-10 flex justify-center">
                <img src="/icon.svg" alt="logo" className="w-25 h-25" />
              </div>
              
              {/* Menu container with scroll capability */}
              <div className="flex-grow overflow-y-auto py-4">
                <motion.div className="flex flex-col px-8 space-y-8">
                  {/* Loading State */}
                  {loading && (
                    <div className="flex justify-center items-center h-full">
                      <FontAwesomeIcon
                        icon={faSpinner}
                        spin
                        className="text-blue-400 text-3xl animate-spin"
                      />
                    </div>
                  )}

                  {!loading && (
                    <>
                      {/* Menu Utama */}
                      <motion.div variants={linkVariants}>
                        <Link
                          to="/projects"
                          className="text-white hover:text-gray-300 text-2xl font-medium flex items-center gap-3"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <FontAwesomeIcon icon={faCode} />
                          Projects
                        </Link>
                      </motion.div>

                      <motion.div variants={linkVariants}>
                        <span className="text-gray-500 text-2xl font-medium cursor-not-allowed flex items-center gap-3">
                          <FontAwesomeIcon icon={faBriefcase} />
                          Jokian
                        </span>
                      </motion.div>

                      <motion.div variants={linkVariants}>
                        <Link
                          to="/tugasKuliah"
                          className="text-white hover:text-gray-300 text-2xl font-medium flex items-center gap-3"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          <FontAwesomeIcon icon={faGraduationCap} />
                          Tugas Kuliah
                        </Link>
                      </motion.div>

                      {/* Profile - Tampilkan hanya jika user login */}
                      {isLoggedIn && (
                        <motion.div variants={linkVariants} key="profile-menu">
                          <Link
                            to="/profile"
                            className="text-white hover:text-gray-300 text-2xl font-medium flex items-center gap-3"
                            onClick={() => setIsMenuOpen(false)}
                          >
                            <FontAwesomeIcon icon={faUser} />
                            Profile
                          </Link>
                        </motion.div>
                      )}

                      {/* Database (SuperAdmin) - Tampilkan hanya jika superadmin */}
                      {isSuperAdmin && (
                        <motion.div variants={linkVariants} key="admin-menu">
                          <div
                            className="text-white text-2xl font-medium flex items-center gap-3 cursor-pointer"
                            onClick={() => setIsDataMenuOpen(!isDataMenuOpen)}
                          >
                            <FontAwesomeIcon icon={faDatabase} />
                            Database
                            <FontAwesomeIcon
                              icon={isDataMenuOpen ? faAngleUp : faAngleDown}
                              className="ml-2 text-gray-400"
                            />
                          </div>

                          {/* Submenu dengan height absolute untuk menghindari pergeseran */}
                          <div className={`ml-8 mt-2 ${isDataMenuOpen ? 'block' : 'hidden'}`}>
                            <Link
                              to="/dataUser"
                              className="text-white hover:text-gray-300 text-xl block py-1"
                              onClick={() => {
                                setIsDataMenuOpen(false);
                                setIsMenuOpen(false);
                              }}
                            >
                              Data User
                            </Link>
                            <Link
                              to="/dashboardActivity"
                              className="text-white hover:text-gray-300 text-xl block py-1"
                              onClick={() => {
                                setIsDataMenuOpen(false);
                                setIsMenuOpen(false);
                              }}
                            >
                              Aktivitas User
                            </Link>                          
                            <Link
                              to="/registerFriend"
                              className="text-white hover:text-gray-300 text-xl block py-1"
                              onClick={() => {
                                setIsDataMenuOpen(false);
                                setIsMenuOpen(false);
                              }}
                            >
                              Add User
                            </Link>
                            <Link
                              to="/deletedUsers"
                              className="text-white hover:text-gray-300 text-xl block py-1"
                              onClick={() => {
                                setIsDataMenuOpen(false);
                                setIsMenuOpen(false);
                              }}
                            >
                              Deleted Users
                            </Link>
                          </div>
                        </motion.div>
                      )}
                    </>
                  )}
                </motion.div>
              </div>
              
              {/* Footer menu - fixed at bottom */}
              <div className="sticky bottom-0 bg-gray-900 bg-opacity-95 pt-2 pb-4 z-10">
                <motion.div variants={linkVariants} className="px-8 pt-4 border-t border-gray-700">
                  {isLoggedIn ? (
                    <button
                      onClick={handleLogout}
                      className="text-red-400 hover:text-red-300 text-xl font-medium flex items-center gap-3 w-full"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} />
                      Logout
                    </button>
                  ) : (
                    <Link
                      to="/login"
                      className="text-blue-400 hover:text-blue-300 text-xl font-medium flex items-center gap-3"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <FontAwesomeIcon icon={faUser} />
                      Login
                    </Link>
                  )}
                </motion.div>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;