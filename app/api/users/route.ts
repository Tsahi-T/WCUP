import { NextResponse } from "next/server";
import { getState, saveState } from "@/lib/store";

export const dynamic = "force-dynamic";

// מחיקת שחקן (מנהל בלבד). אי אפשר למחוק מנהל.
export async function DELETE(req: Request) {
  const { userId, password, targetId } = await req.json();
  const s = await getState();
  const u = s.users.find((x) => x.id === userId);
  if (!u || u.password !== String(password)) {
    return NextResponse.json({ ok: false, error: "אימות נכשל" }, { status: 401 });
  }
  if (!u.admin) return NextResponse.json({ ok: false, error: "פעולה למנהל בלבד" }, { status: 403 });

  const target = s.users.find((x) => x.id === targetId);
  if (!target) return NextResponse.json({ ok: false, error: "שחקן לא נמצא" }, { status: 404 });
  if (target.admin) return NextResponse.json({ ok: false, error: "אי אפשר למחוק מנהל" }, { status: 400 });

  s.users = s.users.filter((x) => x.id !== targetId);
  for (const mid of Object.keys(s.guesses)) delete s.guesses[mid][targetId];
  await saveState(s);
  return NextResponse.json({ ok: true });
}
