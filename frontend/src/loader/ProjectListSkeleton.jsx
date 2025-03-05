import React from 'react';

const ProjectRowSkeleton = () => {
  return (
    <tr className="border-b border-gray-700 animate-pulse">
      <td className="py-2 px-3 sm:py-4 sm:px-6">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10 bg-gray-600 rounded-full"></div>
          <div>
            <div className="h-3 bg-gray-600 rounded w-24 sm:w-36 mb-2"></div>
            <div className="h-2 bg-gray-700 rounded w-16 sm:w-24"></div>
          </div>
        </div>
      </td>
      <td className="py-2 px-3 sm:py-4 sm:px-6">
        <div className="h-3 bg-gray-600 rounded w-16"></div>
      </td>
      <td className="py-2 px-3 sm:py-4 sm:px-6">
        <div className="h-3 bg-gray-600 rounded w-16"></div>
      </td>
      <td className="py-2 px-3 sm:py-4 sm:px-6">
        <div className="h-3 bg-gray-600 rounded w-24"></div>
      </td>
      <td className="py-2 px-2 sm:py-4 sm:px-6">
        <div className="flex items-center">
          <div className="w-12 sm:w-24 bg-gray-700 rounded-full h-1.5 sm:h-2.5 mr-1 sm:mr-2"></div>
          <div className="h-3 bg-gray-600 rounded w-7"></div>
        </div>
      </td>
      <td className="py-2 px-2 sm:py-4 sm:px-6">
        <div className="flex items-center justify-end space-x-1 sm:space-x-2">
          <div className="h-3 bg-gray-600 rounded w-10"></div>
          <div className="w-4 h-4 sm:w-5 sm:h-5 bg-gray-600 rounded"></div>
        </div>
      </td>
    </tr>
  );
};

const ProjectListSkeleton = () => {
  return (
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
          {[...Array(7)].map((_, index) => (
            <ProjectRowSkeleton key={index} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ProjectListSkeleton;