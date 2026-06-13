// ===== עזרי צד-לקוח =====

export type PublicUser = {
  id: string;
  name: string;
  avatar: string;
  hasPassword: boolean;
  quizScore: number;
  predictionScore: number;
  total: number;
};

export type Match = {
  id: string;
  teamA: string;
  teamB: string;
  flagA: string;
  flagB: string;
  date: string;
  stage: string;
  scoreA: number | null;
  scoreB: number | null;
  finished: boolean;
};

export type Guess = { scoreA: number; scoreB: number };

export type FullState = {
  users: PublicUser[];
  matches: Match[];
  guesses: Record<string, Record<string, Guess>>;
};

export type Session = { id: string; name: string; avatar: string; password: string };

const SKEY = "mondial.session";

export function loadSession(): Session | null {
  if (typeof window === "undefined") return null;
  try { return JSON.parse(localStorage.getItem(SKEY) || "null"); } catch { return null; }
}
export function saveSession(s: Session | null) {
  if (s) localStorage.setItem(SKEY, JSON.stringify(s));
  else localStorage.removeItem(SKEY);
}

async function post(url: string, body: any) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok || data.ok === false) throw new Error(data.error || "שגיאה");
  return data;
}

export async function getState(): Promise<FullState> {
  const res = await fetch("/api/state", { cache: "no-store" });
  return res.json();
}

export const api = {
  login: (userId: string, password: string, newName?: string) =>
    post("/api/login", { userId, password, newName }),
  guess: (s: Session, matchId: string, scoreA: number, scoreB: number) =>
    post("/api/guess", { userId: s.id, password: s.password, matchId, scoreA, scoreB }),
  result: (s: Session, matchId: string, scoreA: number, scoreB: number) =>
    post("/api/result", { userId: s.id, password: s.password, matchId, scoreA, scoreB }),
  score: (s: Session, points: number) =>
    post("/api/score", { userId: s.id, password: s.password, points }),
  avatar: (s: Session, avatar: string) =>
    post("/api/avatar", { userId: s.id, password: s.password, avatar }),
  addMatch: (s: Session, teamA: string, teamB: string, date: string, stage: string) =>
    post("/api/match", { userId: s.id, password: s.password, teamA, teamB, date, stage }),
  sync: () => post("/api/sync", {}),
};
