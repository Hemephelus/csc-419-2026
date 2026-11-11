import { Speaker } from "lucide-react";
import { useState } from "react";

export function PlayPauseButton() {
  const [isPlaying, setIsPlaying] = useState(true);

  return (
    <button onClick={() => setIsPlaying(!isPlaying)}>
      {isPlaying ? "⏸ Pause" : "▶ Play"} {isPlaying && <Speaker />}
    </button>
  );
}
