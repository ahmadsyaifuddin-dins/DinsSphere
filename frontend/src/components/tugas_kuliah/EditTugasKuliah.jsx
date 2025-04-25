// src/components/EditTugasKuliah.jsx
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getTask, updateTask } from "../../services/taskService";

const EditTugasKuliah = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const res = await getTask(id);
        const task = res.data;

        let tgl = "";
        let jam = "";
        if (task.tanggalDeadline) {
          const d = new Date(task.tanggalDeadline);
          tgl = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
          jam = `${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
        }

        setFormData({
          namaTugas: task.namaTugas || "",
          tingkatKesulitan: task.tingkatKesulitan || "",
          deskripsiTugas: task.deskripsiTugas || "",
          tanggalDeadline: tgl,
          jamDeadline: jam,
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

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { tanggalDeadline, jamDeadline, ...rest } = formData;
    let deadlineISO = null;
    let deadlineWITA = null;

    if (tanggalDeadline && jamDeadline) {
      const localDate = new Date(`${tanggalDeadline}T${jamDeadline}:00`);
      deadlineISO = localDate.toISOString();
      deadlineWITA = localDate
        .toLocaleString("id-ID", {
          timeZone: "Asia/Makassar",
          year: "numeric",
          month: "2-digit",
          day: "2-digit",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        })
        .replace(
          /(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/,
          "$3-$1-$2T$4:$5:$6"
        );
    }

    const payload = {
      ...rest,
      tanggalDeadline: deadlineISO,
      tanggalDeadlineWITA: deadlineWITA,
    };

    try {
      await updateTask(id, payload);
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
            to="/tugasKuliah"
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
            <label
              htmlFor="tingkatKesulitan"
              className="block text-gray-300 mb-2"
            >
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
              <option value="Ngopi Santai ☕">Ngopi Santai ☕</option>
              <option value="Begadang Sedikit 🌙">Begadang Sedikit 🌙</option>
              <option value="Mikir Keras 🧠">Mikir Keras 🧠</option>
              <option value="Lembur Panik Attack 😨">Lembur Panik Attack 😨</option>
              <option value="Professor Level 🧑‍🦲🔬">Professor Level 🧑‍🦲🔬</option>
            </select>
          </div>
          {/* Deskripsi Tugas */}
          <div className="mb-4">
            <label
              htmlFor="deskripsiTugas"
              className="block text-gray-300 mb-2"
            >
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
            <label
              htmlFor="tanggalDeadline"
              className="block text-gray-300 mb-2"
            >
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
