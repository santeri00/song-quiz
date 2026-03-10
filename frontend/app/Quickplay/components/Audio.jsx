import { useEffect, useRef, useState, useCallback } from "react";
import { Volume2, VolumeX, Volume1 } from "lucide-react";

export default function Audio({ audioRef }) {
  const [volume, setVolume] = useState(() => {
    const vol = localStorage.getItem("volume");
    return vol !== null ? Number(vol) : 0.5;
  });
  const [hovered, setHovered] = useState(false);
  const [dragging, setDragging] = useState(false);
  const trackRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("volume", volume.toString());
    if (audioRef?.current) {
      audioRef.current.volume = volume;
    }
  }, [volume, audioRef]);

  const getVolumeFromPointer = useCallback((clientY) => {
    const track = trackRef.current;
    if (!track) return;
    const rect = track.getBoundingClientRect();
    const raw = 1 - (clientY - rect.top - 4) / (rect.height - 8);
    return Math.min(1, Math.max(0, raw));
  }, []);

  const handleTrackPointerDown = (e) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setDragging(true);
    setVolume(getVolumeFromPointer(e.clientY));
  };

  const handleTrackPointerMove = (e) => {
    if (!dragging) return;
    setVolume(getVolumeFromPointer(e.clientY));
  };

  const handleTrackPointerUp = () => setDragging(false);

  const VolumeIcon = volume === 0 ? VolumeX : volume < 0.5 ? Volume1 : Volume2;
  const isOpen = hovered || dragging;

  return (
    <div
      className="fixed right-6 bottom-1/3 flex flex-col items-center select-none"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <audio ref={audioRef} preload="auto" />

      <div className="relative flex flex-col items-center">
        <div
          className="flex justify-center items-end overflow-hidden transition-all duration-250"
          style={{
            height: isOpen ? 140 : 0,
            opacity: isOpen ? 1 : 0,
            marginBottom: isOpen ? 8 : 0,
            transition: "height 0.25s cubic-bezier(0.4,0,0.2,1), opacity 0.2s ease, margin-bottom 0.25s ease",
          }}
        >
          <div
            ref={trackRef}
            onPointerDown={handleTrackPointerDown}
            onPointerMove={handleTrackPointerMove}
            onPointerUp={handleTrackPointerUp}
            onPointerCancel={handleTrackPointerUp}
            className="relative w-7 h-30 rounded-full bg-neutral-800 cursor-pointer touch-none"
            style={{ height: 120 }}
          >
            <div
              className="absolute bottom-0 left-0 right-0 rounded-full bg-white"
              style={{
                height: `${volume * 100}%`,
                transition: dragging ? "none" : "height 0.1s ease",
              }}
            />

          </div>
        </div>

        {/* Icon button */}
        <div
          className="w-12 h-12 rounded-full bg-neutral-900 flex items-center justify-center cursor-pointer"
          onClick={() => setVolume(volume === 0 ? 0.5 : 0)}
        >
          <VolumeIcon size={20} className="text-white" />
        </div>
      </div>
    </div>
  );
}