import pool from "../config/db.js";

/**
 * Extracts raw statistical aggregates and pipeline distributions for a specific user
 * @param {number|string} userId - The authenticated user's ID
 * @returns {Promise<Object>} Raw database rows for metrics summary and status breakdown
 */
export const fetchAnalyticsData = async (userId) => {
  const [summaryResult, statusResult] = await Promise.all([
    // 1. Fetch overall performance metrics and status aggregates
    pool.query(
      `
      SELECT
        COUNT(*)::int AS total_proposals,
        COALESCE(SUM(value), 0)::float AS total_value,
        COALESCE(ROUND(AVG(score)), 0)::int AS average_score,
        COUNT(*) FILTER (WHERE status = 'Draft')::int AS draft_count,
        COUNT(*) FILTER (WHERE status = 'Review')::int AS review_count,
        COUNT(*) FILTER (WHERE status = 'Sent')::int AS sent_count,
        COUNT(*) FILTER (WHERE status = 'Viewed')::int AS viewed_count,
        COUNT(*) FILTER (WHERE status = 'Accepted')::int AS accepted_count,
        COUNT(*) FILTER (WHERE status = 'Rejected')::int AS rejected_count,
        COUNT(*) FILTER (WHERE status = 'Won')::int AS won_count,
        COUNT(*) FILTER (WHERE status = 'Lost')::int AS lost_count
      FROM proposals
      WHERE user_id = $1
      `,
      [userId]
    ),

    // 2. Fetch row distributions grouped by state for visual charts
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

  return {
    rawSummary: summaryResult.rows[0],
    rawStatusBreakdown: statusResult.rows
  };
};