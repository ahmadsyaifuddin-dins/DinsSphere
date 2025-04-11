import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation, faSpinner, faEye } from "@fortawesome/free-solid-svg-icons";
import decode from "jwt-decode"; // Tambahkan import ini
import { API_BASE_URL } from "../config";

const DataUser = () => {
  const [users, setUsers] = useState([]);
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
      // DECODE TOKEN DENGAN JWT-DECODE
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
        const response = await axios.get(`${API_BASE_URL}/api/users`); // Ganti dengan endpoint API Anda
        setUsers(response.data);
        setLoading(false);
      } catch (err) {
        setError("Gagal memuat data pengguna");
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <div className="bg-gray-900 text-white min-h-screen p-4">
      <h1 className="mb-4 text-3xl font-bold text-blue-400">Daftar Pengguna</h1>

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
          <table className="min-w-full bg-gray-800 shadow rounded-lg text-white">
            <thead>
              <tr>
                <th className="px-4 py-3 bg-gray-700 text-left">No</th>
                <th className="px-4 py-3 bg-gray-700 text-left">Nama</th>
                <th className="px-4 py-3 bg-gray-700 text-left">Username</th>
                <th className="px-4 py-3 bg-gray-700 text-left">Email</th>
                <th className="px-4 py-3 bg-gray-700 text-left">Role</th>
                <th className="px-4 py-3 bg-gray-700 text-left">Status</th>
                <th className="px-4 py-3 bg-gray-700 text-left">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, index) => (
                <tr
                  key={user._id}
                  className="border-b border-gray-700 hover:bg-gray-600 transition duration-200"
                >
                  <td className="px-4 py-3">{index + 1}</td>
                  <td className="px-4 py-3 capitalize">{user.name}</td>
                  <td className="px-4 py-3">{user.username}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 capitalize">{user.role}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`${
                        user.isActive
                          ? "bg-green-600 text-white"
                          : "bg-red-600 text-white"
                      } py-1 px-2 rounded text-sm`}
                    >
                      {user.isActive ? "Aktif" : "Tidak Aktif"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
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
        </div>
      )}
    </div>
  );
};

export default DataUser;