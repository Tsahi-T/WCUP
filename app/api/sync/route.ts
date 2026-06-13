import { NextResponse } from "next/server";
import { getState, saveState } from "@/lib/store";

export const dynamic = "force-dynamic";

// מיפוי שמות עבריים לאנגלית עבור TheSportsDB
const EN: Record<string, string> = {
  "ברזיל": "Brazil",
  "ארגנטינה": "Argentina",
  "צרפת": "France",
  "אנגליה": "England",
  "ספרד": "Spain",
  "גרמניה": "Germany",
  "פורטוגל": "Portugal",
  "איטליה": "Italy",
  "הולנד": "Netherlands",
  "בלגיה": "Belgium",
  "קרואטיה": "Croatia",
  "מרוקו": "Morocco",
  "סנגל": "Senegal",
  "מצרים": "Egypt",
  "ניגריה": "Nigeria",
  "אלג'יריה": "Algeria",
  "יפן": "Japan",
  "דרום קוריאה": "South Korea",
  "ערב הסעודית": "Saudi Arabia",
  "אוסטרליה": "Australia",
  "ארצות הברית": "USA",
  "מקסיקו": "Mexico",
  "קנדה": "Canada",
  "אורוגוואי": "Uruguay",
  "קולומביה": "Colombia",
};

const KEY = process.env.SPORTSDB_KEY || "3"; // מפתח בדיקה ציבורי חינמי

// שליפת תוצאות אמיתיות אוטומטית. גיבוי: הזנה ידנית בלשונית ההורים.
export async function POST() {
  const s = await getState();
  let updated = 0;
  const errors: string[] = [];

  for (const m of s.matches) {
    if (m.finished) continue;
    const a = EN[m.teamA];
    const b = EN[m.teamB];
    if (!a || !b) continue;
    try {
      const q = encodeURIComponent(`${a}_vs_${b}`);
      const url = `https://www.thesportsdb.com/api/v1/json/${KEY}/searchevents.php?e=${q}&s=2026`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) continue;
      const data: any = await res.json();
      const events: any[] = data?.event || [];
      // מחפשים אירוע עם תוצאה סופית
      const ev = events.find(
        (e) => e.intHomeScore != null && e.intAwayScore != null
      );
      if (!ev) continue;

      const home = String(ev.strHomeTeam || "").toLowerCase();
      const hs = Number(ev.intHomeScore);
      const as = Number(ev.intAwayScore);
      // התאמת סדר הקבוצות
      if (home.includes(a.toLowerCase())) {
        m.scoreA = hs;
        m.scoreB = as;
      } else {
        m.scoreA = as;
        m.scoreB = hs;
      }
      m.finished = true;
      updated++;
    } catch (e: any) {
      errors.push(`${m.teamA}-${m.teamB}: ${e?.message || "שגיאה"}`);
    }
  }

  if (updated > 0) await saveState(s);
  return NextResponse.json({ ok: true, updated, errors });
}

export async function GET() {
  return POST();
}
