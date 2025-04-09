import React, { useState, useRef, useEffect } from "react";
import { Music, Pause, Play, Volume2, VolumeX } from "lucide-react";

const MusicPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.muted = false;
      setIsMuted(false);
      
      audioRef.current
        .play()
        .then(() => {
          setIsPlaying(true);
          setIsInitialized(true);
        })
        .catch((err) => {
          console.error("Play failed:", err);
        });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    if (isMuted && !isPlaying) {
      audioRef.current.muted = false;
      setIsMuted(false);
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setIsInitialized(true);
        })
        .catch(err => console.error("Play failed on unmute:", err));
    } else {
      audioRef.current.muted = !audioRef.current.muted;
      setIsMuted(audioRef.current.muted);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Listen for the first user interaction with the page
  useEffect(() => {
    const handleFirstInteraction = () => {
      if (!isInitialized && audioRef.current) {
        audioRef.current.muted = true;
        audioRef.current.play()
          .then(() => {
            setIsPlaying(true);
            setIsInitialized(true);
          })
          .catch(() => {
            // Expected error, don't log
          });
      }
    };

    document.addEventListener('click', handleFirstInteraction, { once: true });
    document.addEventListener('keydown', handleFirstInteraction, { once: true });
    document.addEventListener('scroll', handleFirstInteraction, { once: true });

    return () => {
      document.removeEventListener('click', handleFirstInteraction);
      document.removeEventListener('keydown', handleFirstInteraction);
      document.removeEventListener('scroll', handleFirstInteraction);
      
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, [isInitialized]);

  return (
    <div className="fixed bottom-2 right-2 z-50">
      {isExpanded ? (
        // Expanded view
        <div className="flex items-center bg-gradient-to-r from-green-600 to-lime-600 rounded-lg shadow-lg px-3 py-2 border border-blue-400 transition-all duration-300">
          <div className="mr-2">
            <Music className="w-4 h-4 text-white animate-pulse" />
          </div>
          
          <div className="flex-1 mr-3">
            <p className="text-white font-medium text-xs truncate max-w-24">
              DJ Music
            </p>
            <div className="mt-1 h-1 bg-blue-300/30 rounded-full overflow-hidden">
              <div className={`h-full bg-blue-200 ${isPlaying ? "animate-music-progress" : ""}`}></div>
            </div>
          </div>
          
          <div className="flex space-x-1">
            <button
              onClick={togglePlay}
              className="p-1.5 bg-white/20 hover:bg-white/40 rounded-full text-white transition-all"
              aria-label={isPlaying ? "Pause music" : "Play music"}
            >
              {isPlaying ? (
                <Pause className="w-3 h-3" />
              ) : (
                <Play className="w-3 h-3" />
              )}
            </button>
            
            <button
              onClick={toggleMute}
              className="p-1.5 bg-white/20 hover:bg-white/40 rounded-full text-white transition-all"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? (
                <VolumeX className="w-3 h-3" />
              ) : (
                <Volume2 className="w-3 h-3" />
              )}
            </button>
            
            <button
              onClick={toggleExpand}
              className="p-1.5 bg-white/20 hover:bg-white/40 rounded-full text-white transition-all"
              aria-label="Minimize player"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        </div>
      ) : (
        // Minimized view - just a floating button
        <button
          onClick={toggleExpand}
          className="flex items-center space-x-1 bg-gradient-to-r from-green-600 to-lime-600 rounded-full p-2 shadow-lg border border-blue-400 hover:shadow-blue-500/50 transition-all duration-300"
          aria-label="Expand music player"
        >
          <Music className="w-4 h-4 text-white" />
          {isPlaying && !isMuted && (
            <span className="animate-pulse h-2 w-2 bg-white rounded-full"></span>
          )}
        </button>
      )}
      
      <audio 
        ref={audioRef} 
        src="/Music/DJ_MAU_DIBILANG_SOK_OKE_SLOW.mp3" 
        loop 
        muted 
        preload="auto"
      />
      
    </div>
  );
};

export default MusicPlayer;