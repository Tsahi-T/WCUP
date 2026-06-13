"use client";
import { useState } from "react";
import { TRIVIA } from "@/lib/data";
import Confetti from "./Confetti";

const OPT = "אבגד";

function shuffleIdx(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export default function TriviaQuiz({ onScore }: { onScore: (pts: number) => void }) {
  const [order] = useState(() => shuffleIdx(TRIVIA.length));
  const [i, setI] = useState(0);
  const [reading, setReading] = useState(true); // שלב קריאת שלושת המשפטים
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [confetti, setConfetti] = useState(0);

  const total = order.length;
  const t = TRIVIA[order[i]];

  function choose(idx: number) {
    if (picked !== null) return;
    setPicked(idx);
    const ok = idx === t.answer;
    if (ok) { setScore((s) => s + 1); setConfetti((c) => c + 1); }
    setTimeout(() => {
      if (i + 1 < total) { setI(i + 1); setPicked(null); setReading(true); }
      else { setDone(true); onScore(ok ? score + 1 : score); }
    }, 1300);
  }

  function restart() { setI(0); setReading(true); setPicked(null); setScore(0); setDone(false); }

  if (done) {
    return (
      <div className="glass pad result-card slide-up">
        <div style={{ fontSize: 60 }}>{score >= total - 1 ? "🧠🏆" : score >= total / 2 ? "🎉" : "📚"}</div>
        <h2>סיימת את ההידעת!</h2>
        <div className="score-big">{score}/{total}</div>
        <p className="note">צברת {score} נקודות לטבלת האלופים</p>
        <button className="btn full" onClick={restart}>שוב 🔁</button>
      </div>
    );
  }

  return (
    <div>
      <Confetti fire={confetti} />
      <div className="screen-title">
        <span className="ico">🧠</span>
        <div><h2>הידעת? — כדורגל</h2><p>קוראים שלושה משפטים, ואז עונים</p></div>
      </div>
      <div className="progress"><i style={{ width: `${(i / total) * 100}%` }} /></div>

      <div className="glass pad slide-up" key={i}>
        <div className="facts">
          {t.facts.map((f, idx) => (
            <div className="fact" key={idx}><span className="num">{idx + 1}</span><span>{f}</span></div>
          ))}
        </div>

        {reading ? (
          <button className="btn full sky" onClick={() => setReading(false)}>הבנתי — לשאלה ➜</button>
        ) : (
          <>
            <h3 className="center" style={{ marginBottom: 12 }}>{t.question}</h3>
            <div className="options">
              {t.options.map((o, idx) => {
                let cls = "opt";
                if (picked !== null) {
                  if (idx === t.answer) cls += " correct";
                  else if (idx === picked) cls += " wrong";
                }
                return (
                  <button key={idx} className={cls} disabled={picked !== null} onClick={() => choose(idx)}>
                    <span className="badge">{OPT[idx]}</span>{o}
                  </button>
                );
              })}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
