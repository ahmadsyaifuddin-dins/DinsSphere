import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, ExternalLink } from "lucide-react";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await axios.get(`https://dinssphere-production.up.railway.app/api/projects/${id}`);
        // const res = await axios.get(`http://localhost:5000/api/projects/${id}`);
        setProject(res.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching project details");
        setLoading(false);
        console.error(err);
      }
    };
    fetchProject();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        Loading...
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-4 sm:p-8">
      {/* Back Button */}
      <button 
        className="flex items-center text-gray-400 hover:text-white mb-4" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        Back
      </button>
      <div className="bg-gray-800 rounded-lg shadow p-6">
        {/* Thumbnail (optional) */}
        {project.thumbnail && (
          <img 
            src={project.thumbnail} 
            alt={project.title} 
            className="w-full h-64 object-cover rounded-md mb-4"
          />
        )}
        {/* Icon/Logo and Basic Info */}
        <div className="flex items-center space-x-4 mb-4">
          <div className={`w-16 h-16 rounded-full overflow-hidden flex items-center justify-center ${project.icon ? "" : "bg-gradient-to-br from-blue-500 to-indigo-600"}`}>
            {project.icon ? (
              <img src={project.icon} alt={project.title} className="w-full h-full object-cover" />
            ) : (
              <span className="text-2xl font-bold">{project.title.charAt(0)}</span>
            )}
          </div>
          <div>
            <h2 className="text-3xl font-bold">{project.title}</h2>
            {project.description && (
              <p className="text-lg text-gray-400">{project.description}</p>
            )}
          </div>
        </div>
        {/* Description */}
        <div className="mb-4">
          <p className="text-sm">{project.description}</p>
        </div>
        {/* Detail Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <span className="font-semibold">Status: </span>
            <span>{project.status}</span>
          </div>
          <div>
            <span className="font-semibold">Difficulty: </span>
            <span>{project.difficulty || "N/A"}</span>
          </div>
          <div>
            <span className="font-semibold">Start Date: </span>
            <span>{project.startDate ? new Date(project.startDate).toLocaleString() : "N/A"}</span>
          </div>
          <div>
            <span className="font-semibold">End Date: </span>
            <span>{project.endDate ? new Date(project.endDate).toLocaleString() : "In Progress"}</span>
          </div>
        </div>
        {/* Technologies */}
        <div className="mb-4">
          <span className="font-semibold">Technologies: </span>
          {project.technologies && project.technologies.length > 0 ? (
            project.technologies.map((tech, idx) => (
              <span key={idx} className="inline-block bg-gray-700 rounded-full px-3 py-1 text-xs font-semibold text-gray-300 mr-2">
                {tech}
              </span>
            ))
          ) : (
            <span>N/A</span>
          )}
        </div>
        {/* Progress */}
        <div className="mb-4">
          <span className="font-semibold">Progress: </span>
          <div className="w-full bg-gray-700 rounded-full h-4 mt-1">
            <div 
              className="bg-green-500 h-4 rounded-full"
              style={{ width: `${project.progress}%` }}
            ></div>
          </div>
          <span className="text-xs">{project.progress}%</span>
        </div>
        {/* Links */}
        <div className="flex space-x-4">
          {project.linkDemo && (
            <a 
              href={project.linkDemo} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-400 hover:text-blue-600"
            >
              <ExternalLink className="w-4 h-4 mr-1" /> Demo
            </a>
          )}
          {project.linkSource && (
            <a 
              href={project.linkSource} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center text-blue-400 hover:text-blue-600"
            >
              <ExternalLink className="w-4 h-4 mr-1" /> Source Code
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;
