import pool from "../config/db.js";

export const create = async (doc) => {
  const query = `
    INSERT INTO documents (
      file_name, 
      file_url, 
      file_type, 
      mime_type, 
      file_size, 
      owner_id, 
      relation_type, 
      relation_id
    )
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    RETURNING *;
  `;

  const values = [
    doc.fileName,
    doc.fileUrl,
    doc.fileType,
    doc.mimeType,
    doc.fileSize,
    doc.ownerId,
    doc.relationType,
    doc.relationId
  ];

  const result = await pool.query(query, values);
  return result.rows[0];
};

export const findById = async (id) => {
  const query = `SELECT * FROM documents WHERE id = $1;`;
  const result = await pool.query(query, [id]);
  return result.rows[0] || null;
};

export const findByRelation = async (relationType, relationId) => {
  const query = `
    SELECT * FROM documents 
    WHERE relation_type = $1 AND relation_id = $2
    ORDER BY created_at DESC;
  `;
  const result = await pool.query(query, [relationType, relationId]);
  return result.rows;
};

export const deleteById = async (id) => {
  const query = `DELETE FROM documents WHERE id = $1 RETURNING id;`;
  const result = await pool.query(query, [id]);
  return result.rows[0];
};