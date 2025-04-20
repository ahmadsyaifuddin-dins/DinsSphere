// src/components/Navbar/NavbarBrand.jsx
import React from "react";
import { Link } from "react-router-dom";

const NavbarBrand = () => (
  <div className="flex-grow text-center">
    <h1 className="text-xl font-extrabold font-['Oxanium'] tracking-tight relative">
      <Link to="/">
        <span className="relative inline-block">
          <span className="text-transparent">DinsSphere InterConnected</span>
          <span className="absolute inset-0 bg-gradient-to-r from-green-400 via-teal-500 to-cyan-500 bg-clip-text text-transparent">
            DinsSphere InterConnected
          </span>
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent bg-clip-text text-transparent animate-shimmer bg-[length:200%_auto]">
            DinsSphere InterConnected
          </span>
        </span>
      </Link>
    </h1>
  </div>
);

export default NavbarBrand;