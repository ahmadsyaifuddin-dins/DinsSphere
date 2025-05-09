// src/components/ProjectList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import { SortAsc, Eye, Edit, Trash2 } from "lucide-react";
import { API_BASE_URL } from "../../config";

const ProjectList = ({
  projects: initialProjects,
  getStatusProjectColorClass,
  getProgressColorClass,
  viewProjectDetail,
  handleEdit,
  handleDelete,
  isAdmin,
}) => {
  const [projects, setProjects] = useState(initialProjects);

  // Update state lokal saat props berubah
  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  // Fetch view counts untuk setiap project
  useEffect(() => {
    const fetchViewCounts = async () => {
      const updatedProjects = await Promise.all(
        initialProjects.map(async (project) => {
          try {
            const response = await axios.get(
              `${API_BASE_URL}/api/viewProjects/${project._id}`
            );
            return { ...project, viewCount: response.data.count || 0 };
          } catch (error) {
            console.error(
              "Error fetching view count for project",
              project._id,
              error
            );
            return { ...project, viewCount: 0 };
          }
        })
      );
      setProjects(updatedProjects);
    };

    if (initialProjects.length > 0) {
      fetchViewCounts();
    }
  }, [initialProjects]);

  return (
    <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
      <table className="w-full text-xs sm:text-sm text-left text-gray-300">
        <thead className="text-xs uppercase bg-gray-700 text-gray-300">
          <tr>
            <th className="py-2 px-3 sm:py-3 sm:px-6">Nama Project</th>
            <th className="py-2 px-3 sm:py-3 sm:px-6">Type</th>
            <th className="py-2 px-2 sm:py-3 sm:px-6">Status</th>
            <th className="py-2 px-3 sm:py-3 sm:px-6 md:table-cell">
              Tanggal Mulai
            </th>
            <th className="py-2 px-2 sm:py-3 sm:px-6">Progress</th>
            <th className="py-2 px-2 sm:py-3 sm:px-6 text-right">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {projects.length > 0 ? (
            projects.map((project, index) => (
              <tr
                key={project._id}
                className={`border-b border-gray-700 ${
                  index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"
                } hover:bg-slate-950 transition-colors duration-150`}
              >
                <td className="py-2 px-3 sm:py-4 sm:px-6">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <div
                      className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full ${
                        project.icon
                          ? ""
                          : "bg-gradient-to-br from-blue-500 to-indigo-600"
                      } flex items-center justify-center text-white font-bold`}
                    >
                      {project.icon ? (
                        <img
                          src={project.icon}
                          alt={project.title}
                          className="w-full h-full rounded-full object-cover"
                        />
                      ) : (
                        project.title.charAt(0)
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-white text-xs sm:text-sm">
                        {project.title}
                      </h3>
                      {project.subtitle && (
                        <p className="text-xs text-gray-400 hidden sm:block">
                          {project.subtitle}
                        </p>
                      )}
                    </div>
                  </div>
                </td>
                <td className="py-2 px-3 sm:py-4 sm:px-6 max-w-xs truncate md:table-cell">
                  {project.type || "Not specified"}
                </td>
                <td className="py-2 px-3 sm:py-4 sm:px-6 max-w-xs truncate md:table-cell">
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusProjectColorClass(
                      project.status
                    )} border whitespace-nowrap`}
                  >
                    {project.status}
                  </span>
                </td>
                <td className="py-2 px-3 sm:py-4 sm:px-6 max-w-xs truncate md:table-cell">
                  {project.startDate
                    ? new Date(project.startDate).toLocaleString("id-ID", {
                        timeZone: "UTC",
                      })
                    : "Not Available"}
                </td>
                <td className="py-2 px-2 sm:py-4 sm:px-6">
                  <div className="flex items-center">
                    <div className="w-12 sm:w-24 bg-gray-700 rounded-full h-1.5 sm:h-2.5 mr-1 sm:mr-2">
                      <div
                        className={`h-1.5 sm:h-2.5 rounded-full ${getProgressColorClass(
                          project.progress
                        )}`}
                        style={{ width: `${project.progress}%` }}
                      ></div>
                    </div>
                    <span className="text-xs w-7 sm:w-9 text-right font-medium whitespace-nowrap">
                      {project.progress}%
                    </span>
                  </div>
                </td>
                <td className="py-2 px-2 sm:py-4 sm:px-6">
                  <div className="flex items-center justify-end space-x-1 sm:space-x-2">
                    {/* View counter */}
                    <p className="font-medium">{project.viewCount}</p>
                    <button
                      className="text-gray-400 hover:text-blue-500 focus:outline-none p-1 cursor-pointer"
                      onClick={() => viewProjectDetail(project._id)}
                    >
                      <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                    </button>
                    {isAdmin && (
                      <>
                        <button
                          onClick={() => handleEdit(project)}
                          className="text-gray-400 hover:text-yellow-500 focus:outline-none p-1 cursor-pointer"
                        >
                          <Edit className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                        <button
                          onClick={() => handleDelete(project._id)}
                          className="text-gray-400 hover:text-rose-500 focus:outline-none p-1 cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4 sm:w-5 sm:h-5" />
                        </button>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr className="bg-gray-800 border-b border-gray-700">
              <td
                colSpan="6"
                className="py-6 px-4 sm:py-8 sm:px-6 text-center"
              >
                <div className="flex flex-col items-center">
                  <SortAsc className="w-8 h-8 sm:w-12 sm:h-12 text-gray-500 mb-2 sm:mb-3" />
                  <p className="text-gray-400 text-sm">
                    Tidak ada project yang ditemukan
                  </p>
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectList;
