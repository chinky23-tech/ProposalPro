import * as documentValidation from "../validations/document.validation.js";
import * as documentService from "../services/document.service.js";
export const uploadDocument = async (req, res) => {
  try {
    const file = req.file;
    const { relationType, relationId, fileType } = req.body;
    const ownerId = req.user.id; // Extracted from auth middleware

    // 1. Validation Layer Check
    const validationError = documentValidation.validateUploadInput(file, { relationType, relationId, fileType });
    if (validationError) {
      return res.status(400).json({ success: false, message: validationError });
    }

    // 2. Pass to Service Layer
    const newDocument = await documentService.processUpload({
      file,
      fileType,
      relationType,
      relationId,
      ownerId
    });

    return res.status(201).json({
      success: true,
      message: "File uploaded successfully",
      data: newDocument
    });
  } catch (error) {
    console.error("Error in uploadDocument controller:", error);
    return res.status(500).json({ success: false, message: "Internal server error during upload" });
  }
};

export const getDocumentDownloadUrl = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Call service to check permissions and get secure link
    const downloadUrl = await documentService.getSecureDownloadUrl(id, userId);

    return res.status(200).json({
      success: true,
      url: downloadUrl
    });
  } catch (error) {
    console.error("Error in getDocumentDownloadUrl controller:", error);
    if (error.message === "Document not found") return res.status(404).json({ success: false, message: error.message });
    if (error.message === "Unauthorized access to this document") return res.status(403).json({ success: false, message: error.message });
    
    return res.status(500).json({ success: false, message: "Internal server error fetching download URL" });
  }
};

export const deleteDocument = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    await documentService.processDelete(id, userId);

    return res.status(200).json({ success: true, message: "Document deleted successfully" });
  } catch (error) {
    console.error("Error in deleteDocument controller:", error);
    if (error.message === "Document not found") return res.status(404).json({ success: false, message: error.message });
    if (error.message === "Unauthorized to delete this document") return res.status(403).json({ success: false, message: error.message });

    return res.status(500).json({ success: false, message: "Internal server error during deletion" });
  }
};