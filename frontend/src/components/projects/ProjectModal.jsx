import React, { useState } from "react";

const ProjectModal = ({ isOpen, onClose, project, onSave }) => {
  const [title, setTitle] = useState(project ? project.title : "");
  const [type, setType] = useState(project ? project.type : "");
  const [subtitle, setSubtitle] = useState(project ? project.subtitle : "");
  const [description, setDescription] = useState(project ? project.description : "");
  const [thumbnail, setThumbnail] = useState(project ? project.thumbnail : "");
  const [icon, setIcon] = useState(project ? project.icon : "");
  const [linkDemo, setLinkDemo] = useState(project ? project.linkDemo : "");
  const [linkSource, setLinkSource] = useState(project ? project.linkSource : "");
  const [technologies, setTechnologies] = useState(
    project && project.technologies ? project.technologies.join(" ") : ""
  );
  const [difficulty, setDifficulty] = useState(project ? project.difficulty : "");
  const [startDate, setStartDate] = useState(
    project && project.startDate ? project.startDate.split("T")[0] : ""
  );
  const [startTime, setStartTime] = useState(
    project && project.startDate ? project.startDate.split("T")[1]?.slice(0, 5) : ""
  );
  const [endDate, setEndDate] = useState(
    project && project.endDate ? project.endDate.split("T")[0] : ""
  );
  const [status, setStatus] = useState(project ? project.status : "In Progress");
  // Field baru:
  const [progress, setProgress] = useState(project ? project.progress : "");
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen) return null;

    const handleSubmit = async (e) => {
      e.preventDefault();

      setIsLoading(true);
      const techArray = technologies.trim() ? technologies.trim().split(/\s+/) : [];
      const formData = {
        title,
        type,
        subtitle,
        description,
        thumbnail,
        icon, // field icon/logo
        linkDemo,
        linkSource,
        technologies: techArray,
        difficulty,
        startDate: startDate && startTime ? `${startDate}T${startTime}:00` : startDate,
        endDate: endDate ? endDate : null,
        status,
        progress: progress ? Number(progress) : 0, // convert progress to number; default 0 jika kosong
      };
      
      try {
        await onSave(formData);
      } catch (error) {
        console.error("Error saving project:", error);
      } finally {
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
          {project ? "Edit Project" : "Tambah Project"}
        </h2>
        
        <div className="overflow-y-auto flex-grow pr-4 custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label className={labelClasses} htmlFor="title">
                Nama Project *
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={inputClasses}
                required
                placeholder="Masukkan nama project"
              />
            </div>
            {/* Jenis Project */}
            <div>
              <label className={labelClasses} htmlFor="type">
                Jenis Project *
              </label>
              <select
                id="type"
                value={type}
                onChange={(e) => setType(e.target.value)}
                className={inputClasses}
              >
                <option value="">Pilih Tipe Project</option>
                <option value="Website">Website</option>
                <option value="Web Application">Web Application</option>
                <option value="Mobile Application">Mobile Application</option>
                <option value="Desktop Application">Desktop Application</option>
                <option value="Artificial Intelligence">Artificial Intelligence</option>
                <option value="Data Science">Data Science</option>
                <option value="Bot Chat">Bot Chat</option>
                <option value="Game">Game</option>
                <option value="Other">Other</option>
              </select>
            </div>
            {/* Subtitle */}
            <div>
              <label className={labelClasses} htmlFor="subtitle">
                Subtitle Project *
              </label>
              <input
                type="text"
                id="subtitle"
                value={subtitle}
                onChange={(e) => setSubtitle(e.target.value)}
                className={inputClasses}
                placeholder="Masukkan subtitle project (misal : Dibuat dengan ReactJS)"
              />
            </div>

            {/* Description */}
            <div>
              <label className={labelClasses} htmlFor="description">
                Deskripsi Project *
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className={`${inputClasses} min-h-[100px] resize-y`}
                placeholder="Jelaskan tentang project Anda"
                required
              />
            </div>

            {/* Thumbnail */}
            <div>
              <label className={labelClasses} htmlFor="thumbnail">
                URL Thumbnail
              </label>
              <input
                type="url"
                id="thumbnail"
                value={thumbnail}
                onChange={(e) => setThumbnail(e.target.value)}
                className={inputClasses}
                placeholder="https://..."
              />
            </div>

            {/* Icon/Logo App */}
            <div>
              <label className={labelClasses} htmlFor="icon">
                Icon/Logo App (Opsional)
              </label>
              <input
                type="url"
                id="icon"
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className={inputClasses}
                placeholder="https://..."
              />
            </div>

            {/* Links */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses} htmlFor="linkDemo">
                  Link Demo
                </label>
                <input
                  type="url"
                  id="linkDemo"
                  value={linkDemo}
                  onChange={(e) => setLinkDemo(e.target.value)}
                  className={inputClasses}
                  placeholder="https://..."
                />
              </div>
              <div>
                <label className={labelClasses} htmlFor="linkSource">
                  Link Source Code
                </label>
                <input
                  type="url"
                  id="linkSource"
                  value={linkSource}
                  onChange={(e) => setLinkSource(e.target.value)}
                  className={inputClasses}
                  placeholder="https://github.com/..."
                />
              </div>
            </div>

            {/* Technologies */}
            <div>
              <label className={labelClasses} htmlFor="technologies">
                Teknologi
              </label>
              <input
                type="text"
                id="technologies"
                value={technologies}
                onChange={(e) => setTechnologies(e.target.value)}
                className={inputClasses}
                placeholder="Contoh: react node express (pisahkan dengan spasi)"
              />
            </div>

            {/* Difficulty */}
            <div>
              <label className={labelClasses} htmlFor="difficulty">
                Tingkat Kesulitan *
              </label>
              <select
                id="difficulty"
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value)}
                className={inputClasses}
              >
                <option value="">Pilih Kesulitan</option>
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
                <option value="Expert">Expert</option>
              </select>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses} htmlFor="startDate">
                  Tanggal Pembuatan *
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="date"
                    id="startDate"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className={inputClasses}
                  />
                  <input
                    type="time"
                    id="startTime"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>
              <div>
                <label className={labelClasses} htmlFor="endDate">
                  Tanggal Selesai
                </label>
                <input
                  type="date"
                  id="endDate"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>

            {/* Status */}
            <div>
              <label className={labelClasses} htmlFor="status">
                Status Aplikasi
              </label>
              <select
                id="status"
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={inputClasses}
              >
                <option value="In Progress">In Progress</option>
                <option value="Done">Done</option>
                <option value="Paused">Paused</option>
                <option value="Backlog">Backlog</option>
                <option value="Planning">Planning</option>      
              </select>
            </div>

            {/* Persentase Progress Project */}
            <div>
              <label className={labelClasses} htmlFor="progress">
                Persentase Progress Project (Opsional)
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
          </form>
        </div>

        {/* Action Buttons */}
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
            className="px-6 py-2.5 rounded-lg bg-[#3A86FF] hover:bg-blue-500 transition-colors duration-200 cursor-pointer flex items-center justify-center"
            disabled={isLoading}
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

export default ProjectModal;
