import React from "react";
import { List, Grid } from "lucide-react";

const ViewMode = ({ viewMode, setViewMode }) => {
  return (
    <div className="flex justify-end mb-4">
      <div className="inline-flex rounded-md shadow-sm" role="group">
        <button
          onClick={() => setViewMode("list")}
          className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-l-lg border ${
            viewMode === "list"
              ? "bg-blue-600 text-white border-blue-700"
              : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
          }`}
        >
          <div className="flex items-center">
            <List className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Table View</span>
            <span className="xs:hidden">Table</span>
          </div>
        </button>
        <button
          onClick={() => setViewMode("grid")}
          className={`px-3 py-2 text-xs sm:text-sm font-medium rounded-r-lg border ${
            viewMode === "grid"
              ? "bg-blue-600 text-white border-blue-700"
              : "bg-gray-800 text-gray-300 border-gray-700 hover:bg-gray-700"
          }`}
        >
          <div className="flex items-center">
            <Grid className="w-3 h-3 sm:w-4 sm:h-4 mr-1 sm:mr-2" />
            <span className="hidden xs:inline">Card View</span>
            <span className="xs:hidden">Card</span>
          </div>
        </button>
      </div>
    </div>
  );
};

export default ViewMode;
