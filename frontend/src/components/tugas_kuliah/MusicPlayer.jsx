// src/components/MusicPlayer/MusicPlayer.jsx
import React, { useState, useRef, useEffect } from "react";
import { AnimatePresence } from "framer-motion";
import { useLocation } from "react-router-dom";
import tracks from "../../data/tracks";
import MinimizedPlayer from "../MusicPlayer/MinimizedPlayer";
import ExpandedPlayer from "../MusicPlayer/ExpandedPlayer";

const MusicPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);
  const [autoplayAttempted, setAutoplayAttempted] = useState(false);
  const [showAutoplayHint, setShowAutoplayHint] = useState(false);
  const [showTrackList, setShowTrackList] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  
  const location = useLocation();
  
  const currentTrack = tracks[currentTrackIndex];
  
  // Function untuk mengganti lagu
  const changeTrack = (index) => {
    const wasPlaying = isPlaying;
    
    // Pause current track
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
    
    // Update current track index
    setCurrentTrackIndex(index);
    
    // Update audio src
    if (audioRef.current) {
      audioRef.current.src = tracks[index].src;
      
      // If it was playing, auto-play the new track
      if (wasPlaying) {
        audioRef.current.muted = isMuted;
        audioRef.current.play()
          .then(() => setIsPlaying(true))
          .catch((err) => {
            console.error("Play failed after track change:", err);
            setIsPlaying(false);
            setShowAutoplayHint(true);
          });
      }
    }
    
    // Hide track list after selection
    setShowTrackList(false);
  };
  
  const togglePlay = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Saat user klik, unmute dulu
      audioRef.current.muted = false;
      setIsMuted(false);
      setShowAutoplayHint(false);
      
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch((err) => {
          console.error("Play failed:", err);
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
    // Just toggle the expanded state without affecting playback
    setIsExpanded(!isExpanded);
    
    // When expanding, show autoplay hint if needed
    if (!isExpanded && autoplayAttempted && !isPlaying) {
      setShowAutoplayHint(true);
    }
    
    // Hide track list when minimizing
    if (isExpanded) {
      setShowTrackList(false);
    }
  };
  
  const toggleTrackList = () => {
    setShowTrackList(!showTrackList);
  };
  
  const nextTrack = () => {
    const nextIndex = (currentTrackIndex + 1) % tracks.length;
    changeTrack(nextIndex);
  };
  
  const prevTrack = () => {
    const prevIndex = (currentTrackIndex - 1 + tracks.length) % tracks.length;
    changeTrack(prevIndex);
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
    
    // Audio ended event listener
    const handleAudioEnded = () => {
      // Automatically play next track
      nextTrack();
    };

    if (audioRef.current) {
      audioRef.current.addEventListener('ended', handleAudioEnded);
    }
    
    return () => {
      clearInterval(intervalId);
      if (audioRef.current) {
        audioRef.current.removeEventListener('ended', handleAudioEnded);
      }
    };
  }, [isExpanded, currentTrackIndex]);

  // Listen for route changes to autoplay on /tugasKuliah
  useEffect(() => {
    if (!audioRef.current) return;
    
    // If we navigate to the dashboard tugas kuliah page, try to play the music
    if (location.pathname === "/tugasKuliah") {
      // First try to play with sound
      audioRef.current.muted = false;
      setIsMuted(false);
      
      audioRef.current.play()
        .then(() => {
          setIsPlaying(true);
          setShowAutoplayHint(false);
        })
        .catch(err => {
          console.error("Auto play on route change blocked:", err);
          
          // If failed, try muted autoplay
          audioRef.current.muted = true;
          setIsMuted(true);
          
          audioRef.current.play()
            .then(() => {
              setIsPlaying(true);
              setShowAutoplayHint(true); // Show hint to unmute
              // Auto-expand player to show the hint
              setIsExpanded(true);
              
              // Hide the hint after a few seconds
              setTimeout(() => {
                if (!isExpanded) setShowAutoplayHint(false);
              }, 5000);
            })
            .catch(muteErr => {
              console.error("Even muted autoplay failed on route change:", muteErr);
              setShowAutoplayHint(true);
              // Auto-expand player to show the hint
              setIsExpanded(true);
            });
        });
    }
  }, [location.pathname]);

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

  return (
    <div className="fixed bottom-2 left-2 z-50">
      <AnimatePresence mode="wait">
        {isExpanded ? (
          <ExpandedPlayer
            variants={jellyVariants}
            showAutoplayHint={showAutoplayHint}
            isPlaying={isPlaying}
            isMuted={isMuted}
            currentTrack={currentTrack}
            togglePlay={togglePlay}
            toggleMute={toggleMute}
            toggleTrackList={toggleTrackList}
            showTrackList={showTrackList}
            toggleExpand={toggleExpand}
            tracks={tracks}
            currentTrackIndex={currentTrackIndex}
            changeTrack={changeTrack}
            prevTrack={prevTrack}
            nextTrack={nextTrack}
          />
        ) : (
          <MinimizedPlayer
            onClick={toggleExpand}
            isPlaying={isPlaying}
            isMuted={isMuted}
            variants={jellyVariants}
          />
        )}
      </AnimatePresence>
      
      <audio 
        ref={audioRef} 
        src={currentTrack.src} 
        loop={false} 
        preload="auto"
      />
    </div>
  );
};

export default MusicPlayer;