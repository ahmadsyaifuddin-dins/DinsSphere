// src/components/ViewCountSkeleton.jsx
import React from "react";

const ViewCountSkeleton = () => (
  <div className="flex items-center justify-end space-x-1 sm:space-x-2">
    <div className="w-5 h-4 bg-gray-700 rounded animate-pulse"></div>
    <div className="w-5 h-5 bg-gray-700 rounded-full animate-pulse"></div>
  </div>
);

export default ViewCountSkeleton;
