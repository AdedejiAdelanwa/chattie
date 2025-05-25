import React from "react";

interface ChatMessageProps {
  message: string;
  sender: string;
  timeStamp?: string;
  isOwnMessage: boolean;
  //   isSystemMessage: boolean;
}

function ChatMessage({
  sender,
  message,
  isOwnMessage,
  timeStamp,
}: ChatMessageProps) {
  const isSystemMessage = sender === "system";
  return (
    <div
      className={`flex ${
        isSystemMessage
          ? "justify-center"
          : isOwnMessage
          ? "justify-end"
          : "justify-start"
      } mb-3`}
    >
      <div
        className={`flex flex-col max-w-xs px-4 py-2 rounded-lg ${
          isSystemMessage
            ? "bg-gray-800 text-white text-xs"
            : isOwnMessage
            ? "bg-blue-500 text-white"
            : "bg-white text-black"
        }`}
      >
        {!isSystemMessage && <p className="text-sm font-bold">{sender}</p>}
        <p className="">{message}</p>
        {!isSystemMessage && (
          <small className="self-end text-gray-300 text-xs">{timeStamp}</small>
        )}
      </div>
    </div>
  );
}

export default ChatMessage;
