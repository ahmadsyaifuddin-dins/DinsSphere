import React from "react";
import Sidebar from "./Sidebar";

const Layout = ({ children }) => {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar di sisi kiri */}
      <Sidebar />
      {/* Konten utama di sebelah kanan */}
      <main className="flex-1 p-6 bg-[#121212]">
        {children}
      </main>
    </div>
  );
};

export default Layout;
