import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { 
  faUser, 
  faArrowLeft, 
  faSpinner, 
  faEnvelope, 
  faUserTag, 
  faIdCard, 
  faCircleCheck, 
  faCircleExclamation,
  faShieldAlt,
  faEdit
} from "@fortawesome/free-solid-svg-icons";
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
      console.log("Decoded Token:", decoded);
  
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
          console.error("API Error:", apiError);
          setError("Gagal memuat profil");
          setLoading(false);
        }
      };

      fetchUser();
    } catch (decodeError) {
      console.error("Token Decoding Error:", decodeError);
      navigate("/login");
    }
  }, [navigate]);

  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map(word => word[0])
      .join("")
      .toUpperCase()
      .substring(0, 2);
  };

  // Generate a consistent color based on name
  const getAvatarColor = (name) => {
    if (!name) return "bg-blue-600";
    
    const colors = [
      "bg-blue-600", "bg-purple-600", "bg-green-600", 
      "bg-yellow-600", "bg-red-600", "bg-pink-600", 
      "bg-indigo-600", "bg-teal-600"
    ];
    
    // Simple hash function to get consistent color
    const hash = name.split("").reduce((acc, char) => {
      return acc + char.charCodeAt(0);
    }, 0);
    
    return colors[hash % colors.length];
  };

  return (
    <div className="bg-gradient-to-b from-gray-900 to-gray-800 text-white min-h-screen p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center justify-center w-10 h-10 bg-gray-800 hover:bg-gray-700 rounded-lg transition duration-300 mr-4"
            aria-label="Kembali"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-blue-400" />
          </button>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-500">
            Profil Saya
          </h1>
        </div>

        {/* Error message */}
        {error && (
          <div className="bg-red-900/70 border border-red-500 text-white rounded-lg p-4 mb-8 flex items-center shadow-lg">
            <FontAwesomeIcon icon={faCircleExclamation} className="text-red-400 mr-3 text-xl" />
            <span>{error}</span>
          </div>
        )}

        {/* Loading state */}
        {loading ? (
          <div className="flex flex-col justify-center items-center mt-16">
            <FontAwesomeIcon
              icon={faSpinner}
              spin
              className="text-blue-400 text-4xl mb-4"
            />
            <p className="text-gray-400">Memuat profil pengguna...</p>
          </div>
        ) : (
          user && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - Profile Card */}
              <div className="lg:col-span-1">
                <div className="bg-gray-800 rounded-xl overflow-hidden shadow-lg border border-gray-700">
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-24"></div>
                  <div className="px-6 pb-6 pt-0 -mt-12 flex flex-col items-center">
                    <div className={`${getAvatarColor(user.name)} w-24 h-24 rounded-full flex items-center justify-center text-2xl font-bold text-white border-4 border-gray-800 shadow-xl`}>
                      {getInitials(user.name)}
                    </div>
                    <h2 className="mt-4 text-xl font-bold capitalize">{user.name}</h2>
                    <p className="text-gray-400 mb-4">@{user.username}</p>
                    
                    <div className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-medium ${
                      user.isActive
                        ? "bg-green-900/50 text-green-300 border border-green-600"
                        : "bg-red-900/50 text-red-300 border border-red-600"
                      }`}
                    >
                      <FontAwesomeIcon 
                        icon={user.isActive ? faCircleCheck : faCircleExclamation} 
                        className={`${user.isActive ? "text-green-400" : "text-red-400"} mr-2`} 
                      />
                      {user.isActive ? "Akun Aktif" : "Akun Tidak Aktif"}
                    </div>
                    
                    <button className="mt-6 bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg inline-flex items-center transition duration-300">
                      <FontAwesomeIcon icon={faEdit} className="mr-2" />
                      Edit Profil
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Right Column - Details */}
              <div className="lg:col-span-2">
                <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden">
                  <div className="p-6 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-blue-400 flex items-center">
                      <FontAwesomeIcon icon={faUser} className="mr-3" />
                      Informasi Profil
                    </h3>
                  </div>
                  
                  <div className="divide-y divide-gray-700">
                    <div className="p-6 flex items-center">
                      <div className="mr-4 bg-blue-600/20 p-3 rounded-lg">
                        <FontAwesomeIcon icon={faIdCard} className="text-blue-400 text-lg" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Nama Lengkap</p>
                        <p className="font-medium text-lg capitalize">{user.name}</p>
                      </div>
                    </div>
                    
                    <div className="p-6 flex items-center">
                      <div className="mr-4 bg-purple-600/20 p-3 rounded-lg">
                        <FontAwesomeIcon icon={faUserTag} className="text-purple-400 text-lg" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Username</p>
                        <p className="font-medium text-lg">{user.username}</p>
                      </div>
                    </div>
                    
                    <div className="p-6 flex items-center">
                      <div className="mr-4 bg-green-600/20 p-3 rounded-lg">
                        <FontAwesomeIcon icon={faEnvelope} className="text-green-400 text-lg" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Email</p>
                        <p className="font-medium text-lg">{user.email}</p>
                      </div>
                    </div>
                    
                    <div className="p-6 flex items-center">
                      <div className="mr-4 bg-yellow-600/20 p-3 rounded-lg">
                        <FontAwesomeIcon icon={faShieldAlt} className="text-yellow-400 text-lg" />
                      </div>
                      <div>
                        <p className="text-gray-400 text-sm">Role</p>
                        <div className="mt-1">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium
                            ${user.role === 'superadmin' ? 'bg-purple-900/50 text-purple-300 border border-purple-600' : 
                             user.role === 'admin' ? 'bg-blue-900/50 text-blue-300 border border-blue-600' : 
                             'bg-gray-700 text-gray-300 border border-gray-600'}`
                          }>
                            {user.role}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Additional Info Card */}
                <div className="bg-gray-800 rounded-xl shadow-lg border border-gray-700 overflow-hidden mt-6">
                  <div className="p-6 border-b border-gray-700">
                    <h3 className="text-xl font-bold text-blue-400">Aktivitas Terbaru</h3>
                  </div>
                  <div className="p-6">
                    <div className="text-center py-4">
                      <p className="text-gray-400">Belum ada riwayat aktivitas untuk ditampilkan.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )
        )}
      </div>
    </div>
  );
};

export default Profile;