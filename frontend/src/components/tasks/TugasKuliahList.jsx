import React, { useState, useCallback, useEffect } from "react";

import {
  SortAsc,
  Eye,
  Edit,
  Trash2,
  GripVertical,
  Check,
  X,
} from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import axios from "axios";
import api from "../../services/api";

const DraggableRow = ({
  task,
  index,
  moveRow,
  onDragEnd,
  getStatusColorClass,
  getProgressColorClass,
  viewTaskDetail,
  handleEdit,
  handleDelete,
  handleToggleCompletion,
  isAdmin,
  mataKuliahOptions, // Diterima untuk lookup icon
}) => {
  const rowRef = React.useRef(null);

  const [{ isDragging }, drag] = useDrag({
    type: "TASK_ROW",
    item: { index },
    end: (item, monitor) => {
      if (onDragEnd) onDragEnd();
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "TASK_ROW",
    hover: (draggedItem, monitor) => {
      if (!rowRef.current) return;
      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      const hoverBoundingRect = rowRef.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      moveRow(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });

  drag(drop(rowRef));

  const opacity = isDragging ? 0.5 : 1;

  // Format view count
  const formatViewCount = (count) => {
    if (count === undefined || count === null) return "0";
    return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  // Jika gambaranTugas ada, gunakan itu, kalau tidak, cari icon berdasarkan mataKuliah
  const iconUrl =
    task.gambaranTugas ||
    (mataKuliahOptions &&
      mataKuliahOptions.find((mk) => mk.value === task.mataKuliah)?.icon);

  // Updated formatDate function to prioritize WITA format
  const formatDate = (dateStr) => {
    if (!dateStr) return "Not Available";
    return new Date(dateStr).toLocaleString("id-ID", {
      timeZone: "Asia/Makassar",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <tr
      ref={rowRef}
      style={{ opacity }}
      className={`border-b border-gray-700 ${
        index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"
      } hover:bg-slate-950 transition-colors duration-150 cursor-move`}
    >
      <td className="py-2 px-3 sm:py-4 sm:px-6">
        <div className="flex items-center space-x-2 sm:space-x-3">
          {isAdmin && (
            <div className="text-gray-400 flex-shrink-0 mr-1">
              <GripVertical className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          )}
          <div
            className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
              iconUrl ? "" : "bg-gradient-to-br from-blue-500 to-indigo-600"
            } flex items-center justify-center text-white font-bold`}
          >
            {iconUrl ? (
              <img
                src={iconUrl}
                alt={task.namaTugas}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              task.namaTugas.charAt(0)
            )}
          </div>
          <div className="max-w-xs">
            <h3 className="text-white text-xs truncate">
              {task.namaTugas.length > 45
                ? `${task.namaTugas.substring(0, 42)}...`
                : task.namaTugas}
            </h3>
            {task.mataKuliah && (
              <p className="text-xs text-gray-400 truncate">
                {task.mataKuliah}
              </p>
            )}
          </div>
        </div>
      </td>
      <td className="py-2 px-3 sm:py-4 sm:px-6 max-w-xs truncate md:table-cell">
        {task.tingkatKesulitan || "Not specified"}
      </td>
      <td className="py-2 px-3 sm:py-4 sm:px-6 max-w-xs truncate md:table-cell">
        <span
          className={`inline-block px-2 py-1 rounded-full text-xs font-medium capitalize ${getStatusColorClass(
            task.statusTugas
          )} border whitespace-nowrap`}
        >
          {task.statusTugas}
        </span>
      </td>
      <td className="py-2 px-3 sm:py-4 sm:px-6 max-w-xs truncate md:table-cell">
        {formatDate(task.tanggalDeadline, task.tanggalDeadlineWITA)}
      </td>
      <td className="py-2 px-2 sm:py-4 sm:px-6">
        <div className="flex items-center">
          <div className="w-12 sm:w-24 bg-gray-700 rounded-full h-1.5 sm:h-2.5 mr-1 sm:mr-2">
            <div
              className={`h-1.5 sm:h-2.5 rounded-full ${getProgressColorClass(
                task.progress
              )}`}
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
          <span className="text-xs w-7 sm:w-9 text-right font-medium whitespace-nowrap">
            {task.progress}%
          </span>
        </div>
      </td>
      <td className="py-2 px-2 sm:py-4 sm:px-6">
        <div className="flex items-center justify-end space-x-1 sm:space-x-2">
          <p className="font-medium">{formatViewCount(task.viewCount)}</p>
          <button
            className="text-gray-400 hover:text-blue-500 focus:outline-none p-1 cursor-pointer"
            onClick={() => viewTaskDetail(task._id)}
          >
            <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
          {isAdmin && (
            <>
              {/* Tombol toggle completion */}
              <button
                className={`text-gray-400 focus:outline-none p-1 cursor-pointer ${
                  task.tanggalSelesai
                    ? "hover:text-red-500"
                    : "hover:text-green-500"
                }`}
                onClick={() => handleToggleCompletion(task)}
                title={
                  task.tanggalSelesai
                    ? "Tandai Belum Selesai"
                    : "Tandai Selesai"
                }
              >
                {task.tanggalSelesai ? (
                  <X className="w-4 h-4 sm:w-5 sm:h-5" />
                ) : (
                  <Check className="w-4 h-4 sm:w-5 sm:h-5" />
                )}
              </button>

              <button
                onClick={() => handleEdit(task)}
                className="text-gray-400 hover:text-yellow-500 focus:outline-none p-1 cursor-pointer"
              >
                <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                className="text-gray-400 hover:text-rose-500 focus:outline-none p-1 cursor-pointer"
              >
                <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
};

const TugasKuliahList = ({
  tasks: initialTasks,
  getStatusColorClass,
  getProgressColorClass,
  viewTaskDetail,
  handleEdit,
  handleDelete,
  isAdmin,
  onOrderChange,
  mataKuliahOptions, // terima juga dari parent
}) => {
  const [tasks, setTasks] = useState(initialTasks);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  useEffect(() => {
    const fetchViewCounts = async () => {
      const updatedTasks = await Promise.all(
        initialTasks.map(async (task) => {
          try {
            const response = await axios.get(
              `https://dins-sphere-backend.vercel.app/api/viewTasks/${task._id}`
            );
            return { ...task, viewCount: response.data.count || 0 };
          } catch (error) {
            console.error(
              "Error fetching view count for task",
              task._id,
              error
            );
            return { ...task, viewCount: 0 };
          }
        })
      );
      setTasks(updatedTasks);
    };

    if (initialTasks.length > 0) {
      fetchViewCounts();
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

  // Fungsi untuk toggle status tugas selesai
  const toggleCompletion = async (task) => {
    const taskIndex = tasks.findIndex((t) => t._id === task._id);
    if (taskIndex === -1) return;

    const previousTask = tasks[taskIndex];
    
    // Create current date in WITA timezone for consistent display
    const now = new Date();
    const tanggalSelesaiWITA = previousTask.tanggalSelesai ? null : 
      now.toLocaleString('id-ID', { 
        timeZone: 'Asia/Makassar',
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      }).replace(/(\d+)\/(\d+)\/(\d+), (\d+):(\d+):(\d+)/, '$3-$1-$2T$4:$5:$6');
    
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
      // API call
      await api.patch(
        `/tasks/${task._id}/complete`,
        updatedData
      );
    } catch (error) {
      console.error("Gagal memperbarui status tugas:", error);
      alert("Gagal memperbarui status tugas");
      // Revert optimistic update
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
              <th
                scope="col"
                className="py-2 px-3 sm:py-3 sm:px-6 md:table-cell"
              >
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
                  handleToggleCompletion={toggleCompletion} // pass fungsi toggle completion
                  isAdmin={isAdmin}
                  mataKuliahOptions={mataKuliahOptions}
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