import React from "react";
import { getRemainingDays } from "../../utils/helpers";

const TaskDates = ({ task }) => {
  const remainingDays = getRemainingDays(task.tanggalDeadline);

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        })
      : "Tidak tersedia";

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-4">
        <div className="text-gray-400 text-sm mb-1">Tanggal Diberikan</div>
        <div className="text-white font-semibold">{formatDate(task.tanggalDiberikan)}</div>
      </div>
      <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-4">
        <div className="text-gray-400 text-sm mb-1">Deadline</div>
        <div className="text-white font-semibold">{formatDate(task.tanggalDeadline)}</div>
      </div>
      <div
        className={`${
          remainingDays && remainingDays < 3
            ? "bg-red-900/30 border-red-700"
            : remainingDays && remainingDays < 7
            ? "bg-yellow-900/30 border-yellow-700"
            : "bg-green-900/30 border-green-700"
        } border rounded-xl p-4`}
      >
        <div className="text-gray-300 text-sm mb-1">Sisa Waktu</div>
        <div className="text-white font-bold text-lg">
          {remainingDays !== null
            ? remainingDays > 0
              ? `${remainingDays} hari lagi`
              : remainingDays === 0
              ? "Hari ini!"
              : `Terlambat ${Math.abs(remainingDays)} hari`
            : "Tidak tersedia"}
        </div>
      </div>
    </div>
  );
};

export default TaskDates;
