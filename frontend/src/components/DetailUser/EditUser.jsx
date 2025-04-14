// EditUser.js (versi perbaikan)
import React, { useEffect, useState, useRef } from "react";
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
  faCircleExclamation,
  faSave,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { API_BASE_URL } from "../../config";
import FormField from "./FormField"; // Import komponen yang sudah diperbaiki
import Swal from "sweetalert2";

const EditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    nuclearCode: "",
    role: "",
    isActive: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  // Refs untuk auto focus
  const inputRefs = {
    name: useRef(null),
    username: useRef(null),
    email: useRef(null),
    password: useRef(null),
    nuclearCode: useRef(null),
    role: useRef(null),
    isActive: useRef(null),
  };

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/api/users/${id}`);
        setFormData(response.data);
        setLoading(false);
        setTimeout(() => inputRefs.name.current?.focus(), 100);
      } catch (err) {
        setError("Pengguna tidak ditemukan");
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const focusNextInput = (currentField) => {
    const fields = [
      "name",
      "username",
      "email",
      "password",
      "nuclearCode",
      "role",
      "isActive",
    ];
    const currentIndex = fields.indexOf(currentField);
    if (currentIndex < fields.length - 1) {
      const nextField = fields[currentIndex + 1];
      inputRefs[nextField].current?.focus();
    }
  };

  const handleKeyDown = (e, fieldName) => {
    if (e.key === "Enter") {
      e.preventDefault();
      focusNextInput(fieldName);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const token = localStorage.getItem("token");
      await axios.put(`${API_BASE_URL}/api/users/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setSuccessMessage("Data pengguna berhasil diperbarui");

      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      setError(
        err.response?.data?.message || "Gagal memperbarui data pengguna"
      );
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    const confirmDelete = await Swal.fire({
      title: "Yakin ingin menghapus pengguna ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Ya, hapus!",
    });

    if (confirmDelete.isConfirmed) {
      const token = localStorage.getItem("token");
      try {
        await axios.put(
          `${API_BASE_URL}/api/users/${id}/soft-delete`,
          { isDeleted: true },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        await Swal.fire({
          title: "Pengguna berhasil dihapus!",
          icon: "success",
        });
        navigate("/dataUser");
      } catch (err) {
        setError(err.response?.data?.message || "Gagal menghapus pengguna");
        await Swal.fire({
          title: "Gagal menghapus pengguna",
          icon: "error",
          text: err.response?.data?.message || "Gagal menghapus pengguna",
        });
      }
    }
  };

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
            Edit Pengguna
          </h1>
        </div>

        {error && (
          <div className="bg-red-600 bg-opacity-80 backdrop-filter backdrop-blur-sm text-white rounded-lg p-4 mb-6 shadow-lg border border-red-500 animate-pulse">
            <FontAwesomeIcon icon={faCircleExclamation} className="mr-2" />
            {error}
          </div>
        )}

        {successMessage && (
          <div className="bg-green-600 bg-opacity-80 backdrop-filter backdrop-blur-sm text-white rounded-lg p-4 mb-6 shadow-lg border border-green-500">
            <FontAwesomeIcon icon={faSave} className="mr-2" />
            {successMessage}
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
          <div className="bg-gray-800 rounded-xl shadow-2xl overflow-hidden transition-all duration-500 transform hover:shadow-blue-900/20">
            <div className="bg-gradient-to-r from-blue-700 to-blue-500 p-6">
              <div className="flex items-center">
                <div className="bg-white rounded-full p-3 mr-4 shadow-lg">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="text-blue-600 text-2xl"
                  />
                </div>
                <h2 className="text-xl font-bold">Edit Data Pengguna</h2>
              </div>
            </div>

            <div className="p-6">
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <FormField
                      key="name"
                      icon={faIdCard}
                      label="Nama Lengkap"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      ref={inputRefs.name}
                      onKeyDown={(e) => handleKeyDown(e, "name")}
                    />
                    <FormField
                      key="username"
                      icon={faUserTag}
                      label="Username"
                      name="username"
                      value={formData.username}
                      onChange={handleChange}
                      ref={inputRefs.username}
                      onKeyDown={(e) => handleKeyDown(e, "username")}
                    />
                    <FormField
                      key="email"
                      icon={faEnvelope}
                      label="Email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      ref={inputRefs.email}
                      onKeyDown={(e) => handleKeyDown(e, "email")}
                    />
                  </div>
                  <div>
                    <FormField
                      key="password"
                      icon={faLock}
                      label="Password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      ref={inputRefs.password}
                      onKeyDown={(e) => handleKeyDown(e, "password")}
                    />
                    <FormField
                      key="nuclearCode"
                      icon={faShieldAlt}
                      label="Kode Nuklir"
                      name="nuclearCode"
                      value={formData.nuclearCode}
                      onChange={handleChange}
                      ref={inputRefs.nuclearCode}
                      onKeyDown={(e) => handleKeyDown(e, "nuclearCode")}
                    />
                    <FormField
                      key="role"
                      icon={faUser}
                      label="Role"
                      name="role"
                      type="select"
                      value={formData.role}
                      onChange={handleChange}
                      ref={inputRefs.role}
                      onKeyDown={(e) => handleKeyDown(e, "role")}
                      options={[
                        { value: "friend", label: "Friend" },
                        { value: "member", label: "Member" },
                        { value: "admin", label: "Admin" },
                      ]}
                    />
                    <FormField
                      key="isActive"
                      icon={faUser}
                      label="Status"
                      name="isActive"
                      type="checkbox"
                      value={formData.isActive}
                      onChange={handleChange}
                      ref={inputRefs.isActive}
                    />
                  </div>
                </div>

                <div className="flex flex-col md:flex-row justify-between gap-4 mt-8">
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="bg-red-600 hover:bg-red-700 text-white py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center w-full md:w-auto"
                  >
                    <FontAwesomeIcon icon={faTrash} className="mr-2" />
                    Hapus Pengguna
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center w-full md:w-auto order-first md:order-last"
                  >
                    {saving ? (
                      <>
                        <FontAwesomeIcon
                          icon={faSpinner}
                          spin
                          className="mr-2"
                        />
                        Menyimpan...
                      </>
                    ) : (
                      <>
                        <FontAwesomeIcon icon={faSave} className="mr-2" />
                        Simpan Perubahan
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EditUser;
