import React from "react";

const CompletionStatus = ({ task }) => (
  <div className="mb-6">
    <h2 className="text-xl font-semibold text-white mb-3">
      Status Penyelesaian
    </h2>
    <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-4 md:p-5">
      <div className="flex flex-col sm:flex-row sm:items-center mb-3">
        <div className="flex items-center mb-2 sm:mb-0">
          <div
            className={`w-3 h-3 rounded-full mr-2 ${
              task.tanggalSelesai ? "bg-green-500" : "bg-red-500"
            }`}
          ></div>
          <span className="text-gray-300">Status:</span>
        </div>
        <span className="ml-0 sm:ml-2 font-medium text-white">
          {task.tanggalSelesai ? "Selesai" : "Belum selesai"}
        </span>
      </div>
      {task.tanggalSelesai && (
        <div className="flex flex-col sm:flex-row sm:items-center">
          <div className="flex items-center mb-2 sm:mb-0">
            <div className="w-3 h-3 rounded-full mr-2 bg-green-500"></div>
            <span className="text-gray-300">Diselesaikan pada:</span>
          </div>
          <span className="ml-0 sm:ml-2 font-medium text-white break-words">
            {new Date(task.tanggalSelesai).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
        </div>
      )}
    </div>
  </div>
);

export default CompletionStatus;
