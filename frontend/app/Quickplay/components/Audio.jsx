import { useEffect, useRef, useState } from "react";
import { Music } from "lucide-react"
export default function Audio({ audioRef }) {
  const [volume, setVolume] = useState(() => {
    const vol = localStorage.getItem("volume");
    return vol !== null ? Number(vol) : 0.5;
  });

  const [hovered, setHovered] = useState(true);

  useEffect(() => {
    localStorage.setItem("volume", volume.toString());
    if (audioRef?.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, audioRef])



  return (
    <div
      className="fixed right-6 bottom-1/3 flex flex-col items-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <audio ref={audioRef} preload="auto" />

      <div className="relative flex flex-col items-center">
        <div
          className={`w-14 bg-neutral-800 rounded-full flex justify-center
        transition-all duration-300 overflow-hidden
        ${hovered ? "h-40" : "h-4"} `}
        >
          <input
            type="range"
            min={0}
            max={1}
            step={0.02}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="rotate-270 w-28 h-4/6 mt-2 pt-5 cursor-pointer rounded-sm"
          />
        </div>

        <div className="w-14 h-14 rounded-full bg-neutral-800 flex items-center justify-center cursor-pointer -mt-10 z-10">
          <Music className="text-white" />
        </div>
      </div>
    </div>


  )
}