// src/components/Navbar/NavbarFooter.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignOutAlt, faUser } from "@fortawesome/free-solid-svg-icons";

const NavbarFooter = ({ isLoggedIn, onLogout, setIsOpen, linkVariants }) => (
  <div className="sticky bottom-0 bg-slate-950 bg-opacity-95 pt-2 pb-4 z-10">
    <motion.div variants={linkVariants} className="px-8 pt-4 border-t border-slate-900">
      {isLoggedIn ? (
        <button
          onClick={() => { onLogout(); setIsOpen(false); }}
          className="text-red-400 cursor-pointer hover:text-red-300 text-xl font-medium flex items-center gap-3 w-fit"
        >
          <FontAwesomeIcon icon={faSignOutAlt} />
          Logout
        </button>
      ) : (
        <Link
          to="/login"
          onClick={() => setIsOpen(false)}
          className="text-blue-400 cursor-pointer hover:text-blue-300 text-xl font-medium flex items-center gap-3"
        >
          <FontAwesomeIcon icon={faUser} />
          Login
        </Link>
      )}
    </motion.div>
  </div>
);

export default NavbarFooter;