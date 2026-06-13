"use client";
import Avatar from "./Avatar";
import { type FullState } from "@/lib/api";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Leaderboard({ state, meId }: { state: FullState; meId: string }) {
  const sorted = [...state.users].sort((a, b) => b.total - a.total);
  return (
    <div>
      <div className="screen-title">
        <span className="ico">🏆</span>
        <div><h2>טבלת האלופים</h2><p>מי המלך של המונדיאל המשפחתי?</p></div>
      </div>
      <div className="board">
        {sorted.map((u, idx) => (
          <div key={u.id} className={`row ${idx === 0 ? "gold" : ""} slide-up`}>
            <span className="rank">{MEDALS[idx] ? <span className="medal">{MEDALS[idx]}</span> : idx + 1}</span>
            <Avatar src={u.avatar} size={50} ring={u.id === meId} />
            <div className="info">
              <div className="n">{u.name}{u.id === meId ? " (אני)" : ""}</div>
              <div className="b">🔮 ניחושים {u.predictionScore} · 🧠 ידע {u.quizScore}</div>
            </div>
            <span className="tot">{u.total}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
