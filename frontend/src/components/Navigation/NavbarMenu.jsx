// src/components/Navbar/NavbarMenu.jsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCode,
  faBriefcase,
  faGraduationCap,
  faDatabase,
  faAngleUp,
  faAngleDown,
  faSpinner,
  faDashboard,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import NavbarMenuItem from "./NavbarMenuItem";
import NavbarFooter from "./NavbarFooter";

const menuVariants = {
  closed: {
    x: "-100%",
    borderTopRightRadius: "100%",
    borderBottomRightRadius: "100%",
    transition: { type: "spring", stiffness: 300, damping: 60 },
  },
  open: {
    x: 0,
    borderTopRightRadius: "0%",
    borderBottomRightRadius: "0%",
    transition: { type: "spring", stiffness: 400, damping: 50, staggerChildren: 0.2, delayChildren: 0.2 },
  },
};
const linkVariants = { closed: { opacity: 0, y: -20 }, open: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 20 } } };

const NavbarMenu = ({ isOpen, setIsOpen, isSuperAdmin, isLoggedIn, onLogout }) => {
  const [loading] = useState(false);
  const [subOpen, setSubOpen] = useState(false);

  return (
    <motion.div
      className="fixed top-14 left-0 w-64 h-[calc(100%-3.5rem)] bg-slate-950 bg-opacity-95 z-40 overflow-y-auto"
      initial="closed"
      animate="open"
      exit="closed"
      variants={menuVariants}
    >
      <nav className="flex flex-col h-full">
        {/* Logo */}
        <div className="sticky top-0 bg-slate-950 bg-opacity-95 pt-4 pb-2 z-10 flex justify-center">
          <Link to="/">
            <img src="/icon.svg" alt="logo" className="w-20 h-20" />
          </Link>
        </div>
        {/* Menu Items */}
        <div className="flex-grow overflow-y-auto py-4">
          <motion.div className="flex flex-col px-8 space-y-6">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <FontAwesomeIcon icon={faSpinner} spin className="text-blue-400 text-3xl animate-spin" />
              </div>
            ) : (
              <>      
                <NavbarMenuItem to="/dashboard" icon={faDashboard} label="Beranda" linkVariants={linkVariants} setClose={setIsOpen} />
                <NavbarMenuItem to="/projects" icon={faCode} label="Projects" linkVariants={linkVariants} setClose={setIsOpen} />
                <NavbarMenuItem icon={faBriefcase} label="Jokian" linkVariants={linkVariants} simple />
                <NavbarMenuItem to="/tugasKuliah" icon={faGraduationCap} label="Tugas Kuliah" linkVariants={linkVariants} setClose={setIsOpen} />
                {isLoggedIn && <NavbarMenuItem to="/profile" icon={faUser} label="Profile" linkVariants={linkVariants} setClose={setIsOpen} />}
                {isSuperAdmin && (
                  <>
                    <div className="text-white text-xl font-medium flex items-center gap-3 cursor-pointer" onClick={() => setSubOpen(o => !o)}>
                      <FontAwesomeIcon icon={faDatabase} />
                      Database
                      <FontAwesomeIcon icon={subOpen ? faAngleUp : faAngleDown} className="ml-2 text-gray-400" />
                    </div>
                    {subOpen && (
                      <div className="ml-8 mt-2 space-y-1">
                        <NavbarMenuItem to="/dataUser" label="Data User" linkVariants={linkVariants} simple setClose={() => { setSubOpen(false); setIsOpen(false); }} />
                        <NavbarMenuItem to="/dashboardActivity" label="Aktivitas User" linkVariants={linkVariants} simple setClose={() => { setSubOpen(false); setIsOpen(false); }} />
                        <NavbarMenuItem to="/registerFriend" label="Add User" linkVariants={linkVariants} simple setClose={() => { setSubOpen(false); setIsOpen(false); }} />
                        <NavbarMenuItem to="/deletedUsers" label="Deleted Users" linkVariants={linkVariants} simple setClose={() => { setSubOpen(false); setIsOpen(false); }} />
                      </div>
                    )}
                  </>
                )}
              </>
            )}
          </motion.div>
        </div>
        {/* Footer/Login & Logout */}
        <NavbarFooter isLoggedIn={isLoggedIn} onLogout={onLogout} setIsOpen={setIsOpen} linkVariants={linkVariants} />
      </nav>
    </motion.div>
  );
};

export default NavbarMenu;