import React from "react";
import { Save } from "lucide-react";

const NotesSection = () => (
  <div className="mt-8 bg-gray-700/30 border border-gray-600 rounded-xl p-5">
    <h2 className="text-xl font-semibold text-white mb-3">Catatan</h2>
    <div className="space-y-2">
      <div className="relative">
        <textarea
          className="w-full bg-gray-800/80 rounded-lg border border-gray-700 p-4 text-white placeholder-gray-500 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300"
          placeholder="Tambahkan catatan tentang tugas ini..."
          rows="3"
        ></textarea>
        <button
          className="cursor-pointer absolute right-3 bottom-3 bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition-all duration-300"
          onClick={() => alert("Simpan catatan belum berfungsi")}
        >
          <Save className="w-5 h-5" />
        </button>
      </div>
    </div>
  </div>
);

export default NotesSection;
