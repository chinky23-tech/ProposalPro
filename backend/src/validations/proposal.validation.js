export const validateCreateProposal = ({
  client,
  title,
  score,
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
  };
};

export const validateUpdateProposal = ({
  client,
  title,
  score,
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

  let parsedScore = null;

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
    client:
      client !== undefined
        ? client.trim()
        : undefined,

    title:
      title !== undefined
        ? title.trim()
        : undefined,

    score: parsedScore,
  };
};