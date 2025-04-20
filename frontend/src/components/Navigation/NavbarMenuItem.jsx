// src/components/Navbar/NavbarMenuItem.jsx
import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const NavbarMenuItem = ({ to, icon, label, linkVariants, simple, setClose }) => (
  <motion.div variants={linkVariants}>
    {to ? (
      <Link
        to={to}
        className={`text-white hover:text-gray-300 text-xl font-medium flex items-center gap-3 ${simple ? '' : ''}`}
        onClick={() => setClose(false)}
      >
        {icon && <FontAwesomeIcon icon={icon} />}
        {label}
      </Link>
    ) : (
      <div className="text-gray-500 text-xl font-medium cursor-not-allowed flex items-center gap-3">
        {icon && <FontAwesomeIcon icon={icon} />}
        {label}
      </div>
    )}
  </motion.div>
);

export default NavbarMenuItem;