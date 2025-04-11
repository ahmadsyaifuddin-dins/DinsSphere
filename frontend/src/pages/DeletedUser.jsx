import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faSpinner,
  faEye,
  faUndo,
  faUserCheck,
  faArrowLeft,
  faTrashRestore,
  faSearch
} from "@fortawesome/free-solid-svg-icons";
import decode from "jwt-decode";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../config";

const DeletedUsers = () => {
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  // Cek role SuperAdmin
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
    try {
      const decoded = decode(token);
      if (decoded.role !== "superadmin") {
        navigate("/");
      }
    } catch (error) {
      navigate("/login");
    }
  }, [navigate]);

  // Fetch deleted users
  const fetchDeletedUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/api/users/deleted/all`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDeletedUsers(response.data);
      setLoading(false);
    } catch (err) {
      setError("Gagal memuat data pengguna yang telah dihapus");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDeletedUsers();
  }, []);

  // Fungsi restore (undelete) user
  const handleRestore = async (userId) => {
    try {
      const confirm = await Swal.fire({
        title: "Pulihkan Pengguna",
        text: "Anda yakin ingin memulihkan data pengguna ini?",
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, pulihkan!",
        cancelButtonText: "Batal",
        background: "#1E293B",
        color: "#fff",
        iconColor: "#3B82F6"
      });
      
      if (!confirm.isConfirmed) return;
      
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/api/users/${userId}/undelete`,
        null, // Payload null, karena backend cuma update isDeleted ke false
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      Swal.fire({
        title: "Berhasil!", 
        text: "Data pengguna telah dipulihkan.", 
        icon: "success",
        background: "#1E293B",
        color: "#fff",
        iconColor: "#10B981"
      });
      
      // Refresh list deleted users
      fetchDeletedUsers();
    } catch (err) {
      console.error("Error restoring user:", err);
      Swal.fire({
        title: "Error", 
        text: "Gagal memulihkan data pengguna.", 
        icon: "error",
        background: "#1E293B",
        color: "#fff"
      });
    }
  };

  // Restore all users confirmation
  const handleRestoreAll = async () => {
    try {
      const confirm = await Swal.fire({
        title: "Pulihkan Semua Pengguna",
        text: `Anda yakin ingin memulihkan ${deletedUsers.length} pengguna yang telah dihapus?`,
        icon: "question",
        showCancelButton: true,
        confirmButtonText: "Ya, pulihkan semua!",
        cancelButtonText: "Batal",
        background: "#1E293B",
        color: "#fff",
        iconColor: "#3B82F6"
      });
      
      if (!confirm.isConfirmed) return;
      
      const token = localStorage.getItem("token");
      
      // Progress indicator
      Swal.fire({
        title: "Memulihkan...",
        text: "Proses pemulihan data sedang berlangsung",
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        },
        background: "#1E293B",
        color: "#fff"
      });
      
      // Process each user sequentially
      for (const user of deletedUsers) {
        await axios.put(
          `${API_BASE_URL}/api/users/${user._id}/undelete`,
          null,
          { headers: { Authorization: `Bearer ${token}` } }
        );
      }
      
      Swal.fire({
        title: "Berhasil!", 
        text: `${deletedUsers.length} pengguna telah dipulihkan.`, 
        icon: "success",
        background: "#1E293B",
        color: "#fff",
        iconColor: "#10B981"
      });
      
      // Refresh list deleted users
      fetchDeletedUsers();
    } catch (err) {
      console.error("Error restoring all users:", err);
      Swal.fire({
        title: "Error", 
        text: "Gagal memulihkan beberapa pengguna.", 
        icon: "error",
        background: "#1E293B",
        color: "#fff"
      });
      
      // Refresh to see which ones were restored
      fetchDeletedUsers();
    }
  };

  // Filter users based on search term
  const filteredUsers = deletedUsers.filter(user => 
    user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <div className="flex items-center">
              <Link 
                to="/users" 
                className="mr-4 bg-gray-700 hover:bg-gray-600 p-2 rounded-lg transition duration-200"
                title="Kembali ke Daftar Pengguna"
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </Link>
              <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-400 to-orange-500">
                  Daftar Pengguna Terhapus
                </h1>
                <p className="text-gray-400 mt-1">Kelola pengguna yang telah dihapus (soft delete)</p>
              </div>
            </div>
          </div>
          
          {deletedUsers.length > 0 && (
            <button
              onClick={handleRestoreAll}
              className="mt-4 md:mt-0 flex items-center justify-center px-4 py-2 bg-gradient-to-r from-yellow-500 to-orange-600 hover:from-yellow-600 hover:to-orange-700 rounded-lg text-white transition duration-300"
            >
              <FontAwesomeIcon icon={faTrashRestore} className="mr-2" />
              <span>Pulihkan Semua ({deletedUsers.length})</span>
            </button>
          )}
        </div>

        {/* Search section */}
        {deletedUsers.length > 0 && (
          <div className="bg-gray-800 rounded-xl p-4 mb-6 shadow-lg">
            <div className="relative">
              <input
                type="text"
                placeholder="Cari pengguna terhapus..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition duration-150"
              />
              <FontAwesomeIcon 
                icon={faSearch} 
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="bg-red-900/70 border border-red-500 text-white rounded-lg p-4 mb-6 flex items-center shadow-lg">
            <FontAwesomeIcon icon={faCircleExclamation} className="text-red-400 mr-3 text-xl" />
            <span>{error}</span>
          </div>
        )}

        {/* Deleted users section */}
        {loading ? (
          <div className="flex flex-col justify-center items-center mt-16">
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="text-orange-400 text-4xl mb-4"
            />
            <p className="text-gray-400">Memuat data pengguna terhapus...</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {deletedUsers.length === 0 ? (
              <div className="text-center py-16 px-4">
                <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-green-900/30 mb-4">
                  <FontAwesomeIcon icon={faUserCheck} className="text-green-400 text-2xl" />
                </div>
                <h3 className="text-xl font-medium text-gray-200 mb-2">Tidak Ada Pengguna Terhapus</h3>
                <p className="text-gray-400 max-w-md mx-auto">
                  Semua pengguna aktif dalam sistem. Tidak ada data pengguna yang telah dihapus saat ini.
                </p>
                <Link
                  to="/users"
                  className="mt-6 inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition duration-200"
                >
                  <FontAwesomeIcon icon={faArrowLeft} className="mr-2" />
                  Kembali ke Daftar Pengguna
                </Link>
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Tidak ada data pengguna terhapus yang sesuai dengan pencarian</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr className="bg-gray-700/50">
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">No</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Nama</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Username</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Role</th>
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-700">
                    {filteredUsers.map((user, index) => (
                      <tr
                        key={user._id}
                        className="hover:bg-gray-700/50 transition duration-200"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">{index + 1}</td>
                        <td className="px-6 py-4 whitespace-nowrap capitalize font-medium">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                            ${user.role === 'superadmin' ? 'bg-purple-900 text-purple-200' : 
                             user.role === 'admin' ? 'bg-blue-900 text-blue-200' : 
                             'bg-gray-700 text-gray-200'}`
                          }>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleRestore(user._id)}
                              className="bg-yellow-600 hover:bg-yellow-700 text-white py-1.5 px-3 rounded-lg text-sm inline-flex items-center transition duration-200"
                            >
                                <FontAwesomeIcon icon={faUndo} className="mr-1.5" />
                              Pulihkan
                            </button>
                            <Link
                              to={`/detailUser/${user._id}`}
                              className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded-lg text-sm inline-flex items-center transition duration-200"
                            >
                              <FontAwesomeIcon icon={faEye} className="mr-1.5" />
                              Detail
                            </Link>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {/* Footer with count */}
            {deletedUsers.length > 0 && (
              <div className="bg-gray-800 px-6 py-4 border-t border-gray-700">
                <p className="text-gray-400 text-sm">
                  Menampilkan {filteredUsers.length} dari {deletedUsers.length} pengguna terhapus
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeletedUsers;