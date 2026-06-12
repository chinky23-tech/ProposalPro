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
    // Safety check: Make sure req.body exists
    const body = req.body || {};
    
    if (!body.brief) {
      return res.status(400).json({ message: "The 'brief' property is required in the request body." });
    }

    const brief = validateBrief(body.brief);
    const result = await generateDraftService({ brief });

    return res.status(200).json(result);
  } catch (error) {
    console.error("Generate draft error:", error?.message || error);

    if (
      error?.message?.includes("required") ||
      error?.message?.includes("between")
    ) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

// Improve winscore
export const improveWinScore = async (req, res) => {
  try {
    const body = req.body || {};
    
    // Safety check: Ensure the validation yields a valid object
    const data = validateImproveScore(body);
    if (!data) {
      return res.status(400).json({ message: "Invalid request data. Please provide a brief." });
    }

    const result = await improveWinScoreService(data);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Improve win score error:", error?.message || error);

    if (
      error?.message?.includes("required") ||
      error?.message?.includes("between")
    ) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};

// Apply suggestion
export const applySuggestion = async (req, res) => {
  try {
    const body = req.body || {};

    const data = validateSuggestion(body);
    if (!data) {
      return res.status(400).json({ message: "Invalid request data. Missing required components." });
    }

    const result = await applySuggestionService(data);

    return res.status(200).json(result);
  } catch (error) {
    console.error("Apply suggestion error:", error?.message || error);

    if (
      error?.message?.includes("required") ||
      error?.message?.includes("between")
    ) {
      return res.status(400).json({ message: error.message });
    }

    return res.status(500).json({
      message: error?.message || "Internal Server Error",
    });
  }
};