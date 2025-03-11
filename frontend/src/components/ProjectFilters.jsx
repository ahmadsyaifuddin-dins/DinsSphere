// src/components/ProjectFilters.jsx
import React from "react";

const ProjectFilters = ({
  selectedType,
  setSelectedType,
  selectedStatus,
  setSelectedStatus,
  projectTypes,
  projectStatuses,
}) => {
  return (
    <div className="flex flex-wrap gap-2 mb-4">
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value)}
        className="bg-gray-800 border border-gray-700 rounded px-2 py-1"
      >
        <option value="">All Types</option>
        {projectTypes.map((typeOpt, idx) => (
          <option key={idx} value={typeOpt}>
            {typeOpt || "Semua"}
          </option>
        ))}
      </select>

      <select
        value={selectedStatus}
        onChange={(e) => setSelectedStatus(e.target.value)}
        className="bg-gray-800 border border-gray-700 rounded px-2 py-1"
      >
        <option value="">All Status</option>
        {projectStatuses.map((statusOpt, idx) => (
          <option key={idx} value={statusOpt}>
            {statusOpt || "Semua"}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ProjectFilters;
