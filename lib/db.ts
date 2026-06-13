import Redis from "ioredis";
import fs from "fs";
import path from "path";
import os from "os";

// ===== שכבת אחסון =====
// בפרודקשן (Vercel): Redis (Upstash) דרך משתנה החיבור REDIS_URL — משותף בין כל המכשירים.
// ללא Redis: קובץ JSON זמני + גיבוי בזיכרון, כדי שהכל יעבוד מיד.

const STATE_KEY = "mondial:state:v1";

// איתור כתובת החיבור ל-Redis בכל שם משתנה אפשרי (REDIS_URL / KV_URL / וכו').
function findUrl(): { url: string; key: string } | null {
  const env = process.env as Record<string, string>;
  const preferred = ["REDIS_URL", "KV_URL", "UPSTASH_REDIS_URL"];
  for (const k of preferred) {
    if (env[k] && /^rediss?:\/\//.test(env[k])) return { url: env[k], key: k };
  }
  const k = Object.keys(env).find((k) => /^rediss?:\/\//.test(env[k] || ""));
  return k ? { url: env[k], key: k } : null;
}

const found = findUrl();

// יצירת לקוח יחיד (נשמר בין הפעלות "חמות" בענן)
let client: Redis | null = null;
if (found) {
  try {
    client = new Redis(found.url, {
      maxRetriesPerRequest: 3,
      lazyConnect: false,
      enableReadyCheck: false,
    });
    client.on("error", () => {}); // לא להפיל את התהליך על ניתוק זמני
  } catch {
    client = null;
  }
}

// חיווי אבחון: שמות מפתחות אחסון בלבד (ללא ערכים/סודות)
export const storageInfo = {
  connected: !!client,
  matchedKey: found?.key || null,
  storageKeysSeen: Object.keys(process.env).filter((k) =>
    /(REDIS|UPSTASH|KV_|STORAGE)/i.test(k)
  ),
};

// קובץ מקומי לפיתוח; בענן (מערכת קבצים לקריאה בלבד) ב-tmp.
const LOCAL_FILE = process.env.VERCEL
  ? path.join(os.tmpdir(), "mondial-state.json")
  : path.join(process.cwd(), ".mondial-state.json");

let memoryState: any = null;

export async function readRaw(): Promise<any | null> {
  if (client) {
    const v = await client.get(STATE_KEY);
    return v ? JSON.parse(v) : null;
  }
  if (memoryState !== null) return memoryState;
  try {
    return JSON.parse(fs.readFileSync(LOCAL_FILE, "utf-8"));
  } catch {
    return null;
  }
}

export async function writeRaw(value: any): Promise<void> {
  if (client) {
    await client.set(STATE_KEY, JSON.stringify(value));
    return;
  }
  memoryState = value;
  try {
    fs.writeFileSync(LOCAL_FILE, JSON.stringify(value, null, 2), "utf-8");
  } catch {
    // מערכת קבצים לקריאה בלבד — נשארים עם הגיבוי בזיכרון
  }
}

export const usingRedis = !!client;
