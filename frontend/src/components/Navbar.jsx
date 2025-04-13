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
} from "@fortawesome/free-solid-svg-icons";
import decode from "jwt-decode";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDataMenuOpen, setIsDataMenuOpen] = useState(false);
  // Loading state default false (atur kalau perlu ambil dari API)
  const [loading, setLoading] = useState(false);

  // Ambil token dari localStorage terus decode untuk dapetin user
  const getUserFromToken = () => {
    const token = localStorage.getItem("token");
    try {
      return token ? decode(token) : null;
    } catch (error) {
      console.error("Gagal decode token:", error);
      return null;
    }
  };

  const [user, setUser] = useState(getUserFromToken);
  // State untuk cek role dan login
  const [isSuperAdmin, setIsSuperAdmin] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Update state user tiap kali route berubah
  useEffect(() => {
    setUser(getUserFromToken());
  }, [location.pathname]);

  // Tambahkan event listener custom untuk update token misalnya dari login
  useEffect(() => {
    const updateProfile = () => {
      setUser(getUserFromToken());
    };

    window.addEventListener("profileUpdated", updateProfile);
    return () => window.removeEventListener("profileUpdated", updateProfile);
  }, []);

  // Update internal state berdasarkan user
  useEffect(() => {
    setIsSuperAdmin(user?.role === "superadmin");
    setIsLoggedIn(Boolean(user));
    console.log("User updated di Navbar:", user);
  }, [user]);

  // Reset menu ketika route berubah
  useEffect(() => {
    setIsMenuOpen(false);
    setIsDataMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    document.body.classList.toggle("open");
    setIsMenuOpen(!isMenuOpen);
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
            className="fixed top-0 left-0 w-64 h-full bg-gray-900 bg-opacity-95 z-40 overflow-hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <nav className="flex flex-col justify-center items-center h-full">
              <img src="/icon.svg" alt="logo" className="w-25 h-25" />
              <motion.div className="flex flex-col p-8 w-full space-y-8">
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
                        to="/"
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
                        to="/dashboardTugasKuliah"
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
                          className="text-white text-2xl font-medium flex items-center gap-3 cursor-pointer mb-5"
                          onClick={() => setIsDataMenuOpen(!isDataMenuOpen)}
                        >
                          <FontAwesomeIcon icon={faDatabase} />
                          Database
                          <FontAwesomeIcon
                            icon={isDataMenuOpen ? faAngleUp : faAngleDown}
                            className="ml-2 text-gray-400"
                          />
                        </div>

                        <AnimatePresence>
                          {isDataMenuOpen && (
                            <motion.div
                              className="ml-8 flex flex-col gap-2"
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: "easeInOut" }}
                            >
                              <Link
                                to="/dataUser"
                                className="text-white hover:text-gray-300 text-xl"
                                onClick={() => {
                                  setIsDataMenuOpen(false);
                                  setIsMenuOpen(false);
                                }}
                              >
                                Data User
                              </Link>
                              <Link
                                to="/dashboardActivity"
                                className="text-white hover:text-gray-300 text-xl"
                                onClick={() => {
                                  setIsDataMenuOpen(false);
                                  setIsMenuOpen(false);
                                }}
                              >
                                Aktivitas User
                              </Link>                          
                              <Link
                                to="/registerFriend"
                                className="text-white hover:text-gray-300 text-xl"
                                onClick={() => {
                                  setIsDataMenuOpen(false);
                                  setIsMenuOpen(false);
                                }}
                              >
                                Add User
                              </Link>
                              <Link
                                to="/deletedUsers"
                                className="text-white hover:text-gray-300 text-xl"
                                onClick={() => {
                                  setIsDataMenuOpen(false);
                                  setIsMenuOpen(false);
                                }}
                              >
                                Deleted Users
                              </Link>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </motion.div>
                    )}
                  </>
                )}
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;
