"use client";
import React, { useEffect, useRef, useState } from "react";
import ChatForm from "./components/ChatForm";
import ChatMessage from "./components/ChatMessage";
import { socket } from "./lib/socketClient";

function ChatApp() {
  // ... (keep all existing state and handlers)

  const [showScrollButton, setShowScrollButton] = useState(false);
  const scrollDebounceRef = useRef<NodeJS.Timeout>();
  const lastScrollPosition = useRef(0);

  useEffect(() => {
    const container = contentRef.current;
    if (!container) return;

    const checkScrollPosition = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollHeight - (scrollTop + clientHeight) < 10;

      // Detect scroll direction
      const isScrollingDown = scrollTop > lastScrollPosition.current;
      lastScrollPosition.current = scrollTop;

      // Show button if not at bottom and either:
      // 1. New messages arrived (scrollHeight increased)
      // 2. User is scrolling up
      const shouldShow =
        !isAtBottom &&
        (!isScrollingDown || scrollHeight > container.scrollHeight);

      setShowScrollButton(shouldShow);
    };

    const handleAutoScroll = () => {
      clearTimeout(scrollDebounceRef.current);
      checkScrollPosition();

      const { scrollTop, scrollHeight, clientHeight } = container;
      const isAtBottom = scrollHeight - (scrollTop + clientHeight) < 100;

      if (isAtBottom) {
        scrollDebounceRef.current = setTimeout(() => {
          bottomRef.current?.scrollIntoView({ behavior: "smooth" });
        }, 100);
      }
    };

    // Set up observers and event listeners
    const observer = new MutationObserver(handleAutoScroll);
    observer.observe(container, { childList: true, subtree: true });

    container.addEventListener("scroll", checkScrollPosition);
    window.addEventListener("resize", checkScrollPosition);

    // Initial check
    checkScrollPosition();
    handleAutoScroll();

    return () => {
      observer.disconnect();
      container.removeEventListener("scroll", checkScrollPosition);
      window.removeEventListener("resize", checkScrollPosition);
      clearTimeout(scrollDebounceRef.current);
    };
  }, [messages]);

  const scrollToBottom = () => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
    setShowScrollButton(false);
  };

  return (
    <div className="flex mt-24 justify-center w-full">
      {/* ... (keep your existing join room UI) */}

      {joined && (
        <div className="w-full max-w-3xl">
          {/* ... (keep your existing room header) */}

          <div
            ref={contentRef}
            className="relative h-[500px] overflow-y-auto border bg-gray-200 border-gray-300 rounded p-4"
          >
            {/* ... (keep your messages rendering) */}

            {showScrollButton && (
              <div className="fixed bottom-24 right-4 md:right-8 z-50">
                <button
                  onClick={scrollToBottom}
                  className="p-3 bg-blue-500 hover:bg-blue-600 rounded-full shadow-lg transition-all duration-300"
                  aria-label="Scroll to bottom"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="white"
                  >
                    <path d="M16 13l-4 4-4-4M12 16V8" />
                  </svg>
                </button>
              </div>
            )}

            <div ref={bottomRef} />
          </div>

          <ChatForm onTyping={handleTyping} onSendMessage={handleSendMessage} />
        </div>
      )}
    </div>
  );
}

export default ChatApp;
