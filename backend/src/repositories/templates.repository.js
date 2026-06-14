import pool from "../config/db.js";

export const insertTemplate = async (templateData) => {
  const { user_id, title, content } = templateData;
  const result = await pool.query(
    `
    INSERT INTO templates (user_id, title, content)
    VALUES ($1, $2, $3)
    RETURNING *
    `,
    [user_id, title, content]
  );
  return result.rows[0];
};

export const selectTemplatesByUserId = async (userId) => {
  const result = await pool.query(
    "SELECT * FROM templates WHERE user_id = $1 ORDER BY created_at DESC",
    [userId]
  );
  return result.rows;
};

export const selectTemplateById = async (id) => {
  const result = await pool.query(
    "SELECT * FROM templates WHERE id = $1",
    [id]
  );
  return result.rows[0] || null;
};

export const updateTemplateById = async (id, templateData) => {
  const { title, content } = templateData;
  const result = await pool.query(
    `
    UPDATE templates 
    SET title = $1, content = $2, updated_at = NOW()
    WHERE id = $3
    RETURNING *
    `,
    [title, content, id]
  );
  return result.rows[0];
};

export const deleteTemplateById = async (id) => {
  await pool.query("DELETE FROM templates WHERE id = $1", [id]);
  return true;
};