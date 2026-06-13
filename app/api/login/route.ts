import { NextResponse } from "next/server";
import { getState, saveState } from "@/lib/store";

export const dynamic = "force-dynamic";

// התחברות: אם למשתמש אין עדיין סיסמה — ההתחברות הראשונה קובעת אותה.
export async function POST(req: Request) {
  const { userId, password, newName } = await req.json();
  const s = await getState();
  const u = s.users.find((x) => x.id === userId);
  if (!u) return NextResponse.json({ ok: false, error: "משתמש לא נמצא" }, { status: 404 });

  if (!u.password) {
    if (!password || String(password).length < 3) {
      return NextResponse.json({ ok: false, error: "בחרו סיסמה (לפחות 3 תווים)" }, { status: 400 });
    }
    u.password = String(password);
    if (newName) u.name = String(newName);
    await saveState(s);
    return NextResponse.json({ ok: true, firstTime: true, user: { id: u.id, name: u.name, avatar: u.avatar } });
  }

  if (u.password !== String(password)) {
    return NextResponse.json({ ok: false, error: "סיסמה שגויה" }, { status: 401 });
  }
  return NextResponse.json({ ok: true, user: { id: u.id, name: u.name, avatar: u.avatar } });
}
