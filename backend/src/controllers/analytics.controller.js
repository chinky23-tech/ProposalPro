import * as analyticsService from "../services/analytics.service.js";

/**
 * Handles the HTTP request layer to return the processed dashboard statistics summary
 */
export const getAnalyticsSummary = async (req, res) => {
  try {
    // 1. Extract the authenticated user ID added by your protect middleware
    const userId = req.user.id;

    // 2. Delegate data gathering and business rules to the service layer
    const processedSummary = await analyticsService.calculateAnalyticsSummary(userId);

    // 3. Return the clean JSON structure
    return res.status(200).json(processedSummary);
  } catch (error) {
    console.error("Analytics controller processing failure:", error);
    return res.status(500).json({ 
      success: false, 
      message: error.message || "Internal server error assembling metrics pipeline data engines." 
    });
  }
};