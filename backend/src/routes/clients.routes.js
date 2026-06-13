import { Router } from "express";
import protect from "../middleware/auth.middleware.js";
import { 
  createClient, 
  getClients, 
  getClientById, 
  updateClient, 
  deleteClient 
} from "../controllers/clients.controller.js";

const router = Router();

// Secure all client interactions downstream
router.use(protect);

/**
 * @openapi
 * /api/clients:
 *   post:
 *     summary: Create a new client
 *     description: Registers a new client profile under the authenticated user's account.
 *     tags:
 *       - Clients
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
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               company:
 *                 type: string
 *             example:
 *               name: "Northstar Studios"
 *               email: "billing@northstar.com"
 *               phone: "+1-555-123-4567"
 *               company: "Northstar Studios LLC"
 *     responses:
 *       '201':
 *         description: Client profile registered successfully
 *       '400':
 *         description: Bad request (Validation error)
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 *   get:
 *     summary: Get all clients
 *     description: Returns a list of all client profiles created by the authenticated user.
 *     tags:
 *       - Clients
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Clients retrieved successfully
 *       '401':
 *         description: Unauthorized
 *       '500':
 *         description: Internal server error
 */
router.route("/")
  .post(createClient)
  .get(getClients);

/**
 * @openapi
 * /api/clients/{id}:
 *   get:
 *     summary: Get a client by ID
 *     description: Retrieves details of a specific client profile. Access is restricted to the owner.
 *     tags:
 *       - Clients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique UUID or ID of the client profile
 *     responses:
 *       '200':
 *         description: Client details retrieved successfully
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden (You do not own this client profile)
 *       '404':
 *         description: Client not found
 *       '500':
 *         description: Internal server error
 *   put:
 *     summary: Update an existing client
 *     description: Modifies profile data for a specific client profile. Access is restricted to the owner.
 *     tags:
 *       - Clients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique UUID or ID of the client profile to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               company:
 *                 type: string
 *             example:
 *               name: "Northstar Studios LLC"
 *               email: "hello@northstarstudios.com"
 *               phone: "+1-555-987-6543"
 *               company: "Updated billing operations profile."
 *     responses:
 *       '200':
 *         description: Client profile updated successfully
 *       '400':
 *         description: Bad request (Validation error)
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Client not found
 *       '500':
 *         description: Internal server error
 *   delete:
 *     summary: Delete a client
 *     description: Permanently purges a client profile. Access is restricted to the owner.
 *     tags:
 *       - Clients
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique UUID or ID of the client profile to delete
 *     responses:
 *       '200':
 *         description: Client profile removed successfully
 *       '401':
 *         description: Unauthorized
 *       '403':
 *         description: Forbidden
 *       '404':
 *         description: Client not found
 *       '500':
 *         description: Internal server error
 */
router.route("/:id")
  .get(getClientById)
  .put(updateClient)
  .delete(deleteClient);

export default router;