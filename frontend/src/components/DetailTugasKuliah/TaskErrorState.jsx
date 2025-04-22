import React from 'react';
import { Link } from 'react-router-dom';

const TaskErrorState = ({ error }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 px-4 py-12">
      <div className="w-full max-w-md text-center">
        {/* Error Icon */}
        <div className="mb-6 relative">
          <div className="h-28 w-28 mx-auto rounded-full bg-gray-800/80 border-2 border-gray-700 flex items-center justify-center shadow-lg">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="absolute top-0 right-0 left-0 -mt-2 flex justify-center">
            <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              Error
            </span>
          </div>
        </div>
        
        {/* Error Title */}
        <h2 className="text-2xl font-bold mb-3 text-white">Gagal Memuat Tugas</h2>
        
        {/* Error Message */}
        <p className="text-red-400 mb-4">{error || "Detail tugas tidak ditemukan"}</p>
        <p className="text-gray-400 mb-8">Silakan coba lagi atau lihat daftar tugas lainnya di halaman Tugas Kuliah.</p>
        
        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/tugasKuliah"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white font-medium rounded-xl transition duration-300 shadow-lg shadow-blue-600/20"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 mr-2"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
                clipRule="evenodd"
              />
            </svg>
            Kembali ke Tugas Kuliah
          </Link>
          
          <button
            onClick={() => window.location.reload()}
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-xl transition duration-300 border border-gray-600"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Coba Lagi
          </button>
        </div>
      </div>
    
    </div>
  );
};

export default TaskErrorState;