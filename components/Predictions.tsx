"use client";
import { useMemo, useState } from "react";
import Avatar from "./Avatar";
import { api, type FullState, type Match, type Session, type PublicUser } from "@/lib/api";

function fmtDate(iso: string) {
  try {
    const d = new Date(iso);
    return d.toLocaleString("he-IL", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
  } catch { return ""; }
}

function Stepper({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  return (
    <div className="stepper">
      <button onClick={() => onChange(Math.max(0, value - 1))} aria-label="הורד">−</button>
      <span className="val">{value}</span>
      <button onClick={() => onChange(Math.min(20, value + 1))} aria-label="הוסף">+</button>
    </div>
  );
}

function MatchCard({
  m, users, state, session, onChanged,
}: {
  m: Match; users: PublicUser[]; state: FullState; session: Session; onChanged: () => void;
}) {
  const mine = state.guesses[m.id]?.[session.id];
  const [a, setA] = useState(mine?.scoreA ?? 1);
  const [b, setB] = useState(mine?.scoreB ?? 1);
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);

  async function save() {
    setBusy(true);
    try {
      await api.guess(session, m.id, a, b);
      setSaved(true);
      setTimeout(() => setSaved(false), 1500);
      onChanged();
    } catch (e: any) { alert(e.message); }
    finally { setBusy(false); }
  }

  // תחזיות כל המשתתפים
  const predictors = users
    .map((u) => ({ u, g: state.guesses[m.id]?.[u.id] }))
    .filter((x) => x.g);

  function winnerLabel(g: { scoreA: number; scoreB: number }) {
    if (g.scoreA > g.scoreB) return m.flagA;
    if (g.scoreB > g.scoreA) return m.flagB;
    return "🤝";
  }

  const status = m.finished ? "done" : "live";

  return (
    <div className="glass pad match slide-up">
      <div className="meta">
        <span className="tag">{m.stage}</span>
        {m.finished
          ? <span className="tag done">הסתיים ✓</span>
          : <span className="tag live">פתוח לניחוש · {fmtDate(m.date)}</span>}
      </div>

      <div className="teams">
        <div className="team">
          <span className="fl">{m.flagA}</span>
          <span className="tn">{m.teamA}</span>
        </div>
        {m.finished
          ? <span className="final-score">{m.scoreA} : {m.scoreB}</span>
          : <span className="vs">VS</span>}
        <div className="team">
          <span className="fl">{m.flagB}</span>
          <span className="tn">{m.teamB}</span>
        </div>
      </div>

      {!m.finished && (
        <>
          <div className="guess-row">
            <div className="score-input"><Stepper value={a} onChange={setA} /></div>
            <span className="vs">:</span>
            <div className="score-input"><Stepper value={b} onChange={setB} /></div>
          </div>
          <button className={`btn ${saved ? "green" : ""} full sm`} onClick={save} disabled={busy}>
            {saved ? "נשמר! ✓" : mine ? "עדכון הניחוש שלי" : "שמירת ניחוש 🔮"}
          </button>
        </>
      )}

      <div className="predictors">
        {predictors.length === 0 && <span className="empty-pred">עדיין אין ניחושים — היו הראשונים! ⚡</span>}
        {predictors.map(({ u, g }) => (
          <div className="predictor" key={u.id} title={`${u.name}: ${g!.scoreA}-${g!.scoreB}`}>
            <Avatar src={u.avatar} size={26} />
            <span className="pl">{u.name}</span>
            <span className="wn">{winnerLabel(g!)}</span>
            <span className="pg">{g!.scoreA}-{g!.scoreB}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Predictions({
  state, session, onChanged,
}: {
  state: FullState; session: Session; onChanged: () => void;
}) {
  const sorted = useMemo(
    () => [...state.matches].sort((x, y) => Number(x.finished) - Number(y.finished) || x.date.localeCompare(y.date)),
    [state.matches]
  );
  return (
    <div>
      <div className="screen-title">
        <span className="ico">🔮</span>
        <div><h2>ניחושים</h2><p>נחשו את התוצאה — תוצאה מדויקת 3 נק׳, מנצח נכון 1 נק׳</p></div>
      </div>
      {sorted.map((m) => (
        <MatchCard key={m.id} m={m} users={state.users} state={state} session={session} onChanged={onChanged} />
      ))}
    </div>
  );
}
