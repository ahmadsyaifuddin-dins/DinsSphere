import React from "react";
import { List, Grid } from "lucide-react";
import { motion } from "framer-motion";

const ViewMode = ({ viewMode, setViewMode }) => {
  return (
    <div className="flex gap-2">
      <div className="flex items-center space-x-0 bg-gray-700 p-0.5 rounded-lg relative overflow-hidden">
        {/* Background indicator - matches SortOrder style */}
        <motion.div 
          className="absolute z-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-md"
          initial={false}
          animate={{
            x: viewMode === "list" ? 0 : "100%"
          }}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          style={{ 
            top: 2, 
            bottom: 2, 
            left: 2,
            width: "calc(50% - 2px)", 
          }}
        />
        
        <motion.button
          onClick={() => setViewMode("list")}
          className={`flex items-center justify-center gap-1 px-3 py-1.5 text-sm rounded-md relative z-10 w-full cursor-pointer ${
            viewMode === "list" 
              ? "text-white" 
              : "text-gray-300 hover:text-gray-100"
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: viewMode === "list" ? -5 : 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 15 
            }}
          >
            <List className="w-4 h-4" />
          </motion.div>
          <span className="hidden xs:inline">Table View</span>
          <span className="xs:hidden">List</span>
        </motion.button>
        
        <motion.button
          onClick={() => setViewMode("grid")}
          className={`flex items-center justify-center gap-1 px-3 py-1.5 text-sm rounded-md relative z-10 w-full cursor-pointer ${
            viewMode === "grid" 
              ? "text-white" 
              : "text-gray-300 hover:text-gray-100"
          }`}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: viewMode === "grid" ? 5 : 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 15 
            }}
          >
            <Grid className="w-4 h-4" />
          </motion.div>
          <span className="hidden xs:inline">Card View</span>
          <span className="xs:hidden">Card</span>
        </motion.button>
      </div>
    </div>
  );
};

export default ViewMode;