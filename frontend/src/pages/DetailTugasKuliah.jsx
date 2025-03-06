import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const DetailTugasKuliah = () => {
  const { id } = useParams();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTaskDetail = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`https://dins-sphere-backend.vercel.app/api/tasks/${id}`);
        setTask(response.data);
      } catch (err) {
        console.error("Error fetching task detail:", err);
        setError("Gagal mengambil detail tugas");
      } finally {
        setLoading(false);
      }
    };

    fetchTaskDetail();
  }, [id]);

  if (loading) return <div className="text-center py-8 text-gray-400">Loading...</div>;
  if (error) return <div className="text-center py-8 text-red-400">{error}</div>;
  if (!task) return <div className="text-center py-8 text-gray-400">Detail tugas tidak ditemukan.</div>;

  return (
    <div className="container mx-auto p-4">
      <Link to="/dashboardTugasKuliah" className="text-blue-500 hover:underline">&larr; Kembali</Link>
      <div className="mt-4 bg-[#1E1E2E] p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-4 text-white">{task.namaTugas}</h1>
        <div className="mb-2">
          <strong className="text-gray-300">Mata Kuliah:</strong> <span className="text-white">{task.mataKuliah}</span>
        </div>
        <div className="mb-2">
          <strong className="text-gray-300">Deskripsi:</strong>
          <p className="text-white">{task.deskripsiTugas}</p>
        </div>
        <div className="mb-2">
          <strong className="text-gray-300">Tingkat Kesulitan:</strong> <span className="text-white">{task.tingkatKesulitan}</span>
        </div>
        <div className="mb-2">
          <strong className="text-gray-300">Tanggal Diberikan:</strong>{" "}
          <span className="text-white">
            {task.tanggalDiberikan ? new Date(task.tanggalDiberikan).toLocaleString("id-ID") : "Tidak tersedia"}
          </span>
        </div>
        <div className="mb-2">
          <strong className="text-gray-300">Tanggal Deadline:</strong>{" "}
          <span className="text-white">
            {task.tanggalDeadline ? new Date(task.tanggalDeadline).toLocaleString("id-ID") : "Tidak tersedia"}
          </span>
        </div>
        <div className="mb-2">
          <strong className="text-gray-300">Progress:</strong>{" "}
          <span className="text-white">{task.progress}%</span>
        </div>
        <div className="mb-2">
          <strong className="text-gray-300">Status Tugas:</strong>{" "}
          <span className="text-white">{task.statusTugas}</span>
        </div>
        <div className="mb-2">
          <strong className="text-gray-300">Tanggal Selesai:</strong>{" "}
          <span className="text-white">
            {task.tanggalSelesai ? new Date(task.tanggalSelesai).toLocaleString("id-ID") : "Belum selesai"}
          </span>
        </div>
        {task.gambaranTugas && (
          <div className="mt-4">
            <img
              src={task.gambaranTugas}
              alt={task.namaTugas}
              className="max-w-full rounded-lg object-cover"
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailTugasKuliah;
