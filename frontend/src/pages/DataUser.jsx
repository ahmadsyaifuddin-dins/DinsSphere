import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faCircleExclamation, 
  faSpinner, 
  faEye,
  faUserSlash,
  faPlus,
  faSearch,
  faFilter,
  faTrash
} from "@fortawesome/free-solid-svg-icons";
import decode from "jwt-decode";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../config";

const DataUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
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

  // Fetch data pengguna
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/users`);
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError("Gagal memuat data pengguna");
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Fungsi soft delete user
  const handleDelete = async (userId) => {
    const confirm = await Swal.fire({
      title: "Hapus Pengguna",
      text: "Anda yakin ingin menghapus data pengguna ini? (soft delete)",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Ya, hapus!",
      cancelButtonText: "Batal",
      background: "#1E293B",
      color: "#fff",
      iconColor: "#F59E0B"
    });
  
    if (!confirm.isConfirmed) return;
  
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/api/users/${userId}/soft-delete`,
        { isDeleted: true },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Filter user yg telah dihapus agar tidak ditampilkan
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
      Swal.fire({
        title: "Deleted!", 
        text: "Data pengguna sudah dihapus.", 
        icon: "success",
        background: "#1E293B",
        color: "#fff",
        iconColor: "#10B981"
      });
    } catch (err) {
      console.error("Error deleting user:", err);
      Swal.fire({
        title: "Error", 
        text: "Gagal menghapus data pengguna.", 
        icon: "error",
        background: "#1E293B",
        color: "#fff"
      });
    }
  };

  // Fungsi restore (undelete) user
  const handleRestore = async (userId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/api/users/${userId}/undelete`,
        null, // payload bisa null karena backend cukup update isDeleted ke false
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Setelah restore, refresh data pengguna
      const response = await axios.get(`${API_BASE_URL}/api/users`);
      setUsers(response.data);
      Swal.fire({
        title: "Restored!", 
        text: "Data pengguna telah dipulihkan.", 
        icon: "success",
        background: "#1E293B",
        color: "#fff",
        iconColor: "#10B981"
      });
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

  // Filter users based on search term and filters
  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRole = filterRole === "" || user.role === filterRole;
    const matchesStatus = filterStatus === "" || 
      (filterStatus === "active" && user.isActive) ||
      (filterStatus === "inactive" && !user.isActive);
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Get unique roles for filter dropdown
  const uniqueRoles = [...new Set(users.map(user => user.role))];

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header area */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
              Daftar Pengguna
            </h1>
            <p className="text-gray-400 mt-1">Kelola semua pengguna dalam sistem</p>
          </div>
          
          <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
            <Link 
              to="/deletedUsers" 
              className="flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition duration-300"
            >
              <FontAwesomeIcon icon={faTrash} className="mr-2 text-red-400" />
              <span>Lihat User Terhapus</span>
            </Link>
            
            <Link 
              to="/add-user" 
              className="flex items-center justify-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 rounded-lg text-white transition duration-300"
            >
              <FontAwesomeIcon icon={faPlus} className="mr-2" />
              <span>Tambah User</span>
            </Link>
          </div>
        </div>

        {/* Search and filter section */}
        <div className="bg-gray-800 rounded-xl p-4 mb-6 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
            <div className="lg:col-span-2">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Cari pengguna..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                />
                <FontAwesomeIcon 
                  icon={faSearch} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
            
            <div>
              <div className="relative">
                <select
                  value={filterRole}
                  onChange={(e) => setFilterRole(e.target.value)}
                  className="w-full capitalize bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                >
                  <option value="">Semua Role</option>
                  {uniqueRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
                <FontAwesomeIcon 
                  icon={faFilter} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
            
            <div>
              <div className="relative">
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg py-2 pl-10 pr-4 text-white appearance-none focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-150"
                >
                  <option value="">Semua Status</option>
                  <option value="active">Aktif</option>
                  <option value="inactive">Tidak Aktif</option>
                </select>
                <FontAwesomeIcon 
                  icon={faFilter} 
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-900/70 border border-red-500 text-white rounded-lg p-4 mb-6 flex items-center shadow-lg">
            <FontAwesomeIcon icon={faCircleExclamation} className="text-red-400 mr-3 text-xl" />
            <span>{error}</span>
          </div>
        )}

        {/* Users table */}
        {loading ? (
          <div className="flex flex-col justify-center items-center mt-16">
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="text-blue-400 text-4xl mb-4"
            />
            <p className="text-gray-400">Memuat data pengguna...</p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-xl shadow-lg overflow-hidden">
            {filteredUsers.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-400 text-lg">Tidak ada data pengguna yang ditemukan</p>
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
                      <th className="px-6 py-4 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">Status</th>
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
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                            ${user.role === 'superadmin' ? 'bg-purple-900 text-purple-200' : 
                             user.role === 'admin' ? 'bg-blue-900 text-blue-200' :
                             user.role === 'friend' ? 'bg-green-950 text-green-400' :
                             'bg-gray-700 text-gray-200'}`
                          }>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                              ${user.isActive 
                                ? 'bg-green-900 text-green-200' 
                                : 'bg-red-900 text-red-200'
                              }`
                            }
                          >
                            {user.isActive ? "Aktif" : "Tidak Aktif"}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {/* Tampilkan tombol restore jika user sudah soft-deleted */}
                          {user.isDeleted ? (
                            <button
                              onClick={() => handleRestore(user._id)}
                              className="bg-yellow-600 hover:bg-yellow-700 text-white py-1.5 px-3 rounded-lg text-sm inline-flex items-center transition duration-200"
                            >
                              <FontAwesomeIcon icon={faUndo} className="mr-1.5" />
                              Restore
                            </button>
                          ) : (
                            <div className="flex space-x-2">
                              <Link
                                to={`/detailUser/${user._id}`}
                                className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-3 rounded-lg text-sm inline-flex items-center transition duration-200"
                              >
                                <FontAwesomeIcon icon={faEye} className="mr-1.5" />
                                Detail
                              </Link>
                              <button
                                onClick={() => handleDelete(user._id)}
                                className="bg-red-600 hover:bg-red-700 text-white py-1.5 px-3 rounded-lg text-sm inline-flex items-center transition duration-200"
                                title="Hapus User"
                              >
                                <FontAwesomeIcon icon={faUserSlash} className="mr-1.5" />
                                Hapus
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            {/* Footer with count */}
            <div className="bg-gray-800 px-6 py-4 border-t border-gray-700">
              <p className="text-gray-400 text-sm">
                Menampilkan {filteredUsers.length} dari {users.length} pengguna
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DataUser;