import { useState, useRef, useEffect } from "react";
import "../styles/terminal.css";
import HackingGame from "./HackingGame";

export default function Terminal() {
    const [output, setOutput] = useState<string[]>([
        "WELCOME TO ROCKEET MASHALL INDUSTRIES (TM) TERMINAL",
        "--------------------------------------------------",
        "[LoggedIn: Anonymous]",
        "Enter a command:",
    ]);
    const [command, setCommand] = useState<string>("");
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number>(-1);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [loginStep, setLoginStep] = useState<"none" | "username" | "password">("none");
    const [tempUsername, setTempUsername] = useState<string>("");
    const inputRef = useRef<HTMLInputElement>(null);

    const [isHacking, setIsHacking] = useState(false);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    const handleCommand = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            if (loginStep === "username") {
                setTempUsername(command);
                setOutput((prev) => [...prev, `Username: ${command}`, "Password: "]);
                setCommand("");
                setLoginStep("password");
                return;
            }
            if (loginStep === "password") {
                if (tempUsername === "fuji97" && command === "1234") {
                    setIsLoggedIn(true);
                    setOutput([
                        "WELCOME TO ROCKEET MASHALL INDUSTRIES (TM) TERMINAL",
                        "--------------------------------------------------",
                        "[LoggedIn: Fuji97]",
                        "Enter a command:"
                    ]);
                } else {
                    setOutput((prev) => [...prev, "Invalid username or password."]);
                }
                setCommand("");
                setLoginStep("none");
                return;
            }
            processCommand(command);
            setHistory((prev) => [...prev, command]);
            setHistoryIndex(-1);
            setCommand("");
        } else if (e.key === "ArrowUp") {
            if (history.length > 0 && historyIndex < history.length - 1) {
                setHistoryIndex((prev) => prev + 1);
                setCommand(history[history.length - 1 - historyIndex - 1] || "");
            }
        } else if (e.key === "ArrowDown") {
            if (historyIndex > 0) {
                setHistoryIndex((prev) => prev - 1);
                setCommand(history[history.length - historyIndex] || "");
            } else {
                setHistoryIndex(-1);
                setCommand("");
            }
        }
    };

    const processCommand = (cmd: string) => {
        let newOutput = [...output, `${isLoggedIn ? "fuji97> " : "> "} ${cmd}`];

        switch (cmd.toLowerCase()) {
            case "login":
                setLoginStep("username");
                newOutput.push("Username: ");
                break;
            case "help":
                newOutput.push("Available commands: HELP, LOGIN, ABOUT, CLEAR, HACK, EXIT");
                break;
            case "about":
                newOutput.push("This is a Fallout-style terminal built with React, TypeScript, and Bootstrap.");
                break;
            case "clear":
                setOutput([
                    "WELCOME TO ROCKEET MASHALL INDUSTRIES (TM) TERMINAL",
                    "--------------------------------------------------",
                    isLoggedIn ? "[LoggedIn: Fuji97]" : "[LoggedIn: Anonymous]",
                    "Enter a command:",
                ]);
                return;

            case "exit":
                newOutput.push("Shutting down...");
                setTimeout(() => {
                    setOutput([
                        "WELCOME TO ROCKEET MASHALL INDUSTRIES (TM) TERMINAL",
                        "--------------------------------------------------",
                        "[LoggedIn: Anonymous]",
                        "Enter a command:",
                    ]);
                    setIsLoggedIn(false);
                }, 2000);
                return;
            case "hack":
                newOutput.push("Initiating hacking protocol...");
                setIsHacking(true);
                return;
            default:
                newOutput.push("Command not recognized. Type 'HELP' for options.");
        }
        setOutput(newOutput);
    };

    return (
        <div className="d-flex align-items-center justify-content-center vh-100 w-100 bg-black position-fixed top-0 start-0">
            <div className="terminal border border-white p-3 w-100 h-100 text-white font-monospace shadow-lg position-relative">
                {isHacking ? (
                    <HackingGame onExit={() => setIsHacking(false)} />
                ) : (
                    <>
                        <pre className="overflow-auto h-100 m-4">{output.join("\n")}</pre>
                        <div className="position-absolute bottom-0 start-0 w-100 p-3">
                            <span className="command-symbol">{isLoggedIn ? "fuji97> " : "> "} </span>
                            <input
                                ref={inputRef}
                                className="bg-transparent border-0 text-white font-monospace w-75"
                                type="text"
                                value={command}
                                onChange={(e) => setCommand(e.target.value)}
                                onKeyDown={handleCommand}
                                autoFocus
                                style={{ outline: "none" }}
                            />
                        </div>
                    </>
                )}
            </div>
        </div>
    );

}
