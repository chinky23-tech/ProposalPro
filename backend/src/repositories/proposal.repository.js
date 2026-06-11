import pool from "../config/db.js";

export const createProposal = async ({
  userId,
  client,
  title,
  value,
  status,
  score,
}) => {
  const result = await pool.query(
    `
    INSERT INTO proposals (user_id, client, title, value, status, score)
    VALUES ($1, $2, $3, $4, $5, $6)
    RETURNING *
    `,
    [userId, client, title, value, status, score]
  );

  return result.rows[0];
};

export const getAllProposals = async (userId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM proposals
    WHERE user_id = $1
    ORDER BY created_at DESC
    `,
    [userId]
  );

  return result.rows;
};

export const getProposalById = async (proposalId, userId) => {
  const result = await pool.query(
    `
    SELECT *
    FROM proposals
    WHERE id = $1 AND user_id = $2
    `,
    [proposalId, userId]
  );

  return result.rows[0] || null;
};

export const updateProposal = async ({
  proposalId,
  userId,
  client,
  title,
  value,
  status,
  score,
}) => {
  const result = await pool.query(
    `
    UPDATE proposals
    SET
      client = $1,
      title = $2,
      value = $3,
      status = $4,
      score = $5
    WHERE id = $6 AND user_id = $7
    RETURNING *
    `,
    [client, title, value, status, score, proposalId, userId]
  );

  return result.rows[0];
};

export const deleteProposal = async (proposalId, userId) => {
  const result = await pool.query(
    `
    DELETE FROM proposals
    WHERE id = $1 AND user_id = $2
    RETURNING *
    `,
    [proposalId, userId]
  );

  return result.rows[0];
};

// Reusing getProposalById to keep code DRY (Don't Repeat Yourself)
export const proposalExists = async (proposalId, userId) => {
  return await getProposalById(proposalId, userId);
};