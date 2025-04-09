// src/components/MusicPlayer/ExpandButton.jsx
import React from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";

const ExpandButton = ({ isExpanded, onToggle }) => (
  <motion.button
    onClick={onToggle}
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    className="p-1.5 bg-white/20 hover:bg-white/40 rounded-full text-white transition-all"
    aria-label={isExpanded ? "Minimize player" : "Expand player"}
  >
    {isExpanded ? (
      <ChevronDown className="w-3 h-3" />
    ) : (
      <ChevronUp className="w-3 h-3" />
    )}
  </motion.button>
);

export default ExpandButton;