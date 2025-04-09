// src/components/MusicPlayer/TrackList.jsx
import React from "react";
import { motion, AnimatePresence } from "framer-motion";

const TrackList = ({ show, tracks, currentTrackIndex, onTrackSelect }) => (
  <AnimatePresence>
    {show && (
      <motion.div
        initial={{ height: 0, opacity: 0 }}
        animate={{ height: 'auto', opacity: 1 }}
        exit={{ height: 0, opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-blue-700/30 overflow-hidden"
      >
        <ul className="py-1 px-2">
          {tracks.map((track, index) => (
            <motion.li 
              key={track.id}
              initial={{ opacity: 0, x: -5 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`text-xs py-1 px-2 rounded cursor-pointer ${
                index === currentTrackIndex 
                  ? 'bg-white/20 text-white font-medium' 
                  : 'text-white/80 hover:bg-white/10'
              }`}
              onClick={() => onTrackSelect(index)}
            >
              {track.title}
            </motion.li>
          ))}
        </ul>
      </motion.div>
    )}
  </AnimatePresence>
);

export default TrackList;