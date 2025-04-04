import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { getTask } from "../../services/taskService";

const EditTugasKuliah = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Tambahkan properti jamDeadline dalam state
  const [formData, setFormData] = useState({
    namaTugas: "",
    tingkatKesulitan: "",
    deskripsiTugas: "",
    tanggalDeadline: "",
    jamDeadline: "",
    progress: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Ambil detail tugas saat mount
  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const response = await getTask(id);
        const task = response.data;
        
        // Pisahkan tanggal dan jam dari tanggalDeadline jika ada
        let tglDeadline = "";
        let jamDeadline = "";
        if (task.tanggalDeadline) {
          // Create date object from ISO string
          const deadlineDate = new Date(task.tanggalDeadline);
          
          // Format date as YYYY-MM-DD for the date input
          tglDeadline = deadlineDate.getFullYear() + '-' + 
                        String(deadlineDate.getMonth() + 1).padStart(2, '0') + '-' + 
                        String(deadlineDate.getDate()).padStart(2, '0');
          
          // Format time as HH:MM for the time input
          jamDeadline = String(deadlineDate.getHours()).padStart(2, '0') + ':' + 
                        String(deadlineDate.getMinutes()).padStart(2, '0');
        }
        
        setFormData({
          namaTugas: task.namaTugas || "",
          tingkatKesulitan: task.tingkatKesulitan || "",
          deskripsiTugas: task.deskripsiTugas || "",
          tanggalDeadline: tglDeadline,
          jamDeadline: jamDeadline,
          progress: task.progress || 0,
        });
      } catch (err) {
        console.error("Error fetching task:", err);
        setError("Gagal mengambil detail tugas");
      } finally {
        setLoading(false);
      }
    };

    fetchTask();
  }, [id]);

  // Handle perubahan input
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle submit form buat update tugas
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Gabungkan tanggalDeadline dan jamDeadline
    const { tanggalDeadline, jamDeadline, ...rest } = formData;
    let deadline = null;
    let deadlineWITA = null;
    
    if (tanggalDeadline && jamDeadline) {
      // Create a Date object with the local timezone
      const localDate = new Date(`${tanggalDeadline}T${jamDeadline}:00`);
      
      // Store ISO string for backend processing
      deadline = localDate.toISOString();
      
      // Also store formatted string in WITA timezone
      deadlineWITA = localDate.toLocaleString('id-ID', {
        timeZone: 'Asia/Makassar',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/, '$3-$1-$2T$4:$5:$6');
    }
    
    const payload = { 
      ...rest, 
      tanggalDeadline: deadline,
      tanggalDeadlineWITA: deadlineWITA
    };

    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `${API_BASE_URL}/api/tasks/${id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      navigate(`/detailTugasKuliah/${id}`);
    } catch (err) {
      console.error("Error updating task:", err);
      setError("Gagal memperbarui tugas");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-300">Memuat detail tugas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="bg-red-900 border border-red-500 rounded-xl p-6 max-w-md text-center">
          <p className="text-gray-300">{error}</p>
          <Link
            to="/dashboardTugasKuliah"
            className="mt-4 inline-block px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-lg transition duration-300"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto bg-gray-800 p-6 rounded-lg shadow-lg">
        <h1 className="text-3xl font-bold mb-6">Edit Tugas Kuliah</h1>
        <form onSubmit={handleSubmit}>
          {/* Nama Tugas */}
          <div className="mb-4">
            <label htmlFor="namaTugas" className="block text-gray-300 mb-2">
              Nama Tugas
            </label>
            <input
              type="text"
              id="namaTugas"
              name="namaTugas"
              value={formData.namaTugas}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-100"
              required
            />
          </div>
          {/* Tingkat Kesulitan */}
          <div className="mb-4">
            <label htmlFor="tingkatKesulitan" className="block text-gray-300 mb-2">
              Tingkat Kesulitan
            </label>
            <select
              id="tingkatKesulitan"
              name="tingkatKesulitan"
              value={formData.tingkatKesulitan}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-100"
              required
            >
              <option value="">Pilih tingkat kesulitan</option>
              <option value="Damai">Damai</option>
              <option value="Mudah">Mudah</option>
              <option value="Sedang">Sedang</option>
              <option value="Sulit">Sulit</option>
              <option value="Ngeri ☠️">Ngeri ☠️</option>
            </select>
          </div>
          {/* Deskripsi Tugas */}
          <div className="mb-4">
            <label htmlFor="deskripsiTugas" className="block text-gray-300 mb-2">
              Deskripsi Tugas
            </label>
            <textarea
              id="deskripsiTugas"
              name="deskripsiTugas"
              value={formData.deskripsiTugas}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-100"
              rows="5"
            ></textarea>
          </div>
          {/* Tanggal Deadline */}
          <div className="mb-4">
            <label htmlFor="tanggalDeadline" className="block text-gray-300 mb-2">
              Tanggal Deadline
            </label>
            <input
              type="date"
              id="tanggalDeadline"
              name="tanggalDeadline"
              value={formData.tanggalDeadline}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-100"
            />
          </div>
          {/* Jam Deadline */}
          <div className="mb-4">
            <label htmlFor="jamDeadline" className="block text-gray-300 mb-2">
              Jam Deadline
            </label>
            <input
              type="time"
              id="jamDeadline"
              name="jamDeadline"
              value={formData.jamDeadline || ""}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-100"
            />
          </div>
          {/* Progress */}
          <div className="mb-4">
            <label htmlFor="progress" className="block text-gray-300 mb-2">
              Progress (%)
            </label>
            <input
              type="number"
              id="progress"
              name="progress"
              value={formData.progress}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-100"
              min="0"
              max="100"
            />
          </div>
          {/* Tombol aksi */}
          <div className="flex justify-between mt-6">
            <Link
              to={`/detailTugasKuliah/${id}`}
              className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-lg transition duration-300"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="cursor-pointer px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-300"
            >
              Simpan Perubahan
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditTugasKuliah;