// src/components/NotFound.jsx
import React from 'react';
import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-blue-950 text-white p-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-xl mb-6">Waduh, halaman yang kamu cari gak ada :)</p>
      <Link
        to="/"
        className="px-6 py-3 rounded-2xl shadow-md bg-slate-950 hover:shadow-2xl transition"
      >
        Balik ke Home
      </Link>
    </div>
  );
}
