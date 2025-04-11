import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faArrowLeft, faSpinner } from "@fortawesome/free-solid-svg-icons";
import decode from "jwt-decode";
import { API_BASE_URL } from "../config";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
      return;
    }
  
    try {
      const decoded = decode(token);
      console.log("Decoded Token:", decoded); // Pastikan ada _id di sini
  
      const userId = decoded._id;
  
      if (!userId) {
        setError("Token tidak valid");
        setLoading(false);
        return;
      }
  
      const fetchUser = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await axios.get(
            `${API_BASE_URL}/api/users/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          
          setUser(response.data);
          setLoading(false);
        } catch (apiError) {
          console.error("API Error:", apiError); // Tambahkan logging
          setError("Gagal memuat profil");
          setLoading(false);
        }
      };

      fetchUser();
    } catch (decodeError) {
      console.error("Token Decoding Error:", decodeError); // Logging error decoding
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div className="bg-gray-900 text-white p-4 min-h-screen">
      <div className="flex items-center mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-400 hover:text-blue-600 mr-4"
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
        <h1 className="text-2xl font-bold text-blue-400">Profil Saya</h1>
      </div>

      {error && (
        <div className="bg-red-600 text-white rounded p-4 mb-4">
          <FontAwesomeIcon icon={faUser} className="mr-2" />
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
              <h2 className="text-lg font-medium">Informasi Profil</h2>
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

export default Profile;