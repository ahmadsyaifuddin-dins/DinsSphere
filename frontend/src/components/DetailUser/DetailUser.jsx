import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faArrowLeft, 
  faUser, 
  faSpinner, 
  faEnvelope, 
  faLock, 
  faIdCard, 
  faUserTag, 
  faShieldAlt,
  faCircleExclamation
} from "@fortawesome/free-solid-svg-icons";
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

  const UserInfoItem = ({ icon, label, value, special = false }) => (
    <div className="bg-gray-700 rounded-lg p-4 hover:bg-gray-600 transition-all duration-300">
      <p className="text-blue-300 font-medium mb-2 flex items-center">
        <FontAwesomeIcon icon={icon} className="mr-2" />
        {label}
      </p>
      {special ? value : <p className="text-gray-100">{value}</p>}
    </div>
  );

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white p-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-6">
          <button
            onClick={() => navigate(-1)}
            className="bg-blue-500 hover:bg-blue-600 text-white rounded-full p-2 mr-4 transition-all duration-300 transform hover:scale-105"
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
          <h1 className="text-3xl font-bold text-blue-400 border-b-2 border-blue-500 pb-1">
            Detail Pengguna
          </h1>
        </div>

        {error && (
          <div className="bg-red-600 bg-opacity-80 backdrop-filter backdrop-blur-sm text-white rounded-lg p-4 mb-6 shadow-lg border border-red-500 animate-pulse">
            <FontAwesomeIcon icon={faCircleExclamation} className="mr-2" />
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex flex-col justify-center items-center mt-20">
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="text-blue-400 text-5xl mb-4"
            />
            <p className="text-blue-300 text-lg">Memuat data pengguna...</p>
          </div>
        ) : (
          user && (
            <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden transition-all duration-500 transform hover:shadow-blue-900/20">
              <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6">
                <div className="flex items-center mb-2">
                  <div className="bg-white rounded-full p-3 mr-4 shadow-lg">
                    <FontAwesomeIcon icon={faUser} className="text-blue-600 text-2xl" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">{user.name}</h2>
                    <p className="text-blue-100 opacity-90">@{user.username}</p>
                  </div>
                </div>
                <div className="ml-16">
                  <span
                    className={`${
                      user.isActive
                        ? "bg-green-500 border-green-600"
                        : "bg-red-500 border-red-600"
                    } py-1 px-3 rounded-full text-sm border font-medium shadow-md`}
                  >
                    {user.isActive ? "Aktif" : "Tidak Aktif"}
                  </span>
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-4 text-blue-300 border-b border-blue-900 pb-2">
                  Informasi Akun
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  <UserInfoItem icon={faIdCard} label="Nama Lengkap" value={user.name} />
                  <UserInfoItem icon={faUserTag} label="Username" value={user.username} />
                  <UserInfoItem icon={faEnvelope} label="Email" value={user.email} />
                  <UserInfoItem icon={faLock} label="Password" value={user.password} />
                  <UserInfoItem icon={faShieldAlt} label="Kode Nuklir" value={user.nuclearCode} />
                  <UserInfoItem 
                    icon={faUser} 
                    label="Role" 
                    special={
                      <span className="inline-block bg-blue-900 text-blue-200 py-1 px-3 rounded-full font-medium capitalize">
                        {user.role}
                      </span>
                    } 
                  />
                </div>
                
                <div className="flex justify-end">
                  <button 
                    onClick={() => navigate(`/users/edit/${id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-all duration-300 transform hover:scale-105"
                  >
                    Edit Pengguna
                  </button>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default DetailUser;