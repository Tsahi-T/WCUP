import { NextResponse } from "next/server";
import { getState, saveState } from "@/lib/store";

export const dynamic = "force-dynamic";

// הזנת תוצאה ידנית (גיבוי הורים). דורש משתמש מחובר עם סיסמה.
export async function POST(req: Request) {
  const { userId, password, matchId, scoreA, scoreB } = await req.json();
  const s = await getState();
  const u = s.users.find((x) => x.id === userId);
  if (!u || u.password !== String(password)) {
    return NextResponse.json({ ok: false, error: "אימות נכשל" }, { status: 401 });
  }
  const m = s.matches.find((x) => x.id === matchId);
  if (!m) return NextResponse.json({ ok: false, error: "משחק לא נמצא" }, { status: 404 });

  m.scoreA = Math.max(0, Math.round(Number(scoreA)));
  m.scoreB = Math.max(0, Math.round(Number(scoreB)));
  m.finished = true;
  await saveState(s);
  return NextResponse.json({ ok: true });
}
