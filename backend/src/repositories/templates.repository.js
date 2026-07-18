import pool from "../config/db.js";

export const insertTemplate = async (templateData) => {
  // 🛠️ 1. Extract category from the incoming data object
  const { user_id, title, content, category } = templateData;
  const result = await pool.query(
    `
    INSERT INTO templates (user_id, title, content, category)
    VALUES ($1, $2, $3, $4)
    RETURNING *
    `,
    // 🛠️ 2. Pass category to the $4 parameter array (with 'General' fallback)
    [user_id, title, content, category || "General"]
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
  // 🛠️ 3. Extract category here for updates
  const { title, content, category } = templateData;
  const result = await pool.query(
    `
    UPDATE templates 
    SET title = $1, content = $2, category = $3, updated_at = NOW()
    WHERE id = $4
    RETURNING *
    `,
    // 🛠️ 4. Align parameters: title($1), content($2), category($3), id($4)
    [title, content, category || "General", id]
  );
  return result.rows[0];
};

export const deleteTemplateById = async (id) => {
  await pool.query("DELETE FROM templates WHERE id = $1", [id]);
  return true;
};