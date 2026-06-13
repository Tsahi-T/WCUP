import { Redis } from "@upstash/redis";
import fs from "fs";
import path from "path";

// ===== שכבת אחסון =====
// בפרודקשן (Vercel): Upstash Redis — נתונים משותפים בין כל המכשירים.
// בפיתוח מקומי ללא הגדרות: קובץ JSON זמני, כדי שהכל יעבוד מיד.

const STATE_KEY = "mondial:state:v1";

const url =
  process.env.KV_REST_API_URL || process.env.UPSTASH_REDIS_REST_URL || "";
const token =
  process.env.KV_REST_API_TOKEN || process.env.UPSTASH_REDIS_REST_TOKEN || "";

const redis = url && token ? new Redis({ url, token }) : null;

const LOCAL_FILE = path.join(process.cwd(), ".mondial-state.json");

export async function readRaw(): Promise<any | null> {
  if (redis) {
    return (await redis.get(STATE_KEY)) as any;
  }
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
  fs.writeFileSync(LOCAL_FILE, JSON.stringify(value, null, 2), "utf-8");
}

export const usingRedis = !!redis;
