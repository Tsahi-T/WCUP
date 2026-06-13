"use client";
import Avatar from "./Avatar";
import { type FullState } from "@/lib/api";

const MEDALS = ["🥇", "🥈", "🥉"];

export default function Leaderboard({ state, meId, onHome }: { state: FullState; meId: string; onHome?: () => void }) {
  const sorted = [...state.users].sort((a, b) => b.total - a.total);
  const top = sorted[0]?.total || 0;
  return (
    <div>
      <div className="screen-title">
        {onHome && <button className="back-btn" onClick={onHome} aria-label="חזרה">→</button>}
        <span className="ico">🏆</span>
        <div><h2>טבלת האלופים</h2><p>מטבעות 🪙 מניחושים ומשחקי הידע</p></div>
      </div>
      <div className="board">
        {sorted.map((u, idx) => (
          <div key={u.id} className={`row ${idx === 0 && top > 0 ? "gold" : ""} slide-up`}>
            <span className="rank">{MEDALS[idx] ? <span className="medal">{MEDALS[idx]}</span> : idx + 1}</span>
            <Avatar src={u.avatar} size={50} ring={u.id === meId} />
            <div className="info">
              <div className="n">{u.name}{u.id === meId ? " (אני)" : ""}{u.admin ? " 👑" : ""}</div>
              <div className="b">🔮 ניחושים {u.predictionScore} · 🧠 ידע {u.quizScore}</div>
            </div>
            <span className="tot">{u.total} <span style={{ fontSize: 18 }}>🪙</span></span>
          </div>
        ))}
      </div>
    </div>
  );
}
