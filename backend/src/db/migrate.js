import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import pool from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const runMigrations = async () => {
  const client = await pool.connect();
  try {
    console.log("Starting database migrations...");

    // 1. Create schema_migrations tracking table if it doesn't exist
    await client.query(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) UNIQUE NOT NULL,
        executed_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Read migration files
    const migrationsDir = path.join(__dirname, "migrations");
    if (!fs.existsSync(migrationsDir)) {
      console.log("No migrations directory found. Skipping migrations.");
      return;
    }

    const files = fs.readdirSync(migrationsDir)
      .filter(file => file.endsWith(".sql"))
      .sort(); // Sorts alphabetically (001, 002, etc.)

    // 3. Get already executed migrations
    const { rows } = await client.query("SELECT name FROM schema_migrations");
    const executedMigrations = new Set(rows.map(r => r.name));

    let runCount = 0;

    // 4. Run pending migrations in a transaction
    for (const file of files) {
      if (!executedMigrations.has(file)) {
        console.log(`Executing migration: ${file}`);
        const filePath = path.join(migrationsDir, file);
        const sql = fs.readFileSync(filePath, "utf8");

        await client.query("BEGIN");
        try {
          await client.query(sql);
          await client.query(
            "INSERT INTO schema_migrations (name) VALUES ($1)",
            [file]
          );
          await client.query("COMMIT");
          console.log(`Migration completed: ${file}`);
          runCount++;
        } catch (err) {
          await client.query("ROLLBACK");
          console.error(`Error in migration ${file}:`, err.message);
          throw err;
        }
      }
    }

    if (runCount === 0) {
      console.log("No new migrations to run.");
    } else {
      console.log(`Database migrations completed successfully. Run count: ${runCount}`);
    }
  } catch (error) {
    console.error("Database migration runner failed:", error.message);
    throw error;
  } finally {
    client.release();
  }
};
export default runMigrations;
