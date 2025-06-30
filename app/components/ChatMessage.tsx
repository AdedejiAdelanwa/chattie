"use client";
import React, { useRef, useState } from "react";
import useLongPress from "../hooks/use-long-press";
interface ChatMessageProps {
  message: string;
  sender: string;
  messageId: string;
  username: string;
  index: string;
  timeStamp?: string;
  isOwnMessage: boolean;
  handleDeleteForMe?: (index: string) => void;
  handleDeleteForAll?: (sender: string, messageId: string) => void;
  //   isSystemMessage: boolean;
}

function ChatMessage({
  sender,
  username,
  message,
  messageId,
  index,
  isOwnMessage,
  timeStamp,
  handleDeleteForMe,
  handleDeleteForAll,
}: ChatMessageProps) {
  const isSystemMessage = sender === "system";
  const { action, setAction, handlers } = useLongPress();
  const [isDeleteClicked, setIsDeleteClicked] = useState<boolean>(false);

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
        {...handlers}
        className={` flex flex-col max-w-xs px-4 py-2 rounded-lg ${
          isSystemMessage
            ? "bg-gray-800 text-white text-xs"
            : isOwnMessage
            ? "bg-blue-500 text-white"
            : "bg-white text-black"
        }`}
      >
        {!isSystemMessage && <p className="text-sm font-bold">{sender}</p>}
        {message.startsWith("data:image/") ? (
          <img
            src={message}
            alt="chat image"
            style={{ borderRadius: "8px", maxWidth: "200px" }}
          />
        ) : (
          <p
            className={`${
              message === "message deleted"
                ? "italic font-light text-gray-300"
                : ""
            } `}
          >
            {message}
          </p>
        )}

        {!isSystemMessage && (
          <small className="self-end text-gray-300 text-xs">{timeStamp}</small>
        )}
      </div>
      {action === "longpress" && (
        <div
          onClick={(e) => {
            setAction("click");
            e.stopPropagation();
            setIsDeleteClicked(!isDeleteClicked);
          }}
          className="absolute top-0 w-[100%] h-[100%] bg-[rgba(0,0,0,.3)] z-40"
        >
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="absolute w-[120px] top-[10%] right-[5%]  max-h-[300px] scroll-auto p-2 bg-red-200 text-black rounded-sm z-50"
          >
            {sender === username && (
              <div
                onClick={() => {
                  setIsDeleteClicked(() => !isDeleteClicked);
                }}
                className="relative bg-[inherit] w-full cursor-pointer text-[inherit] px-2 py-1 rounded mb-2 hover:bg-white hover:text-red-500  transition-colors duration-200"
                title="Delete message"
                aria-label="Delete message"
              >
                Delete
                {isDeleteClicked && (
                  <div className="absolute flex flex-col px-2 py-1 left-[-130%] bg-red-400 text-white rounded">
                    <button
                      className="cursor-pointer px-1 border-b-[0.3px] transition-colors duration-200 hover:bg-white hover:text-red-500 "
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteForMe && handleDeleteForMe(index);
                        console.log("...for me");
                      }}
                    >
                      Delete for me
                    </button>

                    <button
                      className="cursor-pointer px-1 border-b-[0.3px] transition-colors duration-200 hover:bg-white hover:text-red-500 "
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteForAll &&
                          handleDeleteForAll(sender, messageId);
                      }}
                    >
                      Delete for all
                    </button>
                  </div>
                )}
              </div>
            )}

            <p>Pin</p>
            <p>Copy & paste</p>
          </div>
        </div>
      )}
    </div>
  );
}
export default ChatMessage;
