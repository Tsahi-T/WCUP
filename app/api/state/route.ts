import { NextResponse } from "next/server";
import { getState, predictionPoints } from "@/lib/store";
import { usingRedis } from "@/lib/db";

export const dynamic = "force-dynamic";

// מחזיר את המצב המלא ללא סיסמאות, כולל ניקוד ניחושים מחושב
export async function GET() {
  const s = await getState();

  const predictionScore: Record<string, number> = {};
  for (const u of s.users) predictionScore[u.id] = 0;
  for (const m of s.matches) {
    const g = s.guesses[m.id] || {};
    for (const uid of Object.keys(g)) {
      predictionScore[uid] = (predictionScore[uid] || 0) + predictionPoints(g[uid], m);
    }
  }

  const users = s.users.map((u) => ({
    id: u.id,
    name: u.name,
    avatar: u.avatar,
    hasPassword: !!u.password,
    quizScore: u.score,
    predictionScore: predictionScore[u.id] || 0,
    total: u.score + (predictionScore[u.id] || 0),
  }));

  return NextResponse.json({ users, matches: s.matches, guesses: s.guesses, shared: usingRedis });
}
