import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { API_BASE_URL } from "../../config"; // sesuaikan path import

const RelatedTasks = ({ mataKuliah, currentTaskId }) => {
  const [relatedTasks, setRelatedTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRelatedTasks = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/api/tasks/related`, {
          params: { mataKuliah, exclude: currentTaskId },
        });
        setRelatedTasks(res.data);
      } catch (error) {
        console.error("Error fetching related tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    if (mataKuliah) fetchRelatedTasks();
  }, [mataKuliah, currentTaskId]);

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6 animate-pulse">
        <div className="w-6 h-6 border-4 border-t-blue-500 border-r-transparent border-l-transparent border-b-transparent rounded-full animate-spin"></div>
        <p className="ml-2 text-gray-400 text-sm">Loading related tasks...</p>
      </div>
    );
  }

  if (relatedTasks.length === 0) {
    return (
      <div className="flex justify-center items-center p-6 bg-gray-800/30 rounded-xl border border-gray-700">
        <p className="text-gray-400 text-sm">Tidak ada tugas terkait</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {relatedTasks.map((task) => (
        <Link 
          key={task._id} 
          to={`/DetailTugasKuliah/${task._id}`}
          className="block"
        >
          <div className="bg-gray-800/40 backdrop-blur-sm border border-gray-700 rounded-xl p-4 hover:bg-gray-700/50 transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-102 transform">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2">
              <div className="flex-1 overflow-hidden">
                <h3 className="text-white font-medium text-lg truncate">{task.namaTugas}</h3>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 mr-2"></div>
                  <p className="text-gray-400 text-sm">{task.mataKuliah}</p>
                </div>
                
                {task.deadline && (
                  <div className="flex items-center mt-2 text-xs text-gray-400">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {new Date(task.deadline).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric'
                    })}
                  </div>
                )}
              </div>
              
              <div className="self-start sm:self-center mt-1 sm:mt-0">
                <span
                  className={`text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap 
                    ${task.statusTugas === "Selesai"
                      ? "bg-green-500/20 text-green-400 border border-green-500/30"
                      : "bg-blue-500/20 text-blue-400 border border-blue-500/30"
                    }`}
                >
                  {task.statusTugas}
                </span>
              </div>
            </div>
            
            {task.progres && (
              <div className="mt-3 w-full">
                <div className="flex justify-between text-xs text-gray-400 mb-1">
                  <span>Progress</span>
                  <span>{task.progres}%</span>
                </div>
                <div className="w-full bg-gray-700 rounded-full h-1.5">
                  <div 
                    className={`h-1.5 rounded-full ${
                      task.statusTugas === "Selesai" ? "bg-green-500" : "bg-blue-500"
                    }`}
                    style={{ width: `${task.progres}%` }}
                  ></div>
                </div>
              </div>
            )}
          </div>
        </Link>
      ))}
    </div>
  );
};

export default RelatedTasks;