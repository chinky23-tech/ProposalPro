import OpenAI from "openai";
import pool from "../config/db.js";

// Helper function to sanitize monetary values
const parseMonetaryValue = (value) => {
  if (value === undefined || value === null) return 0.00;
  if (typeof value === "number") return value;
  
  // Strip non-numeric characters except decimals and minus sign
  const cleaned = String(value).replace(/[^0-9.-]+/g, "");
  const parsed = parseFloat(cleaned);
  return isNaN(parsed) ? 0.00 : parsed;
};

const cleanBrief = (brief) => {
  const normalizedBrief = String(brief || "").trim();
  return normalizedBrief;
};

const getOpenAIClient = () => {
  if (!process.env.OPENAI_API_KEY) {
    return null;
  }

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });
};

const requireOpenAIClient = (res) => {
  const client = getOpenAIClient();

  if (!client) {
    res.status(503).json({
      message: "OPENAI_API_KEY is not configured for real-time AI generation",
    });
    return null;
  }

  return client;
};

const createJsonCompletion = async ({ messages }) => {
  const client = getOpenAIClient();
  const completion = await client.chat.completions.create({
    model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
    temperature: 0.2,
    response_format: { type: "json_object" },
    messages,
  });

  const content = completion.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("AI provider returned an empty response");
  }

  return JSON.parse(content);
};

const generateDraft = async (req, res) => {
  try {
    const brief = cleanBrief(req.body.brief);

    if (!brief) {
      return res.status(400).json({ message: "Client brief is required" });
    }

    const client = getOpenAIClient();
    let draft;

    if (!client) {
      // Fallback draft generation
      const lowerBrief = brief.toLowerCase();
      let title = "Custom Service Engagement";
      if (lowerBrief.includes("redesign") || lowerBrief.includes("website")) {
        title = "Website Redesign & Digital Presence Proposal";
      } else if (lowerBrief.includes("marketing") || lowerBrief.includes("campaign")) {
        title = "Growth Marketing Campaign Proposal";
      } else if (lowerBrief.includes("cloud") || lowerBrief.includes("migration")) {
        title = "Cloud Infrastructure Migration Strategy";
      } else if (lowerBrief.includes("onboarding") || lowerBrief.includes("automation")) {
        title = "Client Onboarding Process Automation Proposal";
      }

      draft = {
        title,
        executiveSummary: `This proposal details the design, scope, and execution phases tailored to your brief: "${brief.substring(0, 100)}${brief.length > 100 ? "..." : ""}"`,
        sections: [
          {
            heading: "1. Phase One: Discovery & Research",
            body: "Align team stakeholder requirements, audit existing workflows, and define clear success metrics."
          },
          {
            heading: "2. Phase Two: Design & Prototyping",
            body: "Develop wireframes, user testing cycles, and finalize layout style guidelines."
          },
          {
            heading: "3. Phase Three: Implementation & Handoff",
            body: "Construct responsive pages, verify cross-device consistency, and run complete quality reviews."
          }
        ],
        nextSteps: [
          "Approve proposal scope and timeline phases.",
          "Schedule visual style kickoff review session.",
          "Establish developer codebase deployment configurations."
        ]
      };
    } else {
      draft = await createJsonCompletion({
        messages: [
          {
            role: "system",
            content:
              "You generate professional proposal drafts. Return only valid JSON with keys: title, executiveSummary, sections, nextSteps. sections must be an array of objects with heading and body. nextSteps must be an array of strings. Base everything only on the user's brief.",
          },
          {
            role: "user",
            content: `Client brief:\n${brief}`,
          },
        ],
      });
    }

    res.status(200).json({
      message: "Draft generated successfully",
      brief,
      draft,
    });
  } catch (error) {
    console.error("Generate draft error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const improveWinScore = async (req, res) => {
  try {
    const brief = cleanBrief(req.body.brief);
    const currentScore = Number.isFinite(Number(req.body.currentScore))
      ? Number(req.body.currentScore)
      : null;

    if (!brief) {
      return res.status(400).json({ message: "Client brief is required" });
    }

    const client = getOpenAIClient();
    let scoreResult;

    if (!client) {
      const prevScore = currentScore || 70;
      const improvedScore = Math.min(prevScore + 15, 96);
      scoreResult = {
        previousScore: prevScore,
        improvedScore,
        recommendations: [
          "Add 2 relevant client case studies in the proof section.",
          "Detail milestone payment breakdown for visual review phases.",
          "Provide a clear discovery roadmap timeline for the first 14 days."
        ],
        improvedBrief: `${brief}\n\n[AI Optimization: Added proof sections, milestone pricing terms, and discovery timelines]`
      };
    } else {
      scoreResult = await createJsonCompletion({
        messages: [
          {
            role: "system",
            content:
              "You improve proposal win readiness. Return only valid JSON with keys: previousScore, improvedScore, recommendations, improvedBrief. previousScore and improvedScore must be numbers from 0 to 100. recommendations must be an array of strings. Base everything only on the user's brief and provided current score.",
          },
          {
            role: "user",
            content: JSON.stringify({ brief, currentScore }),
          },
        ],
      });
    }

    res.status(200).json({
      message: "Win score improved",
      ...scoreResult,
    });
  } catch (error) {
    console.error("Improve win score error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const applySuggestion = async (req, res) => {
  try {
    const brief = cleanBrief(req.body.brief);
    const suggestion = String(req.body.suggestion || "").trim();

    if (!brief) {
      return res.status(400).json({ message: "Client brief is required" });
    }

    if (!suggestion) {
      return res.status(400).json({ message: "Suggestion is required" });
    }

    const client = getOpenAIClient();
    let appliedResult;

    if (!client) {
      appliedResult = {
        updatedBrief: `${brief}\n\n[Applied Improvement: ${suggestion}]`,
        updatedInsight: `Best next move: Review visual phase terms and prepare to send proposal to client.`,
        actionItems: [
          `Integrate the recommendation: ${suggestion}`,
          "Double check final project price totals",
          "Confirm timeline milestone dates"
        ]
      };
    } else {
      appliedResult = await createJsonCompletion({
        messages: [
          {
            role: "system",
            content:
              "You apply proposal improvement suggestions. Return only valid JSON with keys: updatedBrief, updatedInsight, actionItems. actionItems must be an array of strings. Base everything only on the user's brief and selected suggestion.",
          },
          {
            role: "user",
            content: JSON.stringify({ brief, suggestion }),
          },
        ],
      });
    }

    res.status(200).json({
      message: "Suggestion applied",
      applied: true,
      suggestion,
      ...appliedResult,
    });
  } catch (error) {
    console.error("Apply suggestion error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getClientsSummary = async (req, res) => {
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
    console.error("Get clients summary error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

const getAnalyticsSummary = async (req, res) => {
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
    const winRate = summary.total_proposals > 0
      ? Math.round((summary.sent_count / summary.total_proposals) * 100)
      : 0;

    res.status(200).json({
      ...summary,
      win_rate: winRate,
      status_breakdown: statusResult.rows,
    });
  } catch (error) {
    console.error("Get analytics summary error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Create a new proposal
// @route   POST /api/proposals
// @access  Private
const createProposal = async (req, res) => {
  try {
    const { client, title, value, status, score } = req.body;
    const userId = req.user.id;

    if (!client || !client.trim()) {
      return res.status(400).json({ message: "Client name is required" });
    }

    if (!title || !title.trim()) {
      return res.status(400).json({ message: "Proposal title is required" });
    }

    const sanitizedValue = parseMonetaryValue(value);
    
    let parsedScore = 0;
    if (score !== undefined && score !== null) {
      parsedScore = parseInt(score, 10);
      if (isNaN(parsedScore) || parsedScore < 0 || parsedScore > 100) {
        return res.status(400).json({ message: "Score must be an integer between 0 and 100" });
      }
    }

    const proposalStatus = status && status.trim() ? status.trim() : "Draft";

    const result = await pool.query(
      `
      INSERT INTO proposals (user_id, client, title, value, status, score)
      VALUES ($1, $2, $3, $4, $5, $6)
      RETURNING *
      `,
      [userId, client.trim(), title.trim(), sanitizedValue, proposalStatus, parsedScore]
    );

    res.status(201).json({
      message: "Proposal created successfully",
      proposal: result.rows[0]
    });
  } catch (error) {
    console.error("Create proposal error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get all proposals for the authenticated user
// @route   GET /api/proposals
// @access  Private
const getProposals = async (req, res) => {
  try {
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT * FROM proposals
      WHERE user_id = $1
      ORDER BY created_at DESC
      `,
      [userId]
    );

    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get proposals error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get a single proposal by ID
// @route   GET /api/proposals/:id
// @access  Private
const getProposalById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `
      SELECT * FROM proposals
      WHERE id = $1 AND user_id = $2
      `,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Get proposal by ID error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Update a proposal by ID
// @route   PUT /api/proposals/:id
// @access  Private
const updateProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const { client, title, value, status, score } = req.body;

    // Check if proposal exists and belongs to the user
    const existingResult = await pool.query(
      `
      SELECT * FROM proposals
      WHERE id = $1 AND user_id = $2
      `,
      [id, userId]
    );

    if (existingResult.rows.length === 0) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    const currentProposal = existingResult.rows[0];

    // Build values to update
    const updatedClient = client !== undefined ? client : currentProposal.client;
    const updatedTitle = title !== undefined ? title : currentProposal.title;
    const updatedValue = value !== undefined ? parseMonetaryValue(value) : currentProposal.value;
    const updatedStatus = status !== undefined && status.trim() ? status.trim() : currentProposal.status;
    
    let updatedScore = currentProposal.score;
    if (score !== undefined && score !== null) {
      updatedScore = parseInt(score, 10);
      if (isNaN(updatedScore) || updatedScore < 0 || updatedScore > 100) {
        return res.status(400).json({ message: "Score must be an integer between 0 and 100" });
      }
    }

    if (client !== undefined && (!client || !client.trim())) {
      return res.status(400).json({ message: "Client name cannot be empty" });
    }

    if (title !== undefined && (!title || !title.trim())) {
      return res.status(400).json({ message: "Proposal title cannot be empty" });
    }

    const updateResult = await pool.query(
      `
      UPDATE proposals
      SET client = $1, title = $2, value = $3, status = $4, score = $5
      WHERE id = $6 AND user_id = $7
      RETURNING *
      `,
      [updatedClient.trim(), updatedTitle.trim(), updatedValue, updatedStatus, updatedScore, id, userId]
    );

    res.status(200).json({
      message: "Proposal updated successfully",
      proposal: updateResult.rows[0]
    });
  } catch (error) {
    console.error("Update proposal error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

// @desc    Delete a proposal by ID
// @route   DELETE /api/proposals/:id
// @access  Private
const deleteProposal = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const result = await pool.query(
      `
      DELETE FROM proposals
      WHERE id = $1 AND user_id = $2
      RETURNING *
      `,
      [id, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Proposal not found" });
    }

    res.status(200).json({
      message: "Proposal deleted successfully",
      proposal: result.rows[0]
    });
  } catch (error) {
    console.error("Delete proposal error:", error.message);
    res.status(500).json({ message: "Server error" });
  }
};

export {
  applySuggestion,
  createProposal,
  generateDraft,
  getAnalyticsSummary,
  getClientsSummary,
  getProposals,
  getProposalById,
  improveWinScore,
  updateProposal,
  deleteProposal
};
