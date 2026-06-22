export const validateCreateProposal = ({
  client,
  title,
  score,
  brief,
  content,
}) => {
  if (!client || !client.trim()) {
    throw new Error("Client name is required");
  }

  if (!title || !title.trim()) {
    throw new Error("Proposal title is required");
  }

  let parsedScore = 0;

  if (score !== undefined && score !== null) {
    parsedScore = parseInt(score, 10);

    if (
      Number.isNaN(parsedScore) ||
      parsedScore < 0 ||
      parsedScore > 100
    ) {
      throw new Error(
        "Score must be an integer between 0 and 100"
      );
    }
  }

  return {
    client: client.trim(),
    title: title.trim(),
    score: parsedScore,
    brief: brief !== undefined ? brief.trim() : null,
    content: content !== undefined ? content.trim() : null,
  };
};

export const validateUpdateProposal = ({
  client,
  title,
  score,
  brief,   
  content, 
}) => {
  if (
    client !== undefined &&
    (!client || !client.trim())
  ) {
    throw new Error(
      "Client name cannot be empty"
    );
  }

  if (
    title !== undefined &&
    (!title || !title.trim())
  ) {
    throw new Error(
      "Proposal title cannot be empty"
    );
  }

  let parsedScore = undefined; // Default to undefined so it isn't overwritten if not passed

  if (score !== undefined) {
    if (score === null) {
      parsedScore = null;
    } else {
      parsedScore = parseInt(score, 10);

      if (
        Number.isNaN(parsedScore) ||
        parsedScore < 0 ||
        parsedScore > 100
      ) {
        throw new Error(
          "Score must be an integer between 0 and 100"
        );
      }
    }
  }

  return {
    client:
      client !== undefined
        ? client.trim()
        : undefined,

    title:
      title !== undefined
        ? title.trim()
        : undefined,

    score: parsedScore,

    // Safely handles partial updates for brief
    brief:
      brief !== undefined
        ? (brief === null ? null : brief.trim())
        : undefined,

    // Safely handles partial updates for content
    content:
      content !== undefined
        ? (content === null ? null : content.trim())
        : undefined,
  };
};
/**
 * Ensures the target parameter path contains a valid record ID format
 */
export const validateProposalIdParam = (req, res, next) => {
  const { id } = req.params;
  const safeIdRegex = /^[a-zA-Z0-9-]+$/;

  if (!id || !safeIdRegex.test(id)) {
    return res.status(400).json({
      success: false,
      message: "Validation Error: Target proposal identifier format is invalid."
    });
  }
  next();
};