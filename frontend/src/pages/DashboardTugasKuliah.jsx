import React, { useEffect, useState } from "react";
import HeaderTugasKuliah from "../layout/HeaderTugasKuliah";


const DashboardTugasKuliah = () => {
    
    const [isAdmin, setIsAdmin] = useState(false);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectToEdit, setProjectToEdit] = useState(null);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = async () => {
        try {
          setIsLoggingOut(true);
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          setIsAdmin(false);
          await fetchProjects();
        } catch (error) {
          console.error("Logout error:", error);
        } finally {
          setIsLoggingOut(false);
        }
      };

    useEffect(() => {
        // fetchProjects();
        const token = localStorage.getItem("token");
        setIsAdmin(!!token);
      }, []);

      const handleEdit = (project) => {
        setProjectToEdit(project);
        setIsModalOpen(true);
      };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <div className="max-w-8xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Header Section */}
        <HeaderTugasKuliah
          isAdmin={isAdmin}
          setProjectToEdit={setProjectToEdit}
          setIsModalOpen={setIsModalOpen}
          handleLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />
      </div>
    </div>
  );
};

export default DashboardTugasKuliah;
