"use client";
import React from "react";

interface ChartFormProps {
  onSendMessage: (message: string) => void;
  onTyping: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
}

function ChatForm({ onSendMessage, onTyping }: ChartFormProps) {
  const [message, setMessage] = React.useState<string>("");
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    fileInputRef.current?.click();
  };
  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMessage(e.target.value);
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        // Here you can handle the base64 string, e.g., send it to the server
        console.log("File uploaded:", base64String);
        onSendMessage(base64String);
        inputRef.current?.focus();
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() !== "" && inputRef.current) {
      onSendMessage(message);
      setMessage("");
      inputRef.current.focus();
    }
  };
  return (
    <form className="flex justify-between gap-2 mt-4">
      <input
        type="file"
        accept="image/*"
        style={{ display: "none" }}
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button
        type="submit"
        className=" flex items-center justify-center w-[10%] bg-gray-200 text-white rounded  hover:bg-gray-100 cursor-pointer"
        onClick={handleClick}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          height="24px"
          viewBox="0 -960 960 960"
          width="24px"
          fill="#2b7fff"
        >
          <path d="M480-480ZM200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h320v80H200v560h560v-320h80v320q0 33-23.5 56.5T760-120H200Zm40-160h480L570-480 450-320l-90-120-120 160Zm440-320v-80h-80v-80h80v-80h80v80h80v80h-80v80h-80Z" />
        </svg>
      </button>
      <textarea
        name="message"
        value={message}
        onChange={handleChange}
        onKeyUp={onTyping}
        ref={inputRef}
        className="w-[85%] border border-gray-300 rounded px-1 focus:outline-none"
        placeholder="Type your message here..."
      />
      <button
        type="submit"
        className=" flex items-center justify-center w-[12%] bg-blue-500 text-white rounded  hover:bg-blue-600 cursor-pointer"
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
