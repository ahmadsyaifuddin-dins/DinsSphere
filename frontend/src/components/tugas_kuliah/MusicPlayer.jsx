// src/components/MusicPlayer.jsx
import React, { useState, useRef, useEffect } from "react";

const MusicPlayer = () => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      // Saat klik, unmute dulu biar audionya denger
      if (audioRef.current.muted) {
        audioRef.current.muted = false;
      }
      audioRef.current
        .play()
        .then(() => setIsPlaying(true))
        .catch((err) => console.error("Play failed:", err));
    }
  };

  useEffect(() => {
    if (audioRef.current) {
      // Coba auto play dalam kondisi muted dulu
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        // console.error("Auto play blocked:", err);
      });
    }
  }, []);

  return (
    <div className="fixed bottom-4 right-4 flex items-center bg-gray-700 rounded-md shadow-lg">
      <button
        onClick={togglePlay}
        className="px-3 py-2 bg-blue-500 hover:bg-blue-600 rounded text-white text-sm"
      >
        {isPlaying ? "Pause Music" : "Play Music"}
      </button>
      {/* Mulai audio dengan muted agar browser perbolehkan auto play */}
      <audio ref={audioRef} src="/Music/DJ_MAU_DIBILANG_SOK_OKE_SLOW.mp3" loop muted />
    </div>
  );
};

export default MusicPlayer;
