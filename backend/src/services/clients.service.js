import { 
  insertClient, 
  selectClientsByUserId, 
  selectClientById,
  updateClientById,
  deleteClientById
} from "../repositories/clients.repository.js";

export const createClientService = async (userId, clientData) => {
  const finalPayload = { user_id: userId, ...clientData };
  return await insertClient(finalPayload);
};

export const getClientsByUserService = async (userId) => {
  return await selectClientsByUserId(userId);
};

export const getClientByIdService = async (userId, clientId) => {
  const client = await selectClientById(clientId);
  
  if (!client) {
    const error = new Error("Client not found");
    error.statusCode = 404;
    throw error;
  }

  // Security Check: Ensure client belongs to the authenticated user
  if (client.user_id !== userId) {
    const error = new Error("Forbidden: You do not own this client profile");
    error.statusCode = 403;
    throw error;
  }

  return client;
};

export const updateClientService = async (userId, clientId, clientData) => {
  // Verify ownership before modifying
  await getClientByIdService(userId, clientId);
  return await updateClientById(clientId, clientData);
};

export const deleteClientService = async (userId, clientId) => {
  // Verify ownership before destroying
  await getClientByIdService(userId, clientId);
  return await deleteClientById(clientId);
};