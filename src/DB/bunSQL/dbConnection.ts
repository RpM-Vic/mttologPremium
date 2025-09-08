import { SQL } from "bun";

const DATABASE_URL = process.env.DATABASE_URL || "";

export const pg = new SQL({url:DATABASE_URL,max:2});

export async function testConnection() {
  try {
    const result = await pg`SELECT NOW()`;
    console.log("✅ DB connected:", result[0].now);
  } catch (e) {
    console.error("❌ DB connection error:", e);
  }
}