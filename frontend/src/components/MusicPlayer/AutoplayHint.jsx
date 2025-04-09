// src/components/MusicPlayer/AutoplayHint.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const AutoplayHint = ({ show }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ y: -10, opacity: 0 }}
        animate={{ 
          y: 0, 
          opacity: 1,
          transition: { 
            type: "spring",
            damping: 10,
            stiffness: 150
          }
        }}
        exit={{ 
          y: -10, 
          opacity: 0,
          transition: { duration: 0.2 }
        }}
        className="mb-2 p-2 bg-transparent text-white text-xs rounded shadow-lg"
      >
        Click play to enable audio! ↓
      </motion.div>
    )}
  </AnimatePresence>
);

export default AutoplayHint;