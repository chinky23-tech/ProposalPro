import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import {
  createPackage,
  getPackages,
  getPackageById,
  updatePackage,
  deletePackage
} from "../controllers/packages.controller.js";

const router = Router();

router.use(protect);

/**
 * @openapi
 * /api/packages:
 *   post:
 *     summary: Create a new service package
 *     tags:
 *       - Packages
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               name: "Premium E-Commerce Package"
 *               description: "Full stack customized online store deployment."
 *               price: 2499.99
 *               features: ["Custom UI/UX Blueprint", "Payment Gateway Setup", "1 Year Support"]
 *     responses:
 *       '201':
 *         description: Package tier created successfully
 *       '400':
 *         description: Bad request
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 *   get:
 *     summary: Get all service packages
 *     tags:
 *       - Packages
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Packages retrieved successfully
 */
router.route("/")
  .post(createPackage)
  .get(getPackages);

/**
 * @openapi
 * /api/packages/{id}:
 *   get:
 *     summary: Get package by ID
 *     tags:
 *       - Packages
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
 *         description: Package details retrieved successfully
 *   put:
 *     summary: Update an existing package
 *     tags:
 *       - Packages
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
 *               - name
 *               - price
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 *             example:
 *               name: "Premium E-Commerce Package v2"
 *               description: "Includes enhanced tracking systems."
 *               price: 2800.00
 *               features: ["Custom UI/UX Blueprint", "Payment Gateway Setup", "Priority Support"]
 *     responses:
 *       '200':
 *         description: Package tier updated successfully
 *   delete:
 *     summary: Delete a package tier
 *     tags:
 *       - Packages
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
 *         description: Package tier removed successfully
 */
router.route("/:id")
  .get(getPackageById)
  .put(updatePackage)
  .delete(deletePackage);

export default router;