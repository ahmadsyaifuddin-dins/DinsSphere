import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ExternalLink,
  Calendar,
  Clock,
  Code,
  Star,
  GitBranch,
  Award,
  BarChart,
  Sparkles,
  Eye,
} from "lucide-react";

const ProjectDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [project, setProject] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    let isMounted = true;
    
    const fetchProjectAndViews = async () => {
      try {
        // Fetch project details
        const projectRes = await axios.get(`https://dins-sphere-backend.vercel.app/api/projects/${id}`);
        
        if (isMounted) {
          setProject(projectRes.data);
          setLoading(false);
          
          // Hanya fetch view count tanpa update
          // Ini hanya untuk menampilkan, supaya tidak memicu pemanggilan ganda
          const viewRes = await axios.get(`https://dins-sphere-backend.vercel.app/api/projects/${id}/views`);
          setViewCount(viewRes.data.count || 0);
        }
      } catch (err) {
        if (isMounted) {
          setError("Error fetching project details");
          setLoading(false);
          console.error(err);
        }
      }
    };
    
    // Fetch project dan view count
    fetchProjectAndViews();
    
    // Function untuk update view count hanya sekali per session
    const updateViewCount = async () => {
      // Cek localStorage untuk melihat apakah proyek ini sudah dilihat
      const viewedKey = `viewed_project_${id}`;
      const hasViewed = localStorage.getItem(viewedKey);
      
      if (!hasViewed) {
        try {
          // Update view count sekali saja
          await axios.post(`https://dins-sphere-backend.vercel.app/api/projects/${id}/views`);
          // Tandai sebagai sudah dilihat
          localStorage.setItem(viewedKey, 'true');
          
          // Refresh view count setelah update
          if (isMounted) {
            const viewRes = await axios.get(`https://dins-sphere-backend.vercel.app/api/projects/${id}/views`);
            setViewCount(viewRes.data.count || 0);
          }
        } catch (err) {
          console.error("Error updating view count:", err);
        }
      }
    };
    
    // Update view count terpisah dari fetching data
    updateViewCount();
    
    // Cleanup function untuk mencegah memory leak
    return () => {
      isMounted = false;
    };
  }, [id]); // Hanya bergantung pada id

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-white">
        <div className="w-16 h-16 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
        <p className="mt-4 text-lg">Loading project details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white">
        <div className="bg-red-900/30 p-6 rounded-lg text-center">
          <div className="text-red-400 text-6xl mb-4">⚠️</div>
          <h3 className="text-xl font-bold mb-2">Something went wrong</h3>
          <p className="text-gray-400 mb-4">{error}</p>
          <button 
            onClick={() => navigate(-1)} 
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-md transition-all"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Function to determine status badge style
  const getStatusStyle = (status) => {
    const statusStyles = {
      "In Progress": "bg-blue-500/20 text-blue-400 border-blue-500",
      "Done": "bg-green-500/20 text-green-400 border-green-500",
      "Backlog": "bg-purple-500/20 text-purple-400 border-purple-500",
      "Paused": "bg-red-500/20 text-red-400 border-red-500",
      "Planning": "bg-yellow-500/20 text-yellow-400 border-yellow-500"
    };
    
    return statusStyles[status] || "bg-gray-500/20 text-gray-400 border-gray-500";
  };
  
  // Function to determine difficulty badge style
  const getDifficultyStyle = (difficulty) => {
    const difficultyStyles = {
      "Easy": "bg-green-500/20 text-green-400",
      "Medium": "bg-yellow-500/20 text-yellow-400",
      "Hard": "bg-red-500/20 text-red-400",
      "Expert": "bg-purple-500/20 text-purple-400"
    };
    
    return difficultyStyles[difficulty] || "bg-gray-500/20 text-gray-400";
  };

  // Function to format date
  const formatDate = (dateString) => {
    if (!dateString) return "Not Available";
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Format view count with thousand separator
  const formatViewCount = (count) => {
    return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 text-gray-100 p-4 sm:p-8">
      {/* Header with Back Button */}
      <div className="max-w-6xl mx-auto mb-6">
        <button 
          className="cursor-pointer flex items-center text-gray-400 hover:text-white transition-colors bg-gray-800/50 hover:bg-gray-700/50 px-4 py-2 rounded-full" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Kembali
        </button>
      </div>

      {/* Main Content Container */}
      <div className="max-w-6xl mx-auto">
        {/* Hero Section */}
        <div className="relative mb-8 overflow-hidden rounded-xl bg-gray-800 shadow-2xl">
          {project.thumbnail ? (
            <div className="relative h-64 sm:h-80 overflow-hidden">
              <img 
                src={project.thumbnail} 
                alt={project.title} 
                className="w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"></div>
              
              {/* View Counter Badge */}
              <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center">
                <Eye className="w-4 h-4 mr-2 text-blue-400" />
                <span className="text-sm font-medium">{formatViewCount(viewCount)} views</span>
              </div>
            </div>
          ) : (
            <div className="h-32 bg-gradient-to-r from-blue-900 to-indigo-900 relative">
              {/* View Counter Badge for projects without thumbnail */}
              <div className="absolute top-4 right-4 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center">
                <Eye className="w-4 h-4 mr-2 text-blue-400" />
                <span className="text-sm font-medium">{formatViewCount(viewCount)} views</span>
              </div>
            </div>
          )}
          
          {/* Project Title and Icon Section */}
          <div className="p-6 sm:p-8 relative">
            {/* If thumbnail exists, position icon to overlap it */}
            <div className={`flex flex-col sm:flex-row items-center sm:items-start gap-6 ${project.thumbnail ? "sm:-mt-16" : ""}`}>
              <div className={`w-24 h-24 rounded-xl overflow-hidden flex items-center justify-center shadow-lg ${project.icon ? "" : "bg-gradient-to-br from-blue-600 to-indigo-700"}`}>
                {project.icon ? (
                  <img src={project.icon} alt={project.title} className="w-full h-full object-cover" />
                ) : (
                  <span className="text-4xl font-bold">{project.title.charAt(0)}</span>
                )}
              </div>
              
              <div className="text-center sm:text-left flex-1">
                <h1 className="text-3xl sm:text-4xl font-bold mb-2">{project.title}</h1>
                {project.subtitle && (
                  <p className="text-xl text-gray-400">{project.subtitle}</p>
                )}
                
                {/* Status Badge */}
                <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusStyle(project.status)}`}>
                    {project.status}
                  </span>
                  
                  {project.difficulty && (
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getDifficultyStyle(project.difficulty)}`}>
                      {project.difficulty}
                    </span>
                  )}
                </div>
              </div>
              
              {/* Quick Links */}
              <div className="flex gap-3">
                {project.linkDemo && (
                  <a 
                    href={project.linkDemo} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    <ExternalLink className="w-4 h-4 mr-2" /> Demo
                  </a>
                )}
                {project.linkSource && (
                  <a 
                    href={project.linkSource} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-center px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    <GitBranch className="w-4 h-4 mr-2" /> Source
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content - Left 2/3 */}
          <div className="lg:col-span-2">
            {/* Description Card */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-bold border-b border-gray-700 pb-3 mb-4">Deskripsi Proyek</h2>
              <p className="text-gray-300 leading-relaxed whitespace-pre-line">{project.description}</p>
            </div>
            
            {/* Progress Card */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold">Progress</h2>
                <span className="text-2xl font-bold text-blue-400">{project.progress}%</span>
              </div>
              
              <div className="w-full bg-gray-700 rounded-full h-3 mb-2 overflow-hidden">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-500"
                  style={{ width: `${project.progress}%` }}
                ></div>
              </div>
              
              {/* Timeline */}
              <div className="mt-6 flex justify-between items-center text-sm">
                <div className="flex items-center text-gray-400">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>Start: {formatDate(project.startDate)}</span>
                </div>
                
                <div className="h-px flex-1 bg-gray-700 mx-4"></div>
                
                <div className="flex items-center text-gray-400">
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>End: {formatDate(project.endDate)}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Sidebar - Right 1/3 */}
          <div className="space-y-6">
            {/* Technologies Card */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6">
              <div className="flex items-center mb-4">
                <Code className="w-5 h-5 mr-2 text-blue-400" />
                <h2 className="text-xl font-bold">Technologies</h2>
              </div>
              
              <div className="flex flex-wrap gap-2">
                {project.technologies && project.technologies.length > 0 ? (
                  project.technologies.map((tech, idx) => (
                    <span key={idx} className="px-3 py-1 bg-gray-700/50 border border-gray-600 rounded-lg text-sm font-medium text-gray-300 hover:bg-gray-600/50 transition-colors">
                      {tech}
                    </span>
                  ))
                ) : (
                  <span className="text-gray-500">No technologies specified</span>
                )}
              </div>
            </div>
            
            {/* Details Card */}
            <div className="bg-gray-800 rounded-xl shadow-lg p-6">
              <h2 className="text-xl font-bold mb-4">Project Details</h2>
              <div className="space-y-4">
                
                {/* Project Type */}
                <div className="flex items-start">
                  <Sparkles className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Project Type</p>
                    <p className="font-medium">{project.type || "Not Specified"}</p>
                  </div>
                </div>
                
                {/* Duration */}
                <div className="flex items-start">
                  <Clock className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Duration</p>
                    <p className="font-medium">
                      {project.startDate ? (
                        project.endDate ? 
                          `${Math.ceil(Math.abs(new Date(project.endDate) - new Date(project.startDate)) / (1000 * 60 * 60 * 24))} days` : 
                          "In Progress"
                      ) : "Not Available"}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Star className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Difficulty</p>
                    <p className="font-medium">{project.difficulty || "Not Specified"}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <BarChart className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Status</p>
                    <p className="font-medium">{project.status}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Award className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Achievement</p>
                    <p className="font-medium">{project.achievement || "Not Specified"}</p>
                  </div>
                </div>
                
                {/* View Count */}
                <div className="flex items-start">
                  <Eye className="w-5 h-5 mr-3 text-gray-500 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Views</p>
                    <p className="font-medium">{formatViewCount(viewCount)}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetail;