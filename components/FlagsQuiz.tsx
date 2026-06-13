"use client";
import { useMemo, useState } from "react";
import { COUNTRIES, type Country } from "@/lib/data";
import Confetti from "./Confetti";

const ROUND = 6;
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

function buildRound(): Q[] {
  const picks = shuffle(COUNTRIES).slice(0, ROUND);
  return picks.map((country) => {
    const others = shuffle(COUNTRIES.filter((c) => c.name !== country.name)).slice(0, 3);
    const options = shuffle([country, ...others]);
    return { country, options, correct: options.findIndex((o) => o.name === country.name) };
  });
}

export default function FlagsQuiz({ onScore }: { onScore: (pts: number) => void }) {
  const [qs, setQs] = useState<Q[]>(() => buildRound());
  const [i, setI] = useState(0);
  const [picked, setPicked] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [confetti, setConfetti] = useState(0);

  const q = qs[i];

  function choose(idx: number) {
    if (picked !== null) return;
    setPicked(idx);
    const ok = idx === q.correct;
    if (ok) { setScore((s) => s + 1); setConfetti((c) => c + 1); }
    setTimeout(() => {
      if (i + 1 < qs.length) { setI(i + 1); setPicked(null); }
      else { setDone(true); onScore(ok ? score + 1 : score); }
    }, 1100);
  }

  function restart() {
    setQs(buildRound()); setI(0); setPicked(null); setScore(0); setDone(false);
  }

  if (done) {
    return (
      <div className="glass pad result-card slide-up">
        <div style={{ fontSize: 60 }}>{score >= ROUND - 1 ? "🏆" : score >= ROUND / 2 ? "🎉" : "💪"}</div>
        <h2>כל הכבוד!</h2>
        <div className="score-big">{score}/{ROUND}</div>
        <p className="note">צברת {score} נקודות לטבלת האלופים</p>
        <button className="btn full" onClick={restart}>סיבוב נוסף 🔁</button>
      </div>
    );
  }

  return (
    <div>
      <Confetti fire={confetti} />
      <div className="screen-title">
        <span className="ico">🚩</span>
        <div><h2>דגלים</h2><p>של איזו מדינה הדגל?</p></div>
      </div>
      <div className="progress"><i style={{ width: `${(i / ROUND) * 100}%` }} /></div>
      <div className="glass pad slide-up" key={i}>
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
