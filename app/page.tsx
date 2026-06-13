"use client";
import { useCallback, useEffect, useState } from "react";
import Avatar from "@/components/Avatar";
import Login from "@/components/Login";
import Home from "@/components/Home";
import Schedule from "@/components/Schedule";
import FlagsQuiz from "@/components/FlagsQuiz";
import GeoQuiz from "@/components/GeoQuiz";
import TriviaQuiz from "@/components/TriviaQuiz";
import Leaderboard from "@/components/Leaderboard";
import Manage from "@/components/Manage";
import { api, getState, loadSession, saveSession, type FullState, type Session } from "@/lib/api";

type Tab = "home" | "schedule" | "flags" | "geo" | "trivia" | "board" | "manage";

export default function Home_Page() {
  const [state, setState] = useState<FullState | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [tab, setTab] = useState<Tab>("home");
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
      if (sess && s.users.some((u) => u.id === sess.id)) {
        // סנכרון הרשאת מנהל מהשרת
        const fresh = s.users.find((u) => u.id === sess.id)!;
        const merged = { ...sess, admin: fresh.admin };
        setSession(merged); saveSession(merged);
      }
      setReady(true);
    })();
  }, [refresh]);

  const me = state?.users.find((u) => u.id === session?.id);

  async function addScore(points: number) {
    if (!session || points <= 0) { refresh(); return; }
    try { await api.score(session, points); } catch {}
    refresh();
  }
  function logout() { saveSession(null); setSession(null); setTab("home"); }
  function setAvatar(a: string) {
    if (!session) return;
    const next = { ...session, avatar: a };
    setSession(next); saveSession(next);
  }
  const goHome = () => setTab("home");

  if (!ready) {
    return <div className="app center" style={{ marginTop: "40vh" }}><div className="big-cup" style={{ fontSize: 54 }}>🏆</div></div>;
  }
  if (!state || !session || !me) {
    return <Login users={state?.users || []} onLogin={(s) => { setSession(s); setTab("home"); refresh(); }} />;
  }

  const navTabs: { id: Tab; ico: string; label: string }[] = [
    { id: "home", ico: "🏠", label: "בית" },
    { id: "schedule", ico: "📅", label: "לוח" },
    { id: "board", ico: "🏆", label: "טבלה" },
    { id: "manage", ico: session.admin ? "🛠️" : "⚙️", label: session.admin ? "ניהול" : "פרופיל" },
  ];

  return (
    <div className="app">
      <div className="topbar">
        <div className="brand" onClick={goHome} style={{ cursor: "pointer" }}>
          <span className="cup">🏆</span>
          <div><h1>מונדיאל 2026</h1><small>משחק המשפחה</small></div>
        </div>
        <div className="me" onClick={() => setTab("manage")} style={{ cursor: "pointer" }}>
          <div style={{ textAlign: "left" }}>
            <div className="name">{me.name}{session.admin ? " 👑" : ""}</div>
            <div className="pts">🪙 {me.total} מטבעות</div>
          </div>
          <Avatar src={session.avatar} size={44} ring />
        </div>
      </div>

      {tab === "home" && <Home state={state} session={session} onNav={(t) => setTab(t as Tab)} />}
      {tab === "schedule" && <Schedule state={state} session={session} onChanged={refresh} />}
      {tab === "flags" && <FlagsQuiz onScore={addScore} onHome={goHome} />}
      {tab === "geo" && <GeoQuiz onScore={addScore} onHome={goHome} />}
      {tab === "trivia" && <TriviaQuiz onScore={addScore} onHome={goHome} />}
      {tab === "board" && <Leaderboard state={state} meId={me.id} onHome={goHome} />}
      {tab === "manage" && (
        <Manage state={state} session={session} onChanged={refresh} onLogout={logout} onAvatar={setAvatar} onHome={goHome} />
      )}

      <nav className="tabbar">
        {navTabs.map((t) => (
          <button key={t.id} className={`tab ${tab === t.id ? "active" : ""}`} onClick={() => setTab(t.id)}>
            <span className="ti">{t.ico}</span>
            <span>{t.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
}
