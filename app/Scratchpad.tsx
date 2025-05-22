// "use client";
// import React, { useEffect, useRef, useState } from "react";

// function ChatApp() {
//   // ... (other existing state and handlers)

//   const contentRef = useRef<HTMLDivElement>(null);
//   const bottomRef = useRef<HTMLDivElement>(null);
//   const [showScrollButton, setShowScrollButton] = useState(false);
//   const isAutoScrolling = useRef(false);
//   const userHasScrolledUp = useRef(false);

//   useEffect(() => {
//     const container = contentRef.current;
//     if (!container) return;

//     const checkScrollPosition = () => {
//       if (isAutoScrolling.current) {
//         isAutoScrolling.current = false;
//         return;
//       }

//       const { scrollTop, scrollHeight, clientHeight } = container;
//       const distanceFromBottom = scrollHeight - (scrollTop + clientHeight);
//       const isNearBottom = distanceFromBottom < 50;

//       // User has scrolled up if not near bottom
//       userHasScrolledUp.current = !isNearBottom;
//       setShowScrollButton(userHasScrolledUp.current);
//     };

//     const scrollToBottom = () => {
//       if (!bottomRef.current) return;

//       isAutoScrolling.current = true;
//       bottomRef.current.scrollIntoView({
//         behavior: "smooth",
//         block: "end",
//       });
//     };

//     const handleNewMessages = () => {
//       // Only auto-scroll if user hasn't manually scrolled up
//       if (!userHasScrolledUp.current) {
//         scrollToBottom();
//       }
//       checkScrollPosition();
//     };

//     // Set up MutationObserver to detect new messages
//     const observer = new MutationObserver(handleNewMessages);
//     observer.observe(container, {
//       childList: true,
//       subtree: true,
//       characterData: true,
//     });

//     // Set up event listeners
//     container.addEventListener("scroll", checkScrollPosition);
//     window.addEventListener("resize", checkScrollPosition);

//     // Initial check and scroll to bottom
//     checkScrollPosition();
//     scrollToBottom();

//     return () => {
//       observer.disconnect();
//       container.removeEventListener("scroll", checkScrollPosition);
//       window.removeEventListener("resize", checkScrollPosition);
//     };
//   }, [messages]);

//   const handleManualScrollToBottom = () => {
//     userHasScrolledUp.current = false;
//     setShowScrollButton(false);
//     if (bottomRef.current) {
//       bottomRef.current.scrollIntoView({
//         behavior: "smooth",
//         block: "end",
//       });
//     }
//   };

//   return (
//     <div className="chat-container">
//       {/* ... other existing JSX */}

//       <div ref={contentRef} className="message-container">
//         {/* ... messages rendering */}

//         {showScrollButton && (
//           <button
//             onClick={handleManualScrollToBottom}
//             className="scroll-to-bottom-button"
//           >
//             ↓ New Messages
//           </button>
//         )}

//         <div ref={bottomRef} className="scroll-anchor" />
//       </div>
//     </div>
//   );
// }
