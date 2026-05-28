import { Pool } from "pg";

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

const initDb = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS proposals (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        client VARCHAR(255) NOT NULL,
        title VARCHAR(255) NOT NULL,
        value NUMERIC(12, 2) NOT NULL DEFAULT 0.00,
        status VARCHAR(50) NOT NULL DEFAULT 'Draft',
        score INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Database tables verified/created successfully");
  } catch (err) {
    console.error("Error initializing database tables:", err.message);
  }
};

pool.connect()
  .then(async () => {
    console.log("PostgreSQL Connected");
    await initDb();
  })
  .catch((err) => {
    console.error("DB Connection Error:", err.message);
  });

export default pool;