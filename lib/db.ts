import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";
import os from "os";

// ===== שכבת אחסון =====
// בפרודקשן (Vercel): Upstash Redis — נתונים משותפים בין כל המכשירים.
// ללא Redis: קובץ JSON זמני, כדי שהכל יעבוד מיד (לא משותף בין מכשירים/מופעים).

const STATE_KEY = "mondial:state:v1";

// איתור פרטי ההתחברות ל-Redis בכל שם משתנה אפשרי (Vercel/Upstash מזריקים
// לעיתים עם תחילית כמו STORAGE_ או KV_). מחפשים מפתח URL ואז את ה-TOKEN התואם.
function findCreds(): { url: string; token: string; key: string } | null {
  const env = process.env as Record<string, string>;
  // עדיפות לשמות הסטנדרטיים
  const direct: [string, string][] = [
    ["KV_REST_API_URL", "KV_REST_API_TOKEN"],
    ["UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN"],
  ];
  for (const [u, t] of direct) {
    if (env[u] && env[t]) return { url: env[u], token: env[t], key: u };
  }
  // סריקה גנרית: כל מפתח שמסתיים ב-REST_API_URL או REDIS_REST_URL
  const urlKey = Object.keys(env).find(
    (k) => /(REST_API_URL|REDIS_REST_URL)$/.test(k) && /^https?:\/\//.test(env[k] || "")
  );
  if (urlKey) {
    const tokenKey = urlKey.replace(/URL$/, "TOKEN");
    if (env[tokenKey]) return { url: env[urlKey], token: env[tokenKey], key: urlKey };
  }
  return null;
}

const creds = findCreds();
const redis = creds ? new Redis({ url: creds.url, token: creds.token }) : null;

// חיווי אבחון: אילו מפתחות אחסון נראו בסביבה (שמות בלבד, ללא ערכים/סודות)
export const storageInfo = {
  connected: !!redis,
  matchedKey: creds?.key || null,
  storageKeysSeen: Object.keys(process.env).filter((k) =>
    /(REDIS|UPSTASH|KV_|STORAGE)/i.test(k)
  ),
};

// בפיתוח מקומי נשמור בתיקיית הפרויקט; בענן (מערכת קבצים לקריאה בלבד) ב-tmp.
const LOCAL_FILE = process.env.VERCEL
  ? path.join(os.tmpdir(), "mondial-state.json")
  : path.join(process.cwd(), ".mondial-state.json");

// גיבוי בזיכרון אם גם הכתיבה לקובץ נכשלת
let memoryState: any = null;

export async function readRaw(): Promise<any | null> {
  if (redis) {
    return (await redis.get(STATE_KEY)) as any;
  }
  if (memoryState !== null) return memoryState;
  try {
    const txt = fs.readFileSync(LOCAL_FILE, "utf-8");
    return JSON.parse(txt);
  } catch {
    return null;
  }
}

export async function writeRaw(value: any): Promise<void> {
  if (redis) {
    await redis.set(STATE_KEY, value);
    return;
  }
  memoryState = value;
  try {
    fs.writeFileSync(LOCAL_FILE, JSON.stringify(value, null, 2), "utf-8");
  } catch {
    // מערכת קבצים לקריאה בלבד — נשארים עם הגיבוי בזיכרון
  }
}

export const usingRedis = !!redis;
