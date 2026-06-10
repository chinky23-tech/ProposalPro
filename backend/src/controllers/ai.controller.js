import {
  generateDraftService,
  improveWinScoreService,
  applySuggestionService
} from "../services/openai.service.js";

export const generateDraft = async (req, res) => {
  try {
    const result = await generateDraftService(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error("Generate draft error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const improveWinScore = async (req, res) => {
  try {
    const result = await improveWinScoreService(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error("Improve win score error:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const applySuggestion = async (req, res) => {
  try {
    const result = await applySuggestionService(req.body);
    res.status(200).json(result);
  } catch (error) {
    console.error("Apply suggestion error:", error.message);
    res.status(500).json({ message: error.message });
  }
};