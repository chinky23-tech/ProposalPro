import pool from "../config/db.js";

export const getAnalyticsSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    const [summaryResult, statusResult] = await Promise.all([
      pool.query(
        `
        SELECT
          COUNT(*)::int AS total_proposals,
          COALESCE(SUM(value), 0)::float AS total_value,
          COALESCE(ROUND(AVG(score)), 0)::int AS average_score,
          COUNT(*) FILTER (WHERE status = 'Sent')::int AS sent_count,
          COUNT(*) FILTER (WHERE status = 'Review')::int AS review_count,
          COUNT(*) FILTER (WHERE status = 'Draft')::int AS draft_count
        FROM proposals
        WHERE user_id = $1
        `,
        [userId]
      ),
      pool.query(
        `
        SELECT status, COUNT(*)::int AS count
        FROM proposals
        WHERE user_id = $1
        GROUP BY status
        ORDER BY status
        `,
        [userId]
      ),
    ]);

    const summary = summaryResult.rows[0];

    const winRate =
      summary.total_proposals > 0
        ? Math.round(
            (summary.sent_count / summary.total_proposals) * 100
          )
        : 0;

    res.status(200).json({
      ...summary,
      win_rate: winRate,
      status_breakdown: statusResult.rows,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};