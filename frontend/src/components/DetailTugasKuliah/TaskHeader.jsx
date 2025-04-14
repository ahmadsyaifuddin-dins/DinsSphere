import React from "react";
import { Link } from "react-router-dom";
import { getStatusBadgeClass } from "../../utils/helpers";

const TaskHeader = ({ task, id }) => {
  // Logika render bintang berdasarkan tingkatKesulitan
  const starLevel =
    task.tingkatKesulitan === "Ngopi Santai"
      ? 1
      : task.tingkatKesulitan === "Begadang Sedikit"
      ? 2
      : task.tingkatKesulitan === "Mikir Keras"
      ? 3
      : task.tingkatKesulitan === "Lembur Panik Attack 😨"
      ? 4
      : task.tingkatKesulitan === "Professor Level 🧑‍🦲🔬"
      ? 5
      : 0;

  return (
    <div className="bg-gradient-to-r from-gray-800 to-gray-900 border-b border-gray-700 px-4 sm:px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between">
      <div className="flex-1">
        <h1 className="text-2xl sm:text-3xl font-bold text-white mb-2 leading-tight">
          {task.namaTugas}
        </h1>
        <div className="text-base sm:text-lg text-gray-300 flex items-center">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          {task.mataKuliah}
        </div>
      </div>
      <div className="mt-4 md:mt-0 flex flex-col md:items-end">
        <div className="flex items-center">
          <span className="text-gray-400 mr-2 text-sm sm:text-base">
            Tingkat Kesulitan:
          </span>
          <div className="flex">
            {[1, 2, 3, 4, 5].map((star) => {
              const isFilled = star <= starLevel;
              return (
                <svg
                  key={star}
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill={isFilled ? "currentColor" : "none"}
                  stroke={isFilled ? "none" : "currentColor"}
                  strokeWidth="1.5"
                  className={`w-5 h-5 ${isFilled ? "text-yellow-400" : "text-gray-600"}`}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                  />
                </svg>
              );
            })}
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2 mt-3">
          <span className="text-gray-300 font-medium text-sm px-3 py-1 bg-gray-700/50 rounded-full">
            {task.tingkatKesulitan}
          </span>
          <span
            className={`${getStatusBadgeClass(
              task.statusTugas
            )} text-white text-sm font-medium px-3 py-1 rounded-full shadow-sm`}
          >
            {task.statusTugas}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskHeader;
