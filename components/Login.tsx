"use client";
import { useState } from "react";
import Avatar from "./Avatar";
import { api, saveSession, type PublicUser, type Session } from "@/lib/api";

const EMOJIS = ["⚽", "🦁", "🐯", "🦅", "🐉", "🦊", "🐼", "🦄", "🔥", "⭐", "🚀", "👑", "😎", "🤩", "🐶", "🐱"];
const MAX_USERS = 20;

export default function Login({
  users,
  onLogin,
}: {
  users: PublicUser[];
  onLogin: (s: Session) => void;
}) {
  const [mode, setMode] = useState<"pick" | "register">("pick");
  const [pick, setPick] = useState<PublicUser | null>(null);
  const [password, setPassword] = useState("");
  const [err, setErr] = useState("");
  const [busy, setBusy] = useState(false);

  // שדות הרשמה
  const [regName, setRegName] = useState("");
  const [regPass, setRegPass] = useState("");
  const [regAvatar, setRegAvatar] = useState("⚽");

  const firstTime = pick && !pick.hasPassword;
  const full = users.length >= MAX_USERS;

  async function doLogin() {
    if (!pick) return;
    setBusy(true); setErr("");
    try {
      await api.login(pick.id, password);
      const s: Session = { id: pick.id, name: pick.name, avatar: pick.avatar, password, admin: pick.admin };
      saveSession(s); onLogin(s);
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  }

  async function doRegister() {
    setBusy(true); setErr("");
    try {
      const r = await api.register(regName, regPass, regAvatar);
      const s: Session = { id: r.user.id, name: r.user.name, avatar: r.user.avatar, password: regPass, admin: false };
      saveSession(s); onLogin(s);
    } catch (e: any) { setErr(e.message); } finally { setBusy(false); }
  }

  return (
    <div className="app">
      <div className="login-wrap">
        <div className="hero">
          <div className="big-cup">🏆</div>
          <h1>מונדיאל 2026</h1>
          <p>ניחושים · דגלים · גאוגרפיה · הידעת</p>
        </div>

        {mode === "pick" ? (
          <div className="glass pad slide-up">
            <label>מי משחק?</label>
            <div className="who-grid">
              {users.map((u) => (
                <div key={u.id} className={`who ${pick?.id === u.id ? "active" : ""}`} onClick={() => { setPick(u); setErr(""); }}>
                  <Avatar src={u.avatar} size={78} ring={pick?.id === u.id} />
                  <span className="nm">{u.name}{u.admin ? " 👑" : ""}</span>
                </div>
              ))}
              <div className="who" onClick={() => { setErr(""); setMode("register"); }}>
                <div className="avatar add-avatar" style={{ width: 78, height: 78 }}>＋</div>
                <span className="nm">שחקן חדש</span>
              </div>
            </div>

            {pick && (
              <div className="slide-up" style={{ marginTop: 16, display: "grid", gap: 12 }}>
                <div>
                  <label>{firstTime ? `שלום ${pick.name}! בחרו סיסמה אישית 🔐` : "הסיסמה שלך"}</label>
                  <input type="password" placeholder={firstTime ? "סיסמה חדשה (לפחות 3 תווים)" : "הקלידו סיסמה"}
                    value={password} onChange={(e) => setPassword(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && doLogin()} autoFocus />
                </div>
                {err && <div className="error">{err}</div>}
                <button className="btn full" onClick={doLogin} disabled={busy}>
                  {busy ? "רגע…" : firstTime ? "יצירה וכניסה 🚀" : "כניסה ⚽"}
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="glass pad slide-up" style={{ display: "grid", gap: 12 }}>
            <div className="screen-title" style={{ margin: 0 }}>
              <button className="back-btn" onClick={() => { setMode("pick"); setErr(""); }}>→</button>
              <span className="ico">🆕</span>
              <div><h2>שחקן חדש</h2><p>פתחו משתמש משלכם</p></div>
            </div>
            {full ? (
              <div className="error">הגענו למקסימום {MAX_USERS} שחקנים 🙃</div>
            ) : (
              <>
                <div style={{ display: "grid", gap: 8, justifyItems: "center" }}>
                  <Avatar src={regAvatar} size={84} ring />
                  <div className="chips">
                    {EMOJIS.map((e) => (
                      <span key={e} className={`chip ${regAvatar === e ? "active" : ""}`} onClick={() => setRegAvatar(e)}>{e}</span>
                    ))}
                  </div>
                </div>
                <div><label>השם שלי</label>
                  <input value={regName} onChange={(e) => setRegName(e.target.value)} placeholder="איך קוראים לך?" /></div>
                <div><label>סיסמה</label>
                  <input type="password" value={regPass} onChange={(e) => setRegPass(e.target.value)} placeholder="לפחות 3 תווים" /></div>
                {err && <div className="error">{err}</div>}
                <button className="btn full green" onClick={doRegister} disabled={busy}>
                  {busy ? "יוצר…" : "יצירת משתמש וכניסה 🚀"}
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
