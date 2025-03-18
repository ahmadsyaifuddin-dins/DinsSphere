import React from "react";
import { Share, Printer, FileText, Download, ShareIcon, Share2 } from "lucide-react";

const ButtonFooter = ({ task, handleShareTask, handlePrintTask, exportTaskToPDF }) => {
  return (
    <div className="flex space-x-2">
      <button
        className="cursor-pointer text-gray-400 hover:text-white transition-colors duration-300"
        onClick={handleShareTask}
      >
        <Share2 className="w-5 h-5" />
      </button>
      <button
        className="cursor-pointer text-gray-400 hover:text-white transition-colors duration-300"
        onClick={handlePrintTask}
      >
        <Printer className="w-5 h-5" />
      </button>
      <button
        className="cursor-pointer text-gray-400 hover:text-white transition-colors duration-300"
        onClick={() => exportTaskToPDF(task)}
      >
        <Download className="w-5 h-5" />
      </button>
    </div>
  );
};

export default ButtonFooter;
