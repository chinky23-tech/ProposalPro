import pool from "../config/db.js";

export const getClientsSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT
        client,
        COUNT(*)::int AS proposal_count,
        COALESCE(SUM(value), 0)::float AS total_value,
        COALESCE(ROUND(AVG(score)), 0)::int AS average_score,
        MAX(created_at) AS latest_activity
      FROM proposals
      WHERE user_id = $1
      GROUP BY client
      ORDER BY latest_activity DESC
      `,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};