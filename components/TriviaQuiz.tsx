"use client";
import { useState } from "react";
import { TRIVIA } from "@/lib/data";
import Confetti from "./Confetti";
import Timer from "./Timer";
import { BackTitle } from "./FlagsQuiz";

const OPT = "אבגד";
const READ_SECONDS = 120;   // שתי דקות לקריאה
const ANSWER_SECONDS = 120; // שתי דקות לתשובה

function shuffleIdx(n: number): number[] {
  const a = Array.from({ length: n }, (_, i) => i);
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

export default function TriviaQuiz({ onScore, onHome }: { onScore: (pts: number) => void; onHome: () => void }) {
  const [order] = useState(() => shuffleIdx(TRIVIA.length));
  const [i, setI] = useState(0);
  const [reading, setReading] = useState(true);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [confetti, setConfetti] = useState(0);

  const total = order.length;
  const t = TRIVIA[order[i]];

  function next(ok: boolean) {
    setTimeout(() => {
      if (i + 1 < total) { setI(i + 1); setPicked(null); setReading(true); }
      else { setDone(true); onScore(ok ? score + 1 : score); }
    }, 1300);
  }

  function choose(idx: number) {
    if (picked !== null) return;
    setPicked(idx);
    const ok = idx === t.answer;
    if (ok) { setScore((s) => s + 1); setConfetti((c) => c + 1); }
    next(ok);
  }

  function answerTimeout() {
    if (picked !== null) return;
    setPicked(-1); // נגמר הזמן ללא תשובה
    next(false);
  }

  if (done) {
    return (
      <div className="glass pad result-card slide-up">
        <div style={{ fontSize: 60 }}>{score >= total - 1 ? "🧠🏆" : score >= total / 2 ? "🎉" : "📚"}</div>
        <h2>סיימת את ההידעת!</h2>
        <div className="score-big">{score} 🪙</div>
        <p className="note">צברת {score} מטבעות לטבלת האלופים</p>
        <div className="grid2">
          <button className="btn" onClick={() => { setI(0); setReading(true); setPicked(null); setScore(0); setDone(false); }}>שוב 🔁</button>
          <button className="btn ghost" onClick={onHome}>לדף הבית 🏠</button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <BackTitle onHome={onHome} ico="🧠" title="הידעת? — כדורגל" sub={`שאלה ${i + 1} מתוך ${total}`} />
      <Confetti fire={confetti} />

      {reading ? (
        <Timer seconds={READ_SECONDS} onExpire={() => setReading(false)} resetKey={`read-${i}`} label="זמן קריאה" />
      ) : (
        <Timer seconds={ANSWER_SECONDS} onExpire={answerTimeout} resetKey={`ans-${i}`} paused={picked !== null} label="זמן לתשובה" />
      )}
      <div className="spacer" />

      <div className="glass pad slide-up" key={`${i}-${reading}`}>
        <div className="facts">
          {t.facts.map((f, idx) => (
            <div className="fact" key={idx}><span className="num">{idx + 1}</span><span>{f}</span></div>
          ))}
        </div>

        {reading ? (
          <button className="btn full sky" onClick={() => setReading(false)}>קראתי — לשאלה ➜</button>
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
            {picked === -1 && <p className="feedback no">נגמר הזמן ⏰</p>}
          </>
        )}
      </div>
    </div>
  );
}
