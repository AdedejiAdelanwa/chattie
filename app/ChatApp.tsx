"use client";
import React, { use, useEffect, useRef, useState } from "react";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import { socket } from "./lib/socketClient";

function ChatApp() {
  const [room, setRoom] = useState<string>("");
  const [joined, setJoined] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [messages, setMessages] = useState<
    { sender: string; message: string }[]
  >([]);
  const [typing, setTyping] = useState<string>("");
  const contentRef = useRef<HTMLDivElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState<boolean>(false);

  const handleJoinRoom = () => {
    if (room && username) {
      socket.emit("joinRoom", { room, username });
      setJoined(true);
    }
  };

  const handleExitRoom = () => {
    socket.emit("leaveRoom", { room, username });
    setMessages([]);
    setRoom("");
    setUsername("");
    setJoined(false);
  };
  const handleTyping = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    socket.emit("userTyping", { sender: username, room });

    setTimeout(() => {
      socket.emit("userStoppedTyping", { room });
    }, 6000);
  };
  const handleSendMessage = (message: string) => {
    const data = { room, message, sender: username };
    setMessages((prev) => [...prev, { sender: username, message }]);
    socket.emit("message", data);
  };

  useEffect(() => {
    socket.on("typing", (message) => {
      setTyping(message);
    });
    socket.on("userStoppedTyping", () => {
      setTyping("");
    });
    return () => {
      socket.off("typing");
      socket.off("userStoppedTyping");
    };
  }, [setTyping]);
  useEffect(() => {
    socket.on("joinRoom", (message) => {
      setMessages((prev) => [...prev, { sender: "system", message }]);
    });
    socket.on("message", (data) => {
      setMessages((prev) => [...prev, data]);
    });
    socket.on("leaveRoom", (message) => {
      setMessages((prev) => [...prev, { sender: "system", message }]);
    });
    return () => {
      socket.off("joinRoom");
      socket.off("message");
    };
  }, []);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const checkScrollPosition = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isNearBottom = scrollHeight - (scrollTop + clientHeight) < 50;
      setShowScrollButton(!isNearBottom);
    };
    checkScrollPosition();

    const observer = new MutationObserver(checkScrollPosition);

    observer.observe(container, {
      childList: true,
      subtree: true,
    });

    container.addEventListener("scroll", checkScrollPosition);
    window.addEventListener("resize", checkScrollPosition);

    return () => {
      observer.disconnect();
      container.removeEventListener("scroll", checkScrollPosition);
      window.removeEventListener("resize", checkScrollPosition);
    };

    // const handleScrollHeightChange = () => {
    //   const isAtBottom =
    //     container.scrollHeight - container.scrollTop === container.clientHeight;
    //   if (isAtBottom) {
    //     setScrollHeight(0);
    //     console.log("At the botom");
    //   } else {
    //     setScrollHeight(container.scrollHeight);
    //     //console.log(scrollHeight, container.scrollHeight);
    //     console.log(clientHeight);
    //   }
    // };

    // const observer = new MutationObserver(handleScrollHeightChange);

    // observer.observe(container, {
    //   childList: true,
    //   subtree: true,
    //   characterData: true,
    // });

    // handleScrollHeightChange();
    // return () => observer.disconnect();
  }, [messages]);
  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  };
  return (
    <div className="flex mt-24 justify-center w-full">
      {!joined ? (
        <div className="flex w-full max-w-3xl mx-auto flex-col items-center">
          <h1 className="mb-4 text-2xl font-bold">Chattie App </h1>
          <h2 className="mb-4 text-xl font-bold">Join A Room</h2>
          <input
            type="text"
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-64 px-4 py-2 mb-4 border-2 rounded-lg"
          />
          <input
            type="text"
            placeholder="Enter room name"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
            className="w-64 px-4 py-2 mb-4 border-2 rounded-lg"
          />
          <button
            onClick={handleJoinRoom}
            className="px-4 py-2 text-white bg-blue-500 rounded-lg cursor-pointer"
          >
            Join Room
          </button>
        </div>
      ) : (
        <div className="w-full max-w-3xl">
          <div className="flex justify-between items-center mb-4">
            <h1>Room: {room}</h1>
            <button
              onClick={handleExitRoom}
              className="bg-gray-100 hover:bg-gray-300 text-red-600 rounded px-2 py-1 cursor-pointer border border-red-600"
            >
              Exit Room
            </button>
          </div>

          <div
            ref={contentRef}
            className="relative h-[500px] overflow-y-auto border bg-gray-200 border-gray-300 rounded p-4"
          >
            {messages.map((message, i) => (
              <ChatMessage
                key={i}
                message={message.message}
                sender={message.sender}
                isOwnMessage={message.sender === username}
              />
            ))}
            {typing && <p className="text-[10px] text-gray-900">{typing}</p>}
            {/* check the bottom of the div is at the top or not at the bottom */}
            {showScrollButton && (
              <button
                type="button"
                className="absolute bottom-4 right-0 px-2 py-1 rounded-tl-lg rounded-bl-lg bg-gray-200 border-t-1 border-b-1 border-l-1 border-gray-300  cursor-pointer z-10"
                onClick={scrollToBottom}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="#2a7fff"
                >
                  <path d="m480-340 180-180-57-56-123 123-123-123-57 56 180 180Zm0 260q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                </svg>
              </button>
            )}
            <div ref={bottomRef} className="bg-inherit h-4" />
          </div>
          <ChatForm onTyping={handleTyping} onSendMessage={handleSendMessage} />
        </div>
      )}
    </div>
  );
}

export default ChatApp;
