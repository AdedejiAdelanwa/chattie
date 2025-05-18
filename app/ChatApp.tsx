"use client";
import React, { use, useEffect, useState } from "react";
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

  const handleJoinRoom = () => {
    if (room && username) {
      socket.emit("joinRoom", { room, username });
      setJoined(true);
    }
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
    return () => {
      socket.off("joinRoom");
      socket.off("message");
    };
  }, []);
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
        <div className="w-full max-w-3xl mx-auto">
          <h1>Room: {room}</h1>
          <div className="h-[500px] overflow-y-auto border bg-gray-200 border-gray-300 rounded p-4">
            {messages.map((message, i) => (
              <ChatMessage
                key={i}
                message={message.message}
                sender={message.sender}
                isOwnMessage={message.sender === username}
              />
            ))}
            {typing && <p className="text-[10px] text-gray-900">{typing}</p>}
          </div>
          <ChatForm onTyping={handleTyping} onSendMessage={handleSendMessage} />
        </div>
      )}
    </div>
  );
}

export default ChatApp;
