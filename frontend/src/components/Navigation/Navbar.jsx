// src/components/Navigation/Navbar.jsx
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import { useAuth } from "../../contexts/authContext";
import NavbarToggle from "./NavbarToggle";
import NavbarBrand from "./NavbarBrand";
import NavbarUserInfo from "./NavbarUserInfo";
import NavbarMenu from "./NavbarMenu";

const Navbar = () => {
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { user, logout } = useAuth();
  const isSuperAdmin = user?.role === "superadmin";
  const isLoggedIn = Boolean(user);

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  const toggleMenu = () => {
    document.body.classList.toggle("open");
    setIsMenuOpen(prev => !prev);
  };

  const handleLogout = () => {
    logout();
    setIsMenuOpen(false);
  };

  return (
    <>
      {/* Fixed Top Header */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-slate-950 bg-opacity-95 shadow-lg backdrop-blur-sm">
        <div className="flex items-center justify-between h-14 px-4">
          <NavbarToggle isOpen={isMenuOpen} onToggle={toggleMenu} />
          <NavbarBrand />
          <NavbarUserInfo user={user} isLoggedIn={isLoggedIn} />
        </div>
      </header>

      {/* Spacer */}
      <div className="h-14" />

      {/* Slide-out Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <NavbarMenu
            isOpen={isMenuOpen}
            setIsOpen={setIsMenuOpen}
            isSuperAdmin={isSuperAdmin}
            isLoggedIn={isLoggedIn}
            onLogout={handleLogout}
          />
        )}
      </AnimatePresence>

      {/* Shimmer animation keyframes */}
      <style>{`
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .animate-shimmer { animation: shimmer 3s linear infinite; }
      `}</style>
    </>
  );
};

export default Navbar;