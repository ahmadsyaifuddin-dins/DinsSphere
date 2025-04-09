import React from "react";
import { SortAsc, SortDesc } from "lucide-react";
import { motion } from "framer-motion";

const SortOrder = ({ sortOrder, setSortOrder }) => {
  return (
    <div className="flex gap-2">
      <span className="text-sm text-gray-400"></span>
      <div className="flex items-center space-x-0 bg-gray-700 p-0.5 rounded-lg relative overflow-hidden">
        {/* Background indicator - full width per button */}
        <motion.div 
          className="absolute z-0 bg-gradient-to-r from-green-500/60 to-teal-600/90 rounded-md"
          initial={false}
          animate={{
            x: sortOrder === "newest" ? 0 : "100%"
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
          className={`flex items-center cursor-pointer justify-center gap-1 px-3 py-1.5 text-sm rounded-md relative z-10 w-full ${
            sortOrder === "newest"
              ? "text-white"
              : "text-gray-300 hover:text-gray-100"
          }`}
          onClick={() => setSortOrder("newest")}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: sortOrder === "newest" ? -5 : 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 15 
            }}
          >
            <SortAsc className="w-4 h-4" />
          </motion.div>
          <span>Baru</span>
        </motion.button>
        
        <motion.button
          className={`flex items-center cursor-pointer justify-center gap-1 px-3 py-1.5 text-sm rounded-md relative z-10 w-full ${
            sortOrder === "oldest"
              ? "text-white" 
              : "text-gray-300 hover:text-gray-100"
          }`}
          onClick={() => setSortOrder("oldest")}
          whileTap={{ scale: 0.95 }}
        >
          <motion.div
            animate={{ rotate: sortOrder === "oldest" ? 5 : 0 }}
            transition={{ 
              type: "spring", 
              stiffness: 400, 
              damping: 15 
            }}
          >
            <SortDesc className="w-4 h-4" />
          </motion.div>
          <span>Lama</span>
        </motion.button>
      </div>
    </div>
  );
};

export default SortOrder;