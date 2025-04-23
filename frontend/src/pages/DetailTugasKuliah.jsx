import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  deleteTask,
  toggleTaskCompletion,
} from "../services/taskService";
import { exportTaskToPDF } from "../utils/pdfExport";
import TaskHeader from "../components/DetailTugasKuliah/TaskHeader";
import ProgressBar from "../components/DetailTugasKuliah/ProgressBar";
import TaskDates from "../components/DetailTugasKuliah/TaskDates";
import CompletionStatus from "../components/DetailTugasKuliah/CompletionStatus";
import TaskActions from "../components/DetailTugasKuliah/TaskActions";
import NotesSection from "../components/DetailTugasKuliah/NotesSection";
import RelatedTasks from "../components/DetailTugasKuliah/RelatedTasks";
import ButtonFooter from "../components/DetailTugasKuliah/ButtonFooter";
import DetailTugasKuliahSkeleton from "../loader/DetailTugasKuliahSkeleton";
import TaskErrorState from "../components/DetailTugasKuliah/TaskErrorState";
import { API_BASE_URL } from "../config";
import { useAuth } from "../contexts/AuthContext";

const DetailTugasKuliah = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { token } = useAuth();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewCount, setViewCount] = useState(0);
  const isAdmin = !!token;

  useEffect(() => {
    let isMounted = true;

    const fetchTaskAndViews = async () => {
      try {
        const taskRes = await axios.get(`${API_BASE_URL}/api/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!isMounted) return;
        setTask(taskRes.data);
        setLoading(false);

        const viewRes = await axios.get(`${API_BASE_URL}/api/viewTasks/${id}`);
        setViewCount(viewRes.data.count || 0);
      } catch (err) {
        if (!isMounted) return;
        setError("Error fetching task details");
        setLoading(false);
      }
    };

    fetchTaskAndViews();

    const updateViewCount = async () => {
      const key = `viewed_task_${id}`;
      if (!localStorage.getItem(key)) {
        try {
          await axios.post(`${API_BASE_URL}/api/viewTasks/${id}`);
          localStorage.setItem(key, "true");
          const viewRes = await axios.get(`${API_BASE_URL}/api/viewTasks/${id}`);
          setViewCount(viewRes.data.count || 0);
        } catch (err) {
          console.error("Error updating view count:", err);
        }
      }
    };
    updateViewCount();

    return () => { isMounted = false; };
  }, [id, token]);

  const handleDeleteTask = async () => {
    const result = await Swal.fire({
      title: "Hapus Tugas",
      text: "Yakin hapus tugas ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });
    if (result.isConfirmed) {
      try {
        await deleteTask(id, token);
        navigate("/tugasKuliah");
      } catch {
        alert("Gagal menghapus tugas");
      }
    }
  };

  const handleToggleCompletion = async () => {
    const prev = { ...task };
    const optimistic = {
      ...task,
      tanggalSelesai: task.tanggalSelesai ? null : new Date().toISOString(),
      statusTugas: task.tanggalSelesai ? "Belum Dikerjakan" : "Selesai",
    };
    setTask(optimistic);
    try {
      await toggleTaskCompletion(id, {
        tanggalSelesai: optimistic.tanggalSelesai,
        statusTugas: optimistic.statusTugas,
      }, token);
    } catch {
      alert("Gagal update status");
      setTask(prev);
    }
  };

  const handleShareTask = () => {
    if (navigator.share) {
      navigator.share({
        title: task.namaTugas,
        text: task.deskripsiTugas,
        url: window.location.href,
      }).catch(console.error);
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link disalin ke clipboard");
    }
  };

  const handlePrintTask = () => window.print();

  if (loading) return <DetailTugasKuliahSkeleton />;
  if (error || !task) return <TaskErrorState error={error} />;

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/tugasKuliah"
          className="inline-flex items-center mb-6 px-4 py-2 bg-gray-800/50 hover:bg-gray-700 rounded-lg backdrop-blur-sm transition"
        >
          {/* SVG back icon */}
          Kembali ke Dashboard
        </Link>
        <div className="bg-gray-800/60 border border-gray-700 rounded-2xl shadow-xl overflow-hidden">
          <TaskHeader task={task} id={id} />
          <div className="p-6">
            <ProgressBar progress={task.progress} />
            <TaskDates task={task} />
            <div className="mb-6">
              <h2 className="text-xl font-semibold text-white mb-3">
                Deskripsi Tugas
              </h2>
              <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-5 text-gray-300 whitespace-pre-wrap break-words">
                {task.deskripsiTugas ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: task.deskripsiTugas.replace(
                        /(https?:\/\/[^\s]+)/g,
                        '<a href="$1" target="_blank" rel="noopener noreferrer" class="text-blue-400 hover:text-blue-300 underline break-all">$1</a>'
                      ),
                    }}
                  />
                ) : (
                  "Tidak ada deskripsi"
                )}
              </div>
            </div>
            <CompletionStatus task={task} />
            {task.gambaranTugas && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-3">
                  Gambaran Tugas
                </h2>
                <img
                  src={task.gambaranTugas}
                  alt={task.namaTugas}
                  className="w-full rounded-lg object-cover hover:scale-105 transition"
                />
              </div>
            )}
            <TaskActions
              task={task}
              id={id}
              isAdmin={isAdmin}
              handleToggleCompletion={handleToggleCompletion}
              handleDeleteTask={handleDeleteTask}
            />
            <NotesSection />
            <RelatedTasks mataKuliah={task.mataKuliah} currentTaskId={id} />
          </div>
          <div className="bg-gray-800/80 border-t border-gray-700 px-6 py-4 flex justify-between">
            <span className="text-gray-400 text-sm">ID Tugas: <span className="text-gray-300">{id}</span></span>
            <ButtonFooter
              task={task}
              handleShareTask={handleShareTask}
              handlePrintTask={handlePrintTask}
              exportTaskToPDF={() => exportTaskToPDF(task)}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailTugasKuliah;
