// FilterSearch.jsx
import React from "react";
import { Search } from "lucide-react";

const FilterSearch = ({ filterText, setFilterText }) => {
  return (
    <div className="relative w-full max-w-xs py-5">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        className="pl-10 pr-4 py-2 w-full rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        placeholder="cari projects berdasarkan judul..."
        value={filterText}
        onChange={(e) => setFilterText(e.target.value)}
      />
    </div>
  );
};

export default FilterSearch;