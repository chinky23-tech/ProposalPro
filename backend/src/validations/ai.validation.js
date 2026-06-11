export const validateBrief = (brief) => {
  const cleanedBrief = String(brief || "").trim();

  if (!cleanedBrief) {
    throw new Error("Client brief is required");
  }

  return cleanedBrief;
};

export const validateImproveScore = ({ brief, currentScore }) => {
  const cleanedBrief = validateBrief(brief);

  // Default to null if it's not provided
  let parsedScore = null; 

  if (currentScore !== undefined && currentScore !== null && currentScore !== "") {
    parsedScore = Number(currentScore);

    if (Number.isNaN(parsedScore) || parsedScore < 0 || parsedScore > 100) {
      throw new Error("Current score must be between 0 and 100");
    }
  }

  return {
    brief: cleanedBrief,
    currentScore: parsedScore, // Will pass cleanly as a valid number or null
  };
};

export const validateSuggestion = ({
  brief,
  suggestion,
}) => {
  const cleanedBrief = validateBrief(brief);

  const cleanedSuggestion = String(
    suggestion || ""
  ).trim();

  if (!cleanedSuggestion) {
    throw new Error("Suggestion is required");
  }

  return {
    brief: cleanedBrief,
    suggestion: cleanedSuggestion,
  };
};