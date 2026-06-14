import { readRaw, writeRaw } from "./db";
import { SEED_MATCHES, flagOf } from "./data";

// ===== מבני נתונים =====
export const MAX_USERS = 20;

export type User = {
  id: string;
  name: string;
  password: string;   // משחק משפחתי — נשמר כטקסט פשוט, לא אבטחה אמיתית
  avatar: string;     // נתיב תמונה (/avatars/..) או אמוג'י
  score: number;      // ניקוד כולל ממשחקי הידע
  admin?: boolean;    // צחי = מנהל שרואה ומנהל הכל
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
    { id: "tsahy", name: "צחי", password: "", avatar: "/avatars/tsahy.png", score: 0, admin: true },
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
  // מחיקת משחקי placeholder ישנים שהוחלפו במשחקים אמיתיים
  const STALE_IDS = new Set(["m1","m2","m3","m4","m5","m6","m7","m8"]);
  const before = s.matches.length;
  s.matches = s.matches.filter((m) => !STALE_IDS.has(m.id));
  if (s.matches.length !== before) {
    // ניקוי ניחושים שהתייחסו למשחקים שנמחקו
    for (const id of STALE_IDS) delete s.guesses[id];
  }

  // השלמת משחקי זרע חדשים שנוספו לקוד מבלי לדרוס תוצאות קיימות
  const ids = new Set(s.matches.map((m) => m.id));
  for (const sm of seedMatches()) {
    if (!ids.has(sm.id)) s.matches.push(sm);
  }
  if (!s.guesses) s.guesses = {};
  // הבטחת הרשאת מנהל לצחי (גם במצב קיים מהענן)
  const tsahy = s.users.find((u) => u.id === "tsahy");
  if (tsahy && !tsahy.admin) tsahy.admin = true;
  // שמירה אם הייתה ניקוי
  if (s.matches.length !== before) await saveState(s);
  return s;
}

// אימות משתמש מול סיסמה
export function authUser(s: State, userId: string, password: string): User | null {
  const u = s.users.find((x) => x.id === userId);
  if (!u || u.password !== String(password)) return null;
  return u;
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
