import { useState, useEffect, useRef, RefObject } from "react";
import axios from "axios";
import "../styles/hacking.css";
import { useGlobalKeySound } from "../hooks/useGlobalKeySound";

const BASE_WORDS = [
  "HACK", "BACK", "PACK", "LACK", "TACK", "RACK",
  "CODE", "NODE", "MODE", "LODE", "BODE", "RODE",
  "DATA", "DATE", "DAME", "DICE", "DAZE", "DOTE",
  "MIND", "FIND", "KIND", "BIND", "WIND", "LINE"
];

const MAX_ATTEMPTS = 4;

function generateWordList() {
  const wordPatterns: { [key: string]: number } = {};
  const filteredWords: string[] = [];

  for (const word of BASE_WORDS) {
    const pattern = word.slice(1);
    if (!wordPatterns[pattern]) wordPatterns[pattern] = 0;
    if (wordPatterns[pattern] < 3) {
      filteredWords.push(word);
      wordPatterns[pattern]++;
    }
  }

  return filteredWords.sort(() => Math.random() - 0.5);
}

export default function HackingGame({ onExit, displayName, isLoggedIn, userId }: { onExit: () => void; displayName: string; isLoggedIn: boolean; userId: string }) {
  const [wordList, setWordList] = useState<string[]>([]);
  const [targetWord, setTargetWord] = useState("");
  const [attemptsLeft, setAttemptsLeft] = useState(MAX_ATTEMPTS);
  const [output, setOutput] = useState<string[]>([]);
  const [command, setCommand] = useState("");
  const [isSolved, setIsSolved] = useState<boolean>(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useGlobalKeySound(inputRef as RefObject<HTMLElement>);

  useEffect(() => {
    if (!isLoggedIn) {
      setOutput(["ACCESS DENIED - LOGIN REQUIRED", "Redirecting..."]);
      setTimeout(onExit, 2000);
      return;
    }

    // เช็คว่าผ่านเกมไปแล้วหรือยัง
    axios.post("http://localhost:3000/api/checkreward", { id: userId, game: "hacking-1" })
      .then(res => {
        if (res.data.passed) {
          setOutput(["You've already completed this hacking challenge.", "Redirecting..."]);
          setTimeout(onExit, 2000);
        } else {
          const newWordList = generateWordList();
          setWordList(newWordList);
          setTargetWord(newWordList[Math.floor(Math.random() * newWordList.length)]);
          setOutput([
            `LoggedIn: ${displayName}`,
            "=== HACKING INITIATED ===",
            "Guess the correct password!",
            formatWordList(newWordList),
            `Attempts remaining: ${MAX_ATTEMPTS}`,
            "Possible passwords:",
          ]);
        }
      })
      .catch(err => {
        console.error("Check reward error:", err);
        setOutput(["Server error. Please try again later."]);
        setTimeout(onExit, 2000);
      });
  }, [isLoggedIn, onExit, userId]);

  useEffect(() => {
    if (attemptsLeft <= 0) {
      setOutput((prev) => [...prev, "ACCESS DENIED!", "Exiting..."]);
      setTimeout(onExit, 2000);
    }
  }, [attemptsLeft, onExit]);

  function formatWordList(words: string[]) {
    let formatted = "";
    for (let i = 0; i < words.length; i++) {
      formatted += words[i].padEnd(10, " ") + " ";
      if ((i + 1) % 6 === 0) formatted += "\n";
    }
    return formatted.trim();
  }

  const countMatchingLetters = (guess: string, target: string) => {
    let matchCount = 0;
    for (let i = 0; i < target.length; i++) {
      if (guess[i] === target[i]) matchCount++;
    }
    return matchCount;
  };

  const handleCommand = async (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (command.trim() === "") return;
      const guess = command.toUpperCase();
      setCommand("");

      if (!wordList.includes(guess)) {
        setOutput((prev) => [...prev, `${displayName}> ${guess} - ✖ Invalid word! Choose from:\n${formatWordList(wordList)}`]);
        return;
      }

      if (guess === targetWord) {
        setOutput((prev) => [...prev, `${displayName}> ${guess} - ✔ ACCESS GRANTED!`]);
        setIsSolved(true);

        try {
          await axios.post("http://localhost:3000/api/addreward", { id: userId, game: "hacking-1" });
        } catch (err) {
          console.error("Failed to add reward:", err);
        }

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
          `${displayName}> ${guess} - ✖ ${matchingLetters}/4 letters correct`,
          `Attempts remaining: ${newAttempts}`,
        ];
      });
    }
  };

  return (
    <div className="hacking-container">
      <pre className="hacking-output">{output.join("\n")}</pre>
      <div className="input-line">
        <span>{displayName ? `${displayName}> ` : "> "}</span>
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
