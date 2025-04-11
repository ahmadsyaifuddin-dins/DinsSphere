import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faUser, faSpinner } from "@fortawesome/free-solid-svg-icons";
import { API_BASE_URL } from "../../config";

const DetailUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/users/${id}`);
        setUser(response.data);
        setLoading(false);
      } catch (err) {
        setError("Pengguna tidak ditemukan");
        setLoading(false);
      }
    };

    fetchUser();
  }, [id]);

  return (
    <div className="bg-gray-900 text-white p-4 min-h-screen">
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-400 hover:text-blue-600 mr-4"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1 className="text-2xl font-bold text-blue-400">Detail Pengguna</h1>
      </div>

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
        user && (
          <div className="bg-gray-800 p-6 rounded shadow-lg">
            <div className="flex items-center mb-4">
              <FontAwesomeIcon icon={faUser} className="text-blue-400 mr-2" />
              <h2 className="text-lg font-medium">Profil Pengguna</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="font-medium">Nama:</p>
                <p>{user.name}</p>
              </div>
              <div>
                <p className="font-medium">Username:</p>
                <p>{user.username}</p>
              </div>
              <div>
                <p className="font-medium">Email:</p>
                <p>{user.email}</p>
              </div>
              <div>
                <p className="font-medium">Password:</p>
                <p>{user.password}</p>
              </div>
              <div>
                <p className="font-medium">Kode Nuklir:</p>
                <p>{user.nuclearCode}</p>
              </div>
              <div>
                <p className="font-medium">Role:</p>
                <p className="capitalize">{user.role}</p>
              </div>
              <div>
                <p className="font-medium">Status:</p>
                <span
                  className={`${
                    user.isActive
                      ? "bg-green-600 text-white"
                      : "bg-red-600 text-white"
                  } py-1 px-2 rounded text-sm`}
                >
                  {user.isActive ? "Aktif" : "Tidak Aktif"}
                </span>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  );
};

export default DetailUser;