import { useEffect, RefObject } from "react";

// ✅ เพิ่ม generic T ที่ extends HTMLElement
export function useGlobalKeySound<T extends HTMLElement = HTMLElement>(
  inputRef?: RefObject<T>
) {
  useEffect(() => {
    const sounds = [1, 2, 3].map((i) => {
      const padded = i.toString().padStart(2, "0");
      const audio = new Audio(`${import.meta.env.BASE_URL}assets/sounds/ui_hacking_charenter_${padded}.wav`);
      audio.load();
      return audio;
    });

    const handleKeyDown = (event: KeyboardEvent) => {
      if (inputRef && document.activeElement !== inputRef.current) return;

      if (event.key.length === 1 || event.key === "Backspace" || event.key === "Enter") {
        const clone = sounds[Math.floor(Math.random() * sounds.length)].cloneNode() as HTMLAudioElement;
        clone.volume = 0.2;
        clone.play();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [inputRef]);
}
