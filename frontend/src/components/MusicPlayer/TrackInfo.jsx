// src/components/MusicPlayer/TrackInfo.jsx
import React from "react";

const TrackInfo = ({ title, isPlaying, isMuted }) => (
  <div className="flex-1 mr-3">
    <p className="text-white font-medium text-xs truncate max-w-24">
      {title}
    </p>
    <div className="mt-1 h-1 bg-blue-300/30 rounded-full overflow-hidden">
      <div className={`h-full bg-blue-200 ${isPlaying && !isMuted ? "animate-music-progress" : ""}`}></div>
    </div>
  </div>
);

export default TrackInfo;