import React from "react";

const ProjectCard = ({ project }) => {
  return (
    <div className="bg-[#1E1E2E] text-[#F4F4F8] p-4 rounded-lg shadow-lg transition transform hover:scale-105">
      {/* Thumbnail (opsional) */}
      {project.thumbnail && (
        <img
          src={project.thumbnail}
          alt="Project Thumbnail"
          className="w-full h-48 object-contain rounded-md mb-3"
        />
      )}

      {/* Nama dan Deskripsi Proyek */}
      <h3 className="text-xl font-bold mb-1">{project.title}</h3>
      <p className="mb-2 text-gray-300">{project.description}</p>

      {/* Status dan Tingkat Kesulitan */}
      <div className="flex flex-wrap items-center text-sm mb-2">
        <span className="mr-4 text-gray-400">
          Status:{" "}
          <span className="font-semibold text-[#3A86FF]">{project.status}</span>
        </span>
        <span className="text-gray-400">
          Difficulty:{" "}
          <span
            className={`font-semibold ${
              project.difficulty === "Easy"
                ? "text-[#34C759]"
                : project.difficulty === "Medium"
                ? "text-[#F7DC6F]"
                : project.difficulty === "Hard"
                ? "text-[#FFA07A]"
                : project.difficulty === "Expert"
                ? "text-[#FF69B4]"
                : ""
            }`}
          >
            {project.difficulty || "N/A"}
          </span>
        </span>
      </div>

      {/* Daftar Teknologi (Jika Ada) */}
      {project.technologies && project.technologies.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {project.technologies.map((tech, index) => (
            <span
              key={index}
              className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-200"
            >
              {tech}
            </span>
          ))}
        </div>
      )}

      {/* Tanggal Mulai & Selesai */}
      <div className="flex flex-col sm: sm:justify-between text-sm text-gray-400 mb-3">
        <span>
          Mulai:{" "}
          {project.startDate
            ? new Intl.DateTimeFormat("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(project.startDate))
            : "Belum ditentukan"}
        </span>
        <span>
          Selesai:{" "}
          {project.endDate
            ? new Intl.DateTimeFormat("id-ID", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              }).format(new Date(project.endDate))
            : "In Progress..."} 
        </span>
      </div>

      {/* Link Demo & Source */}
      <div className="flex gap-4">
        {project.linkDemo && (
          <a
            href={project.linkDemo}
            target="_blank"
            rel="noreferrer"
            className="text-[#3A86FF] hover:underline"
          >
            Lihat Demo
          </a>
        )}
        {project.linkSource && (
          <a
            href={project.linkSource}
            target="_blank"
            rel="noreferrer"
            className="text-[#3A86FF] hover:underline"
          >
            Lihat Source
          </a>
        )}
      </div>
    </div>
  );
};

export default ProjectCard;
