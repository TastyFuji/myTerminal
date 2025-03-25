import { useEffect, useRef, useState } from "react";

export function useTypingSound() {
  const audioPool = useRef<HTMLAudioElement[]>([]);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false); // ✅

  // ✅ รอ user interaction ครั้งแรกก่อนเปิดเสียง
  useEffect(() => {
    const enableSound = () => {
      setIsSoundEnabled(true);
      window.removeEventListener("click", enableSound);
      window.removeEventListener("keydown", enableSound);
    };

    window.addEventListener("click", enableSound);
    window.addEventListener("keydown", enableSound);

    return () => {
      window.removeEventListener("click", enableSound);
      window.removeEventListener("keydown", enableSound);
    };
  }, []);

  // ✅ preload เสียงเมื่อ component mount
  useEffect(() => {
    if (audioPool.current.length === 0) {
      const sounds = [1, 2, 3].map((i) => {
        const padded = i.toString().padStart(2, "0");
        const audio = new Audio(`${import.meta.env.BASE_URL}assets/sounds/ui_hacking_charenter_${padded}.wav`);
        audio.load();
        return audio;
      });
      audioPool.current = sounds;
    }
  }, []);

  const playTypingSound = () => {
    if (!isSoundEnabled) return; // ❗ ไม่ให้เล่นจนกว่าจะ interact ก่อน
    const sounds = audioPool.current;
    const sound = sounds[Math.floor(Math.random() * sounds.length)];
    const clone = sound.cloneNode() as HTMLAudioElement;
    clone.volume = 0.05;
    clone.play().catch(() => {}); // ป้องกัน error โผล่ใน console
  };

  return { playTypingSound };
}
