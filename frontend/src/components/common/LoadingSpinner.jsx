import React from "react";

const LoadingSpinner = () => {
  return (
    <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-[spin_1s_linear_infinite] mb-4"></div>
        <div className="text-blue-500 text-xl font-semibold animate-pulse">
          Loading...
        </div>
      </div>
    </div>
  );
};

export default LoadingSpinner;