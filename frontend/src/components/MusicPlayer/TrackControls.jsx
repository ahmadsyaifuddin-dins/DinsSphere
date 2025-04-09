// src/components/MusicPlayer/TrackControls.jsx
import React from "react";
import { SkipBack, SkipForward } from "lucide-react";
import { motion } from "framer-motion";

const TrackControls = ({ onPrevTrack, onNextTrack, disabled }) => (
  <div className="flex space-x-1">
    <motion.button
      onClick={onPrevTrack}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      disabled={disabled}
      className={`p-1.5 bg-blue-500/40 hover:bg-blue-500/60 rounded-full text-white transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label="Previous track"
    >
      <SkipBack className="w-3 h-3" />
    </motion.button>
    
    <motion.button
      onClick={onNextTrack}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      disabled={disabled}
      className={`p-1.5 bg-blue-500/40 hover:bg-blue-500/60 rounded-full text-white transition-all ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
      aria-label="Next track"
    >
      <SkipForward className="w-3 h-3" />
    </motion.button>
  </div>
);

export default TrackControls;