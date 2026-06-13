import pool from "../config/db.js";

export const insertPackage = async (packageData) => {
  const { user_id, name, description, price, features } = packageData;
  const result = await pool.query(
    `
    INSERT INTO packages (user_id, name, description, price, features)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `,
    [user_id, name, description, price, features]
  );
  return result.rows[0];
};

export const selectPackagesByUserId = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM packages WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return result.rows;
};

export const selectPackageById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM packages WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
};

export const updatePackageById = async (id, packageData) => {
  const { name, description, price, features } = packageData;
  const result = await pool.query(
    `
    UPDATE packages 
    SET name = $1, description = $2, price = $3, features = $4, updated_at = NOW()
    WHERE id = $5
    RETURNING *
    `,
    [name, description, price, features, id]
  );
  return result.rows[0];
};

export const deletePackageById = async (id) => {
  await pool.query("DELETE FROM packages WHERE id = $1", [id]);
  return true;
};