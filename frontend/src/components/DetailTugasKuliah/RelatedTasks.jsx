import React from "react";

const RelatedTasks = () => (
  <div className="mt-8">
    <h2 className="text-xl font-semibold text-white mb-3">Tugas Terkait</h2>
    <p className="text-gray-400 text-sm">
      Fitur ini masih dalam tahap pengembangan
    </p>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-4 hover:bg-gray-700/50 transition-all duration-300 cursor-not-allowed opacity-50">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-white font-medium">Tugas Pendahuluan</h3>
            <p className="text-gray-400 text-sm">Mata Kuliah yang Sama</p>
          </div>
          <span className="bg-green-600 text-white text-xs px-2 py-1 rounded-full">
            Selesai
          </span>
        </div>
      </div>
      <div className="bg-gray-700/30 border border-gray-600 rounded-xl p-4 hover:bg-gray-700/50 transition-all duration-300 cursor-not-allowed opacity-50">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-white font-medium">Tugas Lanjutan</h3>
            <p className="text-gray-400 text-sm">Mata Kuliah yang Sama</p>
          </div>
          <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
            Sedang dikerjakan...
          </span>
        </div>
      </div>
    </div>
  </div>
);

export default RelatedTasks;
