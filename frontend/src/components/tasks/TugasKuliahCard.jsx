import React from 'react'

const TugasKuliahCard = ({ task, isAdmin, onViewDetail, onEdit, onDelete }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4 dark:bg-gray-800">
      <h5 className="text-2xl font-bold text-gray-900 mb-2 dark:text-white">
        {task.namaTugas}
      </h5>
      <p className="text-gray-700 mb-4 dark:text-gray-300">
        {task.deskripsiTugas}
      </p>
      
      <div className="flex items-center justify-between mb-4">
        <span className={`inline-block rounded-full px-3 py-1 text-sm font-semibold
          ${task.tingkatKesulitan === 'Mudah' ? 'bg-green-100 text-green-800' : 
            task.tingkatKesulitan === 'Sedang' ? 'bg-yellow-100 text-yellow-800' : 
            'bg-red-100 text-red-800'}
          dark:bg-gray-700 dark:text-gray-200`}>
          {task.tingkatKesulitan}
        </span>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(task.tanggalDiberikan).toLocaleDateString()}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2 mt-4">
        <button
          onClick={() => onViewDetail(task)}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-50 rounded-lg 
            hover:bg-gray-100 border border-gray-200 transition-colors
            focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
            dark:bg-gray-700 dark:text-gray-200 dark:border-gray-600 dark:hover:bg-gray-600"
        >
          Lihat Detail
        </button>
        
        {isAdmin && (
          <div className="flex gap-2">
            <button
              onClick={() => onEdit(task)}
              className="px-4 py-2 text-sm font-medium text-white bg-yellow-500 rounded-lg 
                hover:bg-yellow-600 transition-colors
                focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(task)}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-lg 
                hover:bg-red-700 transition-colors
                focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              Hapus
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default TugasKuliahCard