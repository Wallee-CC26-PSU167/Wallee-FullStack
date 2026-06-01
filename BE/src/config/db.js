import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;
const usesNeon = !!connectionString && connectionString.includes("neon");

if (connectionString) {
  if (usesNeon) {
    console.log("DB: using DATABASE_URL pointing to Neon");
  } else {
    console.log("DB: using DATABASE_URL (non-Neon)");
  }
} else {
  console.log(
    `DB: no DATABASE_URL, falling back to PG env vars (PGHOST=${process.env.PGHOST || 'unset'})`
  );
}

const pool = new Pool({
  connectionString,
  ssl: usesNeon ? { rejectUnauthorized: false } : false,
});

export default pool;