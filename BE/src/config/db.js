import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

const connectionString = process.env.DATABASE_URL;
const usesNeon = !!connectionString && connectionString.includes("neon");

const poolConfig = connectionString
  ? {
      connectionString,
      ssl: usesNeon ? { rejectUnauthorized: false } : false,
    }
  : {
      host: process.env.PGHOST || 'localhost',
      port: process.env.PGPORT || 5432,
      user: process.env.PGUSER || 'postgres',
      password: process.env.PGPASSWORD || 'password',
      database: process.env.PGDATABASE || 'wallee_db',
    };

const pool = new Pool(poolConfig);

if (connectionString) {
  console.log(`DB: using DATABASE_URL${usesNeon ? ' (Neon SSL)' : ''}`);
} else {
  console.log(`DB: using local PG config ${poolConfig.host}:${poolConfig.port}/${poolConfig.database}`);
}

export default pool;