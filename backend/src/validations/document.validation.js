const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/webp"
];

const ALLOWED_RELATION_TYPES = ["PROPOSAL", "CLIENT", "ORGANIZATION"];
const ALLOWED_FILE_TYPES = ["IMAGE", "PDF", "CONTRACT", "CASE_STUDY", "PRICING"];
const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB limit

export const validateUploadInput = (file, body) => {
  const { relationType, relationId, fileType } = body;

  // Check if file exists in request
  if (!file) {
    return "No file provided in the 'file' field.";
  }

  // Validate File Size
  if (file.size > MAX_FILE_SIZE) {
    return "File size exceeds the 15MB maximum limit.";
  }

  // Validate Mime-Type
  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return `Invalid file format (${file.mimetype}). Only PDFs and standard images (JPEG, PNG, WebP) are allowed.`;
  }

  // Validate File Category Type
  if (!ALLOWED_FILE_TYPES.includes(fileType)) {
    return `Invalid fileType. Must be one of: ${ALLOWED_FILE_TYPES.join(", ")}`;
  }

  // Validate Optional Structural Relationships
  if (relationType && !ALLOWED_RELATION_TYPES.includes(relationType)) {
    return `Invalid relationType. Must be one of: ${ALLOWED_RELATION_TYPES.join(", ")}`;
  }

  if (relationType && !relationId) {
    return "A relationId must be provided if relationType is specified.";
  }

  return null; // Passes validation perfectly
};