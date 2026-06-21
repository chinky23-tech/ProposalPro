import * as analyticsRepository from "../repositories/analytics.repository.js";

/**
 * Processes raw database metrics and applies business rules to build the analytics dashboard payload
 * @param {number|string} userId - The authenticated user's ID
 * @returns {Promise<Object>} Calculated and structured analytics summary
 */
export const calculateAnalyticsSummary = async (userId) => {
  // 1. Grab the raw metrics straight from the repository layer
  const { rawSummary, rawStatusBreakdown } = await analyticsRepository.fetchAnalyticsData(userId);

  // 2. Advanced Win Rate Calculation Logic
  // Total closed deals that reached a final decision outcome
  const closedDealsCount = rawSummary.won_count + rawSummary.lost_count + rawSummary.rejected_count;

  const winRate = closedDealsCount > 0
    ? Math.round((rawSummary.won_count / closedDealsCount) * 100)
    : 0;

  // 3. Assemble and return the clean business data engine package
  return {
    total_proposals: rawSummary.total_proposals,
    total_value: rawSummary.total_value,
    average_score: rawSummary.average_score,
    draft_count: rawSummary.draft_count,
    review_count: rawSummary.review_count,
    sent_count: rawSummary.sent_count,
    viewed_count: rawSummary.viewed_count,
    accepted_count: rawSummary.accepted_count,
    rejected_count: rawSummary.rejected_count,
    won_count: rawSummary.won_count,
    lost_count: rawSummary.lost_count,
    win_rate: winRate,
    status_breakdown: rawStatusBreakdown,
  };
};