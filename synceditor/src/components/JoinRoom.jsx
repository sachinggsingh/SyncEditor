import { useEffect, useState, useRef, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import socketManager from "../socket";
import Sidebar from "./Sidebar/Sidebar";
import LanguageSelector from "./UI/LanguageSelector";
import RunButton from "./UI/RunButton";
import EditorPanel from "./EditorPannel/EditorPannel";
import Chat from "./Chat";

const DEBOUNCE_DELAY = 100;

const JoinRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { roomId, username } = location.state || {};

  const editorContainerRef = useRef(null);
  const debounceTimerRef = useRef(null);
  const typingEffectRef = useRef(null);

  const [code, setCode] = useState("// Start coding...");
  const [selectedLanguage, setSelectedLanguage] = useState("javascript");
  const [output, setOutput] = useState("");
  const [isRunning, setIsRunning] = useState(false);
  const [outputHeight, setOutputHeight] = useState(30);
  const [sidebarWidth, setSidebarWidth] = useState(20);
  const [isResizingSidebar, setIsResizingSidebar] = useState(false);
  const [isResizingOutput, setIsResizingOutput] = useState(false);
  const [users, setUsers] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [message, setMessage] = useState([]);

  // Socket event handlers
  const handleUserJoined = useCallback(
    ({ clients, username: joinedUsername }) => {
      setUsers(clients);
      if (joinedUsername !== username) {
        toast.success(`${joinedUsername} joined the room`);
      }
    },
    [username]
  );

  const handleUserLeft = useCallback(({ socketId, userName }) => {
    setUsers((prev) => prev.filter((user) => user.socketId !== socketId));
    toast.error(`${userName} left the room`);
  }, []);

  const handleUserDisconnected = useCallback(({ socketId, userName }) => {
    setUsers((prev) => prev.filter((user) => user.socketId !== socketId));
    toast.error(`${userName} disconnected`);
  }, []);

  const handleCodeChange = useCallback(
    ({ code: newCode, sender }) => {
      if (sender === username) {
        // Ignore echoes of our own changes
        return;
      }
      
      // Clear any pending debounce timer when receiving remote changes
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // For remote changes, update immediately without typing effect
      setCode(newCode);
    },
    [username]
  );

  // Initialize socket connection
  useEffect(() => {
    if (!roomId || !username) {
      navigate("/");
      return;
    }

    let isInitialConnection = true;

    // Connect to socket
    const socket = socketManager.connect();

    if (!socket) {
      toast.error("Failed to connect to server");
      navigate("/");
      return;
    }

    // Add connection event listeners
    socket.on('connect', () => {
      if (!isInitialConnection) {
        toast.success("Reconnected to server");
      } else {
        isInitialConnection = false;
      }
      setIsConnected(true);
    });

    socket.on('disconnect', (reason) => {
      if (reason !== 'io client disconnect') {
        toast.error("Disconnected from server");
      }
      setIsConnected(false);
    });

    socket.on('connect_error', () => {
      toast.error("Connection error. Retrying...");
    });

    // Setup event listeners
    socketManager.onUserJoined(handleUserJoined);
    socketManager.onUserLeft(handleUserLeft);
    socketManager.onUserDisconnected(handleUserDisconnected);
    socketManager.onCodeChange(handleCodeChange);

    // Handle messages
    socketManager.onMessage((messageData) => {
      setMessage((prev) => {
        // Check if message already exists to prevent duplicates
        const messageExists = prev.some(
          (msg) =>
            msg.sender === messageData.sender &&
            msg.message === messageData.message &&
            msg.time === messageData.time
        );

        if (!messageExists) {
          return [...prev, messageData];
        }
        return prev;
      });
    });

    // Join room
    socketManager.joinRoom(roomId, username);

    // Cleanup
    return () => {
      if (isConnected) {
        socketManager.leaveRoom(roomId, username);
        socketManager.removeAllListeners();
        socketManager.disconnect();
        setIsConnected(false);
        setUsers([]);
        setMessage([]); // Clear messages on disconnect
      }
    };
  }, [
    roomId,
    username,
    navigate,
    handleUserJoined,
    handleUserLeft,
    handleUserDisconnected,
    handleCodeChange,
    isConnected,
  ]);

  const handleMessage = (content) => {
    if (isConnected && roomId) {
      // Create message object
      const messageData = {
        message: content,
        sender: username,
        time: new Date().toLocaleTimeString("en-US", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
      };

      // Update local state first
      setMessage((prev) => [...prev, messageData]);

      // Send to server
      socketManager.emmitMessage(roomId, content, username);
    }
  };

  // Handle local code changes with debouncing
  const handleLocalCodeChange = useCallback(
    (value) => {
      // Update local state immediately
      setCode(value);

      // Clear existing timer
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      // Debounce the emission of changes
      debounceTimerRef.current = setTimeout(() => {
        if (isConnected && roomId) {
          socketManager.emitCodeChange(roomId, value, username, username);
        }
      }, DEBOUNCE_DELAY);
    },
    [roomId, isConnected, username]
  );

  // Handle code execution
  const handleRun = async () => {
    if (!code.trim()) {
      toast.error("Please write some code before running");
      return;
    }

    setIsRunning(true);
    setOutput("");

    try {
      const language =
        selectedLanguage === "typescript" ? "javascript" : selectedLanguage;
      const res = await fetch(import.meta.env.PISTON_API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          language,
          version: "*",
          files: [
            {
              content: code,
            },
          ],
          stdin: "",
          compile_timeout: 10000,
          run_timeout: 10000,
          compile_memory_limit: -1,
          run_memory_limit: -1,
        }),
      });

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();

      if (data.run?.output) {
        setOutput(data.run.output);
      } else if (data.compile?.output) {
        setOutput(data.compile.output);
      } else if (data.message) {
        setOutput(data.message);
      } else {
        setOutput("No output");
      }

      if (data.run?.code !== 0 || data.compile?.code !== 0) {
        toast.error("Code execution failed");
      } else {
        toast.success("Code executed successfully");
      }
    } catch (error) {
      console.error("Execution error:", error);
      setOutput(`Error: ${error.message}`);
      toast.error("Failed to execute code");
    } finally {
      setIsRunning(false);
    }
  };

  // Handle resizing
  const handleMouseMove = useCallback(
    (e) => {
      if (isResizingSidebar) {
        const newSidebarWidth = (e.clientX / window.innerWidth) * 100;
        if (newSidebarWidth > 10 && newSidebarWidth < 40) {
          setSidebarWidth(newSidebarWidth);
        }
      }

      if (isResizingOutput) {
        const editorHeight = editorContainerRef.current?.offsetHeight || 0;
        const fromBottom = window.innerHeight - e.clientY;
        const newOutputHeight = (fromBottom / editorHeight) * 100;
        if (newOutputHeight > 10 && newOutputHeight < 70) {
          setOutputHeight(newOutputHeight);
        }
      }
    },
    [isResizingSidebar, isResizingOutput]
  );

  const startSidebarResize = () => setIsResizingSidebar(true);
  const startOutputResize = () => setIsResizingOutput(true);
  const stopResize = useCallback(() => {
    setIsResizingSidebar(false);
    setIsResizingOutput(false);
  }, []);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", stopResize);
    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", stopResize);
    };
  }, [handleMouseMove, stopResize]);

  const handleLeaveRoom = useCallback(() => {
    if (isConnected) {
      socketManager.leaveRoom(roomId, username);
      socketManager.disconnect();
      setIsConnected(false);
      setUsers([]);
    }
    navigate("/");
  }, [roomId, username, navigate, isConnected]);

  return (
    <div className="flex h-screen overflow-hidden text-white bg-gray-900">
      <Sidebar
        roomId={roomId}
        users={users}
        onLeave={handleLeaveRoom}
        startSidebarResize={startSidebarResize}
        sidebarWidth={sidebarWidth}
      />

      <div className="flex flex-col flex-1">
        <div className="p-4 bg-gray-800 gap-4 border-b border-gray-700 flex  items-center">
          <LanguageSelector
            selectedLanguage={selectedLanguage}
            onChange={(e) => {
              const newLanguage = e.target.value;
              setSelectedLanguage(newLanguage);
              if (code === "// Start coding..." || !code.trim()) {
                const template = `// ${newLanguage} code example
${newLanguage === "python"
                    ? 'print("Hello, World!")'
                    : newLanguage === "java"
                      ? `public class Main {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}`
                      : newLanguage === "cpp"
                        ? `#include <iostream>

int main() {
    std::cout << "Hello, World!" << std::endl;
    return 0;
}`
                        : 'console.log("Hello, World!");'
                  }`;
                setCode(template);
              }
            }}
          />
          <RunButton isRunning={isRunning} onRun={handleRun} />
          <Chat
            messages={message}
            onSendMessage={handleMessage}
            userName={username}
          />
        </div>

        <div
          className="relative flex-1 h-[calc(100vh-4rem)]"
          ref={editorContainerRef}
        >
          <EditorPanel
            ref={typingEffectRef}
            code={code}
            selectedLanguage={selectedLanguage}
            onCodeChange={handleLocalCodeChange}
            output={output}
            outputHeight={outputHeight}
            onOutputResize={startOutputResize}
            isRunning={isRunning}
          />
        </div>
      </div>
    </div>
  );
};

export default JoinRoom;
