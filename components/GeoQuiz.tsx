"use client";
import { useState } from "react";
import { COUNTRIES, CONTINENTS, type Country } from "@/lib/data";
import Confetti from "./Confetti";

const ROUND = 6;
const OPT = "אבגד";
const CONT_EMOJI: Record<string, string> = {
  "אירופה": "🏰", "אסיה": "🐉", "אפריקה": "🦁",
  "צפון אמריקה": "🗽", "דרום אמריקה": "🌴", "אוקיאניה": "🦘",
};

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
  return a;
}

type Q =
  | { type: "capital"; country: Country; options: string[]; correct: number }
  | { type: "continent"; country: Country; correctContinent: string };

function buildRound(): Q[] {
  const picks = shuffle(COUNTRIES).slice(0, ROUND);
  return picks.map((country, idx) => {
    if (idx % 2 === 0) {
      const others = shuffle(COUNTRIES.filter((c) => c.capital !== country.capital)).slice(0, 3).map((c) => c.capital);
      const options = shuffle([country.capital, ...others]);
      return { type: "capital", country, options, correct: options.indexOf(country.capital) };
    }
    return { type: "continent", country, correctContinent: country.continent };
  });
}

export default function GeoQuiz({ onScore }: { onScore: (pts: number) => void }) {
  const [qs, setQs] = useState<Q[]>(() => buildRound());
  const [i, setI] = useState(0);
  const [pickedCap, setPickedCap] = useState<number | null>(null);
  const [pickedCont, setPickedCont] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);
  const [confetti, setConfetti] = useState(0);

  const q = qs[i];

  function advance(ok: boolean) {
    if (ok) { setScore((s) => s + 1); setConfetti((c) => c + 1); }
    setTimeout(() => {
      if (i + 1 < qs.length) { setI(i + 1); setPickedCap(null); setPickedCont(null); }
      else { setDone(true); onScore(ok ? score + 1 : score); }
    }, 1100);
  }

  function chooseCap(idx: number) {
    if (pickedCap !== null || q.type !== "capital") return;
    setPickedCap(idx);
    advance(idx === q.correct);
  }
  function chooseCont(cont: string) {
    if (pickedCont !== null || q.type !== "continent") return;
    setPickedCont(cont);
    advance(cont === q.correctContinent);
  }

  function restart() { setQs(buildRound()); setI(0); setPickedCap(null); setPickedCont(null); setScore(0); setDone(false); }

  if (done) {
    return (
      <div className="glass pad result-card slide-up">
        <div style={{ fontSize: 60 }}>{score >= ROUND - 1 ? "🏆" : score >= ROUND / 2 ? "🎉" : "💪"}</div>
        <h2>סיימת את הסיבוב!</h2>
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
        <span className="ico">🗺️</span>
        <div><h2>גאוגרפיה ומפות</h2><p>בירות ויבשות מסביב לעולם</p></div>
      </div>
      <div className="progress"><i style={{ width: `${(i / ROUND) * 100}%` }} /></div>

      <div className="glass pad slide-up" key={i}>
        <div className="center" style={{ marginBottom: 14 }}>
          <div className="quiz-flag pop" style={{ fontSize: 80 }}>{q.country.flag}</div>
          {q.type === "capital"
            ? <h3>מהי בירת {q.country.name}?</h3>
            : <h3>באיזו יבשת נמצאת {q.country.name}?</h3>}
        </div>

        {q.type === "capital" ? (
          <div className="options">
            {q.options.map((o, idx) => {
              let cls = "opt";
              if (pickedCap !== null) {
                if (idx === q.correct) cls += " correct";
                else if (idx === pickedCap) cls += " wrong";
              }
              return (
                <button key={idx} className={cls} disabled={pickedCap !== null} onClick={() => chooseCap(idx)}>
                  <span className="badge">{OPT[idx]}</span>{o}
                </button>
              );
            })}
          </div>
        ) : (
          <div className="continents">
            {CONTINENTS.map((cont) => {
              let cls = "cont";
              if (pickedCont !== null) {
                if (cont === q.correctContinent) cls += " correct";
                else if (cont === pickedCont) cls += " wrong";
              }
              return (
                <button key={cont} className={cls} disabled={pickedCont !== null} onClick={() => chooseCont(cont)}>
                  <span className="ce">{CONT_EMOJI[cont]}</span>{cont}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
