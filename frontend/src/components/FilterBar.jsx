import React from 'react';

const FilterBar = ({ filterText, onFilterChange }) => {
  return (
    <div className="mb-6">
      <input
        type="text"
        placeholder="Cari project..."
        value={filterText}
        onChange={(e) => onFilterChange(e.target.value)}
        className="w-full p-2 rounded bg-[#121212] text-[#F4F4F8] border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#3A86FF] transition"
      />
    </div>
  );
};

export default FilterBar;
