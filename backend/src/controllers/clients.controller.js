import { 
  createClientService, 
  getClientsByUserService, 
  getClientByIdService,
  updateClientService,
  deleteClientService
} from "../services/clients.service.js";
import { validateClientInput } from "../validations/clients.validation.js";
import { successResponse, createdResponse } from "../utils/response.util.js";
import { handleError } from "../utils/error.util.js";

//  Create a New Client
export const createClient = async (req, res) => {
  try {
    // Run sanity checks on body
    const validatedData = validateClientInput(req.body);
    
    // Pass user ID from auth middleware + validated client details to service layer
    const newClient = await createClientService(req.user.id, validatedData);
    
    return createdResponse(res, newClient, "Client profile registered successfully");
  } catch (error) {
    return handleError(res, error, "CreateClientController");
  }
};

//  Get All Clients for the logged-in User
export const getClients = async (req, res) => {
  try {
    const clients = await getClientsByUserService(req.user.id);
    return successResponse(res, clients, "Clients retrieved successfully");
  } catch (error) {
    return handleError(res, error, "GetClientsController");
  }
};

//  Get a Single Client by ID
export const getClientById = async (req, res) => {
  try {
    const { id } = req.params;
    const client = await getClientByIdService(req.user.id, id);
    
    return successResponse(res, client, "Client details retrieved successfully");
  } catch (error) {
    return handleError(res, error, "GetClientByIdController");
  }
};

//  Update an Existing Client
export const updateClient = async (req, res) => {
  try {
    const { id } = req.params;
    const validatedData = validateClientInput(req.body);
    
    const updatedClient = await updateClientService(req.user.id, id, validatedData);
    return successResponse(res, updatedClient, "Client profile updated successfully");
  } catch (error) {
    return handleError(res, error, "UpdateClientController");
  }
};

//  Delete a Client
export const deleteClient = async (req, res) => {
  try {
    const { id } = req.params;
    await deleteClientService(req.user.id, id);
    
    return successResponse(res, null, "Client profile removed successfully");
  } catch (error) {
    return handleError(res, error, "DeleteClientController");
  }
};