// src/components/MusicPlayer/MinimizedPlayer.jsx
import React from "react";
import { Music, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

const MinimizedPlayer = ({ onClick, isPlaying, isMuted, variants }) => (
  <motion.button
    key="minimized"
    initial="hidden"
    animate="visible"
    exit="exit"
    variants={variants}
    onClick={onClick}
    whileHover={{ scale: 1.1 }}
    whileTap={{ 
      scale: 0.9,
      rotate: [0, -5, 5, -5, 0],
      transition: { duration: 0.5 }
    }}
    className={`flex items-center space-x-1 ${isPlaying && !isMuted ? 'bg-gradient-to-r from-green-600 to-blue-600' : 'bg-gradient-to-r from-blue-600 to-green-600'} rounded-full p-0.5 md:p-2 shadow-lg border border-blue-400 hover:shadow-blue-500/50 transition-all duration-300`}
    aria-label="Expand music player"
  >
    <Music className="w-4 h-4 text-white" />
    {isPlaying && (
      <motion.span 
        initial={{ scale: 0 }}
        animate={{ 
          scale: [1, 1.2, 1],
          transition: { 
            repeat: Infinity,
            duration: 1.5
          }
        }}
        className="h-2 w-2 bg-cyan-300 rounded-full"
      ></motion.span>
    )}
    {isMuted && isPlaying && (
      <VolumeX className="w-3 h-3 text-white/70" />
    )}
  </motion.button>
);

export default MinimizedPlayer;