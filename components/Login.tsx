"use client";
import { useState } from "react";
import Avatar from "./Avatar";
import { api, saveSession, type PublicUser, type Session } from "@/lib/api";

export default function Login({
  users,
  onLogin,
}: {
  users: PublicUser[];
  onLogin: (s: Session) => void;
}) {
  const [pick, setPick] = useState<PublicUser | null>(null);
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  const firstTime = pick && !pick.hasPassword;

  async function doLogin() {
    if (!pick) return;
    setBusy(true); setErr("");
    try {
      await api.login(pick.id, password);
      const s: Session = { id: pick.id, name: pick.name, avatar: pick.avatar, password };
      saveSession(s);
      onLogin(s);
    } catch (e: any) {
      setErr(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="app">
      <div className="login-wrap">
        <div className="hero">
          <div className="big-cup">🏆</div>
          <h1>מונדיאל 2026</h1>
          <p>ניחושים · דגלים · גאוגרפיה · הידעת</p>
        </div>

        <div className="glass pad slide-up">
          <label>מי משחק?</label>
          <div className="who-grid">
            {users.map((u) => (
              <div
                key={u.id}
                className={`who ${pick?.id === u.id ? "active" : ""}`}
                onClick={() => { setPick(u); setErr(""); }}
              >
                <Avatar src={u.avatar} size={84} ring={pick?.id === u.id} />
                <span className="nm">{u.name}</span>
              </div>
            ))}
          </div>

          {pick && (
            <div className="slide-up" style={{ marginTop: 16, display: "grid", gap: 12 }}>
              <div>
                <label>{firstTime ? `שלום ${pick.name}! בחרו סיסמה אישית 🔐` : "הסיסמה שלך"}</label>
                <input
                  type="password"
                  inputMode="text"
                  placeholder={firstTime ? "סיסמה חדשה (לפחות 3 תווים)" : "הקלידו סיסמה"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && doLogin()}
                  autoFocus
                />
              </div>
              {err && <div className="error">{err}</div>}
              <button className="btn full" onClick={doLogin} disabled={busy}>
                {busy ? "רגע…" : firstTime ? "יצירה וכניסה 🚀" : "כניסה ⚽"}
              </button>
              {firstTime && (
                <p className="note center">בכניסה הראשונה הסיסמה שתבחרו נשמרת — בפעם הבאה תיכנסו איתה.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
