import { NextResponse } from "next/server";
import { getState, saveState } from "@/lib/store";

export const dynamic = "force-dynamic";

// שמירת ניחוש לתוצאת משחק. דורש משתמש + סיסמה.
export async function POST(req: Request) {
  const { userId, password, matchId, scoreA, scoreB } = await req.json();
  const s = await getState();
  const u = s.users.find((x) => x.id === userId);
  if (!u || u.password !== String(password)) {
    return NextResponse.json({ ok: false, error: "אימות נכשל" }, { status: 401 });
  }
  const m = s.matches.find((x) => x.id === matchId);
  if (!m) return NextResponse.json({ ok: false, error: "משחק לא נמצא" }, { status: 404 });
  if (m.finished) return NextResponse.json({ ok: false, error: "המשחק כבר הסתיים" }, { status: 400 });

  const a = Math.max(0, Math.min(20, Math.round(Number(scoreA))));
  const b = Math.max(0, Math.min(20, Math.round(Number(scoreB))));
  if (Number.isNaN(a) || Number.isNaN(b)) {
    return NextResponse.json({ ok: false, error: "תוצאה לא תקינה" }, { status: 400 });
  }

  if (!s.guesses[matchId]) s.guesses[matchId] = {};
  s.guesses[matchId][userId] = { scoreA: a, scoreB: b };
  await saveState(s);
  return NextResponse.json({ ok: true });
}
