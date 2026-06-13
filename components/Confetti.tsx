"use client";
import { useEffect, useState } from "react";

const COLORS = ["#ffd24a", "#25d07a", "#3ea7ff", "#ff5e9c", "#ff5252", "#fff"];

// מטר קונפטי קצר לחגיגת תשובה נכונה
export default function Confetti({ fire }: { fire: number }) {
  const [pieces, setPieces] = useState<number[]>([]);
  useEffect(() => {
    if (!fire) return;
    setPieces(Array.from({ length: 60 }, (_, i) => i));
    const t = setTimeout(() => setPieces([]), 2200);
    return () => clearTimeout(t);
  }, [fire]);

  if (!pieces.length) return null;
  return (
    <div className="confetti" aria-hidden>
      {pieces.map((i) => {
        const left = Math.random() * 100;
        const delay = Math.random() * 0.4;
        const dur = 1.4 + Math.random() * 1;
        const color = COLORS[i % COLORS.length];
        const w = 7 + Math.random() * 7;
        return (
          <i
            key={i}
            style={{
              left: `${left}%`,
              background: color,
              width: w,
              height: w * 1.4,
              animationDelay: `${delay}s`,
              animationDuration: `${dur}s`,
            }}
          />
        );
      })}
    </div>
  );
}
