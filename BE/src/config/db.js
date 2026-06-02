import dotenv from "dotenv";
dotenv.config();

import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.PGHOST || 'localhost',
  port: process.env.PGPORT || 5432,
  user: process.env.PGUSER || 'postgres',
  password: process.env.PGPASSWORD || 'password',
  database: process.env.PGDATABASE || 'wallee_fiks',
});
console.log(process.env.PGHOST, process.env.PGPORT, process.env.PGUSER, process.env.PGPASSWORD, process.env.PGDATABASE);

console.log(`DB: connecting to ${pool.options.host}:${pool.options.port}/${pool.options.database}`);

export default pool;