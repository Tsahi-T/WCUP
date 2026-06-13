"use client";
import { useRef, useState } from "react";
import Avatar from "./Avatar";
import { api, type FullState, type Session } from "@/lib/api";
import { COUNTRIES } from "@/lib/data";

const EMOJIS = ["⚽", "🦁", "🐯", "🦅", "🐉", "🦊", "🐼", "🦄", "🔥", "⭐", "🚀", "👑", "😎", "🤩", "🐶", "🐱"];

function fileToAvatar(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        const size = 256;
        const canvas = document.createElement("canvas");
        canvas.width = size; canvas.height = size;
        const ctx = canvas.getContext("2d")!;
        const min = Math.min(img.width, img.height);
        ctx.drawImage(img, (img.width - min) / 2, (img.height - min) / 2, min, min, 0, 0, size, size);
        resolve(canvas.toDataURL("image/jpeg", 0.82));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export default function Manage({
  state, session, onChanged, onLogout, onAvatar, onHome,
}: {
  state: FullState; session: Session; onChanged: () => void;
  onLogout: () => void; onAvatar: (a: string) => void; onHome: () => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const isAdmin = !!session.admin;

  async function setAvatar(av: string) {
    try { await api.avatar(session, av); onAvatar(av); onChanged(); }
    catch (e: any) { alert(e.message); }
  }
  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0]; if (!f) return;
    try { const a = await fileToAvatar(f); await setAvatar(a); } catch { alert("לא הצלחתי לטעון את התמונה"); }
  }
  async function doSync() {
    setBusy(true);
    try {
      const r = await api.sync(session);
      onChanged();
      alert(r.updated ? `עודכנו ${r.updated} תוצאות מהאינטרנט ✓` : "לא נמצאו תוצאות חדשות כרגע. אפשר להזין ידנית למטה.");
    } catch (e: any) { alert("שליפה אוטומטית נכשלה: " + e.message + "\nאפשר להזין ידנית למטה."); }
    finally { setBusy(false); }
  }
  async function removeMatch(id: string, label: string) {
    if (!confirm(`למחוק את המשחק ${label}?`)) return;
    try { await api.deleteMatch(session, id); onChanged(); } catch (e: any) { alert(e.message); }
  }
  async function removeUser(id: string, name: string) {
    if (!confirm(`למחוק את השחקן ${name}? כל הניחושים שלו יימחקו.`)) return;
    try { await api.deleteUser(session, id); onChanged(); } catch (e: any) { alert(e.message); }
  }

  return (
    <div>
      {/* ===== פרופיל (לכולם) ===== */}
      <div className="screen-title">
        <button className="back-btn" onClick={onHome} aria-label="חזרה">→</button>
        <span className="ico">🙂</span>
        <div><h2>הפרופיל שלי</h2><p>בחרו תמונה או דמות</p></div>
      </div>
      <div className="glass pad slide-up" style={{ display: "grid", gap: 14, justifyItems: "center" }}>
        <Avatar src={session.avatar} size={96} ring />
        <div className="grid2" style={{ width: "100%" }}>
          <button className="btn sky sm" onClick={() => fileRef.current?.click()}>📷 העלאת תמונה</button>
          <button className="btn ghost sm" onClick={onLogout}>🚪 התנתקות</button>
        </div>
        <input ref={fileRef} type="file" accept="image/*" hidden onChange={onFile} />
        <div className="chips">
          {EMOJIS.map((e) => (
            <span key={e} className={`chip ${session.avatar === e ? "active" : ""}`} onClick={() => setAvatar(e)}>{e}</span>
          ))}
        </div>
      </div>

      {!isAdmin && (
        <>
          <div className="spacer" />
          <p className="note center">פעולות ניהול (תוצאות, משחקים ושחקנים) זמינות למנהל בלבד 👑</p>
        </>
      )}

      {isAdmin && (
        <>
          <div className="spacer" />
          {/* ===== תוצאות ===== */}
          <div className="screen-title"><span className="ico">🎯</span><div><h2>תוצאות 👑</h2><p>שליפה אוטומטית או הזנה ידנית</p></div></div>
          <div className="glass pad slide-up" style={{ display: "grid", gap: 12 }}>
            <button className="btn green full" onClick={doSync} disabled={busy}>
              {busy ? "שולף…" : "🔄 שליפת תוצאות מהאינטרנט"}
            </button>
            <p className="note center">אם משחק לא נמצא — הזינו ידנית:</p>
            {state.matches.map((m) => (
              <ResultRow key={m.id} m={m} session={session} onChanged={onChanged} onDelete={() => removeMatch(m.id, `${m.teamA}–${m.teamB}`)} />
            ))}
          </div>

          <div className="spacer" />
          <AddMatch session={session} onChanged={onChanged} />

          <div className="spacer" />
          {/* ===== שחקנים ===== */}
          <div className="screen-title"><span className="ico">👥</span><div><h2>שחקנים 👑</h2><p>{state.users.length} משחקים · עד 20</p></div></div>
          <div className="glass pad slide-up" style={{ display: "grid", gap: 8 }}>
            {state.users.map((u) => (
              <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 10, background: "rgba(0,0,0,.2)", borderRadius: 12, padding: "8px 10px" }}>
                <Avatar src={u.avatar} size={36} />
                <span style={{ flex: 1, fontWeight: 700 }}>{u.name}{u.admin ? " 👑" : ""}</span>
                <span className="note">{u.total} 🪙</span>
                {!u.admin && <button className="btn ghost sm" onClick={() => removeUser(u.id, u.name)}>🗑️</button>}
              </div>
            ))}
          </div>
        </>
      )}

      <div className="spacer" />
      <p className="note center">משחק משפחתי לכיף ולמידה · מונדיאל 2026 🏆</p>
    </div>
  );
}

function ResultRow({ m, session, onChanged, onDelete }: { m: any; session: Session; onChanged: () => void; onDelete: () => void }) {
  const [a, setA] = useState(m.scoreA ?? 0);
  const [b, setB] = useState(m.scoreB ?? 0);
  const [busy, setBusy] = useState(false);
  async function save() {
    setBusy(true);
    try { await api.result(session, m.id, a, b); onChanged(); }
    catch (e: any) { alert(e.message); }
    finally { setBusy(false); }
  }
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto auto auto auto", gap: 6, alignItems: "center", background: "rgba(0,0,0,.2)", borderRadius: 12, padding: "8px 10px" }}>
      <span style={{ fontSize: 12, fontWeight: 700 }}>{m.flagA} {m.teamA} – {m.teamB} {m.flagB}</span>
      <input style={{ width: 44, textAlign: "center", padding: 8 }} type="number" min={0} value={a} onChange={(e) => setA(Number(e.target.value))} />
      <span style={{ fontWeight: 900 }}>:</span>
      <input style={{ width: 44, textAlign: "center", padding: 8 }} type="number" min={0} value={b} onChange={(e) => setB(Number(e.target.value))} />
      <button className="btn sm" onClick={save} disabled={busy}>{m.finished ? "עדכון" : "שמירה"}</button>
      <button className="btn ghost sm" onClick={onDelete}>🗑️</button>
    </div>
  );
}

function AddMatch({ session, onChanged }: { session: Session; onChanged: () => void }) {
  const [teamA, setTeamA] = useState(COUNTRIES[0].name);
  const [teamB, setTeamB] = useState(COUNTRIES[1].name);
  const [date, setDate] = useState("");
  const [busy, setBusy] = useState(false);
  async function add() {
    if (teamA === teamB) { alert("בחרו שתי מדינות שונות"); return; }
    setBusy(true);
    try {
      await api.addMatch(session, teamA, teamB, date ? new Date(date).toISOString() : new Date().toISOString(), "שלב הבתים");
      setDate(""); onChanged();
    } catch (e: any) { alert(e.message); } finally { setBusy(false); }
  }
  return (
    <>
      <div className="screen-title"><span className="ico">➕</span><div><h2>הוספת משחק 👑</h2><p>הוסיפו מפגש חדש לניחושים</p></div></div>
      <div className="glass pad slide-up" style={{ display: "grid", gap: 10 }}>
        <div className="grid2">
          <div><label>קבוצה א׳</label>
            <select value={teamA} onChange={(e) => setTeamA(e.target.value)}>
              {COUNTRIES.map((c) => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
            </select></div>
          <div><label>קבוצה ב׳</label>
            <select value={teamB} onChange={(e) => setTeamB(e.target.value)}>
              {COUNTRIES.map((c) => <option key={c.name} value={c.name}>{c.flag} {c.name}</option>)}
            </select></div>
        </div>
        <div><label>תאריך ושעה (לא חובה)</label>
          <input type="datetime-local" value={date} onChange={(e) => setDate(e.target.value)} /></div>
        <button className="btn full sm" onClick={add} disabled={busy}>הוספת משחק ⚽</button>
      </div>
    </>
  );
}
