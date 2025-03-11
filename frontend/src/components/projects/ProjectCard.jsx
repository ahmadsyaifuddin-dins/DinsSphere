import React from "react";
import { Calendar, Code, ExternalLink, GitBranch, Clock, Award, ArrowRight } from "lucide-react";
import { getCardBackground, getProgressColorClass, getStatusProjectColorClass, formatDate } from "../../utils/helpers";

const ProjectCard = ({ project, viewProjectDetail }) => {

  return (
    <div className={`rounded-xl overflow-hidden shadow-lg transition duration-300 transform hover:-translate-y-1 hover:shadow-2xl bg-gradient-to-br ${getCardBackground(project.type)}`}>
      {/* Thumbnail dengan overlay gradient */}
      <div className="relative h-48 overflow-hidden">
        {project.thumbnail ? (
          <img
            src={project.thumbnail}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-r from-gray-800 to-gray-900 flex items-center justify-center`}>
            <span className="text-4xl font-bold text-gray-700">{project.title?.charAt(0) || "P"}</span>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
        
        {/* Status badge yang menonjol di thumbnail */}
        <div className="absolute top-3 right-3">
          <span className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusProjectColorClass(project.status)}`}>
            {project.status}
          </span>
        </div>
      </div>

      {/* Content container */}
      <div className="p-5">
        {/* Header with title and icon */}
        <div className="flex items-center mb-3">
          <div className={`w-10 h-10 rounded-full overflow-hidden flex-shrink-0 flex items-center justify-center ${project.icon ? "" : "bg-gradient-to-br from-blue-500 to-indigo-600"}`}>
            {project.icon ? (
              <img src={project.icon} alt="" className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-bold text-white">{project.title?.charAt(0) || "P"}</span>
            )}
          </div>
          <div className="ml-3">
            <h3 className="text-xl font-bold text-white leading-tight">{project.title}</h3>
            {project.subtitle && (
              <p className="text-sm text-gray-400">{project.subtitle}</p>
            )}
          </div>
        </div>

        {/* Description with fade out effect */}
        <div className="relative mb-4 h-12 overflow-hidden">
          <p className="text-sm text-gray-300 line-clamp-2">{project.description}</p>
          <div className="absolute bottom-0 left-0 w-full h-6 bg-gradient-to-t from-slate-900 to-transparent"></div>
        </div>

        {/* Progress bar */}
        <div className="mb-4">
          <div className="flex justify-between items-center mb-1">
            <span className="text-xs text-gray-400">Progress</span>
            <span className="text-xs font-semibold text-white">{project.progress}%</span>
          </div>
          <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full bg-gradient-to-r ${getProgressColorClass(project.progress)}`}
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
        </div>

        {/* Info grid */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          {/* Difficulty */}
          <div className="flex items-start">
            <Award className="w-4 h-4 mr-1.5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Difficulty</p>
              <p className={`text-sm font-medium ${
                project.difficulty === "Easy"
                  ? "text-green-400"
                  : project.difficulty === "Medium"
                  ? "text-yellow-400"
                  : project.difficulty === "Hard"
                  ? "text-orange-400"
                  : project.difficulty === "Expert"
                  ? "text-red-400"
                  : "text-gray-400"
              }`}>
                {project.difficulty || "Not Available"}
              </p>
            </div>
          </div>
          
          {/* Type */}
          <div className="flex items-start">
            <Code className="w-4 h-4 mr-1.5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Type</p>
              <p className="text-sm font-medium text-gray-300">{project.type || "Not Specified"}</p>
            </div>
          </div>

          {/* Start Date */}
          <div className="flex items-start">
            <Calendar className="w-4 h-4 mr-1.5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Mulai</p>
              <p className="text-sm font-medium text-gray-300">{formatDate(project.startDate)}</p>
            </div>
          </div>

          {/* Duration/End Date */}
          <div className="flex items-start">
            <Clock className="w-4 h-4 mr-1.5 text-gray-500 mt-0.5" />
            <div>
              <p className="text-xs text-gray-500">Target Selesai</p>
              <p className="text-sm font-medium text-gray-300">
                {project.endDate ? formatDate(project.endDate) : "In Progress..."}
              </p>
            </div>
          </div>
        </div>

        {/* Technologies */}
        {project.technologies && project.technologies.length > 0 && (
          <div className="mb-4">
            <p className="text-xs text-gray-500 mb-1.5">Technologies</p>
            <div className="flex flex-wrap gap-1.5">
              {project.technologies.map((tech, index) => (
                <span
                  key={index}
                  className="px-2 py-0.5 text-xs rounded-md bg-gray-800 text-gray-300 border border-gray-700 hover:bg-gray-700 transition-colors"
                >
                  {tech}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Links */}
        <div className="flex gap-2 mt-4">
          {project.linkDemo && (
            <a
              href={project.linkDemo}
              target="_blank"
              rel="noreferrer"
              className="flex items-center px-3 py-1.5 bg-blue-600 hover:bg-blue-700 transition-colors rounded-md text-sm font-medium"
            >
              <ExternalLink className="w-3.5 h-3.5 mr-1.5" /> Demo
            </a>
          )}
          {project.linkSource && (
            <a
              href={project.linkSource}
              target="_blank"
              rel="noreferrer"
              className="flex items-center px-3 py-1.5 bg-gray-700 hover:bg-gray-600 transition-colors rounded-md text-sm font-medium"
            >
              <GitBranch className="w-3.5 h-3.5 mr-1.5" /> Source
            </a>
          )}
          <button onClick={() => viewProjectDetail(project._id)} className="flex items-center ml-auto px-3 py-1.5 bg-gray-800 hover:bg-gray-700 transition-colors rounded-md text-sm font-medium text-gray-400 hover:text-white cursor-pointer">
            Detail <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;