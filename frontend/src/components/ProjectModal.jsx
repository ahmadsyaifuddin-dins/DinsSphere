import React, { useState } from "react";

const ProjectModal = ({ isOpen, onClose, project, onSave }) => {
  const [title, setTitle] = useState(project ? project.title : "");
  const [description, setDescription] = useState(project ? project.description : "");
  const [thumbnail, setThumbnail] = useState(project ? project.thumbnail : "");
  const [linkDemo, setLinkDemo] = useState(project ? project.linkDemo : "");
  const [linkSource, setLinkSource] = useState(project ? project.linkSource : "");
  const [technologies, setTechnologies] = useState(project ? project.technologies.join(" ") : "");
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

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const techArray = technologies.trim().split(/\s+/);

    const formData = {
      title,
      description,
      thumbnail,
      linkDemo,
      linkSource,
      technologies: techArray,
      difficulty,
      startDate: startDate && startTime ? `${startDate}T${startTime}:00` : startDate,
      endDate: endDate ? endDate : null,
      status,
    };

    onSave(formData);
  };

  const inputClasses = "w-full p-3 rounded-lg bg-[#121212] text-[#F4F4F8] border border-gray-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-colors";
  const labelClasses = "block mb-2 font-semibold text-[#F4F4F8]";

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-[#1E1E2E] text-[#F4F4F8] p-6 rounded-xl shadow-2xl w-11/12 md:w-2/3 lg:w-1/2 max-h-[90vh] flex flex-col">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          {project ? "Edit Project" : "Tambah Project"}
        </h2>
        
        <div className="overflow-y-auto flex-grow pr-4 custom-scrollbar">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div>
              <label className={labelClasses} htmlFor="name">
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
                Tingkat Kesulitan
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
                  Tanggal Pembuatan
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
                <option value="Completed">Completed</option>
              </select>
            </div>
          </form>
        </div>

        {/* Action Buttons - Fixed at bottom */}
        <div className="mt-6 flex justify-end gap-3 pt-4 border-t border-gray-700">
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
          >
            Batal
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2.5 rounded-lg bg-[#3A86FF] hover:bg-blue-500 transition-colors duration-200"
          >
            Simpan
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;