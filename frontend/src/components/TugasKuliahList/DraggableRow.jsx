// src/components/DraggableRow.jsx
import React, { useRef } from "react";
import { useDrag, useDrop } from "react-dnd";
import {
  GripVertical,
  Eye,
  Edit,
  Trash2,
  Check,
  X,
} from "lucide-react";
import ViewCountSkeleton from "../TugasKuliahList/ViewCountSkeleton";

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
  mataKuliahOptions,
  isLoadingViewCounts,
}) => {
  const rowRef = useRef(null);

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
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
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

  const formatViewCount = (count) => {
    if (count === undefined || count === null) return "0";
    return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  const iconUrl =
    task.gambaranTugas ||
    (mataKuliahOptions &&
      mataKuliahOptions.find((mk) => mk.value === task.mataKuliah)?.icon);

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
      className={`border-b border-gray-700 ${index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"} hover:bg-slate-950 transition-colors duration-150 cursor-move`}
    >
      <td className="py-2 px-3 sm:py-4 sm:px-6">
        <div className="flex items-center space-x-2 sm:space-x-3">
          {isAdmin && (
            <div className="text-gray-400 flex-shrink-0 mr-1">
              <GripVertical className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          )}
          <div
            className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full ${iconUrl ? "" : "bg-gradient-to-br from-blue-500 to-indigo-600"} flex items-center justify-center text-white font-bold`}
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
        {isLoadingViewCounts ? (
          <ViewCountSkeleton />
        ) : (
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
        )}
      </td>
    </tr>
  );
};

export default DraggableRow;
