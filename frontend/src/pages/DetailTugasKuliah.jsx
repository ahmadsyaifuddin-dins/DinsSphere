import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  getTask,
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
import { API_BASE_URL } from "../config";

const DetailTugasKuliah = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewCount, setViewCount] = useState(0);
  const isAdmin = !!localStorage.getItem("token");

  useEffect(() => {
    let isMounted = true;

    const fetchTaskAndViews = async () => {
      try {
        const taskRes = await axios.get(
          `${API_BASE_URL}/api/tasks/${id}`
        );
        if (isMounted) {
          setTask(taskRes.data);
          setLoading(false);
          const viewRes = await axios.get(
            `${API_BASE_URL}/api/viewTasks/${id}`
          );
          setViewCount(viewRes.data.count || 0);
        }
      } catch (err) {
        if (isMounted) {
          setError("Error fetching task details");
          setLoading(false);
        }
      }
    };

    fetchTaskAndViews();

    const updateViewCount = async () => {
      const viewedKey = `viewed_task_${id}`;
      if (!localStorage.getItem(viewedKey)) {
        try {
          await axios.post(
            `${API_BASE_URL}/api/viewTasks/${id}`
          );
          localStorage.setItem(viewedKey, "true");
          const viewRes = await axios.get(
            `${API_BASE_URL}/api/viewTasks/${id}`
          );
          setViewCount(viewRes.data.count || 0);
        } catch (err) {
          console.error("Error updating view count:", err);
        }
      }
    };

    updateViewCount();

    return () => {
      isMounted = false;
    };
  }, [id]);

  const handleDeleteTask = async () => {
    const result = await Swal.fire({
      title: "Hapus Tugas",
      text: "Apakah Anda yakin ingin menghapus tugas ini?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Hapus",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        await deleteTask(id, token);
        navigate("/dashboardTugasKuliah");
      } catch (error) {
        alert("Gagal menghapus tugas");
      }
    }
  };

  const handleToggleCompletion = async () => {
    const previousState = { ...task };
    const optimisticTask = {
      ...task,
      tanggalSelesai: task.tanggalSelesai ? null : new Date().toISOString(),
      statusTugas: task.tanggalSelesai ? "Belum Dikerjakan" : "Selesai",
    };
    setTask(optimisticTask);
    try {
      const updatedData = {
        tanggalSelesai: optimisticTask.tanggalSelesai,
        statusTugas: optimisticTask.statusTugas,
      };
      await toggleTaskCompletion(id, updatedData);
    } catch (error) {
      alert("Gagal memperbarui status tugas");
      setTask(previousState);
    }
  };

  const handleShareTask = () => {
    if (navigator.share) {
      navigator
        .share({
          title: task.namaTugas,
          text: task.deskripsiTugas,
          url: window.location.href,
        })
        .catch((error) => console.error("Error sharing:", error));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Link tugas telah disalin ke clipboard");
    }
  };

  const handlePrintTask = () => window.print();

  if (loading) {
    return <DetailTugasKuliahSkeleton />;
  }

  if (error || !task) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <p className="text-red-500">
          {error || "Detail tugas tidak ditemukan."}
        </p>
        <Link to="/dashboardTugasKuliah">Kembali ke Dashboard</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <Link
          to="/dashboardTugasKuliah"
          className="inline-flex items-center mb-6 px-4 py-2 bg-gray-800/50 hover:bg-gray-700 rounded-lg backdrop-blur-sm transition duration-300 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            ></path>
          </svg>{" "}
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
              <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-5 text-gray-300 whitespace-pre-wrap">
              {task.deskripsiTugas || "Tidak ada deskripsi"}
              </div>
            </div>
            <CompletionStatus task={task} />
            {task.gambaranTugas && (
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-white mb-3">
                  Gambaran Tugas
                </h2>
                <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-2">
                  <img
                    src={task.gambaranTugas}
                    alt={task.namaTugas}
                    className="w-full h-auto rounded-lg object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
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
            <br></br>
            <RelatedTasks mataKuliah={task.mataKuliah} currentTaskId={id} />
            </div>
          <div className="bg-gray-800/80 border-t border-gray-700 px-6 py-4 flex justify-between items-center">
            <div className="text-gray-400 text-sm">
              ID Tugas: <span className="text-gray-300">{id}</span>
            </div>
            <ButtonFooter
              task={task}
              handleShareTask={handleShareTask}
              handlePrintTask={handlePrintTask}
              exportTaskToPDF={exportTaskToPDF}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailTugasKuliah;
