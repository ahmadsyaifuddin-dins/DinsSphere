// src/components/TugasKuliahList.jsx
import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { SortAsc } from "lucide-react";
import DraggableRow from "../TugasKuliahList/DraggableRow";
import { API_BASE_URL } from "../../config";
import api from "../../services/api";

const TugasKuliahList = ({
  tasks: initialTasks,
  getStatusColorClass,
  getProgressColorClass,
  viewTaskDetail,
  handleEdit,
  handleDelete,
  isAdmin,
  onOrderChange,
  mataKuliahOptions,
}) => {
  const [tasks, setTasks] = useState(initialTasks);
  const [isLoadingViewCounts, setIsLoadingViewCounts] = useState(true);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  useEffect(() => {
    const fetchViewCounts = async () => {
      setIsLoadingViewCounts(true);
      try {
        const updatedTasks = await Promise.all(
          initialTasks.map(async (task) => {
            try {
              const response = await axios.get(
                `${API_BASE_URL}/api/viewTasks/${task._id}`
              );
              return { ...task, viewCount: response.data.count || 0 };
            } catch (error) {
              console.error("Error fetching view count for task", task._id, error);
              return { ...task, viewCount: 0 };
            }
          })
        );
        setTasks(updatedTasks);
      } catch (error) {
        console.error("Error in fetchViewCounts:", error);
      } finally {
        setIsLoadingViewCounts(false);
      }
    };

    if (initialTasks.length > 0) {
      fetchViewCounts();
    } else {
      setIsLoadingViewCounts(false);
    }
  }, [initialTasks]);

  const moveRow = useCallback((dragIndex, hoverIndex) => {
    setTasks((prevTasks) => {
      const result = [...prevTasks];
      const [removed] = result.splice(dragIndex, 1);
      result.splice(hoverIndex, 0, removed);
      return result;
    });
  }, []);

  const handleDragEnd = useCallback(() => {
    if (onOrderChange) {
      const newOrder = tasks.map((task, index) => ({
        id: task._id,
        order: index,
      }));
      onOrderChange(newOrder);
    }
  }, [onOrderChange, tasks]);

  const toggleCompletion = async (task) => {
    const taskIndex = tasks.findIndex((t) => t._id === task._id);
    if (taskIndex === -1) return;

    const previousTask = tasks[taskIndex];
    
    const now = new Date();
    const tanggalSelesaiWITA =
      previousTask.tanggalSelesai
        ? null
        : now.toLocaleString("id-ID", { 
            timeZone: "Asia/Makassar",
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
            hour12: false
          }).replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/, "$3-$1-$2T$4:$5:$6");
    
    const optimisticTask = {
      ...previousTask,
      tanggalSelesai: previousTask.tanggalSelesai ? null : now.toISOString(),
      tanggalSelesaiWITA: tanggalSelesaiWITA,
      statusTugas: previousTask.tanggalSelesai ? "Belum Dikerjakan" : "Selesai",
    };

    const updatedTasks = [...tasks];
    updatedTasks[taskIndex] = optimisticTask;
    setTasks(updatedTasks);

    try {
      const updatedData = {
        tanggalSelesai: optimisticTask.tanggalSelesai,
        tanggalSelesaiWITA: optimisticTask.tanggalSelesaiWITA,
        statusTugas: optimisticTask.statusTugas,
      };
      const token = localStorage.getItem("token");
      await api.patch(`/tasks/${task._id}/complete`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
    } catch (error) {
      console.error("Gagal memperbarui status tugas:", error);
      alert("Gagal memperbarui status tugas");
      updatedTasks[taskIndex] = previousTask;
      setTasks(updatedTasks);
    }
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <table className="w-full text-xs sm:text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-gray-700 text-gray-300">
            <tr>
              <th scope="col" className="py-2 px-3 sm:py-3 sm:px-6">
                Nama Tugas
              </th>
              <th scope="col" className="py-2 px-3 sm:py-3 sm:px-6">
                Kesulitan
              </th>
              <th scope="col" className="py-2 px-3 sm:py-3 sm:px-6">
                Status
              </th>
              <th scope="col" className="py-2 px-3 sm:py-3 sm:px-6 md:table-cell">
                Deadline
              </th>
              <th scope="col" className="py-2 px-2 sm:py-3 sm:px-6">
                Progress
              </th>
              <th scope="col" className="py-2 px-2 sm:py-3 sm:px-6 text-right">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {tasks.length > 0 ? (
              tasks.map((task, index) => (
                <DraggableRow
                  key={task._id}
                  task={task}
                  index={index}
                  moveRow={moveRow}
                  onDragEnd={handleDragEnd}
                  getStatusColorClass={getStatusColorClass}
                  getProgressColorClass={getProgressColorClass}
                  viewTaskDetail={viewTaskDetail}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  handleToggleCompletion={toggleCompletion}
                  isAdmin={isAdmin}
                  mataKuliahOptions={mataKuliahOptions}
                  isLoadingViewCounts={isLoadingViewCounts}
                />
              ))
            ) : (
              <tr className="bg-gray-800 border-b border-gray-700">
                <td
                  colSpan="6"
                  className="py-6 px-4 sm:py-8 sm:px-6 text-center"
                >
                  <div className="flex flex-col items-center">
                    <SortAsc className="w-8 h-8 sm:w-12 sm:h-12 text-gray-500 mb-2 sm:mb-3" />
                    <p className="text-gray-400 text-sm">
                      Tidak ada tugas yang ditemukan
                    </p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DndProvider>
  );
};

export default TugasKuliahList;
