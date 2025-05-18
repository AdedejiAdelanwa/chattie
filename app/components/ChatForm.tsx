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
        className="w-[90%] border border-gray-300 rounded px-1 focus:outline-none"
        placeholder="Type your message here..."
      />
      <button
        type="submit"
        className=" flex items-center justify-center w-[7%] bg-blue-500 text-white rounded  hover:bg-blue-600 cursor-pointer"
        onClick={handleSubmit}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#e8eaed"
        >
          <path d="M120-160v-640l760 320-760 320Zm80-120 474-200-474-200v140l240 60-240 60v140Zm0 0v-400 400Z" />
        </svg>
      </button>
    </form>
  );
}

export default ChatForm;
