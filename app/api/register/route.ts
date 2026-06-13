import { NextResponse } from "next/server";
import { getState, saveState, MAX_USERS } from "@/lib/store";

export const dynamic = "force-dynamic";

function slug(name: string): string {
  const base = String(name).trim().toLowerCase().replace(/[^a-z0-9֐-׿]+/g, "-").replace(/^-+|-+$/g, "");
  return (base || "player") + "-" + Math.random().toString(36).slice(2, 6);
}

// רישום שחקן חדש. עד MAX_USERS שחקנים.
export async function POST(req: Request) {
  const { name, password, avatar } = await req.json();
  const s = await getState();

  const nm = String(name || "").trim();
  if (nm.length < 2) return NextResponse.json({ ok: false, error: "בחרו שם (לפחות 2 תווים)" }, { status: 400 });
  if (String(password || "").length < 3) return NextResponse.json({ ok: false, error: "בחרו סיסמה (לפחות 3 תווים)" }, { status: 400 });
  if (s.users.some((u) => u.name === nm)) return NextResponse.json({ ok: false, error: "השם כבר תפוס, בחרו שם אחר" }, { status: 409 });
  if (s.users.length >= MAX_USERS) return NextResponse.json({ ok: false, error: `הגעתם למקסימום ${MAX_USERS} שחקנים` }, { status: 403 });

  const id = slug(nm);
  const av = typeof avatar === "string" && avatar ? avatar : "⚽";
  s.users.push({ id, name: nm, password: String(password), avatar: av, score: 0 });
  await saveState(s);
  return NextResponse.json({ ok: true, user: { id, name: nm, avatar: av } });
}
