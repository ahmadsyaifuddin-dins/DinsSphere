// src/components/Navbar/NavbarUserInfo.jsx
import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";

const NavbarUserInfo = ({ user, isLoggedIn }) => {
  if (!isLoggedIn) return null;
  return (
    <div className="flex items-center">
      <div className="text-white text-sm hidden sm:block mr-2">
        <span className="text-gray-400">Hello, </span>
        <Link
          to="/profile"
          className="font-medium bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent"
        >
          {user?.name || user?.username || "User"}
        </Link>
      </div>
      <Link to="/profile">
        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-teal-500 flex items-center justify-center">
          <FontAwesomeIcon icon={faUser} className="text-white text-xs" />
        </div>
      </Link>
    </div>
  );
};

export default NavbarUserInfo;