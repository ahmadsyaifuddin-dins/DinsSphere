// src/components/Navbar/NavbarToggle.jsx
import React from "react";
import { motion } from "framer-motion";

const NavbarToggle = ({ isOpen, onToggle }) => (
  <button
    className="bg-transparent border-none cursor-pointer p-2 focus:outline-none"
    onClick={onToggle}
    aria-label="Toggle menu"
  >
    <div className="relative w-6 h-6">
      <motion.span
        className="absolute left-0 top-0 h-0.5 w-6 bg-white rounded-sm"
        animate={{ rotate: isOpen ? 45 : 0, y: isOpen ? 10 : 0, width: isOpen ? 24 : 8 }}
        transition={{ duration: 0.5 }}
      />
      <motion.span
        className="absolute left-0 top-[10px] h-0.5 w-6 bg-white rounded-sm"
        animate={{ opacity: isOpen ? 0 : 1 }}
        transition={{ duration: 0.3 }}
      />
      <motion.span
        className="absolute right-0 top-[20px] h-0.5 w-6 bg-white rounded-sm"
        animate={{ rotate: isOpen ? -45 : 0, y: isOpen ? -10 : 0, width: isOpen ? 24 : 8 }}
        transition={{ duration: 0.5 }}
      />
    </div>
  </button>
);

export default NavbarToggle;