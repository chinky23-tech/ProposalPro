export const validateNotificationId = (data) => {
  const { id } = data;
  const numId = Number(id);
  if (!id || isNaN(numId) || numId <= 0) {
    throw new Error("Invalid notification ID");
  }
  return { id: numId };
};

export const validateCreateNotification = (data) => {
  const { proposalId, title, message, type } = data;

  if (!title || typeof title !== "string" || !title.trim()) {
    throw new Error("Notification title is required");
  }

  if (!message || typeof message !== "string" || !message.trim()) {
    throw new Error("Notification message is required");
  }

  return {
    proposalId: proposalId ? Number(proposalId) : null,
    title: title.trim(),
    message: message.trim(),
    type: type || "general",
  };
};