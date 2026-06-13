import pool from "../config/db.js";

export const insertClient = async (clientData) => {
  const { user_id, name, email, phone, company } = clientData;
  const result = await pool.query(
    `
    INSERT INTO clients (user_id, name, email, phone, company)
    VALUES ($1, $2, $3, $4, $5)
    RETURNING *
    `, 
    [user_id, name, email, phone, company]
  );
  return result.rows[0];
};

export const selectClientsByUserId = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM clients WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return result.rows;
};

export const selectClientById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM clients WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
};

export const updateClientById = async (id, clientData) => {
  const { name, email, phone, company } = clientData;
  const result = await pool.query(
    `
    UPDATE clients 
    SET name = $1, email = $2, phone = $3, company = $4, updated_at = NOW()
    WHERE id = $5
    RETURNING *
    `,
    [name, email, phone, company, id]
  );
  return result.rows[0];
};

export const deleteClientById = async (id) => {
  await pool.query("DELETE FROM clients WHERE id = $1", [id]);
  return true;
};