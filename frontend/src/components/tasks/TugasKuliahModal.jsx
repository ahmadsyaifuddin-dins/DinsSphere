import React, { useState } from "react";

const TugasKuliahModal = ({ isOpen, onClose, task, onSave, mataKuliahOptions }) => {
  const [gambaranTugas, setGambaranTugas] = useState(task ? task.gambaranTugas || "" : "");
  const [mataKuliah, setMataKuliah] = useState(task ? task.mataKuliah || "" : "");
  const [namaTugas, setNamaTugas] = useState(task ? task.namaTugas || "" : "");
  const [deskripsiTugas, setDeskripsiTugas] = useState(task ? task.deskripsiTugas || "" : "");
  const [tingkatKesulitan, setTingkatKesulitan] = useState(task ? task.tingkatKesulitan || "" : "");
  const [tanggalDiberikanDate, setTanggalDiberikanDate] = useState(
    task && task.tanggalDiberikan ? task.tanggalDiberikan.split("T")[0] : ""
  );
  const [tanggalDiberikanTime, setTanggalDiberikanTime] = useState(
    task && task.tanggalDiberikan ? task.tanggalDiberikan.split("T")[1]?.slice(0, 5) : ""
  );
  const [tanggalDeadlineDate, setTanggalDeadlineDate] = useState(
    task && task.tanggalDeadline ? task.tanggalDeadline.split("T")[0] : ""
  );
  const [tanggalDeadlineTime, setTanggalDeadlineTime] = useState(
    task && task.tanggalDeadline ? task.tanggalDeadline.split("T")[1]?.slice(0, 5) : ""
  );
  const [progress, setProgress] = useState(task ? task.progress || 0 : 0);
  const [statusTugas, setStatusTugas] = useState(task ? task.statusTugas || "Belum Dikerjakan" : "Belum Dikerjakan");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Set loading state to true when the save button is clicked
    setIsLoading(true);
    
    const tanggalDiberikan =
      tanggalDiberikanDate && tanggalDiberikanTime
        ? `${tanggalDiberikanDate}T${tanggalDiberikanTime}:00`
        : null;  // Jika kosong, set null

    const tanggalDeadline =
      tanggalDeadlineDate && tanggalDeadlineTime
        ? `${tanggalDeadlineDate}T${tanggalDeadlineTime}:00`
        : null; // Jika kosong, set null

    const formData = {
      gambaranTugas: gambaranTugas ? gambaranTugas : null, // ubah string kosong ke null
      mataKuliah,
      namaTugas,
      deskripsiTugas,
      tingkatKesulitan: tingkatKesulitan ? tingkatKesulitan : "Not Available",
      tanggalDiberikan,
      tanggalDeadline,
      progress: progress ? Number(progress) : 0,
      statusTugas,
    };
    
    try {
      // Wait for onSave to complete (assuming it returns a Promise)
      await onSave(formData);
      // If onSave doesn't return a Promise, you can remove the await keyword
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      // Set loading state back to false after save operation completes
      setIsLoading(false);
    }
  };

  const inputClasses =
    "w-full p-3 rounded-lg bg-[#121212] text-[#F4F4F8] border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors";
  const labelClasses = "block mb-2 font-semibold text-[#F4F4F8]";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#1E1E2E] text-[#F4F4F8] p-6 rounded-xl shadow-2xl w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] flex flex-col">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          {task ? "Edit Tugas Kuliah" : "Tambah Tugas Kuliah"}
        </h2>
        
        <div className="overflow-y-auto flex-grow pr-4 custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Gambaran Tugas */}
            <div>
              <label className={labelClasses} htmlFor="gambaranTugas">
                URL Gambaran Tugas (Opsional)
              </label>
              <input
                type="url"
                id="gambaranTugas"
                value={gambaranTugas}
                onChange={(e) => setGambaranTugas(e.target.value)}
                className={inputClasses}
                placeholder="https://..."
              />
            </div>

            {/* Nama Mata Kuliah */}
            <div>
              <label className={labelClasses} htmlFor="mataKuliah">
                Nama Mata Kuliah *
              </label>
              <select
                id="mataKuliah"
                value={mataKuliah}
                onChange={(e) => setMataKuliah(e.target.value)}
                className={inputClasses}
                required
              >
                <option value="">Pilih Mata Kuliah</option>
                {/* Loop dari props mataKuliahOptions */}
                {mataKuliahOptions &&
                  mataKuliahOptions.map((mk, idx) => (
                    <option key={idx} value={mk.value}>
                      {mk.label}
                    </option>
                  ))}
              </select>
            </div>

            {/* Nama Tugas */}
            <div>
              <label className={labelClasses} htmlFor="namaTugas">
                Nama Tugas *
              </label>
              <input
                type="text"
                id="namaTugas"
                value={namaTugas}
                onChange={(e) => setNamaTugas(e.target.value)}
                className={inputClasses}
                required
                placeholder="Masukkan nama tugas"
              />
            </div>

            {/* Deskripsi Tugas */}
            <div>
              <label className={labelClasses} htmlFor="deskripsiTugas">
                Deskripsi Tugas *
              </label>
              <textarea
                id="deskripsiTugas"
                value={deskripsiTugas}
                onChange={(e) => setDeskripsiTugas(e.target.value)}
                className={`${inputClasses} min-h-[100px] resize-y`}
                placeholder="Jelaskan tugas yang diberikan"
                required
              />
            </div>

            {/* Tingkat Kesulitan */}
            <div>
              <label className={labelClasses} htmlFor="tingkatKesulitan">
                Tingkat Kesulitan *
              </label>
              <select
                id="tingkatKesulitan"
                value={tingkatKesulitan}
                onChange={(e) => setTingkatKesulitan(e.target.value)}
                className={inputClasses}
              >
                <option value="">Not Available</option>
                <option value="Damai">Damai</option>
                <option value="Mudah">Mudah</option>
                <option value="Sedang">Sedang</option>
                <option value="Sulit">Sulit</option>
                <option value="Ngeri ☠️">Ngeri ☠️</option>
              </select>
            </div>

            {/* Tanggal Tugas Diberikan */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses} htmlFor="tanggalDiberikanDate">
                  Tanggal Tugas Diberikan *
                </label>
                <input
                  type="date"
                  id="tanggalDiberikanDate"
                  value={tanggalDiberikanDate}
                  onChange={(e) => setTanggalDiberikanDate(e.target.value)}
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label className={labelClasses} htmlFor="tanggalDiberikanTime">
                  Jam
                </label>
                <input
                  type="time"
                  id="tanggalDiberikanTime"
                  value={tanggalDiberikanTime}
                  onChange={(e) => setTanggalDiberikanTime(e.target.value)}
                  className={inputClasses}
                  required
                />
              </div>
            </div>

            {/* Tanggal Deadline */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses} htmlFor="tanggalDeadlineDate">
                  Tanggal Deadline *
                </label>
                <input
                  type="date"
                  id="tanggalDeadlineDate"
                  value={tanggalDeadlineDate}
                  onChange={(e) => setTanggalDeadlineDate(e.target.value)}
                  className={inputClasses}
                  required
                />
              </div>
              <div>
                <label className={labelClasses} htmlFor="tanggalDeadlineTime">
                  Jam
                </label>
                <input
                  type="time"
                  id="tanggalDeadlineTime"
                  value={tanggalDeadlineTime}
                  onChange={(e) => setTanggalDeadlineTime(e.target.value)}
                  className={inputClasses}
                  required
                />
              </div>
            </div>

            {/* Progress Persentase */}
            <div>
              <label className={labelClasses} htmlFor="progress">
                Progress Persentase
              </label>
              <input
                type="number"
                id="progress"
                value={progress}
                onChange={(e) => setProgress(e.target.value)}
                className={inputClasses}
                placeholder="0 - 100"
                min="0"
                max="100"
              />
            </div>

            {/* Status Tugas */}
            <div>
              <label className={labelClasses} htmlFor="statusTugas">
                Status Tugas *
              </label>
              <select
                id="statusTugas"
                value={statusTugas}
                onChange={(e) => setStatusTugas(e.target.value)}
                className={inputClasses}
              >
                <option value="Belum Dikerjakan">Belum Dikerjakan</option>
                <option value="Sedang dikerjain...">Sedang dikerjain...</option>
                <option value="Tertunda">Tertunda</option>
                <option value="Selesai">Selesai</option>
              </select>
            </div>
          </form>
        </div>

        {/* Tombol Aksi */}
        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200 cursor-pointer"
            disabled={isLoading}
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2.5 rounded-lg bg-[#3A86FF] hover:bg-blue-500 transition-colors duration-200 cursor-pointer flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Menyimpan...
              </>
            ) : (
              "Simpan"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default TugasKuliahModal;