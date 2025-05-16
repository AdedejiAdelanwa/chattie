"use client";
import React from "react";

interface ChartFormProps {
  onSendMessage: (message: string) => void;
  onTyping: (e: React.KeyboardEvent<HTMLInputElement>) => void;
}

function ChatForm({ onSendMessage, onTyping }: ChartFormProps) {
  const [message, setMessage] = React.useState<string>("");
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() !== "") {
      onSendMessage(message);
      setMessage("");
    }
  };
  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mt-4">
      <input
        type="text"
        value={message}
        onChange={handleChange}
        onKeyUp={onTyping}
        placeholder="Type your message here..."
        className="w-full border border-gray-300 rounded px-4 py-2 focus:outline-none"
      />
      <button
        type="submit"
        className="bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600"
      >
        Send
      </button>
    </form>
  );
}

export default ChatForm;
