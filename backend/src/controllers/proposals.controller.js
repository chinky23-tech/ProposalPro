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
  createProposal,
  getProposals,
  getProposalById,
  updateProposal,
  deleteProposal
};