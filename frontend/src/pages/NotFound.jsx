import React from 'react';
import { Link } from 'react-router-dom';
import { HomeIcon } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-blue-950 text-white p-6">
      <div className="text-center max-w-lg">
        <div className="mb-6">
          <h1 className="text-8xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-teal-400">404</h1>
          <div className="h-2 w-24 mx-auto bg-gradient-to-r from-blue-400 to-teal-400 rounded-full mb-6"></div>
        </div>
        
        <h2 className="text-2xl font-semibold mb-4">Halaman Tidak Ditemukan</h2>
        <p className="text-blue-200 mb-4">Wah, sepertinya halaman yang kamu cari tidak tersedia di DinsSphere mungkin dah di hapus oleh Developer :) </p>
        <p className="text-blue-200 mb-2">Silakan kembali ke beranda!</p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            to="/"
            className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-medium bg-blue-600 hover:bg-blue-500 transition-all duration-300 shadow-lg shadow-blue-600/30 hover:shadow-blue-500/40"
          >
            <HomeIcon size={18} />
            <span>Kembali ke Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}