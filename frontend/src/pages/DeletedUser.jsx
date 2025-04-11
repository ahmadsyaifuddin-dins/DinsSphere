import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faSpinner,
  faEye,
  faUndo
} from "@fortawesome/free-solid-svg-icons";
import decode from "jwt-decode";
import Swal from "sweetalert2";
import { API_BASE_URL } from "../config";

const DeletedUsers = () => {
  const [deletedUsers, setDeletedUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/api/users/${userId}/undelete`,
        null, // Payload null, karena backend cuma update isDeleted ke false
        { headers: { Authorization: `Bearer ${token}` } }
      );
      Swal.fire("Restored!", "Data pengguna telah dipulihkan.", "success");
      // Refresh list deleted users
      fetchDeletedUsers();
    } catch (err) {
      console.error("Error restoring user:", err);
      Swal.fire("Error", "Gagal memulihkan data pengguna.", "error");
    }
  };

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4">
      <h1 className="mb-4 text-3xl font-bold text-blue-400">
        Daftar Pengguna Terhapus
      </h1>

      {error && (
        <div className="bg-red-600 text-white rounded p-4 mb-4">
          <FontAwesomeIcon icon={faCircleExclamation} className="mr-2" />
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center mt-10">
          <FontAwesomeIcon
            icon={faSpinner}
            spin
            className="text-blue-400 text-3xl animate-spin"
          />
        </div>
      ) : (
        <div className="overflow-x-auto">
          {deletedUsers.length === 0 ? (
            <div className="text-center">Tidak ada pengguna yang terhapus.</div>
          ) : (
            <table className="min-w-full bg-gray-800 shadow rounded-lg text-white">
              <thead>
                <tr>
                  <th className="px-4 py-3 bg-gray-700 text-left">No</th>
                  <th className="px-4 py-3 bg-gray-700 text-left">Nama</th>
                  <th className="px-4 py-3 bg-gray-700 text-left">Username</th>
                  <th className="px-4 py-3 bg-gray-700 text-left">Email</th>
                  <th className="px-4 py-3 bg-gray-700 text-left">Role</th>
                  <th className="px-4 py-3 bg-gray-700 text-left">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {deletedUsers.map((user, index) => (
                  <tr
                    key={user._id}
                    className="border-b border-gray-700 hover:bg-gray-600 transition duration-200"
                  >
                    <td className="px-4 py-3">{index + 1}</td>
                    <td className="px-4 py-3 capitalize">{user.name}</td>
                    <td className="px-4 py-3">{user.username}</td>
                    <td className="px-4 py-3">{user.email}</td>
                    <td className="px-4 py-3 capitalize">{user.role}</td>
                    <td className="px-4 py-3 flex gap-2 items-center">
                      <button
                        onClick={() => handleRestore(user._id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white py-1 px-3 rounded text-sm flex items-center gap-1"
                      >
                        <FontAwesomeIcon icon={faUndo} />
                        Restore
                      </button>
                      {/* Tetap bisa ada tombol "Lihat Detail" kalau diperlukan */}
                      <Link
                        to={`/detailUser/${user._id}`}
                        className="text-blue-400 hover:text-blue-600"
                      >
                        <FontAwesomeIcon icon={faEye} className="mr-1" />
                        Lihat Detail
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
};

export default DeletedUsers;
