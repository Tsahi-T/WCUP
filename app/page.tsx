"use client";
import { useCallback, useEffect, useState } from "react";
import Avatar from "@/components/Avatar";
import Login from "@/components/Login";
import Predictions from "@/components/Predictions";
import FlagsQuiz from "@/components/FlagsQuiz";
import GeoQuiz from "@/components/GeoQuiz";
import TriviaQuiz from "@/components/TriviaQuiz";
import Leaderboard from "@/components/Leaderboard";
import Manage from "@/components/Manage";
import { api, getState, loadSession, saveSession, type FullState, type Session } from "@/lib/api";

type Tab = "predict" | "flags" | "geo" | "trivia" | "board" | "more";

const TABS: { id: Tab; ico: string; label: string }[] = [
  { id: "predict", ico: "🔮", label: "ניחושים" },
  { id: "flags", ico: "🚩", label: "דגלים" },
  { id: "geo", ico: "🗺️", label: "גאוגרפיה" },
  { id: "trivia", ico: "🧠", label: "הידעת" },
  { id: "board", ico: "🏆", label: "טבלה" },
  { id: "more", ico: "⚙️", label: "עוד" },
];

export default function Home() {
  const [state, setState] = useState<FullState | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [tab, setTab] = useState<Tab>("predict");
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    const s = await getState();
    setState(s);
    return s;
  }, []);

  useEffect(() => {
    (async () => {
      const s = await refresh();
      const sess = loadSession();
      // ודא שהמשתמש השמור עדיין קיים
      if (sess && s.users.some((u) => u.id === sess.id)) setSession(sess);
      setReady(true);
    })();
  }, [refresh]);

  const me = state?.users.find((u) => u.id === session?.id);

  async function addScore(points: number) {
    if (!session || points <= 0) { refresh(); return; }
    try { await api.score(session, points); } catch {}
    refresh();
  }

  function logout() { saveSession(null); setSession(null); setTab("predict"); }

  function setAvatar(a: string) {
    if (!session) return;
    const next = { ...session, avatar: a };
    setSession(next); saveSession(next);
  }

  if (!ready) {
    return <div className="app center" style={{ marginTop: "40vh" }}><div className="big-cup" style={{ fontSize: 54 }}>🏆</div></div>;
  }

  if (!state || !session || !me) {
    return <Login users={state?.users || []} onLogin={(s) => { setSession(s); refresh(); }} />;
  }

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand">
          <span className="cup">🏆</span>
          <div>
            <h1>מונדיאל 2026</h1>
            <small>משחק המשפחה</small>
          </div>
        </div>
        <div className="me" onClick={() => setTab("more")} style={{ cursor: "pointer" }}>
          <div style={{ textAlign: "left" }}>
            <div className="name">{me.name}</div>
            <div className="pts">⭐ {me.total} נק׳</div>
          </div>
          <Avatar src={session.avatar} size={44} ring />
        </div>
      </div>

      {tab === "predict" && <Predictions state={state} session={session} onChanged={refresh} />}
      {tab === "flags" && <FlagsQuiz onScore={addScore} />}
      {tab === "geo" && <GeoQuiz onScore={addScore} />}
      {tab === "trivia" && <TriviaQuiz onScore={addScore} />}
      {tab === "board" && <Leaderboard state={state} meId={me.id} />}
      {tab === "more" && (
        <Manage state={state} session={session} onChanged={refresh} onLogout={logout} onAvatar={setAvatar} />
      )}

      <nav className="tabbar">
        {TABS.map((t) => (
          <button key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            <span className="ti">{t.ico}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
