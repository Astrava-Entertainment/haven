import { useState, useRef, useEffect } from "react";
import { useRenderSelector } from "@haven/render/shared";

function AudioPlayer() {
  const fileData = useRenderSelector((state) => state.file.currentFile);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playerRef = useRef<HTMLDivElement | null>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [position, setPosition] = useState({ x: 100, y: 100 });
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [showPlayer, setShowPlayer] = useState(true);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      if (audio.paused) {
        await audio.play();
        setIsPlaying(true);
      } else {
        audio.pause();
        setIsPlaying(false);
      }
    } catch (error) {
      console.error("Failed to play audio:", error);
    }
  };

  // TODO: unused function
  // @ts-ignore
  const closePlayer = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
    setIsPlaying(false);
    setShowPlayer(false);
  };


  const handleMouseDown = (e: React.MouseEvent) => {
    setDragging(true);
    setOffset({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - offset.x,
      y: e.clientY - offset.y,
    });
  };

  const handleMouseUp = () => {
    setDragging(false);
  };

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [dragging, offset]);

  if (!fileData?.url || !showPlayer) return null;

  // TODO: drop render & store info
  const handleAudioEnded = () => {
    setIsPlaying(false);
    setShowPlayer(false);
  };

  return (
    <div
      ref={playerRef}
      style={{
        position: "fixed",
        top: position.y,
        left: position.x,
        zIndex: 9999,
      }}
      className="bg-white border rounded shadow-lg p-4 w-[250px] flex flex-col gap-2 cursor-move"
      onMouseDown={handleMouseDown}
    >
      <div className="flex items-center justify-between text-black">
        <span className="font-medium truncate">{fileData.name}</span>
      </div>

      <audio
        ref={audioRef}
        src={fileData.url}
        preload="metadata"
        onEnded={handleAudioEnded}
      />

      <button
        className="bg-blue-500 text-white rounded px-3 py-1 hover:bg-blue-600"
        onClick={togglePlay}
      >
        {isPlaying ? "Pause" : "Resume"}
      </button>
    </div>
  );
}

export default AudioPlayer;
