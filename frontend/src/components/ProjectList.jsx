import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { SortAsc, Eye, Edit, Trash2, GripVertical } from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

// Komponen untuk baris yang dapat di-drag
const DraggableRow = ({ 
  project, 
  index, 
  moveRow, 
  onDragEnd, // callback tambahan untuk drag end
  getStatusColorClass, 
  getProgressColorClass,
  viewProjectDetail,
  handleEdit,
  handleDelete,
  isAdmin
}) => {
  const rowRef = React.useRef(null);
  
  const [{ isDragging }, drag] = useDrag({
    type: 'PROJECT_ROW',
    item: { index },
    end: (item, monitor) => {
      if (onDragEnd) onDragEnd();
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: 'PROJECT_ROW',
    hover: (draggedItem, monitor) => {
      if (!rowRef.current) return;
      const dragIndex = draggedItem.index;
      const hoverIndex = index;
      if (dragIndex === hoverIndex) return;
      const hoverBoundingRect = rowRef.current.getBoundingClientRect();
      const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset.y - hoverBoundingRect.top;
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;
      moveRow(dragIndex, hoverIndex);
      draggedItem.index = hoverIndex;
    },
  });
  
  // Gabungkan drag dan drop refs
  drag(drop(rowRef));

  const opacity = isDragging ? 0.5 : 1;

  // Karena viewCount sudah kita fetch, anggap nilainya valid (number)
  const formatViewCount = (count) => {
    if (count === undefined || count === null) return "0";
    return count.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  return (
    <tr 
      ref={rowRef}
      style={{ opacity }}
      className={`border-b border-gray-700 ${
        index % 2 === 0 ? "bg-gray-800" : "bg-gray-900"
      } hover:bg-gray-700 transition-colors duration-150 cursor-move`}
    >
      <td className="py-2 px-3 sm:py-4 sm:px-6">
        <div className="flex items-center space-x-2 sm:space-x-3">
          {isAdmin && (
            <div className="text-gray-400 flex-shrink-0 mr-1">
              <GripVertical className="w-4 h-4 sm:w-5 sm:h-5" />
            </div>
          )}
          <div className={`flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 rounded-full ${project.icon ? "" : "bg-gradient-to-br from-blue-500 to-indigo-600"} flex items-center justify-center text-white font-bold`}>
            {project.icon ? (
              <img src={project.icon} alt={project.title} className="w-full h-full rounded-full object-cover" />
            ) : (
              project.title.charAt(0)
            )}
          </div>
          <div>
            <h3 className="font-medium text-white text-xs sm:text-sm">{project.title}</h3>
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
          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColorClass(project.status)} border whitespace-nowrap`}
        >
          {project.status}
        </span>
      </td>
      <td className="py-2 px-3 sm:py-4 sm:px-6 max-w-xs truncate md:table-cell">
        {project.startDate ? new Date(project.startDate).toLocaleString() : "Not Available"}
      </td>
      <td className="py-2 px-2 sm:py-4 sm:px-6">
        <div className="flex items-center">
          <div className="w-12 sm:w-24 bg-gray-700 rounded-full h-1.5 sm:h-2.5 mr-1 sm:mr-2">
            <div
              className={`h-1.5 sm:h-2.5 rounded-full ${getProgressColorClass(project.progress)}`}
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
          <p className="font-medium">{formatViewCount(project.viewCount)}</p>
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
  );
};

const ProjectList = ({ 
  projects: initialProjects, 
  getStatusColorClass, 
  getProgressColorClass, 
  viewProjectDetail, 
  handleEdit, 
  handleDelete, 
  isAdmin,
  onOrderChange // callback untuk update order di backend
}) => {
  const [projects, setProjects] = useState(initialProjects);

  // Update state lokal ketika props berubah
  useEffect(() => {
    setProjects(initialProjects);
  }, [initialProjects]);

  // Fetch view counts untuk setiap project dari API
  useEffect(() => {
    const fetchViewCounts = async () => {
      const updatedProjects = await Promise.all(
        initialProjects.map(async (project) => {
          try {
            const response = await axios.get(
              `https://dinssphere-production.up.railway.app/api/projects/${project._id}/views`
            );
            return { ...project, viewCount: response.data.count || 0 };
          } catch (error) {
            console.error("Error fetching view count for project", project._id, error);
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

  // Fungsi untuk mengubah urutan baris di state lokal
  const moveRow = useCallback((dragIndex, hoverIndex) => {
    setProjects((prevProjects) => {
      const result = [...prevProjects];
      const [removed] = result.splice(dragIndex, 1);
      result.splice(hoverIndex, 0, removed);
      return result;
    });
  }, []);

  // Callback yang dipanggil setelah drag selesai untuk mengirim order baru ke backend
  const handleDragEnd = useCallback(() => {
    if (onOrderChange) {
      const newOrder = projects.map((project, index) => ({ 
        id: project._id,
        order: index 
      }));
      onOrderChange(newOrder);
    }
  }, [onOrderChange, projects]);
  
  return (
    <DndProvider backend={HTML5Backend}>
      <div className="overflow-x-auto relative shadow-md sm:rounded-lg">
        <table className="w-full text-xs sm:text-sm text-left text-gray-300">
          <thead className="text-xs uppercase bg-gray-700 text-gray-300">
            <tr>
              <th scope="col" className="py-2 px-3 sm:py-3 sm:px-6">Nama Project</th>
              <th scope="col" className="py-2 px-3 sm:py-3 sm:px-6">Type</th>
              <th scope="col" className="py-2 px-2 sm:py-3 sm:px-6">Status</th>
              <th scope="col" className="py-2 px-3 sm:py-3 sm:px-6 md:table-cell">Tanggal Mulai</th>
              <th scope="col" className="py-2 px-2 sm:py-3 sm:px-6">Progress</th>
              <th scope="col" className="py-2 px-2 sm:py-3 sm:px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {projects.length > 0 ? (
              projects.map((project, index) => (
                <DraggableRow
                  key={project._id}
                  project={project}
                  index={index}
                  moveRow={moveRow}
                  onDragEnd={handleDragEnd}
                  getStatusColorClass={getStatusColorClass}
                  getProgressColorClass={getProgressColorClass}
                  viewProjectDetail={viewProjectDetail}
                  handleEdit={handleEdit}
                  handleDelete={handleDelete}
                  isAdmin={isAdmin}
                />
              ))
            ) : (
              <tr className="bg-gray-800 border-b border-gray-700">
                <td colSpan="6" className="py-6 px-4 sm:py-8 sm:px-6 text-center">
                  <div className="flex flex-col items-center">
                    <SortAsc className="w-8 h-8 sm:w-12 sm:h-12 text-gray-500 mb-2 sm:mb-3" />
                    <p className="text-gray-400 text-sm">Tidak ada project yang ditemukan</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </DndProvider>
  );
};

export default ProjectList;
