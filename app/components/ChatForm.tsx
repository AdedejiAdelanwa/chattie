"use client";
import React from "react";

interface ChartFormProps {
  onSendMessage: (message: string) => void;
  onTyping: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

function ChatForm({ onSendMessage, onTyping }: ChartFormProps) {
  const [message, setMessage] = React.useState<string>("");
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
    <form className="flex justify-between gap-2 mt-4">
      <textarea
        name="message"
        value={message}
        onChange={handleChange}
        onKeyUp={onTyping}
        className="w-[85%] border border-gray-300 rounded px-4 py-1 focus:outline-none"
        placeholder="Type your message here..."
      />
      <button
        type="submit"
        className="w-[15%] bg-blue-500 text-white rounded px-4 py-2 hover:bg-blue-600 cursor-pointer"
        onClick={handleSubmit}
      >
        Send
      </button>
    </form>
  );
}

export default ChatForm;
