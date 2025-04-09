import React from 'react';
import { getStatusBadgeClass, getProgressColorClass, getRemainingDays } from "../../utils/helpers";

const TugasKuliahCard = ({ task, viewTaskDetail, handleEdit, handleDelete, isAdmin }) => {
  // Calculate remaining days
  const remainingDays = getRemainingDays(task.tanggalDeadline);
  
  // Determine difficulty level indicator
  const getDifficultyIndicator = () => {
    switch(task.tingkatKesulitan) {
      case "Damai": return { stars: 1, color: "bg-emerald-500" };
      case "Mudah": return { stars: 2, color: "bg-green-500" };
      case "Sedang": return { stars: 3, color: "bg-yellow-500" };
      case "Sulit": return { stars: 4, color: "bg-orange-500" };
      case "Ngeri ☠️": return { stars: 5, color: "bg-red-500" };
      default: return { stars: 0, color: "bg-gray-500" };
    }
  };
  
  const difficulty = getDifficultyIndicator();

  const onEdit = (e) => {
    e.stopPropagation();
    handleEdit(task);
  };

  const onDelete = (e) => {
    e.stopPropagation();
    handleDelete(task._id);
  };

  return (
    <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-gray-900 to-gray-800 border border-gray-700 shadow-xl transition-all duration-300 hover:shadow-2xl hover:translate-y-1 hover:border-gray-600">
      {/* Glow effect on hover */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-blue-500/0 via-blue-500/10 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Status indicator stripe (using the status color) */}
      <div className={`absolute top-0 left-0 w-full h-1 ${getStatusBadgeClass(task.statusTugas)}`}></div>
      
      {/* Status badge positioned absolutely in top-right corner */}
      <div className={`absolute top-1.5 right-3 ${getStatusBadgeClass(task.statusTugas)} text-white text-xs font-medium px-2.5 py-1 rounded-full z-10`}>
        {task.statusTugas}
      </div>
      
      <div className="p-6">
        {/* Header with course & task name (now with more space for title) */}
        <div className="mb-4">
          <div className="pr-2">
            <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-400 transition-colors duration-300">{task.namaTugas}</h3>
            <p className="text-gray-400 text-sm">{task.mataKuliah}</p>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between mb-1">
            <span className="text-gray-400 text-xs">Progress</span>
            <span className="text-gray-300 text-xs font-medium">{task.progress}%</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-1.5">
            <div
              className={`h-1.5 rounded-full ${getProgressColorClass(task.progress)}`}
              style={{ width: `${task.progress}%` }}
            ></div>
          </div>
        </div>
        
        {/* Task details */}
        <div className="space-y-3 mb-4">
          {/* Difficulty level */}
          <div className="flex items-center">
            <span className="text-gray-400 text-xs mr-2">Tingkat Kesulitan:</span>
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={star <= difficulty.stars ? "currentColor" : "none"}
                  stroke="currentColor"
                  className={`w-4 h-4 ${star <= difficulty.stars ? "text-yellow-500" : "text-gray-600"}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={star <= difficulty.stars ? 0 : 1.5}
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              ))}
            </div>
          </div>
          
          {/* Deadline info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <svg className="w-4 h-4 text-gray-400 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-gray-300 text-xs">Deadline:</span>
            </div>
            <span className="text-gray-300 text-xs font-medium">
              {task.tanggalDeadline
                ? new Date(task.tanggalDeadline).toLocaleString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "Tidak tersedia"}
            </span>
          </div>
        </div>
        
        {/* Description preview */}
        {task.deskripsiTugas && (
          <div className="mb-5">
            <p className="text-gray-400 text-xs mb-1">Deskripsi:</p>
            <p className="text-gray-300 text-sm line-clamp-2">{task.deskripsiTugas}</p>
          </div>
        )}
        
        {/* Action buttons */}
        <div className="flex justify-between items-center mt-6 gap-2">
          <button
            onClick={() => viewTaskDetail(task._id)}
            className="cursor-pointer grow flex items-center justify-center gap-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-all duration-300 shadow-md shadow-blue-900/20"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Detail
          </button>
          
          {isAdmin && (
            <>
              <button
                onClick={onEdit}
                className="cursor-pointer flex items-center justify-center p-2 bg-transparent hover:bg-gray-700 text-yellow-500 rounded-lg transition-all duration-300"
                aria-label="Edit tugas"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </button>
              
              <button
                onClick={onDelete}
                className="cursor-pointer flex items-center justify-center p-2 bg-transparent hover:bg-gray-700 text-red-500 rounded-lg transition-all duration-300"
                aria-label="Hapus tugas"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TugasKuliahCard;