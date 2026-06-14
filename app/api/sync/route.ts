import { NextResponse } from "next/server";
import { getState, saveState } from "@/lib/store";
import { flagOf } from "@/lib/data";

export const dynamic = "force-dynamic";

// ===== מיפוי עברית ↔ אנגלית (כל 48 קבוצות) =====
const EN: Record<string, string> = {
  "מקסיקו": "Mexico",
  "דרום אפריקה": "South Africa",
  "דרום קוריאה": "South Korea",
  "צ'כיה": "Czech Republic",
  "קנדה": "Canada",
  "בוסניה והרצגובינה": "Bosnia and Herzegovina",
  "קטאר": "Qatar",
  "שווייץ": "Switzerland",
  "ארצות הברית": "United States",
  "פרגוואי": "Paraguay",
  "אוסטרליה": "Australia",
  "טורקיה": "Turkey",
  "ברזיל": "Brazil",
  "מרוקו": "Morocco",
  "סקוטלנד": "Scotland",
  "האיטי": "Haiti",
  "גרמניה": "Germany",
  "קוראסאו": "Curacao",
  "חוף השנהב": "Ivory Coast",
  "אקוודור": "Ecuador",
  "הולנד": "Netherlands",
  "יפן": "Japan",
  "שוודיה": "Sweden",
  "תוניסיה": "Tunisia",
  "ספרד": "Spain",
  "כף ורדה": "Cape Verde",
  "ערב הסעודית": "Saudi Arabia",
  "אורוגוואי": "Uruguay",
  "בלגיה": "Belgium",
  "מצרים": "Egypt",
  "איראן": "Iran",
  "ניו זילנד": "New Zealand",
  "צרפת": "France",
  "סנגל": "Senegal",
  "עיראק": "Iraq",
  "נורווגיה": "Norway",
  "ארגנטינה": "Argentina",
  "אלג'יריה": "Algeria",
  "אוסטריה": "Austria",
  "ירדן": "Jordan",
  "פורטוגל": "Portugal",
  "קונגו הדמוקרטית": "Congo DR",
  "אוזבקיסטן": "Uzbekistan",
  "קולומביה": "Colombia",
  "אנגליה": "England",
  "קרואטיה": "Croatia",
  "גאנה": "Ghana",
  "פנמה": "Panama",
};

// מיפוי הפוך: אנגלית (lowercase) → עברית, עם כינויים נפוצים
const HE: Record<string, string> = Object.fromEntries(
  Object.entries(EN).map(([he, en]) => [en.toLowerCase(), he])
);
// כינויים נוספים שמופיעים ב-APIs שונים
const ALIASES: Record<string, string> = {
  "usa": "ארצות הברית", "united states of america": "ארצות הברית",
  "czechia": "צ'כיה", "czech republic": "צ'כיה",
  "türkiye": "טורקיה", "turkey": "טורקיה",
  "ivory coast": "חוף השנהב", "cote d'ivoire": "חוף השנהב", "côte d'ivoire": "חוף השנהב",
  "dr congo": "קונגו הדמוקרטית", "congo dr": "קונגו הדמוקרטית",
  "democratic republic of the congo": "קונגו הדמוקרטית",
  "curaçao": "קוראסאו", "curacao": "קוראסאו",
  "cape verde": "כף ורדה", "cabo verde": "כף ורדה",
  "korea republic": "דרום קוריאה", "south korea": "דרום קוריאה",
  "new zealand": "ניו זילנד",
  "saudi arabia": "ערב הסעודית",
  "bosnia & herzegovina": "בוסניה והרצגובינה",
  "ir iran": "איראן",
};

function toHebrew(name: string): string | undefined {
  const n = name.toLowerCase().trim();
  return HE[n] ?? ALIASES[n];
}

// ===== אסטרטגיה 1: football-data.org (חינמי, צריך FOOTBALL_DATA_KEY) =====
// הרשמה ב-https://www.football-data.org/client/register
async function syncFootballData(s: Awaited<ReturnType<typeof getState>>): Promise<{ updated: number; info: string }> {
  const key = process.env.FOOTBALL_DATA_KEY!;
  // WC = גביע העולם, season 2026
  const res = await fetch("https://api.football-data.org/v4/competitions/WC/matches?season=2026", {
    headers: { "X-Auth-Token": key },
    cache: "no-store",
  });
  if (!res.ok) throw new Error(`football-data.org: ${res.status}`);
  const data: any = await res.json();
  const apiMatches: any[] = data.matches ?? [];

  let updated = 0;
  for (const wm of apiMatches) {
    const apiDate = new Date(wm.utcDate).getTime();
    // התאמה לפי תאריך (חלון ±45 דק׳)
    const m = s.matches.find((x) => Math.abs(new Date(x.date).getTime() - apiDate) < 45 * 60 * 1000);
    if (!m) continue;

    // עדכון שמות קבוצות אם הן עדיין "?"
    const homeHe = toHebrew(wm.homeTeam?.name ?? "");
    const awayHe = toHebrew(wm.awayTeam?.name ?? "");
    if (m.teamA === "?" && homeHe) { m.teamA = homeHe; m.flagA = flagOf(homeHe); updated++; }
    if (m.teamB === "?" && awayHe) { m.teamB = awayHe; m.flagB = flagOf(awayHe); updated++; }

    // עדכון תוצאה אם המשחק הסתיים
    if (!m.finished && wm.status === "FINISHED") {
      const ft = wm.score?.fullTime;
      if (ft?.home != null && ft?.away != null) {
        const isHomeA = (homeHe === m.teamA) || (m.teamA === "?" && !awayHe);
        m.scoreA = isHomeA ? ft.home : ft.away;
        m.scoreB = isHomeA ? ft.away : ft.home;
        m.finished = true;
        updated++;
      }
    }
  }
  return { updated, info: `football-data.org: ${apiMatches.length} משחקים` };
}

// ===== אסטרטגיה 2: TheSportsDB (ללא מפתח — חינמי לגמרי) =====
const TSDB_KEY = process.env.SPORTSDB_KEY || "3";

async function syncTheSportsDB(s: Awaited<ReturnType<typeof getState>>): Promise<{ updated: number; info: string }> {
  let updated = 0;
  let fetched = 0;

  // ניסיון: שליפת כל המשחקים של העונה (league 4479 = FIFA World Cup)
  try {
    const seasonRes = await fetch(
      `https://www.thesportsdb.com/api/v1/json/${TSDB_KEY}/eventsseason.php?id=4479&s=2026-2027`,
      { cache: "no-store" }
    );
    if (seasonRes.ok) {
      const seasonData: any = await seasonRes.json();
      const events: any[] = seasonData?.events ?? [];
      fetched = events.length;

      for (const ev of events) {
        if (!ev.dateEvent || !ev.strTime) continue;
        const apiDate = new Date(`${ev.dateEvent}T${ev.strTime}Z`).getTime();
        const m = s.matches.find((x) => Math.abs(new Date(x.date).getTime() - apiDate) < 60 * 60 * 1000);
        if (!m) continue;

        const homeHe = toHebrew(ev.strHomeTeam ?? "");
        const awayHe = toHebrew(ev.strAwayTeam ?? "");
        if (m.teamA === "?" && homeHe) { m.teamA = homeHe; m.flagA = flagOf(homeHe); updated++; }
        if (m.teamB === "?" && awayHe) { m.teamB = awayHe; m.flagB = flagOf(awayHe); updated++; }

        if (!m.finished && ev.intHomeScore != null && ev.intAwayScore != null) {
          const hs = Number(ev.intHomeScore), as = Number(ev.intAwayScore);
          if (!isNaN(hs) && !isNaN(as)) {
            const isHomeA = (homeHe === m.teamA) || (m.teamA === "?" && !awayHe);
            m.scoreA = isHomeA ? hs : as;
            m.scoreB = isHomeA ? as : hs;
            m.finished = true;
            updated++;
          }
        }
      }
      if (fetched > 0) return { updated, info: `TheSportsDB season: ${fetched} אירועים` };
    }
  } catch {}

  // fallback: חיפוש לכל משחק בנפרד (איטי אבל עובד)
  const pending = s.matches.filter((m) => !m.finished && m.teamA !== "?" && m.teamB !== "?");
  for (const m of pending) {
    const a = EN[m.teamA], b = EN[m.teamB];
    if (!a || !b) continue;
    try {
      const q = encodeURIComponent(`${a}_vs_${b}`);
      const res = await fetch(
        `https://www.thesportsdb.com/api/v1/json/${TSDB_KEY}/searchevents.php?e=${q}&s=2026`,
        { cache: "no-store" }
      );
      if (!res.ok) continue;
      const data: any = await res.json();
      const ev = (data?.event ?? []).find((e: any) => e.intHomeScore != null && e.intAwayScore != null);
      if (!ev) continue;
      const home = String(ev.strHomeTeam ?? "").toLowerCase();
      const hs = Number(ev.intHomeScore), as = Number(ev.intAwayScore);
      if (home.includes(a.toLowerCase())) { m.scoreA = hs; m.scoreB = as; }
      else { m.scoreA = as; m.scoreB = hs; }
      m.finished = true;
      updated++;
      fetched++;
    } catch {}
  }
  return { updated, info: `TheSportsDB search: ${fetched} ניסיונות` };
}

// ===== handler ראשי =====
export async function POST(req: Request) {
  const s = await getState();
  let body: any = {};
  try { body = await req.json(); } catch {}
  const u = s.users.find((x) => x.id === body.userId);
  if (!u || u.password !== String(body.password))
    return NextResponse.json({ ok: false, error: "אימות נכשל" }, { status: 401 });
  if (!u.admin)
    return NextResponse.json({ ok: false, error: "פעולה למנהל בלבד" }, { status: 403 });

  try {
    const result = process.env.FOOTBALL_DATA_KEY
      ? await syncFootballData(s)
      : await syncTheSportsDB(s);

    if (result.updated > 0) await saveState(s);
    return NextResponse.json({ ok: true, updated: result.updated, info: result.info });
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e.message }, { status: 502 });
  }
}
