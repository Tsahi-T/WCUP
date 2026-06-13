"use client";
import { useEffect, useRef, useState } from "react";

// טיימר ספירה לאחור. מפעיל onExpire כשמגיע ל-0. אתחול מחדש דרך resetKey.
export default function Timer({
  seconds,
  onExpire,
  resetKey,
  paused = false,
  label,
}: {
  seconds: number;
  onExpire: () => void;
  resetKey: any;
  paused?: boolean;
  label?: string;
}) {
  const [left, setLeft] = useState(seconds);
  const expireRef = useRef(onExpire);
  expireRef.current = onExpire;

  useEffect(() => {
    setLeft(seconds);
    if (paused) return;
    const id = setInterval(() => {
      setLeft((prev) => {
        if (prev <= 1) {
          clearInterval(id);
          expireRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey, seconds, paused]);

  const pct = Math.max(0, (left / seconds) * 100);
  const low = left <= Math.max(3, seconds * 0.2);
  const mm = Math.floor(left / 60);
  const ss = left % 60;
  const txt = seconds >= 60 ? `${mm}:${String(ss).padStart(2, "0")}` : `${left}`;

  return (
    <div className={`timer ${low ? "low" : ""}`}>
      <div className="timer-top">
        <span className="timer-label">{label || "זמן"}</span>
        <span className="timer-num">{txt}{seconds < 60 ? "″" : ""}</span>
      </div>
      <div className="timer-bar"><i style={{ width: `${pct}%` }} /></div>
    </div>
  );
}
