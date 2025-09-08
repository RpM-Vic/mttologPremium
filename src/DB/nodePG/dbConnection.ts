import pkg from "pg";
import dotenv from "dotenv";

// Load environment variables from .env file
dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL, // store it in .env
  ssl: {
    rejectUnauthorized: false, // required for Neon
  },
});

export async function testConnection() {
  try {
    const result = await pool.query("SELECT NOW()");
    console.log("Connected! Server time:", result.rows[0]);
  } catch (err) {
    console.error("Connection error:", err);
  }
}
