import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import {
  createTemplate,
  getTemplates,
  getTemplateById,
  updateTemplate,
  deleteTemplate
} from "../controllers/templates.controller.js";

const router = Router();

router.use(protect);

/**
 * @openapi
 * /api/templates:
 *   post:
 *     summary: Create a new proposal template
 *     tags:
 *       - Templates
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *             example:
 *               title: "Standard Web Development Scope"
 *               content: "We propose to build a high-fidelity web application including Tailwind CSS configurations and responsive components..."
 *     responses:
 *       '201':
 *         description: Template document created successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 *   get:
 *     summary: Get all document templates
 *     tags:
 *       - Templates
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Templates retrieved successfully
 */
router.route("/")
  .post(createTemplate)
  .get(getTemplates);

/**
 * @openapi
 * /api/templates/{id}:
 *   get:
 *     summary: Get a template by ID
 *     tags:
 *       - Templates
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Template details retrieved successfully
 *   put:
 *     summary: Update an existing template
 *     tags:
 *       - Templates
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - content
 *             properties:
 *               title:
 *                 type: string
 *               content:
 *                 type: string
 *             example:
 *               title: "Standard Web Development Scope v2"
 *               content: "Updated scope containing modular design agreements."
 *     responses:
 *       '200':
 *         description: Template details updated successfully
 *   delete:
 *     summary: Delete a template document
 *     tags:
 *       - Templates
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       '200':
 *         description: Template document successfully removed
 */
router.route("/:id")
  .get(getTemplateById)
  .put(updateTemplate)
  .delete(deleteTemplate);

export default router;