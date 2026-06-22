import pg from "pg";
import  pool  from "../config/db.js"; 

export const createShare = async ({ proposalId, token, expiresAt }) => {
  const query = `
    INSERT INTO proposal_shares (proposal_id, token, expires_at)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;
  const values = [proposalId, token, expiresAt];
  const { rows } = await pool.query(query, values);
  return rows[0];
};

export const findByToken = async (token) => {
  const query = `
    SELECT ps.*, p.title as proposal_title, p.content as proposal_content, p.user_id, p.status
    FROM proposal_shares ps
    JOIN proposals p ON ps.proposal_id = p.id
    WHERE ps.token = $1;
  `;
  const { rows } = await pool.query(query, [token]);
  return rows[0];
};

export const incrementViewCount = async (token) => {
  const query = `
    UPDATE proposal_shares
    SET view_count = view_count + 1
    WHERE token = $1;
  `;
  await pool.query(query, [token]);
};
/**
 * Updates the structural status of a proposal record directly
 * @param {number|string} proposalId - The database primary key identifier
 * @param {string} status - The targeted pipeline stage configuration ('Sent', 'Viewed', etc.)
 */
export const updateProposalStatus = async (proposalId, status) => {
  const query = `
    UPDATE proposals
    SET status = $1
    WHERE id = $2;
  `;
  await pool.query(query, [status, proposalId]);
};