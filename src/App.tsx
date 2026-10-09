import { Pause, Play } from "lucide-react";
import { Button } from "../components/ui/button";
import "./App.css";
import { useState } from "react";

function App() {
  // const [isPlaying, setIsPlaying] = useState(false);
  return (
    <>
      <PlayButton />
      {/* <Button variant={"default"} onClick={() => setIsPlaying(!isPlaying)}>
        {isPlaying ? <Pause size={10} /> : <Play size={10} />}
      </Button> */}
    </>
  );
}

export function PlayButton() {
  const [isPlaying, setIsPlaying] = useState(false);
  return <Button onClick={() => setIsPlaying(!isPlaying)}>{isPlaying ? <Pause /> : <Play />}</Button>;
}

export default App;
