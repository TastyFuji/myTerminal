import { useState, useRef, useEffect, RefObject } from "react";
import axios from "axios";
import "../styles/terminal.css";
import HackingGame from "./HackingGame";
import { useGlobalKeySound } from "../hooks/useGlobalKeySound";

export default function Terminal() {
    const [output, setOutput] = useState<string[]>(["WELCOME TO ROCKEET MASHALL INDUSTRIES (TM) TERMINAL", "--------------------------------------------------", "[LoggedIn: Anonymous]", "Enter a command:"]);
    const [command, setCommand] = useState<string>("");
    const [history, setHistory] = useState<string[]>([]);
    const [historyIndex, setHistoryIndex] = useState<number>(-1);
    const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
    const [loginStep, setLoginStep] = useState<"none" | "username" | "password" | "displayName">("none");
    const [tempUsername, setTempUsername] = useState<string>("");
    const [tempPassword, setTempPassword] = useState<string>("");
    const [tempDisplayName, setTempDisplayName] = useState<string>("");
    const [isRegistering, setIsRegistering] = useState<boolean>(false);
    const inputRef = useRef<HTMLInputElement>(null);
    const [inputType, setInputType] = useState<"text" | "password">("text");
    const [isHacking, setIsHacking] = useState(false);
    const [userId, setUserId] = useState<string>("");

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    useGlobalKeySound(inputRef as RefObject<HTMLElement>);

    const handleCommand = async (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            if (loginStep === "username") {
                setTempUsername(command);
                setOutput((prev) => [...prev, `Username: ${command}`, "Password: "]);
                setCommand("");
                setLoginStep("password");
                setInputType("password");
                return;
            }
            if (loginStep === "password") {
                setTempPassword(command);
                setCommand("");
                setInputType("text");
                if (isRegistering) {
                    setLoginStep("displayName");
                    setOutput((prev) => [...prev, "Display Name: "]);
                    return;
                } else {
                    setLoginStep("none");
                    try {
                        const res = await axios.post("http://localhost:3000/api/login", {
                            username: tempUsername,
                            password: command
                        });
                        localStorage.setItem("token", res.data.token);
                        setTempDisplayName(res.data.user.displayName);
                        setIsLoggedIn(true);
                        setUserId(res.data.user.id);
                        setOutput(["WELCOME TO ROCKEET MASHALL INDUSTRIES (TM) TERMINAL", "--------------------------------------------------", `[LoggedIn: ${res.data.user.displayName}]`, "Enter a command:"]);
                    } catch (err: any) {
                        console.error("ERROR:", err.response?.data || err.message);
                        setOutput((prev) => [...prev, "Invalid username or password."]);
                    }
                    return;
                }
            }
            if (loginStep === "displayName") {
                setTempDisplayName(command);
                setCommand("");
                setLoginStep("none");
                try {
                    const res = await axios.post("http://localhost:3000/api/reg", {
                        username: tempUsername,
                        password: tempPassword,
                        displayName: command
                    });
                    console.log("✅ REGISTER SUCCESS", res.data);
                    setIsLoggedIn(true);
                    setUserId(res.data.user.id);
                    setOutput(["WELCOME TO ROCKEET MASHALL INDUSTRIES (TM) TERMINAL", "--------------------------------------------------", `[Registered & LoggedIn: ${command}]`, "Enter a command:"]);
                } catch (err: any) {
                    console.error("ERROR:", err.response?.data || err.message);
                    setOutput((prev) => [...prev, "Invalid username or password."]);
                }
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
        let newOutput = [...output, `${isLoggedIn ? `${tempDisplayName}>` : ">"} ${cmd}`];
        switch (cmd.toLowerCase()) {
            case "login":
                setLoginStep("username");
                setIsRegistering(false);
                newOutput.push("Username: ");
                break;
            case "register":
                setLoginStep("username");
                setIsRegistering(true);
                newOutput.push("Username: ");
                break;
            case "help":
                newOutput.push("Available commands: HELP, LOGIN, REGISTER, ABOUT, CLEAR, HACK, EXIT");
                break;
            case "about":
                newOutput.push("This is a Fallout-style terminal built with React, TypeScript, and Bootstrap.");
                break;
            case "clear":
                setOutput(["WELCOME TO ROCKEET MASHALL INDUSTRIES (TM) TERMINAL", "--------------------------------------------------", isLoggedIn ? `[LoggedIn: ${tempDisplayName}]` : "[LoggedIn: Anonymous]", "Enter a command:"]);
                return;
            case "exit":
                newOutput.push("Shutting down...");
                setTimeout(() => {
                    setOutput(["WELCOME TO ROCKEET MASHALL INDUSTRIES (TM) TERMINAL", "--------------------------------------------------", "[LoggedIn: Anonymous]", "Enter a command:"]);
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
                    <HackingGame
                    onExit={() => setIsHacking(false)}
                    isLoggedIn={isLoggedIn}
                    displayName={tempDisplayName}
                    userId={userId}
                  />
                ) : (
                    <>
                        <pre className="overflow-auto h-100 m-4">{output.join("\n")}</pre>
                        <div className="position-absolute bottom-0 start-0 w-100 p-3">
                            <span className="command-symbol">{isLoggedIn ? `${tempDisplayName}> ` : "> "}</span>
                            <input
                                ref={inputRef}
                                className="bg-transparent border-0 text-white font-monospace w-75"
                                type={inputType}
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
