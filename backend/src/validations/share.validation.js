/**
 * Express middleware to validate the Create Share Link payload
 */
export const validateCreateShare = (req, res, next) => {
  const { clientEmail, durationDays } = req.body;
  const { proposalId } = req.params;

  // 1. Updated validation: Allow numbers, letters, or UUID hyphens safely
  const safeIdRegex = /^[a-zA-Z0-9-]+$/;
  if (!proposalId || !safeIdRegex.test(proposalId)) {
    return res.status(400).json({
      success: false,
      message: "Validation Error: Invalid proposal ID format."
    });
  }

  // 2. Validate Client Email
  if (!clientEmail) {
    return res.status(400).json({
      success: false,
      message: "Validation Error: clientEmail field is required."
    });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(clientEmail)) {
    return res.status(400).json({
      success: false,
      message: "Validation Error: Please provide a valid email address structure."
    });
  }

  // 3. Validate Optional Lifespan Duration
  if (durationDays !== undefined) {
    const days = parseInt(durationDays, 10);
    if (isNaN(days) || days <= 0 || days > 365) {
      return res.status(400).json({
        success: false,
        message: "Validation Error: durationDays must be a positive integer between 1 and 365."
      });
    }
    req.body.durationDays = days;
  }

  next();
};