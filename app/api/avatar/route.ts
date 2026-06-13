import { NextResponse } from "next/server";
import { getState, saveState } from "@/lib/store";

export const dynamic = "force-dynamic";

// עדכון תמונת פרופיל (אמוג'י או תמונה שהועלתה כ-base64). דורש אימות.
export async function POST(req: Request) {
  const { userId, password, avatar } = await req.json();
  const s = await getState();
  const u = s.users.find((x) => x.id === userId);
  if (!u || u.password !== String(password)) {
    return NextResponse.json({ ok: false, error: "אימות נכשל" }, { status: 401 });
  }
  if (typeof avatar !== "string" || avatar.length > 700000) {
    return NextResponse.json({ ok: false, error: "תמונה לא תקינה (גדולה מדי)" }, { status: 400 });
  }
  u.avatar = avatar;
  await saveState(s);
  return NextResponse.json({ ok: true, avatar });
}
