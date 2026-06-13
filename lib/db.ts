import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";
import os from "os";

// ===== שכבת אחסון =====
// בפרודקשן (Vercel): Upstash Redis — נתונים משותפים בין כל המכשירים.
// ללא Redis: קובץ JSON זמני, כדי שהכל יעבוד מיד (לא משותף בין מכשירים/מופעים).

const STATE_KEY = "mondial:state:v1";

const url =
  process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const token =
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";

const redis = url && token ? new Redis({ url, token }) : null;

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
