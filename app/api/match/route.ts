import { NextResponse } from "next/server";
import { getState, saveState } from "@/lib/store";
import { flagOf } from "@/lib/data";

export const dynamic = "force-dynamic";

// הוספת משחק חדש (לשונית הורים). דורש אימות.
export async function POST(req: Request) {
  const { userId, password, teamA, teamB, date, stage } = await req.json();
  const s = await getState();
  const u = s.users.find((x) => x.id === userId);
  if (!u || u.password !== String(password)) {
    return NextResponse.json({ ok: false, error: "אימות נכשל" }, { status: 401 });
  }
  if (!teamA || !teamB) {
    return NextResponse.json({ ok: false, error: "חסרות קבוצות" }, { status: 400 });
  }
  const id = "m" + Date.now().toString(36);
  s.matches.push({
    id,
    teamA,
    teamB,
    flagA: flagOf(teamA),
    flagB: flagOf(teamB),
    date: date || new Date().toISOString(),
    stage: stage || "שלב הבתים",
    scoreA: null,
    scoreB: null,
    finished: false,
  });
  await saveState(s);
  return NextResponse.json({ ok: true, id });
}
