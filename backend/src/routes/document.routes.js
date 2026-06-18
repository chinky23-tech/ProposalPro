import { Router } from "express";
import multer from "multer";
import protect from "../middleware/auth.middleware.js";
import {
  uploadDocument,
  getDocumentDownloadUrl,
  deleteDocument,
} from "../controllers/document.controller.js"; // Adjusted path to match your controller folder layout

const router = Router();

// Configure multer to store files temporarily in memory as a Buffer
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Apply authentication middleware globally to all routes below
router.use(protect);

/**
 * @openapi
 * /api/documents/upload:
 *   post:
 *     summary: Upload a new document or attachment
 *     tags:
 *       - Documents
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *               - fileType
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The file binary to upload (PDF, JPEG, PNG, WebP)
 *               fileType:
 *                 type: string
 *                 enum: [IMAGE, PDF, CONTRACT, CASE_STUDY, PRICING]
 *                 description: Category type of the document
 *               relationType:
 *                 type: string
 *                 enum: [PROPOSAL, CLIENT, ORGANIZATION]
 *                 description: Optional module entity relationship type
 *               relationId:
 *                 type: string
 *                 format: uuid
 *                 description: Optional structural target ID relating to relationType
 *     responses:
 *       '201':
 *         description: File uploaded successfully
 *       '400':
 *         description: Bad request (Invalid file type, payload mismatch, or size exceeded)
 *       '500':
 *         description: Internal server error
 */
router.post("/upload", upload.single("file"), uploadDocument);

/**
 * @openapi
 * /api/documents/{id}/download:
 *   get:
 *     summary: Get secure download or view URL for a document
 *     tags:
 *       - Documents
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the document
 *     responses:
 *       '200':
 *         description: Secure download URL generated successfully
 *       '403':
 *         description: Unauthorized access to this document
 *       '404':
 *         description: Document not found
 *       '500':
 *         description: Internal server error
 */
router.get("/:id/download", getDocumentDownloadUrl);

/**
 * @openapi
 * /api/documents/{id}:
 *   delete:
 *     summary: Delete a document record and its cloud storage file
 *     tags:
 *       - Documents
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: The unique identifier of the document to delete
 *     responses:
 *       '200':
 *         description: Document deleted successfully
 *       '403':
 *         description: Unauthorized to delete this document
 *       '404':
 *         description: Document not found
 *       '500':
 *         description: Internal server error
 */
router.delete("/:id", deleteDocument);

export default router;