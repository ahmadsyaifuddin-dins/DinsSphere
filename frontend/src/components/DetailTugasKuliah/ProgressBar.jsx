import React from "react";
import { getProgressColorClass } from "../../utils/helpers";

const ProgressBar = ({ progress }) => (
  <div className="mb-6">
    <div className="flex justify-between mb-2">
      <span className="text-gray-300">Progress</span>
      <span className="font-semibold text-white">{progress}%</span>
    </div>
    <div className="w-full bg-gray-700 rounded-full h-2.5">
      <div
        className={`h-2.5 rounded-full ${getProgressColorClass(progress)}`}
        style={{ width: `${progress}%` }}
      ></div>
    </div>
  </div>
);

export default ProgressBar;
