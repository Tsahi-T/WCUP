import { NextResponse } from "next/server";
import { getState, saveState } from "@/lib/store";

export const dynamic = "force-dynamic";

// הוספת נקודות ממשחקי הידע (דגלים/גאוגרפיה/הידעת). דורש אימות.
export async function POST(req: Request) {
  const { userId, password, points } = await req.json();
  const s = await getState();
  const u = s.users.find((x) => x.id === userId);
  if (!u || u.password !== String(password)) {
    return NextResponse.json({ ok: false, error: "אימות נכשל" }, { status: 401 });
  }
  const p = Math.max(0, Math.round(Number(points)));
  u.score += p;
  await saveState(s);
  return NextResponse.json({ ok: true, score: u.score });
}
