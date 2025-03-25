import { useState, useEffect, useRef, RefObject } from "react";
import "../styles/hacking.css";
import { useGlobalKeySound } from "../hooks/useGlobalKeySound";

const BASE_WORDS = [
  "HACK", "BACK", "PACK", "LACK", "TACK", "RACK",
  "CODE", "NODE", "MODE", "LODE", "BODE", "RODE",
  "DATA", "DATE", "DAME", "DICE", "DAZE", "DOTE",
  "MIND", "FIND", "KIND", "BIND", "WIND", "LINE"
];

const MAX_ATTEMPTS = 4;

/**สุ่ม Word List โดยให้คำที่คล้ายกันไม่เกิน 3 คำ */
function generateWordList() {
  const wordPatterns: { [key: string]: number } = {}; // นับแพทเทิร์นที่ซ้ำกัน
  const filteredWords: string[] = [];
  

  for (const word of BASE_WORDS) {
    const pattern = word.slice(1); // ใช้ 3 ตัวสุดท้ายเป็นแพทเทิร์น (เช่น "ACK", "ODE")

    if (!wordPatterns[pattern]) {
      wordPatterns[pattern] = 0;
    }

    if (wordPatterns[pattern] < 3) {
      filteredWords.push(word);
      wordPatterns[pattern] += 1;
    }
  }

  return filteredWords.sort(() => Math.random() - 0.5); // ✅ สุ่มตำแหน่ง
}

export default function HackingGame({ onExit }: { onExit: () => void }) {
  const [wordList, setWordList] = useState<string[]>([]);
  const [targetWord, setTargetWord] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [output, setOutput] = useState<string[]>([]);
  const [command, setCommand] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  //เสียง
  useGlobalKeySound(inputRef as RefObject<HTMLElement>);

  useEffect(() => {
    const newWordList = generateWordList();
    setWordList(newWordList);
    setTargetWord(newWordList[Math.floor(Math.random() * newWordList.length)]);

    setOutput([
      "=== HACKING INITIATED ===",
      "Guess the correct password!",
      formatWordList(newWordList),
      `Attempts remaining: ${MAX_ATTEMPTS}`,
      "Possible passwords:",
    ]);
  }, []);

  useEffect(() => {
    if (attemptsLeft <= 0) {
      setOutput((prev) => [...prev, "ACCESS DENIED!", "Exiting..."]);
      setTimeout(onExit, 2000);
    }
  }, [attemptsLeft, onExit]);

  function formatWordList(words: string[]) {
    let formatted = "";
    for (let i = 0; i < words.length; i++) {
      formatted += words[i].padEnd(10, " ") + " "; // ✅ ป้องกันการแสดงผิดพลาด
      if ((i + 1) % 6 === 0) formatted += "\n";
    }
    return formatted.trim();
  }

  const countMatchingLetters = (guess: string, target: string) => {
    let matchCount = 0;
    for (let i = 0; i < target.length; i++) {
      if (guess[i] === target[i]) {
        matchCount++;
      }
    }
    return matchCount;
  };

  const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (command.trim() === "") return;
      const guess = command.toUpperCase();
      setCommand("");

      if (!wordList.includes(guess)) {
        setOutput((prev) => [...prev, `> ${guess} - ✖ Invalid word! Choose from:\n${formatWordList(wordList)}`]);
        return;
      }

      if (guess === targetWord) {
        setOutput((prev) => [...prev, `> ${guess} - ✔ ACCESS GRANTED!`]);
        setTimeout(onExit, 2000);
        return;
      }

      const matchingLetters = countMatchingLetters(guess, targetWord);
      const newAttempts = attemptsLeft - 1;
      setAttemptsLeft(newAttempts);

      setOutput((prevOutput) => {
        const filteredOutput = prevOutput.filter((line) => !line.startsWith("Attempts remaining:"));
        return [
          ...filteredOutput,
          `> ${guess} - ✖ ${matchingLetters}/4 letters correct`,
          `Attempts remaining: ${newAttempts}`,
        ];
      });
    }
  };

  return (
    <div className="hacking-container">
      <pre className="hacking-output">{output.join("\n")}</pre>
      <div className="input-line">
        <span>{"> "} </span>
        <input
          type="text"
          ref={inputRef}
          value={command}
          onChange={(e) => setCommand(e.target.value)}
          onKeyDown={handleCommand}
          autoFocus
          className="hacking-input"
        />
      </div>
    </div>
  );
}
