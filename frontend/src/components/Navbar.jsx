import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
// Import FontAwesome components
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCode, 
  faBriefcase, 
  faGraduationCap, 
  faRocket 
} from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    document.body.classList.toggle("open");
    setIsMenuOpen(!isMenuOpen);
  };

  // Curved animation path for the menu
  const menuVariants = {
    closed: {
      x: "-100%",
      borderTopRightRadius: "100%",
      borderBottomRightRadius: "100%",
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 60
      }
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
        delayChildren: 0.2
      }
    }
  };

  const linkVariants = {
    closed: { opacity: 0, y: -20 },
    open: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    }
  };

  return (
    <div className="navbar-container">
      {/* Toggle button on the left */}
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
              width: isMenuOpen ? 24 : 8
            }}
            transition={{ duration: 0.5 }}
          />
          <motion.span
            className="absolute left-0 top-[10px] h-0.5 w-6 bg-white rounded-sm"
            animate={{
              opacity: isMenuOpen ? 0 : 1
            }}
            transition={{ duration: 0.3 }}
          />
          <motion.span
            className="absolute right-0 top-[20px] h-0.5 w-6 bg-white rounded-sm"
            animate={{
              rotate: isMenuOpen ? -45 : 0,
              y: isMenuOpen ? -10 : 0,
              width: isMenuOpen ? 24 : 8
            }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </button>

      {/* Navigation Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed top-0 left-0 w-64 h-full bg-gray-900/95 backdrop-blur-xs z-40 overflow-hidden"
            initial="closed"
            animate="open"
            exit="closed"
            variants={menuVariants}
          >
            <nav className="flex flex-col justify-center items-center h-full">
              <div className="mb-14">
                <img src="/icon.svg" alt="logo" className="w-25 h-25" />
              </div>
              <motion.div
                className="flex flex-col p-8 w-full space-y-8"
              >
                <motion.div variants={linkVariants}>
                  <Link 
                    to="/" 
                    className="text-white hover:text-gray-300 text-2xl font-medium transition-colors duration-300 flex items-center gap-3"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faCode} className="w-5 h-5" />
                    Projects
                  </Link>
                </motion.div>
                
                <motion.div variants={linkVariants}>
                  <span 
                    className="text-gray-500 text-2xl font-medium cursor-not-allowed flex items-center gap-3"
                  >
                    <FontAwesomeIcon icon={faBriefcase} className="w-5 h-5" />
                    Jokian
                  </span>
                </motion.div>
                
                <motion.div variants={linkVariants}>
                  <Link 
                    to="/dashboardTugasKuliah"
                    className="text-white hover:text-gray-300 text-2xl font-medium transition-colors duration-300 flex items-center gap-3"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faGraduationCap} className="w-5 h-5" />
                    Tugas Kuliah
                  </Link>
                </motion.div>
                
                <motion.div variants={linkVariants}>
                  <Link 
                    to="#" 
                    className="text-white hover:text-gray-300 text-2xl font-medium transition-colors duration-300 flex items-center gap-3"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <FontAwesomeIcon icon={faRocket} className="w-5 h-5" />
                    Coming Soon!
                  </Link>
                </motion.div>
              </motion.div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Navbar;