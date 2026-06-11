import OpenAI from "openai";

const cleanBrief = (brief) => {
  return String(brief || "").trim();
};

const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

const createJsonCompletion = async ({ messages }) => {
  const client = getOpenAIClient();

  if (!client) {
    throw new Error("OpenAI API key not configured");
  }

  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages,
  });

  const content = completion.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("AI provider returned empty response");
  }

  return JSON.parse(content);
};

export const generateDraftService = async ({ brief }) => {
  const cleanedBrief = cleanBrief(brief);

  if (!cleanedBrief) {
    throw new Error("Client brief is required");
  }

  return createJsonCompletion({
    messages: [
      {
        role: "system",
        content:
          "You generate professional proposal drafts. Return valid JSON with title, executiveSummary, sections, nextSteps.",
      },
      {
        role: "user",
        content: cleanedBrief,
      },
    ],
  });
};

export const improveWinScoreService = async ({
  brief,
  currentScore,
}) => {
  const cleanedBrief = cleanBrief(brief);

  if (!cleanedBrief) {
    throw new Error("Client brief is required");
  }

  return createJsonCompletion({
    messages: [
      {
        role: "system",
        content:
          "Return JSON with previousScore, improvedScore, recommendations, improvedBrief.",
      },
      {
        role: "user",
        content: JSON.stringify({
          brief: cleanedBrief,
          currentScore,
        }),
      },
    ],
  });
};

export const applySuggestionService = async ({
  brief,
  suggestion,
}) => {
  const cleanedBrief = cleanBrief(brief);

  if (!cleanedBrief) {
    throw new Error("Client brief is required");
  }

  return createJsonCompletion({
    messages: [
      {
        role: "system",
        content:
          "Return JSON with updatedBrief, updatedInsight, actionItems.",
      },
      {
        role: "user",
        content: JSON.stringify({
          brief: cleanedBrief,
          suggestion,
        }),
      },
    ],
  });
};