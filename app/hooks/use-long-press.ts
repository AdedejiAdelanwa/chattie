import { useRef, useState } from "react";

// interface LongPressHandlers {
//   onClick: (e: React.MouseEvent<Element, MouseEvent>) => void;
//   onMouseDown: () => void;
//   onMouseUp: () => void;
//   onTouchStart: () => void;
//   onTouchEnd: () => void;
// }

export default function useLongPress() {
  const [action, setAction] = useState<string>("");
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isLongPress = useRef<boolean | null>(null);

  const startPressTimer = () => {
    isLongPress.current = false;
    timerRef.current = setTimeout(() => {
      isLongPress.current = true;
      setAction("longpress");
    }, 500);
  };

  const handleOnClick = (e: React.MouseEvent<Element, MouseEvent>): void => {
    if (isLongPress.current) {
      console.log("It is a long press");
      return;
    }
    setAction("click");
    e.stopPropagation();
  };
  const handleOnMouseDown = (e: React.MouseEvent<Element, MouseEvent>) => {
    console.log("onMouseDOwn");
    startPressTimer();
    e.stopPropagation();
  };
  const handleOnMouseUp = (e: React.MouseEvent<Element, MouseEvent>) => {
    console.log("onMouseUp");
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    e.stopPropagation();
  };
  const handleOnTouchStart = (e: React.TouchEvent<Element>) => {
    console.log("onTouchStart");
    startPressTimer();
    e.stopPropagation();
  };
  const handleOnTouchEnd = (e: React.TouchEvent<Element>) => {
    if (action === "longpress") return;
    console.log("onTouchEnd");
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    e.stopPropagation();
  };

  return {
    action,
    setAction,
    handlers: {
      onClick: handleOnClick,
      onMouseDown: handleOnMouseDown,
      onMouseUp: handleOnMouseUp,
      onTouchStart: handleOnTouchStart,
      onTouchEnd: handleOnTouchEnd,
    },
  };
}
