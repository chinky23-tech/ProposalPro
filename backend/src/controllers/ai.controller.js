import {
  generateDraftService,
  improveWinScoreService,
  applySuggestionService
} from "../services/openai.service.js";

import {
  validateBrief,
  validateImproveScore,
  validateSuggestion,
} from "../validations/ai.validation.js";

// Generate draft
export const generateDraft = async (req, res) => {
  try {
    const brief = validateBrief(req.body.brief);

    const result = await generateDraftService({ brief });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Generate draft error:", error?.message || error);

    if (
      error?.message?.includes("required") ||
      error?.message?.includes("between")
    ) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

// Improve winscore
export const improveWinScore = async (req, res) => {
  try {
    const data = validateImproveScore(req.body);

    const result = await improveWinScoreService(data);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Improve win score error:", error?.message || error);

    if (
      error?.message?.includes("required") ||
      error?.message?.includes("between")
    ) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

// Apply suggestion
export const applySuggestion = async (req, res) => {
  try {
    const data = validateSuggestion(req.body);

    const result = await applySuggestionService(data);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Apply suggestion error:", error?.message || error);

    if (
      error?.message?.includes("required") ||
      error?.message?.includes("between")
    ) {
      return res.status(400).json({
        message: error.message,
      });
    }

    return res.status(500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};