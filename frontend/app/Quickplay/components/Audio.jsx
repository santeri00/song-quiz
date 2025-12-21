import { useRef } from "react";

export default function Audio({ audioRef }) {
  return <audio ref={audioRef} preload="auto" />
}