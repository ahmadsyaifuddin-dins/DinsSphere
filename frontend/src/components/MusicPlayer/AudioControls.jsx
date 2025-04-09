// src/components/MusicPlayer/AudioControls.jsx
import React from "react";
import { Pause, Play, Volume2, VolumeX } from "lucide-react";
import { motion } from "framer-motion";

const AudioControls = ({ isPlaying, isMuted, onPlayToggle, onMuteToggle }) => (
  <div className="flex space-x-1">
    <motion.button
      onClick={onPlayToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`p-1.5 ${isPlaying ? 'bg-green-500/40 hover:bg-green-500/60' : 'bg-blue-500/40 hover:bg-blue-500/60'} rounded-full text-white transition-all`}
      aria-label={isPlaying ? "Pause music" : "Play music"}
    >
      {isPlaying ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />}
    </motion.button>
    
    <motion.button
      onClick={onMuteToggle}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      className={`p-1.5 ${isMuted ? 'bg-red-500/40 hover:bg-red-500/60' : 'bg-green-500/40 hover:bg-green-500/60'} rounded-full text-white transition-all`}
      aria-label={isMuted ? "Unmute" : "Mute"}
    >
      {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" />}
    </motion.button>
  </div>
);

export default AudioControls;