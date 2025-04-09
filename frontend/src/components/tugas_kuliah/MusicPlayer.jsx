import React, { useState, useRef, useEffect } from "react";
import { Music, Pause, Play, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const MusicPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [autoplayAttempted, setAutoplayAttempted] = useState(false);
  const [showAutoplayHint, setShowAutoplayHint] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Always unmute when manually clicking play
      audioRef.current.muted = false;
      setIsMuted(false);
      setShowAutoplayHint(false);
      
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((err) => {
          console.error("Play failed:", err);
          // If play fails, show visual feedback
          setIsPlaying(false);
          setShowAutoplayHint(true);
        });
    }
  };

  const toggleMute = () => {
    if (!audioRef.current) return;
    
    if (isMuted) {
      audioRef.current.muted = false;
      setIsMuted(false);
      setShowAutoplayHint(false);
      
      // If already supposed to be playing but was muted, ensure it's playing
      if (isPlaying) {
        audioRef.current.play()
          .catch(err => {
            console.error("Play failed on unmute:", err);
            setShowAutoplayHint(true);
          });
      }
    } else {
      audioRef.current.muted = true;
      setIsMuted(true);
    }
  };

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
    // When expanding, show autoplay hint if needed
    if (!isExpanded && autoplayAttempted && !isPlaying) {
      setShowAutoplayHint(true);
    }
  };

  // Initialize audio and attempt autoplay
  useEffect(() => {
    const attemptAutoplay = async () => {
      if (!audioRef.current || autoplayAttempted) return;
      
      setAutoplayAttempted(true);
      
      try {
        // First try with sound (will likely fail due to browser policies)
        await audioRef.current.play();
        setIsPlaying(true);
        setIsMuted(false);
      } catch (err) {
        // If that fails, try muted autoplay (more likely to succeed)
        try {
          audioRef.current.muted = true;
          setIsMuted(true);
          await audioRef.current.play();
          setIsPlaying(true);
          // Show autoplay hint briefly when expanded
          if (isExpanded) {
            setShowAutoplayHint(true);
            setTimeout(() => setShowAutoplayHint(false), 5000);
          }
        } catch (secondErr) {
          // Even muted autoplay failed
          console.error("Even muted autoplay failed:", secondErr);
          setIsPlaying(false);
        }
      }
    };

    // Try autoplay when component mounts
    attemptAutoplay();

    // Check audio context suspension state
    const checkAudioState = () => {
      if (audioRef.current && audioRef.current.paused && isPlaying) {
        setIsPlaying(false);
      }
    };
    
    // Poll audio state to detect browser interventions
    const intervalId = setInterval(checkAudioState, 1000);
    
    // Set up event listeners for user interaction
    const handleInteraction = () => {
      if (audioRef.current && !isPlaying) {
        togglePlay();
      }
    };

    // Audio ended event listener
    const handleAudioEnded = () => {
      setIsPlaying(false);
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleAudioEnded);
    }
    
    return () => {
      clearInterval(intervalId);
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnded);
        audioRef.current.pause();
      }
    };
  }, []);

  // Audio state change handler
  useEffect(() => {
    const audioElement = audioRef.current;
    if (!audioElement) return;

    // Set up audio state change listeners
    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    
    audioElement.addEventListener('play', handlePlay);
    audioElement.addEventListener('pause', handlePause);
    
    return () => {
      audioElement.removeEventListener('play', handlePlay);
      audioElement.removeEventListener('pause', handlePause);
    };
  }, []);

  // Listen for visibility changes to handle tab switching
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && audioRef.current) {
        // When returning to tab, check if audio should be playing
        if (isPlaying && audioRef.current.paused) {
          audioRef.current.play().catch(() => {
            // Browser may block autoplay on tab return
            setShowAutoplayHint(true);
          });
        }
      }
    };
    
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPlaying]);

  // Animation variants for the jelly effect
  const jellyVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: { 
      scale: 1, 
      opacity: 1,
      transition: { 
        type: "spring",
        damping: 8,
        stiffness: 200,
        mass: 1
      }
    },
    exit: { 
      scale: 0.8, 
      opacity: 0,
      transition: { 
        duration: 0.2
      }
    }
  };

  // Animation variants for the hint bounce
  const hintVariants = {
    hidden: { y: -10, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { 
        type: "spring",
        damping: 10,
        stiffness: 150
      }
    },
    exit: { 
      y: -10, 
      opacity: 0,
      transition: { duration: 0.2 }
    }
  };

  return (
    <div className="fixed bottom-2 right-2 z-50">
      <AnimatePresence mode="wait">
        {isExpanded ? (
          // Expanded view
          <motion.div
            key="expanded"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={jellyVariants}
            className="flex flex-col"
          >
            <AnimatePresence>
              {showAutoplayHint && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  variants={hintVariants}
                  className="mb-2 p-2 bg-yellow-600/90 text-white text-xs rounded shadow-lg"
                >
                  Click play to enable audio! ↓
                </motion.div>
              )}
            </AnimatePresence>
            
            <motion.div 
              className="flex items-center bg-gradient-to-r from-blue-600 to-green-600 rounded-lg shadow-lg px-3 py-2 border border-blue-400"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
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
              
              <div className="flex-1 mr-3">
                <p className="text-white font-medium text-xs truncate max-w-24">
                  DJ Music 🥳
                </p>
                <div className="mt-1 h-1 bg-blue-300/30 rounded-full overflow-hidden">
                  <div className={`h-full bg-blue-200 ${isPlaying && !isMuted ? "animate-music-progress" : ""}`}></div>
                </div>
              </div>
              
              <div className="flex space-x-1">
                <motion.button
                  onClick={togglePlay}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-1.5 ${isPlaying ? 'bg-green-500/40 hover:bg-green-500/60' : 'bg-blue-500/40 hover:bg-blue-500/60'} rounded-full text-white transition-all`}
                  aria-label={isPlaying ? "Pause music" : "Play music"}
                >
                  {isPlaying ? (
                    <Pause className="w-3 h-3" />
                  ) : (
                    <Play className="w-3 h-3" />
                  )}
                </motion.button>
                
                <motion.button
                  onClick={toggleMute}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className={`p-1.5 ${isMuted ? 'bg-red-500/40 hover:bg-red-500/60' : 'bg-green-500/40 hover:bg-green-500/60'} rounded-full text-white transition-all`}
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? (
                    <VolumeX className="w-3 h-3" />
                  ) : (
                    <Volume2 className="w-3 h-3" />
                  )}
                </motion.button>
                
                <motion.button
                  onClick={toggleExpand}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  className="p-1.5 bg-white/20 hover:bg-white/40 rounded-full text-white transition-all"
                  aria-label="Minimize player"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        ) : (
          // Minimized view - just a floating button with jelly effect
          <motion.button
            key="minimized"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={jellyVariants}
            onClick={toggleExpand}
            whileHover={{ scale: 1.1 }}
            whileTap={{ 
              scale: 0.9,
              rotate: [0, -5, 5, -5, 0],
              transition: { duration: 0.5 }
            }}
            className={`flex items-center space-x-1 ${isPlaying && !isMuted ? 'bg-gradient-to-r from-green-600 to-blue-600' : 'bg-gradient-to-r from-blue-600 to-green-600'} rounded-full p-2 shadow-lg border border-blue-400 hover:shadow-blue-500/50 transition-all duration-300`}
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
                className="h-2 w-2 bg-white rounded-full"
              ></motion.span>
            )}
            {isMuted && isPlaying && (
              <VolumeX className="w-3 h-3 text-white/70" />
            )}
          </motion.button>
        )}
      </AnimatePresence>
      
      <audio 
        ref={audioRef} 
        src="/Music/DJ_MAU_DIBILANG_SOK_OKE_SLOW.mp3" 
        loop 
        preload="auto"
      />
    </div>
  );
};

export default MusicPlayer;