"use client";
import { useEffect, useState } from "react";
import { COUNTRIES, type Country } from "@/lib/data";
import Confetti from "./Confetti";
import Timer from "./Timer";

const GAME_SECONDS = 30;
const OPT = "אבגד";

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

type Q = { country: Country; options: Country[]; correct: number };

function makeQuestion(): Q {
  const country = COUNTRIES[Math.floor(Math.random() * COUNTRIES.length)];
  const others = shuffle(COUNTRIES.filter((c) => c.name !== country.name)).slice(0, 3);
  const options = shuffle([country, ...others]);
  return { country, options, correct: options.findIndex((o) => o.name === country.name) };
}

export default function FlagsQuiz({ onScore, onHome }: { onScore: (pts: number) => void; onHome: () => void }) {
  const [phase, setPhase] = useState<"intro" | "play" | "done">("intro");
  const [q, setQ] = useState<Q>(() => makeQuestion());
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [confetti, setConfetti] = useState(0);
  const [runKey, setRunKey] = useState(0);

  function start() {
    setScore(0); setAnswered(0); setPicked(null); setQ(makeQuestion());
    setRunKey((k) => k + 1); setPhase("play");
  }

  function choose(idx: number) {
    if (picked !== null) return;
    setPicked(idx);
    const ok = idx === q.correct;
    if (ok) { setScore((s) => s + 1); setConfetti((c) => c + 1); }
    setAnswered((n) => n + 1);
    setTimeout(() => { setPicked(null); setQ(makeQuestion()); }, 450);
  }

  function finish() {
    setPhase("done");
    onScore(score);
  }

  // הגנה: אם המסך נסגר באמצע
  useEffect(() => () => {}, []);

  if (phase === "intro") {
    return (
      <div>
        <BackTitle onHome={onHome} ico="🚩" title="דגלים" sub="תחרות מהירה — 30 שניות!" />
        <div className="glass pad result-card slide-up">
          <div style={{ fontSize: 64 }}>🚩⏱️</div>
          <h2>אתגר הדגלים</h2>
          <p className="note">יש לך <b>30 שניות</b> לזהות כמה שיותר דגלים. כל דגל נכון = מטבע 🪙</p>
          <button className="btn full" onClick={start}>יאללה, מתחילים! 🚀</button>
        </div>
      </div>
    );
  }

  if (phase === "done") {
    return (
      <div className="glass pad result-card slide-up">
        <div style={{ fontSize: 60 }}>{score >= 10 ? "🏆" : score >= 5 ? "🎉" : "💪"}</div>
        <h2>נגמר הזמן!</h2>
        <div className="score-big">{score} 🪙</div>
        <p className="note">ענית נכון על {score} מתוך {answered} דגלים</p>
        <div className="grid2">
          <button className="btn" onClick={start}>עוד פעם 🔁</button>
          <button className="btn ghost" onClick={onHome}>לדף הבית 🏠</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BackTitle onHome={onHome} ico="🚩" title="דגלים" sub={`ניקוד: ${score} 🪙`} />
      <Confetti fire={confetti} />
      <Timer seconds={GAME_SECONDS} onExpire={finish} resetKey={runKey} label="זמן" />
      <div className="spacer" />
      <div className="glass pad slide-up" key={answered}>
        <div className="quiz-flag pop">{q.country.flag}</div>
        <div className="options">
          {q.options.map((o, idx) => {
            let cls = "opt";
            if (picked !== null) {
              if (idx === q.correct) cls += " correct";
              else if (idx === picked) cls += " wrong";
            }
            return (
              <button key={idx} className={cls} disabled={picked !== null} onClick={() => choose(idx)}>
                <span className="badge">{OPT[idx]}</span>{o.name}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export function BackTitle({ onHome, ico, title, sub }: { onHome: () => void; ico: string; title: string; sub: string }) {
  return (
    <div className="screen-title">
      <button className="back-btn" onClick={onHome} aria-label="חזרה">→</button>
      <span className="ico">{ico}</span>
      <div><h2>{title}</h2><p>{sub}</p></div>
    </div>
  );
}
