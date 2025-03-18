import { Check, Edit, Trash } from "lucide-react";
import React from "react";
import { Link } from "react-router-dom";

const TaskActions = ({
  task,
  id,
  isAdmin,
  handleToggleCompletion,
  handleDeleteTask
}) => (
  <>
    {isAdmin && (
      <div className="flex flex-col sm:flex-row gap-4 mt-8">
        <Link
          to={`/editTugasKuliah/${id}`}
          className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-3 px-6 rounded-xl font-medium flex items-center justify-center transition-all duration-300 shadow-lg shadow-blue-900/20"
        >
          <Edit className="w-4 h-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" />
          Edit Tugas
        </Link>
        <button
          className="cursor-pointer flex-1 bg-green-600 hover:bg-green-700 text-white py-3 px-6 rounded-xl font-medium flex items-center justify-center transition-all duration-300 shadow-lg shadow-green-900/20"
          onClick={handleToggleCompletion}
        >
          <Check className="w-4 h-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" />
          {task.tanggalSelesai ? "Tandai Belum Selesai" : "Tandai Selesai"}
        </button>
        <button
          className="cursor-pointer flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-xl font-medium flex items-center justify-center transition-all duration-300 shadow-lg shadow-red-900/20"
          onClick={handleDeleteTask}
        >
          <Trash className="w-4 h-4 mr-1.5 group-hover:rotate-90 transition-transform duration-300" />
          Hapus Tugas
        </button>
      </div>
    )}
  </>
);

export default TaskActions;
