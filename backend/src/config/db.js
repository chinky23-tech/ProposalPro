import { Pool } from "pg";
import { runMigrations } from "../db/migrate.js";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

pool.connect()
  .then(async () => {
    console.log("PostgreSQL Connected");
    try {
      await runMigrations();
    } catch (err) {
      console.error("Database migration during connect phase failed:", err.message);
    }
  })
  .catch((err) => {
    console.error("DB Connection Error:", err.message);
  });

export default pool;