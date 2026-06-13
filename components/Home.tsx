"use client";
import Avatar from "./Avatar";
import { type FullState, type Session } from "@/lib/api";

type Card = { tab: string; ico: string; title: string; sub: string; cls: string };

const CARDS: Card[] = [
  { tab: "schedule", ico: "📅", title: "לוח המשחקים", sub: "נחשו תוצאות וצברו מטבעות", cls: "c-sky" },
  { tab: "flags", ico: "🚩", title: "אתגר הדגלים", sub: "30 שניות — כמה תזהו?", cls: "c-red" },
  { tab: "geo", ico: "🗺️", title: "גאוגרפיה ומפות", sub: "בירות ויבשות", cls: "c-green" },
  { tab: "trivia", ico: "🧠", title: "הידעת? כדורגל", sub: "קוראים ועונים", cls: "c-purple" },
  { tab: "board", ico: "🏆", title: "טבלת האלופים", sub: "מי מוביל במטבעות?", cls: "c-gold" },
];

export default function Home({
  state, session, onNav,
}: {
  state: FullState; session: Session; onNav: (tab: string) => void;
}) {
  const me = state.users.find((u) => u.id === session.id);
  const upcoming = state.matches.filter((m) => !m.finished).length;

  return (
    <div>
      <div className="home-hero glass pad slide-up">
        <Avatar src={session.avatar} size={64} ring />
        <div style={{ flex: 1 }}>
          <div className="home-hi">שלום, {session.name}! {session.admin ? "👑" : "👋"}</div>
          <div className="home-sub">יש לך <b>{me?.total ?? 0}</b> מטבעות 🪙 · {upcoming} משחקים פתוחים לניחוש</div>
        </div>
      </div>

      <div className="spacer" />
      <div className="home-grid">
        {CARDS.map((c) => (
          <button key={c.tab} className={`home-card ${c.cls} slide-up`} onClick={() => onNav(c.tab)}>
            <span className="hc-ico">{c.ico}</span>
            <span className="hc-title">{c.title}</span>
            <span className="hc-sub">{c.sub}</span>
          </button>
        ))}
        {session.admin && (
          <button className="home-card c-admin slide-up" onClick={() => onNav("manage")}>
            <span className="hc-ico">🛠️</span>
            <span className="hc-title">ניהול</span>
            <span className="hc-sub">תוצאות, משחקים, שחקנים</span>
          </button>
        )}
      </div>

      <div className="spacer" />
      <p className="note center">מונדיאל 2026 🏆 · משחק העשרה לכל המשפחה</p>
    </div>
  );
}
