// src/components/Pagination.jsx
import React from "react";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  return (
    <div className="flex justify-center items-center gap-2 mt-6">
      <button
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        className="cursor-pointer px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
      >
        Prev
      </button>
      <span className="text-sm">
        Page {currentPage} of {totalPages}
      </span>
      <button
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        className="cursor-pointer px-3 py-1.5 rounded bg-gray-700 hover:bg-gray-600 disabled:opacity-50"
      >
        Next
      </button>
    </div>
  );
};

export default Pagination;
