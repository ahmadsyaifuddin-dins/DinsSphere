// src/components/MusicPlayer/ExpandedPlayer.jsx
import React from "react";
import { Music } from "lucide-react";
import { motion } from "framer-motion";
import AutoplayHint from "./AutoplayHint";
import TrackInfo from "./TrackInfo";
import AudioControls from "./AudioControls";
import ExpandButton from "./ExpandButton";
import TrackControls from "./TrackControls";
import TrackList from "./TrackList";

const ExpandedPlayer = ({ 
  variants,
  showAutoplayHint,
  isPlaying,
  isMuted,
  currentTrack,
  togglePlay,
  toggleMute,
  toggleTrackList,
  showTrackList,
  toggleExpand,
  tracks,
  currentTrackIndex,
  changeTrack,
  prevTrack,
  nextTrack
}) => (
  <motion.div
    key="expanded"
    initial="hidden"
    animate="visible"
    exit="exit"
    variants={variants}
    className="flex flex-col"
  >
    <AutoplayHint show={showAutoplayHint} />
    
    <motion.div 
      className="flex flex-col bg-gradient-to-r from-blue-600 to-green-600 rounded-lg shadow-lg border border-blue-400 overflow-hidden"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Player controls */}
      <div className="flex items-center px-3 py-2">
        <div className="mr-2 relative">
          <Music className="w-4 h-4 text-white animate-pulse" />
          {isPlaying && !isMuted && (
            <motion.span 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -top-1 -right-1 h-2 w-2 bg-green-400 rounded-full"
            ></motion.span>
          )}
        </div>
        
        {/* Track info */}
        <TrackInfo 
          title={currentTrack.title} 
          isPlaying={isPlaying} 
          isMuted={isMuted} 
        />
        
        <div className="flex space-x-1">
          {/* Audio controls */}
          <AudioControls 
            isPlaying={isPlaying}
            isMuted={isMuted}
            onPlayToggle={togglePlay}
            onMuteToggle={toggleMute}
          />
          
          {/* Track selection button */}
          <motion.button
            onClick={toggleTrackList}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className={`p-1.5 ${showTrackList ? 'bg-purple-500/60' : 'bg-purple-500/40 hover:bg-purple-500/60'} rounded-full text-white transition-all`}
            aria-label="Change track"
          >
            <Music className="w-3 h-3" />
          </motion.button>
          
          {/* Expand/collapse button */}
          <ExpandButton 
            isExpanded={true} 
            onToggle={toggleExpand} 
          />
        </div>
      </div>
      
      {/* Track navigation controls */}
      {!showTrackList && (
        <div className="flex justify-center py-1 bg-blue-700/30">
          <TrackControls 
            onPrevTrack={prevTrack}
            onNextTrack={nextTrack}
            disabled={false}
          />
        </div>
      )}
      
      {/* Track list */}
      <TrackList
        show={showTrackList}
        tracks={tracks}
        currentTrackIndex={currentTrackIndex}
        onTrackSelect={changeTrack}
      />
    </motion.div>
  </motion.div>
);

export default ExpandedPlayer;