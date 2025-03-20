import { useState, useEffect } from "react";
import "../styles/loading.css";

export default function LoadingScreen({ onComplete }: { onComplete: () => void }) {
  const [displayText, setDisplayText] = useState("");
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState<"spec" | "loading">("spec");

  const specText = "ROCKEET MASHALL INDUSTRIES (TM) TERMINAL\n\n"+
  "\nSystem Information"+
  "\nOS: RocketOS v4.0"+
  "\nCPU: PowerBrain X100 500Mhz (1 Core)"+
  "\nMONITOR: CRT Monitor Version 4.5"+
  "\nRAM: 128 KB\n\n";
  const loadingText = "Initializing system..." + 
  "\nENCODING VERSION 12.1.0" + 
  "\nEXEC VERSION 35.1.2" + 
  "\nIIS VERSION 15.4.0" +
  "\nNETWORK VERSION 17.4.1" + 
  "\nConnecting to server..."+
  "\nLoading DATABASE..." + 
  "\nALL DONE" + 
  "\nPlease wait...\n";

  useEffect(() => {
    let text = phase === "spec" ? specText : loadingText;
    let interval: number = 0;

    if (index < text.length) {
      interval = window.setInterval(() => {
        setDisplayText((prev) => prev + text[index]);
        setIndex((prev) => prev + 1);
      }, 30);
    } else {
      clearInterval(interval);
      if (phase === "spec") {
        setTimeout(() => {
          setPhase("loading");
          setDisplayText("");
          setIndex(0);
        }, 1000);
      } else {
        setTimeout(onComplete, 3000);
      }
    }

    return () => clearInterval(interval);
  }, [index, phase, onComplete]);

  return (
    <div className="loading-screen border border-white">
      <div className="loading-content">
        <pre className="typewriter">{displayText}</pre>
      </div>
    </div>
  );
}
