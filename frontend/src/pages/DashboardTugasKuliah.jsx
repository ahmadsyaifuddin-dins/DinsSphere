import React, { useEffect, useState } from "react";
import HeaderTugasKuliah from "../layout/HeaderTugasKuliah";
import { useNavigate } from "react-router-dom";
import TugasKuliahList from "../components/tasks/TugasKuliahList";
import TugasKuliahModal from "../components/tasks/TugasKuliahModal";

const DashboardTugasKuliah = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [TugasKuliahToEdit, setTugasKuliahToEdit] = useState(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // List mata kuliah (value = kode MK, label = nama MK)
  const mataKuliahOptions = [
    { value: "FTI2006", label: "Etika Profesi" },
    { value: "MGU1007", label: "Fiqih" },
    { value: "TIF3601", label: "Jaringan Syaraf Tiruan" },
    { value: "TIF3602", label: "Riset Operasi" },
    { value: "TIF3603", label: "Sistem Penunjang Keputusan" },
    { value: "TIF3604", label: "Keamanan Sistem Komputer" },
    { value: "TIF3605", label: "Manajemen Perangkat Lunak" },
    { value: "TIF3606", label: "Testing & Implementasi di Bidang TI" },
    { value: "TIF3607", label: "Metodologi & Penelitian di Bidang TI" },
    { value: "TIF3609", label: "Pengolahan Citra" },
  ];

  // List Tugas Kuliah
  const [tugasKuliahList, setTugasKuliahList] = useState([]);

  // Dummy function buat menentukan kelas warna status
  const getStatusColorClass = (status) => {
    if (status === "Selesai") return "bg-green-500";
    if (status === "Tertunda") return "bg-yellow-500";
    return "bg-blue-500";
  };

  // Dummy function buat menentukan kelas warna progress
  const getProgressColorClass = (progress) => {
    if (progress >= 100) return "bg-green-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-blue-500";
  };

  // Contoh fungsi untuk melihat detail tugas (bisa pakai modal atau routing)
  const viewTaskDetail = (id) => {
    console.log("View detail for task id:", id);
    // Implementasi detail tugas bisa ditambahkan di sini
  };

  // Hapus tugas kuliah dari list
  const handleDelete = (id) => {
    setTugasKuliahList((prev) => prev.filter((task) => task._id !== id));
  };

  // Callback buat update urutan task ke backend (misalnya)
  const handleOrderChange = (newOrder) => {
    console.log("New order:", newOrder);
    // Lakukan update ke backend kalo perlu
  };

  // Tambah data Tugas Kuliah (simulasi, realnya bisa API call)
  const addTugasKuliah = async (formData) => {
    setTugasKuliahList((prev) => [...prev, { ...formData, _id: Date.now() }]);
  };

  // Update data Tugas Kuliah
  const updateTugasKuliah = async (id, formData) => {
    setTugasKuliahList((prev) =>
      prev.map((tk) => (tk._id === id ? { ...tk, ...formData } : tk))
    );
  };

  // Dipanggil saat modal disubmit
  const handleSave = async (formData) => {
    if (TugasKuliahToEdit) {
      await updateTugasKuliah(TugasKuliahToEdit._id, formData);
      setTugasKuliahToEdit(null);
      setIsModalOpen(false);
    } else {
      await addTugasKuliah(formData);
      setIsModalOpen(false);
    }
  };

  // Buka modal edit/tambah
  const handleEdit = (TugasKuliah) => {
    setTugasKuliahToEdit(TugasKuliah);
    setIsModalOpen(true);
  };

  // Handle logout
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      setIsAdmin(false);
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Cek token untuk set isAdmin
  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAdmin(!!token);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100">
      <div className="max-w-8xl mx-auto px-2 sm:px-6 lg:px-8 py-4 sm:py-8">
        <HeaderTugasKuliah
          isAdmin={isAdmin}
          setTugasKuliahToEdit={setTugasKuliahToEdit}
          setIsModalOpen={setIsModalOpen}
          handleLogout={handleLogout}
          isLoggingOut={isLoggingOut}
        />

      {/* Tugas Kuliah Modal */}
      {isModalOpen && isAdmin && (
        <TugasKuliahModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setTugasKuliahToEdit(null);
          }}
          task={TugasKuliahToEdit}
          onSave={handleSave}
          mataKuliahOptions={mataKuliahOptions}
        />
      )}

      <TugasKuliahList
        tasks={tugasKuliahList}
        getStatusColorClass={getStatusColorClass}
        getProgressColorClass={getProgressColorClass}
        viewTaskDetail={viewTaskDetail}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
        isAdmin={isAdmin}
        onOrderChange={handleOrderChange}
      />
    </div>
    </div>
  );
};


export default DashboardTugasKuliah;
