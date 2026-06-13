import { readRaw, writeRaw } from "./db";
import { SEED_MATCHES, flagOf } from "./data";

// ===== מבני נתונים =====
export type User = {
  id: string;
  name: string;
  password: string;   // משחק משפחתי — נשמר כטקסט פשוט, לא אבטחה אמיתית
  avatar: string;     // נתיב תמונה (/avatars/..) או אמוג'י
  score: number;      // ניקוד כולל ממשחקי הידע
};

export type Match = {
  id: string;
  teamA: string;
  teamB: string;
  flagA: string;
  flagB: string;
  date: string;
  stage: string;
  // תוצאה אמיתית (null עד שמוזנת)
  scoreA: number | null;
  scoreB: number | null;
  finished: boolean;
};

// ניחוש של משתמש למשחק
export type Guess = { scoreA: number; scoreB: number };

export type State = {
  users: User[];
  matches: Match[];
  // guesses[matchId][userId] = ניחוש
  guesses: Record<string, Record<string, Guess>>;
};

// ===== זרע התחלתי: המשפחה מוזנת מראש =====
function seedUsers(): User[] {
  return [
    { id: "tsahy", name: "צחי", password: "", avatar: "/avatars/tsahy.png", score: 0 },
    { id: "ori", name: "אורי", password: "", avatar: "/avatars/ori.png", score: 0 },
    { id: "ofek", name: "אופק", password: "", avatar: "/avatars/ofek.png", score: 0 },
  ];
}

function seedMatches(): Match[] {
  return SEED_MATCHES.map((m) => ({
    id: m.id,
    teamA: m.teamA,
    teamB: m.teamB,
    flagA: flagOf(m.teamA),
    flagB: flagOf(m.teamB),
    date: m.date,
    stage: m.stage,
    scoreA: null,
    scoreB: null,
    finished: false,
  }));
}

function freshState(): State {
  return { users: seedUsers(), matches: seedMatches(), guesses: {} };
}

// ===== קריאה/כתיבה עם זרע אוטומטי =====
export async function getState(): Promise<State> {
  let s = (await readRaw()) as State | null;
  if (!s || !s.users) {
    s = freshState();
    await writeRaw(s);
    return s;
  }
  // השלמת משחקי זרע חדשים שנוספו לקוד מבלי לדרוס תוצאות קיימות
  const ids = new Set(s.matches.map((m) => m.id));
  for (const sm of seedMatches()) {
    if (!ids.has(sm.id)) s.matches.push(sm);
  }
  if (!s.guesses) s.guesses = {};
  return s;
}

export async function saveState(s: State): Promise<void> {
  await writeRaw(s);
}

// חישוב ניקוד ניחושים: תוצאה מדויקת = 3, ניחוש מנצח/תיקו נכון = 1
export function predictionPoints(guess: Guess, m: Match): number {
  if (m.scoreA === null || m.scoreB === null || !m.finished) return 0;
  if (guess.scoreA === m.scoreA && guess.scoreB === m.scoreB) return 3;
  const gSign = Math.sign(guess.scoreA - guess.scoreB);
  const rSign = Math.sign(m.scoreA - m.scoreB);
  return gSign === rSign ? 1 : 0;
}
